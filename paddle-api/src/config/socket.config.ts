/**
 * Configuration Socket.io pour le chat temps réel
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class SocketService {
  private static io: SocketIOServer | null = null;
  private static userSockets: Map<string, string> = new Map(); // userId -> socketId

  /**
   * Initialiser Socket.io
   */
  static initialize(httpServer: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    // Middleware d'authentification
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        // Vérifier le token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        socket.userId = decoded.userId;

        // Mettre à jour le statut en ligne
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { lastActiveAt: new Date() },
        });

        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });

    // Gérer les connexions
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      this.handleConnection(socket);
    });

    console.log('✅ Socket.io initialized');
    return this.io;
  }

  /**
   * Gérer une nouvelle connexion
   */
  private static handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.userId!;
    console.log(`🔌 User ${userId} connected (socket: ${socket.id})`);

    // Enregistrer la socket de l'utilisateur
    this.userSockets.set(userId, socket.id);

    // Rejoindre la room personnelle de l'utilisateur
    socket.join(`user:${userId}`);

    // Événement: Joindre une conversation
    socket.on('join_conversation', async (conversationId: string) => {
      try {
        // Vérifier que l'utilisateur est participant
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId,
          },
        });

        if (participant) {
          socket.join(`conversation:${conversationId}`);
          console.log(`User ${userId} joined conversation ${conversationId}`);
        }
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    });

    // Événement: Quitter une conversation
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Événement: Envoyer un message
    socket.on('send_message', async (data: {
      conversationId: string;
      content: string;
      type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LOCATION';
      attachmentUrl?: string;
    }) => {
      try {
        // Créer le message dans la base de données
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

        // Envoyer le message à tous les participants
        this.io!.to(`conversation:${data.conversationId}`).emit('new_message', message);

        // Envoyer une notification push aux participants hors ligne
        this.notifyOfflineParticipants(data.conversationId, userId, message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Événement: Marquer comme lu
    socket.on('mark_as_read', async (data: { conversationId: string }) => {
      try {
        // Mettre à jour lastReadAt pour l'utilisateur
        await prisma.conversationParticipant.updateMany({
          where: {
            conversationId: data.conversationId,
            userId,
          },
          data: {
            lastReadAt: new Date(),
          },
        });

        // Marquer tous les messages non lus comme lus
        await prisma.message.updateMany({
          where: {
            conversationId: data.conversationId,
            senderId: { not: userId },
            isRead: false,
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });

        // Notifier les autres participants
        socket.to(`conversation:${data.conversationId}`).emit('messages_read', {
          conversationId: data.conversationId,
          userId,
        });
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    });

    // Événement: Utilisateur en train de taper
    socket.on('typing_start', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user_typing', {
        conversationId: data.conversationId,
        userId,
      });
    });

    // Événement: Utilisateur a arrêté de taper
    socket.on('typing_stop', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user_stopped_typing', {
        conversationId: data.conversationId,
        userId,
      });
    });

    // Événement: Match chat (pour les matchs)
    socket.on('join_match_chat', async (matchId: string) => {
      try {
        // Vérifier que l'utilisateur participe au match
        const participant = await prisma.matchParticipant.findFirst({
          where: { matchId, userId },
        });

        if (participant) {
          socket.join(`match:${matchId}`);
          console.log(`User ${userId} joined match chat ${matchId}`);
        }
      } catch (error) {
        console.error('Error joining match chat:', error);
      }
    });

    socket.on('send_match_message', async (data: {
      matchId: string;
      content: string;
    }) => {
      try {
        const message = await prisma.chatMessage.create({
          data: {
            matchId: data.matchId,
            userId,
            content: data.content,
          },
        });

        // Récupérer les infos de l'utilisateur
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
          },
        });

        this.io!.to(`match:${data.matchId}`).emit('new_match_message', {
          ...message,
          user,
        });
      } catch (error) {
        console.error('Error sending match message:', error);
      }
    });

    // Déconnexion
    socket.on('disconnect', async () => {
      console.log(`🔌 User ${userId} disconnected`);
      this.userSockets.delete(userId);

      // Mettre à jour lastActiveAt
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { lastActiveAt: new Date() },
        });
      } catch (error) {
        console.error('Error updating lastActiveAt:', error);
      }
    });
  }

  /**
   * Notifier les participants hors ligne
   */
  private static async notifyOfflineParticipants(
    conversationId: string,
    senderId: string,
    message: any
  ) {
    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { NotificationService } = await import('../services/notification.service');

      // Récupérer tous les participants sauf l'expéditeur
      const participants = await prisma.conversationParticipant.findMany({
        where: {
          conversationId,
          userId: { not: senderId },
        },
        select: { userId: true },
      });

      // Récupérer l'expéditeur
      const sender = await prisma.user.findUnique({
        where: { id: senderId },
        select: { firstName: true, lastName: true },
      });

      // Envoyer une notification aux participants hors ligne
      for (const participant of participants) {
        const isOnline = this.userSockets.has(participant.userId);

        if (!isOnline) {
          await NotificationService.sendNewMessageNotification(
            participant.userId,
            `${sender?.firstName} ${sender?.lastName}`,
            message.content.substring(0, 100)
          );
        }
      }
    } catch (error) {
      console.error('Error notifying offline participants:', error);
    }
  }

  /**
   * Obtenir l'instance Socket.io
   */
  static getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error('Socket.io not initialized');
    }
    return this.io;
  }

  /**
   * Vérifier si un utilisateur est en ligne
   */
  static isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  /**
   * Envoyer un événement à un utilisateur spécifique
   */
  static emitToUser(userId: string, event: string, data: any) {
    if (!this.io) return;

    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  /**
   * Envoyer un événement à une conversation
   */
  static emitToConversation(conversationId: string, event: string, data: any) {
    if (!this.io) return;
    this.io.to(`conversation:${conversationId}`).emit(event, data);
  }

  /**
   * Envoyer un événement à un match
   */
  static emitToMatch(matchId: string, event: string, data: any) {
    if (!this.io) return;
    this.io.to(`match:${matchId}`).emit(event, data);
  }
}
