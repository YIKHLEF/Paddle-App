/**
 * Service de gestion des tournois
 * Gère la création, les inscriptions, les brackets et les résultats
 */

import { PrismaClient, MatchStatus } from '@prisma/client';
import { NotificationService } from './notification.service';

const prisma = new PrismaClient();

/**
 * Types de tournoi
 */
export enum TournamentType {
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION', // Élimination directe
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION', // Double élimination
  ROUND_ROBIN = 'ROUND_ROBIN', // Poule unique
}

/**
 * Statut du tournoi
 */
export enum TournamentStatus {
  DRAFT = 'DRAFT', // En préparation
  REGISTRATION_OPEN = 'REGISTRATION_OPEN', // Inscriptions ouvertes
  REGISTRATION_CLOSED = 'REGISTRATION_CLOSED', // Inscriptions fermées
  IN_PROGRESS = 'IN_PROGRESS', // En cours
  COMPLETED = 'COMPLETED', // Terminé
  CANCELLED = 'CANCELLED', // Annulé
}

/**
 * Format du tournoi
 */
export enum TournamentFormat {
  SINGLES = 'SINGLES',
  DOUBLES = 'DOUBLES',
  MIXED_DOUBLES = 'MIXED_DOUBLES',
}

/**
 * Match de tournoi
 */
export interface TournamentMatch {
  id: string;
  tournamentId: string;
  roundNumber: number;
  matchNumber: number;
  player1Id?: string | null;
  player2Id?: string | null;
  team1Ids?: string[];
  team2Ids?: string[];
  winnerId?: string | null;
  winnerTeamIds?: string[];
  score?: any;
  scheduledAt?: Date | null;
  status: MatchStatus;
  nextMatchId?: string | null; // Match suivant pour le gagnant
  loserNextMatchId?: string | null; // Match suivant pour le perdant (double élimination)
}

/**
 * Participant au tournoi
 */
export interface TournamentParticipant {
  userId: string;
  registeredAt: Date;
  seed?: number; // Tête de série
  eliminated: boolean;
  finalRank?: number;
}

/**
 * Données pour créer un tournoi
 */
export interface CreateTournamentData {
  name: string;
  description?: string;
  organizerId: string;
  clubId?: string;
  type: TournamentType;
  format: TournamentFormat;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxParticipants: number;
  minParticipants?: number;
  requiredSkillLevel?: string;
  entryFee?: number;
  prizes?: any;
  rules?: string;
}

/**
 * Filtres de recherche de tournois
 */
export interface TournamentFilters {
  status?: TournamentStatus;
  type?: TournamentType;
  format?: TournamentFormat;
  clubId?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  organizerId?: string;
  hasSpots?: boolean;
  page?: number;
  limit?: number;
}

export class TournamentService {
  /**
   * Créer un nouveau tournoi
   */
  static async createTournament(data: CreateTournamentData): Promise<any> {
    // Validation des dates
    if (data.startDate >= data.endDate) {
      throw new Error('La date de fin doit être après la date de début');
    }

    if (data.registrationDeadline >= data.startDate) {
      throw new Error('La date limite d\'inscription doit être avant le début du tournoi');
    }

    // Créer le tournoi
    const tournament = await prisma.$queryRaw`
      INSERT INTO tournaments (
        name, description, organizer_id, club_id, type, format,
        start_date, end_date, registration_deadline,
        max_participants, min_participants, required_skill_level,
        entry_fee, prizes, rules, status, created_at, updated_at
      ) VALUES (
        ${data.name}, ${data.description || null}, ${data.organizerId}, ${data.clubId || null},
        ${data.type}, ${data.format}, ${data.startDate}, ${data.endDate},
        ${data.registrationDeadline}, ${data.maxParticipants}, ${data.minParticipants || 4},
        ${data.requiredSkillLevel || null}, ${data.entryFee || 0},
        ${JSON.stringify(data.prizes || {})}, ${data.rules || null},
        ${TournamentStatus.DRAFT}, NOW(), NOW()
      )
      RETURNING *
    ` as any[];

    return tournament[0];
  }

