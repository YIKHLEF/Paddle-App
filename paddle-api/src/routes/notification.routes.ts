/**
 * Routes API pour les notifications push
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';

const router = Router();

/**
 * @route   POST /api/notifications/register-token
 * @desc    Enregistrer un token de device pour recevoir les notifications
 * @access  Private
 */
router.post(
  '/register-token',
  authMiddleware,
  [
    body('deviceToken').notEmpty().withMessage('Device token requis'),
    body('platform')
      .isIn(['ios', 'android'])
      .withMessage('Platform doit être ios ou android'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { deviceToken, platform } = req.body;

      const success = await NotificationService.registerDeviceToken(
        userId,
        deviceToken,
        platform
      );

      if (success) {
        res.json({
          success: true,
          message: 'Device token enregistré avec succès',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Échec de l\'enregistrement du token',
        });
      }
    } catch (error) {
      console.error('Error in register-token:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/notifications/unregister-token
 * @desc    Supprimer un token de device
 * @access  Private
 */
router.post(
  '/unregister-token',
  authMiddleware,
  [body('deviceToken').notEmpty().withMessage('Device token requis')],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { deviceToken } = req.body;

      const success = await NotificationService.unregisterDeviceToken(deviceToken);

      if (success) {
        res.json({
          success: true,
          message: 'Device token supprimé avec succès',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Échec de la suppression du token',
        });
      }
    } catch (error) {
      console.error('Error in unregister-token:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/notifications/send
 * @desc    Envoyer une notification personnalisée (admin uniquement pour le moment)
 * @access  Private
 */
router.post(
  '/send',
  authMiddleware,
  [
    body('userId').notEmpty().withMessage('User ID requis'),
    body('title').notEmpty().withMessage('Titre requis'),
    body('body').notEmpty().withMessage('Corps du message requis'),
    body('data').optional().isObject().withMessage('Data doit être un objet'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, title, body: notificationBody, data, imageUrl } = req.body;

      const success = await NotificationService.sendToUser(userId, {
        title,
        body: notificationBody,
        data,
        imageUrl,
      });

      if (success) {
        res.json({
          success: true,
          message: 'Notification envoyée avec succès',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Échec de l\'envoi de la notification',
        });
      }
    } catch (error) {
      console.error('Error in send notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/notifications/send-bulk
 * @desc    Envoyer une notification à plusieurs utilisateurs (admin uniquement)
 * @access  Private
 */
router.post(
  '/send-bulk',
  authMiddleware,
  [
    body('userIds').isArray().withMessage('userIds doit être un tableau'),
    body('userIds.*').notEmpty().withMessage('Chaque userId doit être non vide'),
    body('title').notEmpty().withMessage('Titre requis'),
    body('body').notEmpty().withMessage('Corps du message requis'),
    body('data').optional().isObject().withMessage('Data doit être un objet'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userIds, title, body: notificationBody, data, imageUrl } = req.body;

      const result = await NotificationService.sendToUsers(userIds, {
        title,
        body: notificationBody,
        data,
        imageUrl,
      });

      res.json({
        success: true,
        message: `Notifications envoyées: ${result.successCount} succès, ${result.failureCount} échecs`,
        ...result,
      });
    } catch (error) {
      console.error('Error in send bulk notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/notifications/test
 * @desc    Envoyer une notification de test à l'utilisateur connecté
 * @access  Private
 */
router.post('/test', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const success = await NotificationService.sendToUser(userId, {
      title: '🎾 Notification de test',
      body: 'Vos notifications fonctionnent parfaitement !',
      data: {
        type: 'test',
      },
    });

    if (success) {
      res.json({
        success: true,
        message: 'Notification de test envoyée avec succès',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Aucun token de device trouvé pour cet utilisateur',
      });
    }
  } catch (error) {
    console.error('Error in test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
});

export default router;
