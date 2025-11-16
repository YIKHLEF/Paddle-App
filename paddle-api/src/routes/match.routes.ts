/**
 * Routes API pour la gestion complète des matchs
 */

import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { MatchService } from '../services/match.service';

const router = Router();

/**
 * @route   POST /api/matches
 * @desc    Créer un nouveau match
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  [
    body('type').isIn(['FRIENDLY', 'RANKED', 'TRAINING', 'TOURNAMENT', 'DISCOVERY']).withMessage('Type invalide'),
    body('format').isIn(['SINGLES', 'DOUBLES']).withMessage('Format invalide'),
    body('scheduledAt').isISO8601().withMessage('Date invalide'),
    body('courtId').optional().isString(),
    body('duration').optional().isInt({ min: 30, max: 240 }),
    body('requiredLevel').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PRO']),
    body('maxParticipants').optional().isInt({ min: 2, max: 4 }),
    body('description').optional().isString(),
    body('visibility').optional().isIn(['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const data = {
        ...req.body,
        organizerId: userId,
        scheduledAt: new Date(req.body.scheduledAt),
      };

      const match = await MatchService.createMatch(data);

      res.status(201).json({
        success: true,
        match,
      });
    } catch (error: any) {
      console.error('Error in create match:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/matches/search
 * @desc    Rechercher des matchs avec filtres
 * @access  Public
 */
