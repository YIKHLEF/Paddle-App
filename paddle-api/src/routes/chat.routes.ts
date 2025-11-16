/**
 * Routes API pour le chat et la messagerie
 */

import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { ChatService } from '../services/chat.service';

const router = Router();

/**
 * @route   GET /api/chat/conversations
 * @desc    Récupérer toutes les conversations de l'utilisateur
 * @access  Private
 */
router.get('/conversations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const conversations = await ChatService.getUserConversations(userId);

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('Error in get conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
});

/**
 * @route   GET /api/chat/conversations/:id
 * @desc    Récupérer une conversation par ID
 * @access  Private
 */
router.get(
  '/conversations/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const conversation = await ChatService.getConversationById(id, userId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation non trouvée',
        });
      }

      res.json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error('Error in get conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/chat/conversations
 * @desc    Créer une nouvelle conversation
 * @access  Private
 */
router.post(
  '/conversations',
  authMiddleware,
  [
    body('type').isIn(['DIRECT', 'GROUP']).withMessage('Type invalide'),
    body('participantIds').isArray().withMessage('participantIds doit être un tableau'),
    body('name').optional().isString().withMessage('name doit être une chaîne'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { type, participantIds, name, avatarUrl } = req.body;

      // Ajouter l'utilisateur actuel aux participants
      const allParticipantIds = [userId, ...participantIds.filter((id: string) => id !== userId)];

      const conversation = await ChatService.createConversation({
        type,
        participantIds: allParticipantIds,
        name,
        avatarUrl,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error('Error in create conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/chat/conversations/direct
 * @desc    Créer ou récupérer une conversation directe
 * @access  Private
 */
router.post(
  '/conversations/direct',
  authMiddleware,
  [body('userId').notEmpty().withMessage('userId requis')],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const currentUserId = (req as any).user.userId;
      const { userId } = req.body;

      const conversationId = await ChatService.getOrCreateDirectConversation(
        currentUserId,
        userId
      );

      const conversation = await ChatService.getConversationById(
        conversationId,
        currentUserId
      );

      res.json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error('Error in create direct conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/chat/conversations/:id/messages
 * @desc    Récupérer les messages d'une conversation
 * @access  Private
 */
router.get(
  '/conversations/:id/messages',
  authMiddleware,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const before = req.query.before ? new Date(req.query.before as string) : undefined;

      const messages = await ChatService.getConversationMessages(id, userId, {
        limit,
        offset,
        before,
      });

      res.json({
        success: true,
        messages,
      });
    } catch (error: any) {
      console.error('Error in get messages:', error);

      if (error.message === 'User is not a participant of this conversation') {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/chat/messages
 * @desc    Envoyer un message (via API REST)
 * @access  Private
 */
router.post(
  '/messages',
  authMiddleware,
  [
    body('conversationId').notEmpty().withMessage('conversationId requis'),
    body('content').notEmpty().withMessage('content requis'),
    body('type')
      .optional()
      .isIn(['TEXT', 'IMAGE', 'VIDEO', 'LOCATION'])
      .withMessage('Type invalide'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { conversationId, content, type, attachmentUrl } = req.body;

      const message = await ChatService.sendMessage(userId, {
        conversationId,
        content,
        type,
        attachmentUrl,
      });

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error: any) {
      console.error('Error in send message:', error);

      if (error.message === 'User is not a participant of this conversation') {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   PUT /api/chat/conversations/:id/read
 * @desc    Marquer les messages comme lus
 * @access  Private
 */
router.put(
  '/conversations/:id/read',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const result = await ChatService.markMessagesAsRead(userId, id);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Error in mark as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/chat/unread-count
 * @desc    Récupérer le nombre total de messages non lus
 * @access  Private
 */
router.get('/unread-count', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const unreadCount = await ChatService.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('Error in get unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
});

/**
 * @route   DELETE /api/chat/conversations/:id
 * @desc    Supprimer une conversation (pour l'utilisateur)
 * @access  Private
 */
router.delete(
  '/conversations/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      await ChatService.deleteConversation(userId, id);

      res.json({
        success: true,
        message: 'Conversation supprimée',
      });
    } catch (error) {
      console.error('Error in delete conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   PUT /api/chat/conversations/:id/mute
 * @desc    Muter/Démuter une conversation
 * @access  Private
 */
router.put(
  '/conversations/:id/mute',
  authMiddleware,
  [
    body('mutedUntil')
      .optional()
      .custom((value) => {
        if (value === null) return true;
        return !isNaN(Date.parse(value));
      })
      .withMessage('mutedUntil doit être une date valide ou null'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { id } = req.params;
      const { mutedUntil } = req.body;

      await ChatService.muteConversation(
        userId,
        id,
        mutedUntil ? new Date(mutedUntil) : null
      );

      res.json({
        success: true,
        message: mutedUntil ? 'Conversation mutée' : 'Conversation démutée',
      });
    } catch (error) {
      console.error('Error in mute conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/chat/search
 * @desc    Rechercher des conversations
 * @access  Private
 */
router.get(
  '/search',
  authMiddleware,
  [query('q').notEmpty().withMessage('query requis')],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const query = req.query.q as string;

      const conversations = await ChatService.searchConversations(userId, query);

      res.json({
        success: true,
        conversations,
      });
    } catch (error) {
      console.error('Error in search conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

export default router;
