/**
 * Routes d'authentification
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import AuthService from '../services/auth.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AppError } from '../middleware/error.middleware';

const router = express.Router();

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    body('firstName').notEmpty().withMessage('Le prénom est requis'),
    body('lastName').notEmpty().withMessage('Le nom est requis'),
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
    body('dateOfBirth').isISO8601().withMessage('Date de naissance invalide'),
    body('gender').isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
    body('skillLevel').isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PRO']),
    body('preferredPosition').isIn(['LEFT', 'RIGHT', 'BOTH']),
    body('dominantHand').isIn(['RIGHT', 'LEFT']),
    body('location').notEmpty().withMessage('La localisation est requise'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        'Erreur de validation',
        400,
      );
    }

    const result = await AuthService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: result,
    });
  })
);

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Email ou mot de passe incorrect', 400);
    }

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: result,
    });
  })
);

/**
 * POST /api/auth/refresh
 * Rafraîchir le token d'accès
 */
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token requis')],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Refresh token invalide', 400);
    }

    const { refreshToken } = req.body;
    const result = await AuthService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token rafraîchi',
      data: result,
    });
  })
);

/**
 * POST /api/auth/forgot-password
 * Demander un reset de mot de passe
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email invalide')],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Email invalide', 400);
    }

    const { email } = req.body;
    await AuthService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });
  })
);

/**
 * POST /api/auth/reset-password
 * Réinitialiser le mot de passe
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token requis'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Données invalides', 400);
    }

    const { token, password } = req.body;
    await AuthService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    });
  })
);

/**
 * POST /api/auth/logout
 * Déconnexion (optionnel, côté client)
 */
router.post('/logout', (req: Request, res: Response) => {
  // La déconnexion est principalement côté client (suppression des tokens)
  // On pourrait implémenter une blacklist de tokens ici si nécessaire

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie',
  });
});

export default router;
