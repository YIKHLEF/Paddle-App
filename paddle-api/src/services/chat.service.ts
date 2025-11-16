/**
 * Service de chat et messagerie
 * Gestion des conversations et messages via API REST
 */

import { PrismaClient, ConversationType, MessageType } from '@prisma/client';
import { SocketService } from '../config/socket.config';

const prisma = new PrismaClient();

export interface CreateConversationData {
  type: ConversationType;
  participantIds: string[];
  name?: string;
  avatarUrl?: string;
}

export interface SendMessageData {
  conversationId: string;
  content: string;
  type?: MessageType;
  attachmentUrl?: string;
}

export interface ConversationWithDetails {
  id: string;
  type: ConversationType;
  name: string | null;
  avatarUrl: string | null;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
  };
  unreadCount: number;
  participants: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string | null;
    isOnline: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export class ChatService {
  /**
   * Créer ou récupérer une conversation directe
   */
  static async getOrCreateDirectConversation(
    userId: string,
    otherUserId: string
  ): Promise<string> {
    try {
      // Chercher une conversation directe existante entre ces deux utilisateurs
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            every: {
              userId: { in: [userId, otherUserId] },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (
        existingConversation &&
        existingConversation.participants.length === 2
      ) {
        return existingConversation.id;
      }

      // Créer une nouvelle conversation
      const conversation = await this.createConversation({
        type: 'DIRECT',
        participantIds: [userId, otherUserId],
      });

      return conversation.id;
    } catch (error) {
      console.error('Error getting or creating direct conversation:', error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle conversation
   */
  static async createConversation(
    data: CreateConversationData
  ): Promise<ConversationWithDetails> {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          type: data.type,
          name: data.name,
          avatarUrl: data.avatarUrl,
          participants: {
            create: data.participantIds.map((userId) => ({
              userId,
            })),
          },
        },
        include: {
          participants: {
            include: {
              conversation: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      return this.formatConversation(conversation, data.participantIds[0]);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Récupérer les conversations d'un utilisateur
   */
  static async getUserConversations(
    userId: string
  ): Promise<ConversationWithDetails[]> {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId },
          },
        },
        include: {
          participants: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return Promise.all(
        conversations.map((conv) => this.formatConversation(conv, userId))
      );
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  }

  /**
   * Récupérer une conversation par ID
   */
  static async getConversationById(
    conversationId: string,
    userId: string
  ): Promise<ConversationWithDetails | null> {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { userId },
          },
        },
        include: {
          participants: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!conversation) return null;

      return this.formatConversation(conversation, userId);
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  }

  /**
   * Récupérer les messages d'une conversation
   */
  static async getConversationMessages(
    conversationId: string,
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      before?: Date;
    }
  ) {
    try {
      // Vérifier que l'utilisateur est participant
      const participant = await prisma.conversationParticipant.findFirst({
        where: { conversationId, userId },
      });

      if (!participant) {
        throw new Error('User is not a participant of this conversation');
      }

      const limit = options?.limit || 50;
      const offset = options?.offset || 0;

      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          ...(options?.before && { createdAt: { lt: options.before } }),
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return messages.reverse(); // Ordre chronologique
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  }

  /**
   * Envoyer un message (via API REST)
   */
  static async sendMessage(userId: string, data: SendMessageData) {
    try {
      // Vérifier que l'utilisateur est participant
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId: data.conversationId,
          userId,
        },
      });

      if (!participant) {
        throw new Error('User is not a participant of this conversation');
      }

      // Créer le message
      const message = await prisma.message.create({
        data: {
          conversationId: data.conversationId,
          senderId: userId,
          content: data.content,
          type: data.type || 'TEXT',
          attachmentUrl: data.attachmentUrl,
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Mettre à jour la conversation
      await prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });

      // Émettre via Socket.io si disponible
      try {
        SocketService.emitToConversation(data.conversationId, 'new_message', message);
      } catch (error) {
        console.warn('Socket.io not available, message sent via REST only');
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Marquer les messages comme lus
   */
  static async markMessagesAsRead(userId: string, conversationId: string) {
    try {
      // Mettre à jour lastReadAt
      await prisma.conversationParticipant.updateMany({
        where: { conversationId, userId },
        data: { lastReadAt: new Date() },
      });

      // Marquer les messages non lus comme lus
      const updated = await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      // Notifier via Socket.io
      try {
        SocketService.emitToConversation(conversationId, 'messages_read', {
          conversationId,
          userId,
        });
      } catch (error) {
        console.warn('Socket.io not available');
      }

      return { messagesMarked: updated.count };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Récupérer le nombre de messages non lus
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      // Récupérer toutes les conversations de l'utilisateur
      const participations = await prisma.conversationParticipant.findMany({
        where: { userId },
        select: {
          conversationId: true,
          lastReadAt: true,
        },
      });

      let totalUnread = 0;

      for (const participation of participations) {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: participation.conversationId,
            senderId: { not: userId },
            isRead: false,
            createdAt: {
              gt: participation.lastReadAt || new Date(0),
            },
          },
        });

        totalUnread += unreadCount;
      }

      return totalUnread;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Supprimer une conversation (pour l'utilisateur uniquement)
   */
  static async deleteConversation(userId: string, conversationId: string) {
    try {
      // Supprimer la participation de l'utilisateur
      await prisma.conversationParticipant.deleteMany({
        where: {
          conversationId,
          userId,
        },
      });

      // Vérifier s'il reste des participants
      const remainingParticipants = await prisma.conversationParticipant.count({
        where: { conversationId },
      });

      // Si plus de participants, supprimer la conversation
      if (remainingParticipants === 0) {
        await prisma.conversation.delete({
          where: { id: conversationId },
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Muter/Démuter une conversation
   */
  static async muteConversation(
    userId: string,
    conversationId: string,
    mutedUntil: Date | null
  ) {
    try {
      await prisma.conversationParticipant.updateMany({
        where: { conversationId, userId },
        data: { mutedUntil },
      });

      return { success: true };
    } catch (error) {
      console.error('Error muting conversation:', error);
      throw error;
    }
  }

  /**
   * Formater une conversation avec détails
   */
  private static async formatConversation(
    conversation: any,
    currentUserId: string
  ): Promise<ConversationWithDetails> {
    // Récupérer les détails des participants
    const participantUsers = await prisma.user.findMany({
      where: {
        id: {
          in: conversation.participants.map((p: any) => p.userId),
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarUrl: true,
        lastActiveAt: true,
      },
    });

    const participants = participantUsers.map((user) => ({
      ...user,
      isOnline: SocketService.isUserOnline(user.id),
    }));

    // Compter les messages non lus
    const currentParticipant = conversation.participants.find(
      (p: any) => p.userId === currentUserId
    );

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: conversation.id,
        senderId: { not: currentUserId },
        isRead: false,
        createdAt: {
          gt: currentParticipant?.lastReadAt || new Date(0),
        },
      },
    });

    // Pour les conversations directes, utiliser le nom de l'autre utilisateur
    let conversationName = conversation.name;
    let conversationAvatar = conversation.avatarUrl;

    if (conversation.type === 'DIRECT') {
      const otherUser = participants.find((p) => p.id !== currentUserId);
      if (otherUser) {
        conversationName = `${otherUser.firstName} ${otherUser.lastName}`;
        conversationAvatar = otherUser.avatarUrl;
      }
    }

    return {
      id: conversation.id,
      type: conversation.type,
      name: conversationName,
      avatarUrl: conversationAvatar,
      lastMessage: conversation.messages[0]
        ? {
            id: conversation.messages[0].id,
            content: conversation.messages[0].content,
            createdAt: conversation.messages[0].createdAt,
            senderId: conversation.messages[0].senderId,
          }
        : undefined,
      unreadCount,
      participants,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Rechercher des conversations
   */
  static async searchConversations(userId: string, query: string) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId },
          },
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            {
              participants: {
                some: {
                  userId: { not: userId },
                },
              },
            },
          ],
        },
        include: {
          participants: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return Promise.all(
        conversations.map((conv) => this.formatConversation(conv, userId))
      );
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  }
}
