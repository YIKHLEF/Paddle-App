/**
 * Service de gestion des réservations de terrains
 * Gère la disponibilité, les réservations, les paiements et les annulations
 */

import { PrismaClient, Booking, BookingStatus, PaymentMethod } from '@prisma/client';
import { NotificationService } from './notification.service';
import { StripeService } from './stripe.service';

const prisma = new PrismaClient();

/**
 * Créneau horaire disponible
 */
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
  price: number;
  bookingId?: string | null;
}

/**
 * Données pour créer une réservation
 */
export interface CreateBookingData {
  userId: string;
  courtId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  totalPrice: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

/**
 * Données pour mettre à jour une réservation
 */
export interface UpdateBookingData {
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  notes?: string;
}

/**
 * Filtres de recherche de réservations
 */
export interface BookingFilters {
  userId?: string;
  courtId?: string;
  clubId?: string;
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Statistiques de réservation pour un utilisateur
 */
export interface BookingStatistics {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  favoriteClub?: {
    id: string;
    name: string;
    bookingCount: number;
  } | null;
  bookingsByMonth: Array<{
    month: string;
    count: number;
    spent: number;
  }>;
}

/**
 * Détails de disponibilité pour une journée
 */
export interface DayAvailability {
  date: Date;
  courtId: string;
  court: {
    id: string;
    name: string;
    type: string;
    pricePerHour: number;
  };
  slots: TimeSlot[];
  openingHour: number; // 0-23
  closingHour: number; // 0-23
}

export class BookingService {
  /**
   * Créer une nouvelle réservation
   */
  static async createBooking(data: CreateBookingData): Promise<Booking> {
    // 1. Vérifier que le terrain existe et est actif
    const court = await prisma.court.findUnique({
      where: { id: data.courtId },
      include: { club: true },
    });

    if (!court || !court.isActive) {
      throw new Error('Terrain introuvable ou inactif');
    }

    // 2. Vérifier la disponibilité
    const isAvailable = await this.checkAvailability(
      data.courtId,
      data.startTime,
      data.endTime
    );

    if (!isAvailable) {
      throw new Error('Créneau non disponible');
    }

    // 3. Calculer le prix si non fourni
    let totalPrice = data.totalPrice;
    if (!totalPrice) {
      totalPrice = this.calculatePrice(court.pricePerHour, data.duration);
    }

    // 4. Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        courtId: data.courtId,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        totalPrice,
        currency: court.currency,
        paymentMethod: data.paymentMethod,
        status: BookingStatus.PENDING,
        notes: data.notes,
      },
      include: {
        court: {
          include: {
            club: true,
          },
        },
        user: true,
      },
    });

    // 5. Si paiement par carte, créer une intention de paiement Stripe
    if (data.paymentMethod === PaymentMethod.CARD) {
      try {
        // Créer le paiement Stripe
        // Note: Dans un vrai système, vous devriez utiliser Payment Intents
        // Pour l'instant, on marque comme CONFIRMED directement
        await this.confirmBooking(booking.id);
      } catch (error) {
        // Si le paiement échoue, supprimer la réservation
        await prisma.booking.delete({ where: { id: booking.id } });
        throw new Error('Échec du paiement. Réservation annulée.');
      }
    }

    // 6. Envoyer une notification de confirmation
    await NotificationService.sendBookingConfirmationNotification(
      booking.userId,
      court.club.name,
      booking.startTime.toISOString(),
      booking.id
    );

