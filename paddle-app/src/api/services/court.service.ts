/**
 * Service API pour les terrains et clubs
 * Gère la recherche de clubs/terrains et les réservations
 */

import axios from '../axios.config';

/**
 * Club/Centre de paddle
 */
export interface Club {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  photos: string[];
  rating?: number | null;
  reviewsCount?: number;
  facilities: {
    parking: boolean;
    lockers: boolean;
    showers: boolean;
    restaurant: boolean;
    shop: boolean;
    lighting: boolean;
  };
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  } | null;
  courts: number; // Nombre de terrains
  createdAt: string;
  updatedAt: string;
}

/**
 * Terrain
 */
export interface Court {
  id: string;
  clubId: string;
  name: string;
  type: 'INDOOR' | 'OUTDOOR';
  surface: 'ARTIFICIAL_GRASS' | 'CONCRETE' | 'GLASS';
  hasLighting: boolean;
  pricePerHour: number;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Paramètres de recherche de clubs
 */
export interface SearchClubsParams {
  query?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // en km
  minRating?: number;
  facilities?: string[]; // ex: ['parking', 'showers']
  page?: number;
  limit?: number;
}

/**
 * Résultat de recherche de clubs
 */
export interface SearchClubsResult {
  clubs: Array<
    Club & {
      distance?: number; // en km
      availableCourts?: number; // Terrains disponibles maintenant
    }
  >;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Disponibilité d'un terrain
 */
export interface CourtAvailability {
  courtId: string;
  date: string;
  slots: Array<{
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    available: boolean;
    price: number;
  }>;
}

/**
 * Réservation
 */
export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  court: Court & { club: { name: string; address: string } };
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentMethod?: 'CARD' | 'CASH' | 'SUBSCRIPTION' | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Données pour créer une réservation
 */
export interface CreateBookingData {
  courtId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  paymentMethod?: 'CARD' | 'CASH' | 'SUBSCRIPTION';
}

/**
 * Avis sur un club
 */
export interface Review {
  id: string;
  userId: string;
  clubId: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  };
  rating: number; // 1-5
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Données pour créer un avis
 */
export interface CreateReviewData {
  rating: number; // 1-5
  comment?: string;
}

/**
 * Service de gestion des terrains et clubs
 */
export const courtService = {
  /**
   * Rechercher des clubs
   */
  async searchClubs(params: SearchClubsParams): Promise<SearchClubsResult> {
    const response = await axios.get<SearchClubsResult>('/clubs', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer un club par ID
   */
  async getClubById(clubId: string): Promise<Club> {
    const response = await axios.get<Club>(`/clubs/${clubId}`);
    return response.data;
  },

  /**
   * Récupérer les terrains d'un club
   */
  async getClubCourts(clubId: string): Promise<Court[]> {
    const response = await axios.get<Court[]>(`/clubs/${clubId}/courts`);
    return response.data;
  },

  /**
   * Récupérer un terrain par ID
   */
  async getCourtById(courtId: string): Promise<Court> {
    const response = await axios.get<Court>(`/courts/${courtId}`);
    return response.data;
  },

  /**
   * Vérifier la disponibilité d'un terrain
   */
  async getCourtAvailability(
    courtId: string,
    date: string
  ): Promise<CourtAvailability> {
    const response = await axios.get<CourtAvailability>(
      `/courts/${courtId}/availability`,
      {
        params: { date },
      }
    );
    return response.data;
  },

  /**
   * Créer une réservation
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await axios.post<Booking>('/bookings', data);
    return response.data;
  },

  /**
   * Récupérer mes réservations
   */
  async getMyBookings(params?: {
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    page?: number;
    limit?: number;
  }): Promise<{
    bookings: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await axios.get('/bookings', { params });
    return response.data;
  },

  /**
   * Récupérer une réservation par ID
   */
  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await axios.get<Booking>(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Modifier une réservation
   */
  async updateBooking(
    bookingId: string,
    data: {
      date?: string;
      startTime?: string;
      endTime?: string;
    }
  ): Promise<Booking> {
    const response = await axios.put<Booking>(`/bookings/${bookingId}`, data);
    return response.data;
  },

  /**
   * Annuler une réservation
   */
  async cancelBooking(bookingId: string): Promise<Booking> {
    const response = await axios.post<Booking>(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  /**
   * Récupérer les avis d'un club
   */
  async getClubReviews(
    clubId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await axios.get(`/clubs/${clubId}/reviews`, { params });
    return response.data;
  },

  /**
   * Ajouter un avis sur un club
   */
  async addReview(clubId: string, data: CreateReviewData): Promise<Review> {
    const response = await axios.post<Review>(`/clubs/${clubId}/reviews`, data);
    return response.data;
  },

  /**
   * Modifier un avis
   */
  async updateReview(
    reviewId: string,
    data: CreateReviewData
  ): Promise<Review> {
    const response = await axios.put<Review>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * Supprimer un avis
   */
  async deleteReview(reviewId: string): Promise<void> {
    await axios.delete(`/reviews/${reviewId}`);
  },

  /**
   * Ajouter un club aux favoris
   */
  async addFavoriteClub(clubId: string): Promise<void> {
    await axios.post(`/users/me/favorite-clubs/${clubId}`);
  },

  /**
   * Retirer un club des favoris
   */
  async removeFavoriteClub(clubId: string): Promise<void> {
    await axios.delete(`/users/me/favorite-clubs/${clubId}`);
  },

  /**
   * Récupérer mes clubs favoris
   */
  async getFavoriteClubs(): Promise<Club[]> {
    const response = await axios.get<Club[]>('/users/me/favorite-clubs');
    return response.data;
  },
};