  /**
   * Récupérer un tournoi par ID
   */
  static async getTournamentById(tournamentId: string): Promise<any> {
    const tournaments = await prisma.$queryRaw`
      SELECT
        t.*,
        json_build_object(
          'id', u.id,
          'firstName', u.first_name,
          'lastName', u.last_name,
          'avatarUrl', u.avatar_url
        ) as organizer,
        (
          SELECT COUNT(*)::int
          FROM tournament_participants tp
          WHERE tp.tournament_id = t.id AND tp.status = 'CONFIRMED'
        ) as participant_count,
        (
          SELECT json_agg(
            json_build_object(
              'userId', u2.id,
              'firstName', u2.first_name,
              'lastName', u2.last_name,
              'avatarUrl', u2.avatar_url,
              'skillLevel', u2.skill_level,
              'registeredAt', tp.registered_at,
              'seed', tp.seed,
              'status', tp.status
            )
          )
          FROM tournament_participants tp
          JOIN users u2 ON u2.id = tp.user_id
          WHERE tp.tournament_id = t.id
          ORDER BY tp.seed NULLS LAST, tp.registered_at
        ) as participants
      FROM tournaments t
      JOIN users u ON u.id = t.organizer_id
      WHERE t.id = ${tournamentId}
    ` as any[];

    return tournaments[0] || null;
  }

