/**
 * Point d'entrée pour toutes les routes de l'API
 */

import express, { Router } from 'express';
import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// import matchRoutes from './match.routes';
// import bookingRoutes from './booking.routes';
// import subscriptionRoutes from './subscription.routes';
// import clubRoutes from './club.routes';
// import notificationRoutes from './notification.routes';

const router: Router = express.Router();

// Monter les routes
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/matches', matchRoutes);
// router.use('/bookings', bookingRoutes);
// router.use('/subscriptions', subscriptionRoutes);
// router.use('/clubs', clubRoutes);
// router.use('/notifications', notificationRoutes);

// Route de test pour vérifier que l'API fonctionne
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Pong! 🎾',
    timestamp: new Date().toISOString(),
  });
});

export default router;