    return booking;
  }

  /**
   * Récupérer une réservation par ID
   */
  static async getBookingById(bookingId: string, userId?: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        court: {
          include: {
            club: true,
          },
        },
        user: true,
      },
    });

    // Vérifier que l'utilisateur a le droit de voir cette réservation
    if (booking && userId && booking.userId !== userId) {
      throw new Error('Non autorisé à voir cette réservation');
    }

    return booking;
  }

  /**
   * Rechercher des réservations avec filtres
   */
  static async searchBookings(filters: BookingFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.courtId) where.courtId = filters.courtId;
    if (filters.status) where.status = filters.status;

    if (filters.clubId) {
      where.court = {
        clubId: filters.clubId,
      };
    }

    if (filters.startDate || filters.endDate) {
      where.startTime = {};
      if (filters.startDate) where.startTime.gte = filters.startDate;
      if (filters.endDate) where.startTime.lte = filters.endDate;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          court: {
            include: {
              club: true,
            },
          },
          user: true,
        },
        orderBy: {
          startTime: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupérer les réservations d'un utilisateur
   */
  static async getUserBookings(
    userId: string,
    filters?: {
      status?: BookingStatus;
      upcoming?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.upcoming) {
      where.startTime = {
        gte: new Date(),
      };
      where.status = {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          court: {
            include: {
              club: true,
            },
          },
        },
        orderBy: {
          startTime: filters?.upcoming ? 'asc' : 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mettre à jour une réservation
   */
  static async updateBooking(
    bookingId: string,
    userId: string,
    data: UpdateBookingData
  ): Promise<Booking> {
    // 1. Récupérer la réservation existante
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { court: true },
    });

    if (!booking) {
      throw new Error('Réservation introuvable');
    }

    // 2. Vérifier les permissions
    if (booking.userId !== userId) {
      throw new Error('Non autorisé à modifier cette réservation');
    }

    // 3. Vérifier que la réservation peut être modifiée
    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Impossible de modifier une réservation annulée');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new Error('Impossible de modifier une réservation terminée');
    }

    // 4. Si changement de créneau, vérifier la disponibilité
    if (data.startTime || data.endTime) {
      const newStartTime = data.startTime || booking.startTime;
      const newEndTime = data.endTime || booking.endTime;

      const isAvailable = await this.checkAvailability(
        booking.courtId,
        newStartTime,
        newEndTime,
        bookingId // Exclure cette réservation de la vérification
      );

      if (!isAvailable) {
        throw new Error('Nouveau créneau non disponible');
      }

      // Recalculer le prix si la durée change
      if (data.duration) {
        const newPrice = this.calculatePrice(booking.court.pricePerHour, data.duration);
        data = { ...data, totalPrice: newPrice } as any;
      }
    }

    // 5. Mettre à jour la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: data as any,
      include: {
        court: {
          include: {
            club: true,
          },
        },
      },
    });

    return updatedBooking;
  }

  /**
   * Confirmer une réservation (après paiement)
   */
  static async confirmBooking(bookingId: string): Promise<Booking> {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paidAt: new Date(),
      },
      include: {
        court: {
          include: {
            club: true,
          },
        },
      },
    });

    return booking;
  }

  /**
   * Annuler une réservation
   */
  static async cancelBooking(
    bookingId: string,
    userId: string,
    reason?: string
  ): Promise<Booking> {
    // 1. Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        court: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error('Réservation introuvable');
    }

    // 2. Vérifier les permissions
    if (booking.userId !== userId) {
      throw new Error('Non autorisé à annuler cette réservation');
    }

    // 3. Vérifier que la réservation peut être annulée
    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Réservation déjà annulée');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new Error('Impossible d\'annuler une réservation terminée');
    }

    // 4. Vérifier la politique d'annulation (24h avant)
    const hoursUntilBooking = (booking.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
    const canRefund = hoursUntilBooking >= 24;

    // 5. Annuler la réservation
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      include: {
        court: {
          include: {
            club: true,
          },
        },
      },
    });

    // 6. Remboursement si applicable
    if (canRefund && booking.paidAt && booking.paymentMethod === PaymentMethod.CARD) {
      try {
        // TODO: Implémenter le remboursement Stripe
        // await StripeService.refundPayment(booking.id);
      } catch (error) {
        console.error('Erreur lors du remboursement:', error);
      }
    }

    // 7. Envoyer une notification d'annulation
    await NotificationService.sendBookingCancellationNotification(
      booking.userId,
      booking.court.club.name,
      booking.startTime.toISOString()
    );

    return cancelledBooking;
  }

  /**
   * Marquer une réservation comme complétée
   */
  static async completeBooking(bookingId: string): Promise<Booking> {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
      },
      include: {
        court: {
          include: {
            club: true,
          },
        },
      },
    });

    return booking;
  }

  /**
   * Vérifier la disponibilité d'un terrain pour un créneau
   */
  static async checkAvailability(
    courtId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    const where: any = {
      courtId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
      OR: [
        // Chevauchement au début
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        // Chevauchement à la fin
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        // Réservation entièrement à l'intérieur
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    };

    // Exclure une réservation spécifique (pour les mises à jour)
    if (excludeBookingId) {
      where.id = {
        not: excludeBookingId,
      };
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where,
    });

    return !conflictingBooking;
  }

  /**
   * Récupérer la disponibilité d'un terrain pour une journée
   */
  static async getCourtDayAvailability(
    courtId: string,
    date: Date
  ): Promise<DayAvailability> {
    // 1. Récupérer le terrain et ses horaires
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: {
        club: true,
      },
    });

    if (!court) {
      throw new Error('Terrain introuvable');
    }

    // 2. Récupérer les horaires d'ouverture du club
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const openingHours = (court.club.openingHours as any)?.[dayOfWeek] || {
      open: '08:00',
      close: '22:00',
    };

    const openingHour = parseInt(openingHours.open.split(':')[0]);
    const closingHour = parseInt(openingHours.close.split(':')[0]);

    // 3. Récupérer les réservations existantes pour cette journée
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        courtId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // 4. Générer les créneaux (par tranche de 1h30 = 90 minutes)
    const slots: TimeSlot[] = [];
    const slotDuration = 90; // minutes
    let currentHour = openingHour;

    while (currentHour + slotDuration / 60 <= closingHour) {
      const slotStart = new Date(date);
      slotStart.setHours(currentHour, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

      // Vérifier si ce créneau est réservé
      const isBooked = bookings.some(
        (booking) =>
          (booking.startTime <= slotStart && booking.endTime > slotStart) ||
          (booking.startTime < slotEnd && booking.endTime >= slotEnd) ||
          (booking.startTime >= slotStart && booking.endTime <= slotEnd)
      );

      const booking = isBooked
        ? bookings.find(
            (b) =>
              (b.startTime <= slotStart && b.endTime > slotStart) ||
              (b.startTime < slotEnd && b.endTime >= slotEnd) ||
              (b.startTime >= slotStart && b.endTime <= slotEnd)
          )
        : null;

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: !isBooked,
        price: this.calculatePrice(court.pricePerHour, slotDuration),
        bookingId: booking?.id || null,
      });

      currentHour += slotDuration / 60;
    }

    return {
      date,
      courtId,
      court: {
        id: court.id,
        name: court.name,
        type: court.type,
        pricePerHour: court.pricePerHour,
      },
      slots,
      openingHour,
      closingHour,
    };
  }

  /**
   * Récupérer les statistiques de réservation d'un utilisateur
   */
  static async getUserBookingStatistics(userId: string): Promise<BookingStatistics> {
    // 1. Compter les réservations par statut
    const [total, upcoming, completed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({
        where: {
          userId,
          startTime: { gte: new Date() },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
      }),
      prisma.booking.count({
        where: { userId, status: BookingStatus.COMPLETED },
      }),
      prisma.booking.count({
        where: { userId, status: BookingStatus.CANCELLED },
      }),
    ]);

    // 2. Calculer le total dépensé
    const paidBookings = await prisma.booking.findMany({
      where: {
        userId,
        paidAt: { not: null },
      },
      select: {
        totalPrice: true,
      },
    });

    const totalSpent = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // 3. Trouver le club favori
    const bookingsWithClub = await prisma.booking.findMany({
      where: { userId },
      include: {
        court: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const clubCounts: Record<string, { id: string; name: string; count: number }> = {};
    bookingsWithClub.forEach((booking) => {
      const clubId = booking.court.club.id;
      if (!clubCounts[clubId]) {
        clubCounts[clubId] = {
          id: clubId,
          name: booking.court.club.name,
          count: 0,
        };
      }
      clubCounts[clubId].count++;
    });

    const favoriteClub =
      Object.values(clubCounts).sort((a, b) => b.count - a.count)[0] || null;

    // 4. Réservations par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentBookings = await prisma.booking.findMany({
      where: {
        userId,
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
        totalPrice: true,
        paidAt: true,
      },
    });

    const bookingsByMonth: Record<string, { count: number; spent: number }> = {};
    recentBookings.forEach((booking) => {
      const month = booking.createdAt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
      });
      if (!bookingsByMonth[month]) {
        bookingsByMonth[month] = { count: 0, spent: 0 };
      }
      bookingsByMonth[month].count++;
      if (booking.paidAt) {
        bookingsByMonth[month].spent += booking.totalPrice;
      }
    });

    return {
      totalBookings: total,
      upcomingBookings: upcoming,
      completedBookings: completed,
      cancelledBookings: cancelled,
      totalSpent,
      favoriteClub: favoriteClub
        ? {
            id: favoriteClub.id,
            name: favoriteClub.name,
            bookingCount: favoriteClub.count,
          }
        : null,
      bookingsByMonth: Object.entries(bookingsByMonth).map(([month, data]) => ({
        month,
        count: data.count,
        spent: data.spent,
      })),
    };
  }

  /**
   * Calculer le prix d'une réservation
   */
  private static calculatePrice(pricePerHour: number, durationMinutes: number): number {
    const hours = durationMinutes / 60;
    return Math.round(pricePerHour * hours * 100) / 100;
  }

  /**
   * Nettoyer les réservations expirées (PENDING > 30 minutes)
   */
  static async cleanupExpiredBookings(): Promise<number> {
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const result = await prisma.booking.updateMany({
      where: {
        status: BookingStatus.PENDING,
        createdAt: {
          lt: thirtyMinutesAgo,
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: 'Réservation expirée (paiement non effectué)',
        cancelledAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Marquer automatiquement les réservations comme complétées
   */
  static async autoCompleteBookings(): Promise<number> {
    const now = new Date();

    const result = await prisma.booking.updateMany({
      where: {
        status: BookingStatus.CONFIRMED,
        endTime: {
          lt: now,
        },
      },
      data: {
        status: BookingStatus.COMPLETED,
      },
    });

    return result.count;
  }
}
