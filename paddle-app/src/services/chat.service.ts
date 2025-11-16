/**
 * Service de chat temps réel
 * Utilise Socket.io pour la communication en temps réel
 */

import { io, Socket } from 'socket.io-client';
import axios from '../api/axios.config';
import { store } from '@/store';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LOCATION' | 'MATCH_INVITATION';
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string | null;
  };
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
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

export interface SendMessageData {
  conversationId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LOCATION';
  attachmentUrl?: string;
}

type MessageHandler = (message: Message) => void;
type ConversationHandler = (conversation: Conversation) => void;
type TypingHandler = (data: { conversationId: string; userId: string }) => void;
type ErrorHandler = (error: any) => void;

export class ChatService {
  private static socket: Socket | null = null;
  private static isConnected = false;

  // Event handlers
  private static messageHandlers: MessageHandler[] = [];
  private static typingStartHandlers: TypingHandler[] = [];
  private static typingStopHandlers: TypingHandler[] = [];
  private static readHandlers: Array<(data: { conversationId: string; userId: string }) => void> = [];
  private static errorHandlers: ErrorHandler[] = [];

  /**
   * Initialiser la connexion Socket.io
   */
  static async initialize(): Promise<boolean> {
    if (this.isConnected && this.socket) {
      return true;
    }

    try {
      const state = store.getState();
      const accessToken = state.auth.accessToken;

      if (!accessToken) {
        console.warn('No access token available for Socket.io');
        return false;
      }

      const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

      this.socket = io(SOCKET_URL, {
        auth: {
          token: accessToken,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.setupListeners();
      this.isConnected = true;

      console.log('✅ Socket.io initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Socket.io:', error);
      return false;
    }
  }

  /**
   * Configurer les listeners Socket.io
   */
  private static setupListeners() {
    if (!this.socket) return;

    // Connexion établie
    this.socket.on('connect', () => {
      console.log('🔌 Socket.io connected');
      this.isConnected = true;
    });

    // Déconnexion
    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.io disconnected:', reason);
      this.isConnected = false;
    });

    // Erreur de connexion
    this.socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
      this.errorHandlers.forEach((handler) => handler(error));
    });

    // Nouveau message reçu
    this.socket.on('new_message', (message: Message) => {
      console.log('📨 New message received:', message);
      this.messageHandlers.forEach((handler) => handler(message));
    });

    // Utilisateur en train de taper
    this.socket.on('user_typing', (data: { conversationId: string; userId: string }) => {
      this.typingStartHandlers.forEach((handler) => handler(data));
    });

    // Utilisateur a arrêté de taper
    this.socket.on('user_stopped_typing', (data: { conversationId: string; userId: string }) => {
      this.typingStopHandlers.forEach((handler) => handler(data));
    });

    // Messages lus
    this.socket.on('messages_read', (data: { conversationId: string; userId: string }) => {
      this.readHandlers.forEach((handler) => handler(data));
    });