  /**
   * Rechercher des tournois
   */
  static async searchTournaments(filters: TournamentFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (filters.status) {
      whereConditions.push(`t.status = $${paramIndex++}`);
      params.push(filters.status);
    }

    if (filters.type) {
      whereConditions.push(`t.type = $${paramIndex++}`);
      params.push(filters.type);
    }

    if (filters.format) {
      whereConditions.push(`t.format = $${paramIndex++}`);
      params.push(filters.format);
    }

    if (filters.clubId) {
      whereConditions.push(`t.club_id = $${paramIndex++}`);
      params.push(filters.clubId);
    }

    if (filters.organizerId) {
      whereConditions.push(`t.organizer_id = $${paramIndex++}`);
      params.push(filters.organizerId);
    }

    if (filters.startDate) {
      whereConditions.push(`t.start_date >= $${paramIndex++}`);
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      whereConditions.push(`t.end_date <= $${paramIndex++}`);
      params.push(filters.endDate);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Note: Cette requête devrait être construite avec un query builder sécurisé
    // Pour simplifier, on va utiliser Prisma ORM directement
    // TODO: Implémenter avec Prisma.tournament.findMany()

    return {
      tournaments: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  /**
   * Ouvrir les inscriptions
   */
  static async openRegistration(tournamentId: string, organizerId: string): Promise<any> {
    const tournament = await this.getTournamentById(tournamentId);

    if (!tournament) {
      throw new Error('Tournoi introuvable');
    }

    if (tournament.organizer_id !== organizerId) {
      throw new Error('Non autorisé');
    }

    if (tournament.status !== TournamentStatus.DRAFT) {
      throw new Error('Les inscriptions peuvent seulement être ouvertes depuis l\'état DRAFT');
    }

    const updated = await prisma.$queryRaw`
      UPDATE tournaments
      SET status = ${TournamentStatus.REGISTRATION_OPEN}, updated_at = NOW()
      WHERE id = ${tournamentId}
      RETURNING *
    ` as any[];

    return updated[0];
  }

  /**
   * S'inscrire à un tournoi
   */
  static async registerParticipant(tournamentId: string, userId: string): Promise<any> {
    const tournament = await this.getTournamentById(tournamentId);

    if (!tournament) {
      throw new Error('Tournoi introuvable');
    }

    // Vérifier que les inscriptions sont ouvertes
    if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
      throw new Error('Les inscriptions ne sont pas ouvertes');
    }

    // Vérifier la date limite
    if (new Date() > new Date(tournament.registration_deadline)) {
      throw new Error('La date limite d\'inscription est dépassée');
    }

    // Vérifier le nombre de participants
    if (tournament.participant_count >= tournament.max_participants) {
      throw new Error('Le tournoi est complet');
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.$queryRaw`
      SELECT * FROM tournament_participants
      WHERE tournament_id = ${tournamentId} AND user_id = ${userId}
    ` as any[];

    if (existing.length > 0) {
      throw new Error('Vous êtes déjà inscrit à ce tournoi');
    }

    // Vérifier le niveau requis si spécifié
    if (tournament.required_skill_level) {
      const user = await prisma.$queryRaw`
        SELECT skill_level FROM users WHERE id = ${userId}
      ` as any[];

      // TODO: Ajouter logique de comparaison de niveau
    }

    // Inscrire le participant
    const participant = await prisma.$queryRaw`
      INSERT INTO tournament_participants (
        tournament_id, user_id, registered_at, status
      ) VALUES (
        ${tournamentId}, ${userId}, NOW(), 'CONFIRMED'
      )
      RETURNING *
    ` as any[];

    // Envoyer une notification
    await NotificationService.sendToUser(
      userId,
      {
        title: 'Inscription confirmée',
        body: `Vous êtes inscrit au tournoi "${tournament.name}"`,
      },
      {
        type: 'tournament_registration',
        tournamentId,
      }
    );

    return participant[0];
  }

  /**
   * Se désinscrire d'un tournoi
   */
  static async unregisterParticipant(tournamentId: string, userId: string): Promise<void> {
    const tournament = await this.getTournamentById(tournamentId);

    if (!tournament) {
      throw new Error('Tournoi introuvable');
    }

    // Vérifier que le tournoi n'a pas commencé
    if (tournament.status === TournamentStatus.IN_PROGRESS || tournament.status === TournamentStatus.COMPLETED) {
      throw new Error('Impossible de se désinscrire d\'un tournoi en cours ou terminé');
    }

    await prisma.$queryRaw`
      DELETE FROM tournament_participants
      WHERE tournament_id = ${tournamentId} AND user_id = ${userId}
    `;
  }

  /**
   * Démarrer le tournoi et générer le bracket
   */
  static async startTournament(tournamentId: string, organizerId: string): Promise<any> {
    const tournament = await this.getTournamentById(tournamentId);

    if (!tournament) {
      throw new Error('Tournoi introuvable');
    }

    if (tournament.organizer_id !== organizerId) {
      throw new Error('Non autorisé');
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_CLOSED) {
      throw new Error('Le tournoi doit avoir les inscriptions fermées');
    }

    const participantCount = tournament.participant_count;

    if (participantCount < (tournament.min_participants || 4)) {
      throw new Error(`Pas assez de participants (minimum: ${tournament.min_participants || 4})`);
    }

    // Générer le bracket selon le type
    let matches: TournamentMatch[] = [];

    switch (tournament.type) {
      case TournamentType.SINGLE_ELIMINATION:
        matches = this.generateSingleEliminationBracket(tournament.participants, tournamentId);
        break;
      case TournamentType.DOUBLE_ELIMINATION:
        matches = this.generateDoubleEliminationBracket(tournament.participants, tournamentId);
        break;
      case TournamentType.ROUND_ROBIN:
        matches = this.generateRoundRobinBracket(tournament.participants, tournamentId);
        break;
    }

    // Sauvegarder les matchs
    for (const match of matches) {
      await prisma.$queryRaw`
        INSERT INTO tournament_matches (
          id, tournament_id, round_number, match_number,
          player1_id, player2_id, status, next_match_id, loser_next_match_id
        ) VALUES (
          gen_random_uuid()::text, ${match.tournamentId}, ${match.roundNumber}, ${match.matchNumber},
          ${match.player1Id || null}, ${match.player2Id || null}, ${match.status},
          ${match.nextMatchId || null}, ${match.loserNextMatchId || null}
        )
      `;
    }

    // Mettre à jour le statut
    await prisma.$queryRaw`
      UPDATE tournaments
      SET status = ${TournamentStatus.IN_PROGRESS}, updated_at = NOW()
      WHERE id = ${tournamentId}
    `;

    // Notifier tous les participants
    for (const participant of tournament.participants) {
      await NotificationService.sendToUser(
        participant.userId,
        {
          title: 'Tournoi commencé',
          body: `Le tournoi "${tournament.name}" a commencé!`,
        },
        {
          type: 'tournament_started',
          tournamentId,
        }
      );
    }

    return this.getTournamentById(tournamentId);
  }

  /**
   * Générer un bracket d'élimination directe
   */
  private static generateSingleEliminationBracket(
    participants: any[],
    tournamentId: string
  ): TournamentMatch[] {
    const matches: TournamentMatch[] = [];
    const n = participants.length;

    // Calculer le nombre de rounds nécessaires
    const totalRounds = Math.ceil(Math.log2(n));
    const firstRoundMatches = Math.ceil(n / 2);

    // Round 1
    let matchNumber = 1;
    for (let i = 0; i < firstRoundMatches; i++) {
      const player1 = participants[i * 2];
      const player2 = participants[i * 2 + 1] || null; // Peut être null si nombre impair (bye)

      matches.push({
        id: `match-r1-${matchNumber}`,
        tournamentId,
        roundNumber: 1,
        matchNumber,
        player1Id: player1?.userId,
        player2Id: player2?.userId,
        status: player2 ? MatchStatus.SCHEDULED : MatchStatus.COMPLETED, // Auto-win si bye
        winnerId: player2 ? undefined : player1?.userId,
      });

      matchNumber++;
    }

    // Générer les rounds suivants
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.ceil(firstRoundMatches / Math.pow(2, round - 1));

      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: `match-r${round}-${i + 1}`,
          tournamentId,
          roundNumber: round,
          matchNumber: i + 1,
          player1Id: null,
          player2Id: null,
          status: MatchStatus.SCHEDULED,
        });
      }
    }

