/**
 * Configuration de la base de données Prisma
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Créer une instance unique de Prisma Client
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Logger les requêtes en mode développement
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query:', { query: e.query, params: e.params, duration: e.duration });
  });
}

// Logger les erreurs
prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e);
});

// Fonction pour se connecter à la base de données
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Base de données connectée avec succès');
  } catch (error) {
    logger.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

// Fonction pour se déconnecter proprement
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Base de données déconnectée');
  } catch (error) {
    logger.error('Erreur lors de la déconnexion:', error);
  }
};

// Gérer les signaux d'arrêt proprement
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default prisma;
