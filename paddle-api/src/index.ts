/**
 * Point d'entrée principal de l'API Paddle
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Charger les variables d'environnement
dotenv.config();

// Import des configurations
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

// Import des routes (à créer)
// import authRoutes from './routes/auth.routes';
// import userRoutes from './routes/user.routes';
// import matchRoutes from './routes/match.routes';
// import bookingRoutes from './routes/booking.routes';
// import subscriptionRoutes from './routes/subscription.routes';

// Import des middleware
// import { errorHandler } from './middleware/error.middleware';
// import { notFound } from './middleware/notFound.middleware';

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Créer l'application Express
const app: Application = express();

// Créer le serveur HTTP pour Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  },
});

// ==================== MIDDLEWARE ====================

// Sécurité avec Helmet
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging HTTP avec Morgan
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// ==================== ROUTES ====================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API Routes (à décommenter quand les routes seront créées)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/matches', matchRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// Route racine
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🎾 Bienvenue sur l\'API Paddle',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// ==================== ERROR HANDLING ====================

// 404 - Route non trouvée
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
  });
});

// Error handler global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur non gérée:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== SOCKET.IO ====================

io.on('connection', (socket) => {
  logger.info(`Client connecté: ${socket.id}`);

  // Événements Socket.io (à développer)
  socket.on('join-match', (matchId: string) => {
    socket.join(`match:${matchId}`);
    logger.debug(`Socket ${socket.id} a rejoint le match ${matchId}`);
  });

  socket.on('send-message', (data) => {
    // Logique de chat à implémenter
    io.to(`match:${data.matchId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Client déconnecté: ${socket.id}`);
  });
});

// ==================== STARTUP ====================

/**
 * Démarrer le serveur
 */
const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDatabase();

    // Démarrer le serveur
    httpServer.listen(PORT, () => {
      logger.info('=================================');
      logger.info(`🎾 Paddle API démarrée`);
      logger.info(`🚀 Environnement: ${NODE_ENV}`);
      logger.info(`📡 Port: ${PORT}`);
      logger.info(`🔗 URL: http://localhost:${PORT}`);
      logger.info('=================================');
    });
  } catch (error) {
    logger.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer l'application
startServer();

// Gérer les erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export pour les tests
export { app, io };