    // Lier les matchs (nextMatchId)
    for (let round = 1; round < totalRounds; round++) {
      const currentRoundMatches = matches.filter(m => m.roundNumber === round);
      const nextRoundMatches = matches.filter(m => m.roundNumber === round + 1);

      currentRoundMatches.forEach((match, index) => {
        const nextMatchIndex = Math.floor(index / 2);
        match.nextMatchId = nextRoundMatches[nextMatchIndex]?.id;
      });
    }

    return matches;
  }

  /**
   * Générer un bracket de double élimination
   */
  private static generateDoubleEliminationBracket(
    participants: any[],
    tournamentId: string
  ): TournamentMatch[] {
    // TODO: Implémenter la double élimination (winner's bracket + loser's bracket)
    // Pour l'instant, utiliser single elimination
    return this.generateSingleEliminationBracket(participants, tournamentId);
  }

  /**
   * Générer un bracket round robin
   */
  private static generateRoundRobinBracket(
    participants: any[],
    tournamentId: string
  ): TournamentMatch[] {
    const matches: TournamentMatch[] = [];
    const n = participants.length;
    let matchNumber = 1;

    // Chaque participant joue contre tous les autres
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        matches.push({
          id: `match-rr-${matchNumber}`,
          tournamentId,
          roundNumber: 1, // Tous dans le même "round" pour round robin
          matchNumber,
          player1Id: participants[i].userId,
          player2Id: participants[j].userId,
          status: MatchStatus.SCHEDULED,
        });
        matchNumber++;
      }
    }

    return matches;
  }

  /**
   * Enregistrer le résultat d'un match
   */
  static async recordMatchResult(
    matchId: string,
    winnerId: string,
    score: any,
    organizerId: string
  ): Promise<any> {
    // Récupérer le match
    const matches = await prisma.$queryRaw`
      SELECT tm.*, t.organizer_id, t.type
      FROM tournament_matches tm
      JOIN tournaments t ON t.id = tm.tournament_id
      WHERE tm.id = ${matchId}
    ` as any[];

    const match = matches[0];

    if (!match) {
      throw new Error('Match introuvable');
    }

    if (match.organizer_id !== organizerId) {
      throw new Error('Non autorisé');
    }

    // Vérifier que le gagnant est un des participants
    if (winnerId !== match.player1_id && winnerId !== match.player2_id) {
      throw new Error('Le gagnant doit être un des participants');
    }

    // Mettre à jour le match
    await prisma.$queryRaw`
      UPDATE tournament_matches
      SET
        winner_id = ${winnerId},
        score = ${JSON.stringify(score)},
        status = ${MatchStatus.COMPLETED}
      WHERE id = ${matchId}
    `;

    // Faire progresser le gagnant dans le bracket
    if (match.next_match_id) {
      await this.advanceWinner(match.next_match_id, winnerId, match.match_number);
    }

    // Si double élimination, faire progresser le perdant dans le loser's bracket
    if (match.type === TournamentType.DOUBLE_ELIMINATION && match.loser_next_match_id) {
      const loserId = winnerId === match.player1_id ? match.player2_id : match.player1_id;
      await this.advanceWinner(match.loser_next_match_id, loserId, match.match_number);
    }

    // Vérifier si le tournoi est terminé
    await this.checkTournamentCompletion(match.tournament_id);

    return this.getTournamentById(match.tournament_id);
  }

  /**
   * Faire avancer le gagnant au match suivant
   */
  private static async advanceWinner(
    nextMatchId: string,
    winnerId: string,
    previousMatchNumber: number
  ): Promise<void> {
    // Déterminer si le gagnant va à player1 ou player2
    const isPlayer1 = previousMatchNumber % 2 === 1;

    if (isPlayer1) {
      await prisma.$queryRaw`
        UPDATE tournament_matches
        SET player1_id = ${winnerId}
        WHERE id = ${nextMatchId}
      `;
    } else {
      await prisma.$queryRaw`
        UPDATE tournament_matches
        SET player2_id = ${winnerId}
        WHERE id = ${nextMatchId}
      `;
    }
  }

  /**
   * Vérifier si le tournoi est terminé
   */
  private static async checkTournamentCompletion(tournamentId: string): Promise<void> {
    // Récupérer tous les matchs
    const matches = await prisma.$queryRaw`
      SELECT * FROM tournament_matches
      WHERE tournament_id = ${tournamentId}
    ` as any[];

    // Trouver le dernier round
    const maxRound = Math.max(...matches.map(m => m.round_number));

    // Vérifier si tous les matchs sont terminés
    const allCompleted = matches.every(m => m.status === MatchStatus.COMPLETED);

    if (allCompleted) {
      // Trouver le champion (gagnant du dernier match)
      const finalMatch = matches.find(m => m.round_number === maxRound && m.match_number === 1);
      const championId = finalMatch?.winner_id;

      // Mettre à jour le tournoi
      await prisma.$queryRaw`
        UPDATE tournaments
        SET
          status = ${TournamentStatus.COMPLETED},
          champion_id = ${championId},
          updated_at = NOW()
        WHERE id = ${tournamentId}
      `;

      // Notifier le champion
      if (championId) {
        const tournament = await this.getTournamentById(tournamentId);
        await NotificationService.sendToUser(
          championId,
          {
            title: 'Félicitations!',
            body: `Vous avez remporté le tournoi "${tournament.name}"!`,
          },
          {
            type: 'tournament_won',
            tournamentId,
          }
        );
      }
    }
  }

  /**
   * Récupérer les matchs d'un tournoi
   */
  static async getTournamentMatches(tournamentId: string): Promise<any[]> {
    const matches = await prisma.$queryRaw`
      SELECT
        tm.*,
        json_build_object(
          'id', u1.id,
          'firstName', u1.first_name,
          'lastName', u1.last_name,
          'avatarUrl', u1.avatar_url
        ) as player1,
        json_build_object(
          'id', u2.id,
          'firstName', u2.first_name,
          'lastName', u2.last_name,
          'avatarUrl', u2.avatar_url
        ) as player2
      FROM tournament_matches tm
      LEFT JOIN users u1 ON u1.id = tm.player1_id
      LEFT JOIN users u2 ON u2.id = tm.player2_id
      WHERE tm.tournament_id = ${tournamentId}
      ORDER BY tm.round_number, tm.match_number
    ` as any[];

    return matches;
  }

  /**
   * Récupérer les tournois d'un utilisateur
   */
  static async getUserTournaments(userId: string): Promise<any[]> {
    const tournaments = await prisma.$queryRaw`
      SELECT DISTINCT
        t.*,
        tp.status as registration_status,
        tp.registered_at
      FROM tournaments t
      JOIN tournament_participants tp ON tp.tournament_id = t.id
      WHERE tp.user_id = ${userId}
      ORDER BY t.start_date DESC
    ` as any[];

    return tournaments;
  }
}
