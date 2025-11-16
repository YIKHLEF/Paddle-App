/**
 * Routes API pour la gestion des tournois
 * Tous les endpoints nécessitent une authentification sauf recherche publique
 */

import { Router, Request, Response } from 'express';
import { TournamentService, TournamentType, TournamentFormat } from '../services/tournament.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/tournaments
 * Créer un nouveau tournoi
 * Auth: Required
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      name,
      description,
      clubId,
      type,
      format,
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants,
      minParticipants,
      requiredSkillLevel,
      entryFee,
      prizes,
      rules,
    } = req.body;

    // Validation
    if (!name || !type || !format || !startDate || !endDate || !registrationDeadline || !maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: name, type, format, startDate, endDate, registrationDeadline, maxParticipants requis',
      });
    }

    const tournament = await TournamentService.createTournament({
      name,
      description,
      organizerId: userId,
      clubId,
      type: type as TournamentType,
      format: format as TournamentFormat,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      registrationDeadline: new Date(registrationDeadline),
      maxParticipants,
      minParticipants,
      requiredSkillLevel,
      entryFee,
      prizes,
      rules,
    });

    res.status(201).json({
      success: true,
      tournament,
    });
  } catch (error: any) {
    console.error('Erreur création tournoi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création du tournoi',
    });
  }
});

/**
 * GET /api/tournaments/search
 * Rechercher des tournois
 * Auth: Public
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const {
      status,
      type,
      format,
      clubId,
      city,
      startDate,
      endDate,
      organizerId,
      hasSpots,
      page,
      limit,
    } = req.query;

    const filters: any = {};

    if (status) filters.status = status;
    if (type) filters.type = type;
    if (format) filters.format = format;
    if (clubId) filters.clubId = clubId as string;
    if (city) filters.city = city as string;
    if (organizerId) filters.organizerId = organizerId as string;
    if (hasSpots === 'true') filters.hasSpots = true;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (page) filters.page = parseInt(page as string);
    if (limit) filters.limit = parseInt(limit as string);

    const result = await TournamentService.searchTournaments(filters);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Erreur recherche tournois:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la recherche',
    });
  }
});

/**
 * GET /api/tournaments/:id
 * Récupérer les détails d'un tournoi
 * Auth: Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tournament = await TournamentService.getTournamentById(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournoi introuvable',
      });
    }

    res.json({
      success: true,
      tournament,
    });
  } catch (error: any) {
    console.error('Erreur récupération tournoi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération',
    });
  }
});

/**
 * POST /api/tournaments/:id/open-registration
 * Ouvrir les inscriptions
 * Auth: Required (organizer only)
 */
router.post('/:id/open-registration', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const tournament = await TournamentService.openRegistration(id, userId);

    res.json({
      success: true,
      tournament,
      message: 'Inscriptions ouvertes',
    });
  } catch (error: any) {
    console.error('Erreur ouverture inscriptions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'ouverture des inscriptions',
    });
  }
});

/**
 * POST /api/tournaments/:id/register
 * S'inscrire au tournoi
 * Auth: Required
 */
router.post('/:id/register', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const participant = await TournamentService.registerParticipant(id, userId);

    res.status(201).json({
      success: true,
      participant,
      message: 'Inscription confirmée',
    });
  } catch (error: any) {
    console.error('Erreur inscription tournoi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'inscription',
    });
  }
});

/**
 * POST /api/tournaments/:id/unregister
 * Se désinscrire du tournoi
 * Auth: Required
 */
router.post('/:id/unregister', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    await TournamentService.unregisterParticipant(id, userId);

    res.json({
      success: true,
      message: 'Désinscription réussie',
    });
  } catch (error: any) {
    console.error('Erreur désinscription tournoi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la désinscription',
    });
  }
});

/**
 * POST /api/tournaments/:id/start
 * Démarrer le tournoi et générer le bracket
 * Auth: Required (organizer only)
 */
router.post('/:id/start', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const tournament = await TournamentService.startTournament(id, userId);

    res.json({
      success: true,
      tournament,
      message: 'Tournoi démarré, bracket généré',
    });
  } catch (error: any) {
    console.error('Erreur démarrage tournoi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du démarrage du tournoi',
    });
  }
});

/**
 * GET /api/tournaments/:id/matches
 * Récupérer les matchs du tournoi (bracket)
 * Auth: Public
 */
router.get('/:id/matches', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const matches = await TournamentService.getTournamentMatches(id);

    // Organiser les matchs par round
    const rounds: any = {};
    matches.forEach((match) => {
      const roundNumber = match.round_number;
      if (!rounds[roundNumber]) {
        rounds[roundNumber] = [];
      }
      rounds[roundNumber].push(match);
    });

    res.json({
      success: true,
      matches,
      rounds,
      totalRounds: Object.keys(rounds).length,
    });
  } catch (error: any) {
    console.error('Erreur récupération matchs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des matchs',
    });
  }
});

/**
 * POST /api/tournaments/matches/:matchId/result
 * Enregistrer le résultat d'un match
 * Auth: Required (organizer only)
 */
router.post('/matches/:matchId/result', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { matchId } = req.params;
    const { winnerId, score } = req.body;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: 'winnerId requis',
      });
    }

    const tournament = await TournamentService.recordMatchResult(
      matchId,
      winnerId,
      score,
      userId
    );

    res.json({
      success: true,
      tournament,
      message: 'Résultat enregistré',
    });
  } catch (error: any) {
    console.error('Erreur enregistrement résultat:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'enregistrement du résultat',
    });
  }
});

/**
 * GET /api/tournaments/user/me
 * Récupérer mes tournois
 * Auth: Required
 */
router.get('/user/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const tournaments = await TournamentService.getUserTournaments(userId);

    res.json({
      success: true,
      tournaments,
    });
  } catch (error: any) {
    console.error('Erreur récupération tournois utilisateur:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération',
    });
  }
});

/**
 * GET /api/tournaments/types
 * Liste des types de tournoi disponibles
 * Auth: Public
 */
router.get('/types', async (req: Request, res: Response) => {
  res.json({
    success: true,
    types: [
      {
        value: TournamentType.SINGLE_ELIMINATION,
        label: 'Élimination directe',
        description: 'Un joueur éliminé après une défaite',
      },
      {
        value: TournamentType.DOUBLE_ELIMINATION,
        label: 'Double élimination',
        description: 'Un joueur éliminé après deux défaites',
      },
      {
        value: TournamentType.ROUND_ROBIN,
        label: 'Poule unique',
        description: 'Tous les joueurs s\'affrontent',
      },
    ],
    formats: [
      {
        value: TournamentFormat.SINGLES,
        label: 'Simple',
        description: '1 contre 1',
      },
      {
        value: TournamentFormat.DOUBLES,
        label: 'Double',
        description: '2 contre 2',
      },
      {
        value: TournamentFormat.MIXED_DOUBLES,
        label: 'Double mixte',
        description: '2 contre 2 (mixte)',
      },
    ],
  });
});

export default router;
