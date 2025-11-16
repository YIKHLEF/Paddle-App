/**
 * Hook pour le chat temps réel
 * Simplifie l'utilisation du ChatService dans les composants
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChatService,
  Conversation,
  Message,
  SendMessageData,
} from '@/services/chat.service';

export const useChat = (conversationId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialiser Socket.io au montage
   */
  useEffect(() => {
    const init = async () => {
      const success = await ChatService.initialize();
      setIsConnected(success);
    };

    init();

    return () => {
      ChatService.disconnect();
    };
  }, []);

  /**
   * Charger les conversations
   */
  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const convs = await ChatService.getConversations();
      setConversations(convs);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      setError(err.message || 'Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger une conversation spécifique
   */
  const loadConversation = useCallback(async (convId: string) => {
    setLoading(true);
    setError(null);

    try {
      const conv = await ChatService.getConversation(convId);
      setCurrentConversation(conv);
    } catch (err: any) {
      console.error('Error loading conversation:', err);
      setError(err.message || 'Erreur lors du chargement de la conversation');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger les messages d'une conversation
   */
  const loadMessages = useCallback(
    async (convId: string, options?: { limit?: number; offset?: number; before?: Date }) => {
      setLoading(true);
      setError(null);

      try {
        const msgs = await ChatService.getMessages(convId, options);
        setMessages(msgs);
      } catch (err: any) {
        console.error('Error loading messages:', err);
        setError(err.message || 'Erreur lors du chargement des messages');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Charger plus de messages (pagination)
   */
  const loadMoreMessages = useCallback(
    async (convId: string) => {
      if (messages.length === 0) return;

      setLoading(true);

      try {
        const oldestMessage = messages[0];
        const olderMessages = await ChatService.getMessages(convId, {
          limit: 50,
          before: oldestMessage.createdAt,
        });

        setMessages((prev) => [...olderMessages, ...prev]);
      } catch (err: any) {
        console.error('Error loading more messages:', err);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  /**
   * Créer ou récupérer une conversation directe
   */
  const getOrCreateDirectConversation = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const conv = await ChatService.getOrCreateDirectConversation(userId);
      setCurrentConversation(conv);
      return conv;
    } catch (err: any) {
      console.error('Error creating conversation:', err);
      setError(err.message || 'Erreur lors de la création de la conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Créer une conversation de groupe
   */
  const createGroupConversation = useCallback(
    async (participantIds: string[], name: string, avatarUrl?: string) => {
      setLoading(true);
      setError(null);

      try {
        const conv = await ChatService.createGroupConversation(
          participantIds,
          name,
          avatarUrl
        );
        setCurrentConversation(conv);
        setConversations((prev) => [conv, ...prev]);
        return conv;
      } catch (err: any) {
        console.error('Error creating group:', err);
        setError(err.message || 'Erreur lors de la création du groupe');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Envoyer un message
   */
  const sendMessage = useCallback(
    (data: SendMessageData) => {
      ChatService.sendMessage(data);

      // Arrêter l'indicateur de frappe
      ChatService.stopTyping(data.conversationId);
    },
    []
  );

  /**
   * Marquer les messages comme lus
   */
  const markAsRead = useCallback((convId: string) => {
    ChatService.markAsRead(convId);

    // Mettre à jour le compteur de non lus localement
    setCurrentConversation((prev) => {
      if (prev && prev.id === convId) {
        return { ...prev, unreadCount: 0 };
      }
      return prev;
    });

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === convId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  }, []);

  /**
   * Indiquer que l'utilisateur tape
   */
  const startTyping = useCallback((convId: string) => {
    ChatService.startTyping(convId);

    // Auto-stop après 3 secondes
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      ChatService.stopTyping(convId);
    }, 3000);
  }, []);

  /**
   * Indiquer que l'utilisateur a arrêté de taper
   */
  const stopTyping = useCallback((convId: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    ChatService.stopTyping(convId);
  }, []);

  /**
   * Supprimer une conversation
   */
  const deleteConversation = useCallback(async (convId: string) => {
    try {
      await ChatService.deleteConversation(convId);
      setConversations((prev) => prev.filter((conv) => conv.id !== convId));

      if (currentConversation?.id === convId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Error deleting conversation:', err);
      setError(err.message || 'Erreur lors de la suppression');
    }
  }, [currentConversation]);

  /**
   * Muter/Démuter une conversation
   */
  const muteConversation = useCallback(
    async (convId: string, mutedUntil: Date | null) => {
      try {
        await ChatService.muteConversation(convId, mutedUntil);

        // Mettre à jour localement
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === convId
              ? { ...conv, participants: conv.participants } // TODO: update muted status
              : conv
          )
        );
      } catch (err: any) {
        console.error('Error muting conversation:', err);
        setError(err.message || 'Erreur lors du changement de statut');
      }
    },
    []
  );

  /**
   * Mettre à jour le compteur de non lus
   */
  const updateUnreadCount = useCallback(async () => {
    try {
      const count = await ChatService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error updating unread count:', err);
    }
  }, []);

  /**
   * Rejoindre une conversation (Socket.io)
   */
  useEffect(() => {
    if (!conversationId || !isConnected) return;

    ChatService.joinConversation(conversationId);

    return () => {
      ChatService.leaveConversation(conversationId);
    };
  }, [conversationId, isConnected]);

  /**
   * S'abonner aux événements Socket.io
   */
  useEffect(() => {
    // Nouveaux messages
    const unsubscribeMessage = ChatService.onNewMessage((message) => {
      // Ajouter le message à la liste
      setMessages((prev) => [...prev, message]);

      // Mettre à jour la conversation dans la liste
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: {
                  id: message.id,
                  content: message.content,
                  createdAt: message.createdAt,
                  senderId: message.senderId,
                },
                updatedAt: message.createdAt,
              }
            : conv
        )
      );

      // Mettre à jour le compteur de non lus
      updateUnreadCount();
    });

    // Utilisateur en train de taper
    const unsubscribeTypingStart = ChatService.onTypingStart((data) => {
      setIsTyping((prev) => ({ ...prev, [data.userId]: true }));

      // Auto-stop après 5 secondes
      setTimeout(() => {
        setIsTyping((prev) => ({ ...prev, [data.userId]: false }));
      }, 5000);
    });

    // Utilisateur a arrêté de taper
    const unsubscribeTypingStop = ChatService.onTypingStop((data) => {
      setIsTyping((prev) => ({ ...prev, [data.userId]: false }));
    });

    // Messages lus
    const unsubscribeRead = ChatService.onMessagesRead((data) => {
      // Marquer les messages comme lus localement
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === data.conversationId && msg.senderId !== data.userId
            ? { ...msg, isRead: true, readAt: new Date() }
            : msg
        )
      );
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTypingStart();
      unsubscribeTypingStop();
      unsubscribeRead();
    };
  }, [updateUnreadCount]);

  /**
   * Charger automatiquement les données au montage
   */
  useEffect(() => {
    loadConversations();
    updateUnreadCount();
  }, [loadConversations, updateUnreadCount]);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
      loadMessages(conversationId);
    }
  }, [conversationId, loadConversation, loadMessages]);

  return {
    // État
    conversations,
    currentConversation,
    messages,
    unreadCount,
    loading,
    error,
    isTyping,
    isConnected,

    // Méthodes
    loadConversations,
    loadConversation,
    loadMessages,
    loadMoreMessages,
    getOrCreateDirectConversation,
    createGroupConversation,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    deleteConversation,
    muteConversation,
    updateUnreadCount,
  };
};
