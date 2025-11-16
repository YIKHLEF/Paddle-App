/**
 * Routes API pour la recherche basée sur la localisation
 */

import { Router, Request, Response } from 'express';
import { query, body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { LocationService } from '../services/location.service';

const router = Router();

/**
 * @route   GET /api/location/players/nearby
 * @desc    Rechercher des joueurs à proximité
 * @access  Private
 */
router.get(
  '/players/nearby',
  authMiddleware,
  [
    query('latitude').isFloat().withMessage('Latitude requise'),
    query('longitude').isFloat().withMessage('Longitude requise'),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Rayon invalide'),
    query('skillLevel').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radiusKm = parseFloat(req.query.radiusKm as string) || 10;
      const skillLevel = req.query.skillLevel as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;

      const players = await LocationService.findNearbyPlayers(
        { latitude, longitude, radiusKm },
        {
          skillLevel,
          limit,
          excludeUserId: userId,
        }
      );

      res.json({
        success: true,
        players,
        count: players.length,
      });
    } catch (error) {
      console.error('Error in nearby players:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/location/clubs/nearby
 * @desc    Rechercher des clubs à proximité
 * @access  Public
 */
router.get(
  '/clubs/nearby',
  [
    query('latitude').isFloat().withMessage('Latitude requise'),
    query('longitude').isFloat().withMessage('Longitude requise'),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('hasAvailableCourts').optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radiusKm = parseFloat(req.query.radiusKm as string) || 10;
      const limit = parseInt(req.query.limit as string) || 50;
      const hasAvailableCourts = req.query.hasAvailableCourts === 'true';

      const clubs = await LocationService.findNearbyClubs(
        { latitude, longitude, radiusKm },
        {
          limit,
          hasAvailableCourts,
        }
      );

      res.json({
        success: true,
        clubs,
        count: clubs.length,
      });
    } catch (error) {
      console.error('Error in nearby clubs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/location/courts/nearby
 * @desc    Rechercher des terrains à proximité
 * @access  Public
 */
router.get(
  '/courts/nearby',
  [
    query('latitude').isFloat().withMessage('Latitude requise'),
    query('longitude').isFloat().withMessage('Longitude requise'),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }),
    query('type').optional().isIn(['INDOOR', 'OUTDOOR']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radiusKm = parseFloat(req.query.radiusKm as string) || 10;
      const type = req.query.type as 'INDOOR' | 'OUTDOOR' | undefined;
      const limit = parseInt(req.query.limit as string) || 50;

      const courts = await LocationService.findNearbyCourts(
        { latitude, longitude, radiusKm },
        {
          type,
          limit,
        }
      );

      res.json({
        success: true,
        courts,
        count: courts.length,
      });
    } catch (error) {
      console.error('Error in nearby courts:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/location/matches/nearby
 * @desc    Rechercher des matchs à proximité
 * @access  Private
 */
router.get(
  '/matches/nearby',
  authMiddleware,
  [
    query('latitude').isFloat().withMessage('Latitude requise'),
    query('longitude').isFloat().withMessage('Longitude requise'),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }),
    query('skillLevel').optional().isString(),
    query('type').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radiusKm = parseFloat(req.query.radiusKm as string) || 10;
      const skillLevel = req.query.skillLevel as string | undefined;
      const type = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;

      const matches = await LocationService.findNearbyMatches(
        { latitude, longitude, radiusKm },
        {
          skillLevel,
          type,
          limit,
          excludeUserId: userId,
        }
      );

      res.json({
        success: true,
        matches,
        count: matches.length,
      });
    } catch (error) {
      console.error('Error in nearby matches:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   PUT /api/location/update
 * @desc    Mettre à jour la position de l'utilisateur
 * @access  Private
 */
router.put(
  '/update',
  authMiddleware,
  [
    body('latitude').isFloat().withMessage('Latitude requise'),
    body('longitude').isFloat().withMessage('Longitude requise'),
    body('location').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { latitude, longitude, location } = req.body;

      const success = await LocationService.updateUserLocation(
        userId,
        latitude,
        longitude,
        location
      );

      if (success) {
        res.json({
          success: true,
          message: 'Position mise à jour',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Échec de la mise à jour',
        });
      }
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

/**
 * @route   GET /api/location/stats
 * @desc    Obtenir des statistiques géographiques
 * @access  Private
 */
router.get(
  '/stats',
  authMiddleware,
  [
    query('latitude').isFloat().withMessage('Latitude requise'),
    query('longitude').isFloat().withMessage('Longitude requise'),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radiusKm = parseFloat(req.query.radiusKm as string) || 10;

      const stats = await LocationService.getLocationStats(latitude, longitude, radiusKm);

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Error getting location stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }
);

export default router;
