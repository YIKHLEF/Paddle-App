/**
 * Hook React pour la gestion des réservations de terrains
 * Fournit toutes les fonctions nécessaires pour gérer les réservations
 */

import { useState, useEffect, useCallback } from 'react';
import { Booking, courtService } from '../api/services/court.service';
import { getErrorMessage } from '../api/axios.config';

/**
 * Statistiques de réservation
 */
interface BookingStatistics {
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
 * Pagination
 */
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Filtres de recherche de réservations
 */
interface BookingFilters {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  upcoming?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Hook useBooking
 */
export const useBooking = (autoLoad: boolean = false) => {
  // État pour les réservations
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [statistics, setStatistics] = useState<BookingStatistics | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // États de chargement et d'erreur
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  /**
   * Charger les réservations de l'utilisateur
   */
  const loadMyBookings = useCallback(async (filters?: BookingFilters) => {
    try {
      setLoading(true);
      setError(null);

      const result = await courtService.getMyBookings(filters);

      setBookings(result.bookings);
      setPagination(result.pagination);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement réservations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger les réservations à venir
   */
  const loadUpcomingBookings = useCallback(async (page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const result = await courtService.getMyBookings({
        upcoming: true,
        page,
        limit,
      });

      setBookings(result.bookings);
      setPagination(result.pagination);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement réservations à venir:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger une réservation par ID
   */
  const loadBookingById = useCallback(async (bookingId: string) => {
    try {
      setLoading(true);
      setError(null);

      const booking = await courtService.getBookingById(bookingId);

      setCurrentBooking(booking);
      return booking;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement réservation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Créer une nouvelle réservation
   */
  const createBooking = useCallback(
    async (data: {
      courtId: string;
      date: string;
      startTime: string;
      endTime: string;
      paymentMethod?: 'CARD' | 'CASH' | 'SUBSCRIPTION';
    }) => {
      try {
        setActionLoading(true);
        setError(null);

        const booking = await courtService.createBooking(data);

        // Ajouter la nouvelle réservation à la liste
        setBookings((prev) => [booking, ...prev]);

        return booking;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur création réservation:', err);
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  /**
   * Modifier une réservation
   */
  const updateBooking = useCallback(
    async (
      bookingId: string,
      data: {
        date?: string;
        startTime?: string;
        endTime?: string;
      }
    ) => {
      try {
        setActionLoading(true);
        setError(null);

        const updatedBooking = await courtService.updateBooking(bookingId, data);

        // Mettre à jour dans la liste
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );

        // Mettre à jour currentBooking si c'est celle-ci
        if (currentBooking?.id === bookingId) {
          setCurrentBooking(updatedBooking);
        }

        return updatedBooking;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur modification réservation:', err);
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [currentBooking]
  );

  /**
   * Annuler une réservation
   */
  const cancelBooking = useCallback(
    async (bookingId: string) => {
      try {
        setActionLoading(true);
        setError(null);

        const cancelledBooking = await courtService.cancelBooking(bookingId);

        // Mettre à jour dans la liste
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? cancelledBooking : b))
        );

        // Mettre à jour currentBooking si c'est celle-ci
        if (currentBooking?.id === bookingId) {
          setCurrentBooking(cancelledBooking);
        }

        return true;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur annulation réservation:', err);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [currentBooking]
  );

  /**
   * Charger les statistiques de réservation
   */
  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implémenter l'endpoint API /api/bookings/user/statistics
      // Pour l'instant, calculer localement à partir des réservations
      const totalBookings = bookings.length;
      const upcomingBookings = bookings.filter(
        (b) =>
          (b.status === 'PENDING' || b.status === 'CONFIRMED') &&
          new Date(b.date) >= new Date()
      ).length;
      const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
      const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
      const totalSpent = bookings
        .filter((b) => b.paymentStatus === 'PAID')
        .reduce((sum, b) => sum + b.price, 0);

      const stats: BookingStatistics = {
        totalBookings,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        totalSpent,
        favoriteClub: null,
        bookingsByMonth: [],
      };

      setStatistics(stats);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement statistiques:', err);
    } finally {
      setLoading(false);
    }
  }, [bookings]);

  /**
   * Vérifier la disponibilité d'un terrain
   */
  const checkAvailability = useCallback(
    async (courtId: string, date: string) => {
      try {
        setLoading(true);
        setError(null);

        const availability = await courtService.getCourtAvailability(courtId, date);

        return availability;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur vérification disponibilité:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Charger la page suivante de réservations
   */
  const loadMore = useCallback(
    async (filters?: BookingFilters) => {
      if (!pagination || pagination.page >= pagination.totalPages) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const nextPage = pagination.page + 1;
        const result = await courtService.getMyBookings({
          ...filters,
          page: nextPage,
        });

        setBookings((prev) => [...prev, ...result.bookings]);
        setPagination(result.pagination);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur chargement page suivante:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination]
  );

  /**
   * Rafraîchir les réservations
   */
  const refresh = useCallback(async (filters?: BookingFilters) => {
    await loadMyBookings(filters);
  }, [loadMyBookings]);

  /**
   * Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setBookings([]);
    setCurrentBooking(null);
    setStatistics(null);
    setPagination(null);
    setError(null);
  }, []);

  // Charger les réservations au montage si autoLoad est true
  useEffect(() => {
    if (autoLoad) {
      loadMyBookings();
    }
  }, [autoLoad, loadMyBookings]);

  return {
    // État
    bookings,
    currentBooking,
    statistics,
    pagination,
    loading,
    actionLoading,
    error,

    // Fonctions de chargement
    loadMyBookings,
    loadUpcomingBookings,
    loadBookingById,
    loadStatistics,
    checkAvailability,
    loadMore,
    refresh,

    // Actions
    createBooking,
    updateBooking,
    cancelBooking,

    // Utilitaires
    reset,

    // Helpers
    hasMore: pagination ? pagination.page < pagination.totalPages : false,
    isEmpty: bookings.length === 0,
    upcomingCount: bookings.filter(
      (b) =>
        (b.status === 'PENDING' || b.status === 'CONFIRMED') &&
        new Date(b.date) >= new Date()
    ).length,
  };
};

export default useBooking;
