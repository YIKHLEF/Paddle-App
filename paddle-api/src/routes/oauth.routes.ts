/**
 * Routes OAuth - Authentification sociale
 */

import { Router, Request, Response } from 'express';
import { OAuthService } from '../services/oauth.service';
import { body, validationResult } from 'express-validator';

const router = Router();

/**
 * POST /api/oauth/google
 * Authentification avec Google
 */
router.post(
  '/google',
  [
    body('idToken').notEmpty().withMessage('Token Google requis'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { idToken } = req.body;

      // Authentification
      const result = await OAuthService.loginWithGoogle(idToken);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route Google OAuth:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Échec de l\'authentification Google',
      });
    }
  }
);

/**
 * POST /api/oauth/apple
 * Authentification avec Apple
 */
router.post(
  '/apple',
  [
    body('identityToken').notEmpty().withMessage('Identity token Apple requis'),
    body('user').optional().isObject(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { identityToken, user } = req.body;

      const result = await OAuthService.loginWithApple(identityToken, user);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route Apple OAuth:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Échec de l\'authentification Apple',
      });
    }
  }
);

/**
 * POST /api/oauth/facebook
 * Authentification avec Facebook
 */
router.post(
  '/facebook',
  [
    body('accessToken').notEmpty().withMessage('Access token Facebook requis'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { accessToken } = req.body;

      const result = await OAuthService.loginWithFacebook(accessToken);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route Facebook OAuth:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Échec de l\'authentification Facebook',
      });
    }
  }
);

export default router;
