/**
 * Routes API pour la gestion des réservations
 * Tous les endpoints nécessitent une authentification sauf indication contraire
 */

import { Router, Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { BookingStatus, PaymentMethod } from '@prisma/client';

const router = Router();

/**
 * POST /api/bookings
 * Créer une nouvelle réservation
 * Auth: Required
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { courtId, startTime, endTime, duration, paymentMethod, notes } = req.body;

    // Validation
    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: courtId, startTime, endTime requis',
      });
    }

    // Convertir les dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide',
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début',
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de réserver dans le passé',
      });
    }

    // Calculer la durée si non fournie
    const calculatedDuration = duration || Math.floor((end.getTime() - start.getTime()) / (1000 * 60));

    const booking = await BookingService.createBooking({
      userId,
      courtId,
      startTime: start,
      endTime: end,
      duration: calculatedDuration,
      totalPrice: 0, // Sera calculé par le service
      paymentMethod: paymentMethod as PaymentMethod,
      notes,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error('Erreur création réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la réservation',
    });
  }
});

/**
 * GET /api/bookings
 * Rechercher des réservations avec filtres
 * Auth: Required (admin ou club manager)
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      userId,
      courtId,
      clubId,
      status,
      startDate,
      endDate,
      page,
      limit,
    } = req.query;

    const filters: any = {};

    if (userId) filters.userId = userId as string;
    if (courtId) filters.courtId = courtId as string;
    if (clubId) filters.clubId = clubId as string;
    if (status) filters.status = status as BookingStatus;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (page) filters.page = parseInt(page as string);
    if (limit) filters.limit = parseInt(limit as string);

    const result = await BookingService.searchBookings(filters);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Erreur recherche réservations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la recherche',
    });
  }
});

/**
 * GET /api/bookings/user/me
 * Récupérer mes réservations
 * Auth: Required
 */
router.get('/user/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status, upcoming, page, limit } = req.query;

    const filters: any = {};
    if (status) filters.status = status as BookingStatus;
    if (upcoming === 'true') filters.upcoming = true;
    if (page) filters.page = parseInt(page as string);
    if (limit) filters.limit = parseInt(limit as string);

    const result = await BookingService.getUserBookings(userId, filters);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Erreur récupération réservations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération',
    });
  }
});

/**
 * GET /api/bookings/user/upcoming
 * Récupérer mes réservations à venir
 * Auth: Required
 */
router.get('/user/upcoming', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { page, limit } = req.query;

    const result = await BookingService.getUserBookings(userId, {
      upcoming: true,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Erreur récupération réservations à venir:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération',
    });
  }
});

/**
 * GET /api/bookings/user/statistics
 * Récupérer mes statistiques de réservation
 * Auth: Required
 */
router.get('/user/statistics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const statistics = await BookingService.getUserBookingStatistics(userId);

    res.json({
      success: true,
      statistics,
    });
  } catch (error: any) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération',
    });
  }
});

/**
 * GET /api/bookings/:id
 * Récupérer les détails d'une réservation
 * Auth: Required
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const booking = await BookingService.getBookingById(id, userId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error('Erreur récupération réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération',
    });
  }
});

/**
 * PUT /api/bookings/:id
 * Modifier une réservation
 * Auth: Required
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { startTime, endTime, duration, notes } = req.body;

    const updateData: any = {};

    if (startTime) {
      const start = new Date(startTime);
      if (isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Format de date de début invalide',
        });
      }
      updateData.startTime = start;
    }

    if (endTime) {
      const end = new Date(endTime);
      if (isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Format de date de fin invalide',
        });
      }
      updateData.endTime = end;
    }

    if (duration) updateData.duration = duration;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await BookingService.updateBooking(id, userId, updateData);

    res.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error('Erreur modification réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la modification',
    });
  }
});

/**
 * POST /api/bookings/:id/cancel
 * Annuler une réservation
 * Auth: Required
 */
router.post('/:id/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await BookingService.cancelBooking(id, userId, reason);

    res.json({
      success: true,
      booking,
      message: 'Réservation annulée avec succès',
    });
  } catch (error: any) {
    console.error('Erreur annulation réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'annulation',
    });
  }
});

/**
 * DELETE /api/bookings/:id
 * Supprimer/Annuler une réservation (alias de cancel)
 * Auth: Required
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const booking = await BookingService.cancelBooking(
      id,
      userId,
      'Supprimée par l\'utilisateur'
    );

    res.json({
      success: true,
      booking,
      message: 'Réservation supprimée avec succès',
    });
  } catch (error: any) {
    console.error('Erreur suppression réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression',
    });
  }
});

/**
 * POST /api/bookings/:id/confirm
 * Confirmer une réservation (après paiement)
 * Auth: Required
 */
router.post('/:id/confirm', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await BookingService.confirmBooking(id);

    res.json({
      success: true,
      booking,
      message: 'Réservation confirmée avec succès',
    });
  } catch (error: any) {
    console.error('Erreur confirmation réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la confirmation',
    });
  }
});

/**
 * GET /api/courts/:courtId/availability
 * Vérifier la disponibilité d'un terrain pour une journée
 * Auth: Public
 */
router.get('/courts/:courtId/availability', async (req: Request, res: Response) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Paramètre date requis (format: YYYY-MM-DD)',
      });
    }

    const availabilityDate = new Date(date as string);
    if (isNaN(availabilityDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide',
      });
    }

    const availability = await BookingService.getCourtDayAvailability(
      courtId,
      availabilityDate
    );

    res.json({
      success: true,
      availability,
    });
  } catch (error: any) {
    console.error('Erreur vérification disponibilité:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la vérification',
    });
  }
});

/**
 * GET /api/courts/:courtId/availability/week
 * Vérifier la disponibilité d'un terrain sur une semaine
 * Auth: Public
 */
router.get('/courts/:courtId/availability/week', async (req: Request, res: Response) => {
  try {
    const { courtId } = req.params;
    const { startDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide',
      });
    }

    // Générer 7 jours de disponibilité
    const weekAvailability = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);

      const dayAvailability = await BookingService.getCourtDayAvailability(courtId, date);
      weekAvailability.push(dayAvailability);
    }

    res.json({
      success: true,
      weekAvailability,
    });
  } catch (error: any) {
    console.error('Erreur vérification disponibilité semaine:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la vérification',
    });
  }
});

/**
 * POST /api/bookings/check-availability
 * Vérifier si un créneau est disponible
 * Auth: Public
 */
router.post('/check-availability', async (req: Request, res: Response) => {
  try {
    const { courtId, startTime, endTime } = req.body;

    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: courtId, startTime, endTime requis',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide',
      });
    }

    const available = await BookingService.checkAvailability(courtId, start, end);

    res.json({
      success: true,
      available,
    });
  } catch (error: any) {
    console.error('Erreur vérification disponibilité:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la vérification',
    });
  }
});

/**
 * POST /api/bookings/cleanup
 * Nettoyer les réservations expirées (tâche cron)
 * Auth: Admin only
 */
router.post('/cleanup', async (req: Request, res: Response) => {
  try {
    // TODO: Ajouter une vérification d'admin ou token spécial

    const [expired, completed] = await Promise.all([
      BookingService.cleanupExpiredBookings(),
      BookingService.autoCompleteBookings(),
    ]);

    res.json({
      success: true,
      message: 'Nettoyage effectué',
      expiredCount: expired,
      completedCount: completed,
    });
  } catch (error: any) {
    console.error('Erreur nettoyage réservations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du nettoyage',
    });
  }
});

export default router;