    // Erreur de message
    this.socket.on('message_error', (error: any) => {
      console.error('Message error:', error);
      this.errorHandlers.forEach((handler) => handler(error));
    });
  }

  /**
   * Se déconnecter
   */
  static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Rejoindre une conversation
   */
  static joinConversation(conversationId: string) {
    if (!this.socket) {
      console.warn('Socket.io not initialized');
      return;
    }

    this.socket.emit('join_conversation', conversationId);
  }

  /**
   * Quitter une conversation
   */
  static leaveConversation(conversationId: string) {
    if (!this.socket) {
      console.warn('Socket.io not initialized');
      return;
    }

    this.socket.emit('leave_conversation', conversationId);
  }

  /**
   * Envoyer un message via Socket.io
   */
  static sendMessage(data: SendMessageData) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket.io not connected, falling back to REST API');
      return this.sendMessageViaREST(data);
    }

    this.socket.emit('send_message', data);
  }

  /**
   * Envoyer un message via REST API (fallback)
   */
  private static async sendMessageViaREST(data: SendMessageData): Promise<Message> {
    const response = await axios.post<{ success: boolean; message: Message }>(
      '/chat/messages',
      data
    );
    return response.data.message;
  }

  /**
   * Marquer les messages comme lus
   */
  static markAsRead(conversationId: string) {
    if (!this.socket || !this.isConnected) {
      // Fallback REST API
      return axios.put(`/chat/conversations/${conversationId}/read`);
    }

    this.socket.emit('mark_as_read', { conversationId });
  }

  /**
   * Indiquer que l'utilisateur tape
   */
  static startTyping(conversationId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('typing_start', { conversationId });
  }

  /**
   * Indiquer que l'utilisateur a arrêté de taper
   */
  static stopTyping(conversationId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('typing_stop', { conversationId });
  }

  // ==================== Event Handlers ====================

  /**
   * S'abonner aux nouveaux messages
   */
  static onNewMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);

    // Retourner une fonction pour se désabonner
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * S'abonner aux événements "en train de taper"
   */
  static onTypingStart(handler: TypingHandler) {
    this.typingStartHandlers.push(handler);

    return () => {
      this.typingStartHandlers = this.typingStartHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * S'abonner aux événements "arrêt de taper"
   */
  static onTypingStop(handler: TypingHandler) {
    this.typingStopHandlers.push(handler);

    return () => {
      this.typingStopHandlers = this.typingStopHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * S'abonner aux événements "messages lus"
   */
  static onMessagesRead(handler: (data: { conversationId: string; userId: string }) => void) {
    this.readHandlers.push(handler);

    return () => {
      this.readHandlers = this.readHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * S'abonner aux erreurs
   */
  static onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler);

    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  // ==================== REST API Methods ====================

  /**
   * Récupérer toutes les conversations
   */
  static async getConversations(): Promise<Conversation[]> {
    const response = await axios.get<{ success: boolean; conversations: Conversation[] }>(
      '/chat/conversations'
    );
    return response.data.conversations;
  }

  /**
   * Récupérer une conversation par ID
   */
  static async getConversation(conversationId: string): Promise<Conversation> {
    const response = await axios.get<{ success: boolean; conversation: Conversation }>(
      `/chat/conversations/${conversationId}`
    );
    return response.data.conversation;
  }

  /**
   * Créer une conversation directe ou la récupérer si elle existe
   */
  static async getOrCreateDirectConversation(userId: string): Promise<Conversation> {
    const response = await axios.post<{ success: boolean; conversation: Conversation }>(
      '/chat/conversations/direct',
      { userId }
    );
    return response.data.conversation;
  }

  /**
   * Créer une conversation de groupe
   */
  static async createGroupConversation(
    participantIds: string[],
    name: string,
    avatarUrl?: string
  ): Promise<Conversation> {
    const response = await axios.post<{ success: boolean; conversation: Conversation }>(
      '/chat/conversations',
      {
        type: 'GROUP',
        participantIds,
        name,
        avatarUrl,
      }
    );
    return response.data.conversation;
  }

  /**
   * Récupérer les messages d'une conversation
   */
  static async getMessages(
    conversationId: string,
    options?: {
      limit?: number;
      offset?: number;
      before?: Date;
    }
  ): Promise<Message[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.before) params.append('before', options.before.toISOString());

    const response = await axios.get<{ success: boolean; messages: Message[] }>(
      `/chat/conversations/${conversationId}/messages?${params.toString()}`
    );
    return response.data.messages;
  }

  /**
   * Récupérer le nombre de messages non lus
   */
  static async getUnreadCount(): Promise<number> {
    const response = await axios.get<{ success: boolean; unreadCount: number }>(
      '/chat/unread-count'
    );
    return response.data.unreadCount;
  }

  /**
   * Supprimer une conversation
   */
  static async deleteConversation(conversationId: string): Promise<void> {
    await axios.delete(`/chat/conversations/${conversationId}`);
  }

  /**
   * Muter une conversation
   */
  static async muteConversation(
    conversationId: string,
    mutedUntil: Date | null
  ): Promise<void> {
    await axios.put(`/chat/conversations/${conversationId}/mute`, {
      mutedUntil: mutedUntil ? mutedUntil.toISOString() : null,
    });
  }

  /**
   * Rechercher des conversations
   */
  static async searchConversations(query: string): Promise<Conversation[]> {
    const response = await axios.get<{ success: boolean; conversations: Conversation[] }>(
      `/chat/search?q=${encodeURIComponent(query)}`
    );
    return response.data.conversations;
  }

  /**
   * Vérifier si Socket.io est connecté
   */
  static isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }
}