router.get(
  '/search',
  [
    query('type').optional().isIn(['FRIENDLY', 'RANKED', 'TRAINING', 'TOURNAMENT', 'DISCOVERY']),
    query('format').optional().isIn(['SINGLES', 'DOUBLES']),
    query('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    query('skillLevel').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PRO']),
    query('latitude').optional().isFloat(),
    query('longitude').optional().isFloat(),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }),
    query('hasSpots').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filters = {
        type: req.query.type as any,
        format: req.query.format as any,
        status: req.query.status as any,
        skillLevel: req.query.skillLevel as any,
        latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
        longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
        radiusKm: req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined,
        hasSpots: req.query.hasSpots === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await MatchService.searchMatches(filters);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error in search matches:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/matches/:id
 * @desc    Récupérer un match par ID
 * @access  Public
 */
router.get(
  '/:id',
  [param('id').isString()],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      const match = await MatchService.getMatchById(id, userId);

      res.json({
        success: true,
        match,
      });
    } catch (error: any) {
      console.error('Error in get match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   PUT /api/matches/:id
 * @desc    Mettre à jour un match
 * @access  Private (organizer only)
 */
router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isString(),
    body('type').optional().isIn(['FRIENDLY', 'RANKED', 'TRAINING', 'TOURNAMENT', 'DISCOVERY']),
    body('format').optional().isIn(['SINGLES', 'DOUBLES']),
    body('scheduledAt').optional().isISO8601(),
    body('courtId').optional().isString(),
    body('duration').optional().isInt({ min: 30, max: 240 }),
    body('requiredLevel').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PRO']),
    body('maxParticipants').optional().isInt({ min: 2, max: 4 }),
    body('description').optional().isString(),
    body('visibility').optional().isIn(['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const userId = (req as any).user.userId;
      const data = {
        ...req.body,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined,
      };

      const match = await MatchService.updateMatch(id, userId, data);

      res.json({
        success: true,
        match,
      });
    } catch (error: any) {
      console.error('Error in update match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Only the organizer can update the match') {
        return res.status(403).json({
          success: false,
          message: 'Seul l\'organisateur peut modifier le match',
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/matches/:id/join
 * @desc    Rejoindre un match
 * @access  Private
 */
router.post(
  '/:id/join',
  authMiddleware,
  [
    param('id').isString(),
    body('team').optional().isInt({ min: 1, max: 2 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const { team } = req.body;

      await MatchService.joinMatch(id, userId, team);

      res.json({
        success: true,
        message: 'Match rejoint avec succès',
      });
    } catch (error: any) {
      console.error('Error in join match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Match is full' || error.message === 'Already joined this match') {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/matches/:id/leave
 * @desc    Quitter un match
 * @access  Private
 */
router.post(
  '/:id/leave',
  authMiddleware,
  [param('id').isString()],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      await MatchService.leaveMatch(id, userId);

      res.json({
        success: true,
        message: 'Match quitté avec succès',
      });
    } catch (error: any) {
      console.error('Error in leave match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Organizer cannot leave the match') {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/matches/:id/start
 * @desc    Démarrer un match
 * @access  Private (organizer only)
 */
router.post(
  '/:id/start',
  authMiddleware,
  [param('id').isString()],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const match = await MatchService.startMatch(id, userId);

      res.json({
        success: true,
        match,
        message: 'Match démarré',
      });
    } catch (error: any) {
      console.error('Error in start match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Only the organizer can start the match') {
        return res.status(403).json({
          success: false,
          message: 'Seul l\'organisateur peut démarrer le match',
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/matches/:id/score
 * @desc    Ajouter un score de set
 * @access  Private (organizer only)
 */
router.post(
  '/:id/score',
  authMiddleware,
  [
    param('id').isString(),
    body('team1Score').isInt({ min: 0, max: 7 }).withMessage('Score équipe 1 invalide'),
    body('team2Score').isInt({ min: 0, max: 7 }).withMessage('Score équipe 2 invalide'),
    body('setNumber').isInt({ min: 1, max: 5 }).withMessage('Numéro de set invalide'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const userId = (req as any).user.userId;
      const { team1Score, team2Score, setNumber } = req.body;

      const score = await MatchService.addSetScore(id, userId, {
        team1Score,
        team2Score,
        setNumber,
      });

      res.json({
        success: true,
        score,
        message: 'Score ajouté',
      });
    } catch (error: any) {
      console.error('Error in add score:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Only the organizer can add scores') {
        return res.status(403).json({
          success: false,
          message: 'Seul l\'organisateur peut ajouter des scores',
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/matches/:id/complete
 * @desc    Terminer un match
 * @access  Private (organizer only)
 */
router.post(
  '/:id/complete',
  authMiddleware,
  [
    param('id').isString(),
    body('winnerId').optional().isString(),
    body('scores').isArray().withMessage('scores doit être un tableau'),
    body('scores.*.team1Score').isInt({ min: 0, max: 7 }),
    body('scores.*.team2Score').isInt({ min: 0, max: 7 }),
    body('scores.*.setNumber').isInt({ min: 1, max: 5 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const userId = (req as any).user.userId;
      const { winnerId, scores } = req.body;

      const match = await MatchService.completeMatch(id, userId, {
        winnerId,
        scores,
      });

      res.json({
        success: true,
        match,
        message: 'Match terminé',
      });
    } catch (error: any) {
      console.error('Error in complete match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Only the organizer can complete the match') {
        return res.status(403).json({
          success: false,
          message: 'Seul l\'organisateur peut terminer le match',
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   POST /api/matches/:id/cancel
 * @desc    Annuler un match
 * @access  Private (organizer only)
 */
router.post(
  '/:id/cancel',
  authMiddleware,
  [param('id').isString()],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const match = await MatchService.cancelMatch(id, userId);

      res.json({
        success: true,
        match,
        message: 'Match annulé',
      });
    } catch (error: any) {
      console.error('Error in cancel match:', error);

      if (error.message === 'Match not found') {
        return res.status(404).json({
          success: false,
          message: 'Match non trouvé',
        });
      }

      if (error.message === 'Only the organizer can cancel the match') {
        return res.status(403).json({
          success: false,
          message: 'Seul l\'organisateur peut annuler le match',
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/matches/user/history
 * @desc    Récupérer l'historique des matchs de l'utilisateur
 * @access  Private
 */
router.get(
  '/user/history',
  authMiddleware,
  [
    query('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    query('type').optional().isIn(['FRIENDLY', 'RANKED', 'TRAINING', 'TOURNAMENT', 'DISCOVERY']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const filters = {
        status: req.query.status as any,
        type: req.query.type as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await MatchService.getUserMatchHistory(userId, filters);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error in get match history:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/matches/user/recommendations
 * @desc    Obtenir des recommandations de matchs
 * @access  Private
 */
router.get(
  '/user/recommendations',
  authMiddleware,
  [query('limit').optional().isInt({ min: 1, max: 50 })],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const recommendations = await MatchService.getMatchRecommendations(userId, limit);

      res.json({
        success: true,
        recommendations,
      });
    } catch (error: any) {
      console.error('Error in get recommendations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur',
      });
    }
  }
);

export default router;
