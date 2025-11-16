/**
 * Routes Subscription - Gestion des abonnements Stripe
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { StripeService } from '../services/stripe.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/subscriptions/create
 * Créer un nouvel abonnement
 */
router.post(
  '/create',
  authMiddleware,
  [
    body('priceId').notEmpty().withMessage('Price ID requis'),
    body('paymentMethodId').optional().isString(),
    body('trialDays').optional().isInt({ min: 0, max: 30 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { priceId, paymentMethodId, trialDays } = req.body;

      const result = await StripeService.createSubscription({
        userId,
        priceId,
        paymentMethodId,
        trialDays,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route create subscription:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la création de l\'abonnement',
      });
    }
  }
);

/**
 * POST /api/subscriptions/cancel
 * Annuler un abonnement
 */
router.post(
  '/cancel',
  authMiddleware,
  [
    body('subscriptionId').notEmpty().withMessage('Subscription ID requis'),
    body('immediate').optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { subscriptionId, immediate = false } = req.body;

      const result = await StripeService.cancelSubscription(subscriptionId, immediate);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route cancel subscription:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'annulation',
      });
    }
  }
);

/**
 * PUT /api/subscriptions/update
 * Mettre à jour un abonnement (upgrade/downgrade)
 */
router.put(
  '/update',
  authMiddleware,
  [
    body('subscriptionId').notEmpty().withMessage('Subscription ID requis'),
    body('newPriceId').notEmpty().withMessage('Nouveau Price ID requis'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { subscriptionId, newPriceId } = req.body;

      const result = await StripeService.updateSubscription({
        subscriptionId,
        newPriceId,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route update subscription:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour',
      });
    }
  }
);

/**
 * GET /api/subscriptions/status
 * Récupérer le statut de l'abonnement de l'utilisateur
 */
router.get('/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Récupérer l'utilisateur depuis la base
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        isSubscribed: user.subscriptionTier !== 'FREE',
        tier: user.subscriptionTier,
        subscriptionId: user.subscriptionId,
        expiryDate: user.subscriptionEnd,
        isTrialActive: user.trialUsed === false && user.subscriptionTier !== 'FREE',
      },
    });
  } catch (error: any) {
    console.error('Erreur route subscription status:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du statut',
    });
  }
});

/**
 * POST /api/subscriptions/checkout-session
 * Créer une session Stripe Checkout
 */
router.post(
  '/checkout-session',
  authMiddleware,
  [
    body('priceId').notEmpty().withMessage('Price ID requis'),
    body('successUrl').notEmpty().withMessage('Success URL requis'),
    body('cancelUrl').notEmpty().withMessage('Cancel URL requis'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { priceId, successUrl, cancelUrl } = req.body;

      const result = await StripeService.createCheckoutSession(
        userId,
        priceId,
        successUrl,
        cancelUrl
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Erreur route checkout session:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la session',
      });
    }
  }
);

/**
 * POST /api/subscriptions/portal
 * Créer une session Customer Portal
 */
router.post(
  '/portal',
  authMiddleware,
  [body('returnUrl').notEmpty().withMessage('Return URL requis')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user.userId;
      const { returnUrl } = req.body;

      // Récupérer le customerId
      const customerId = await StripeService.getOrCreateCustomer(userId);

      const portalUrl = await StripeService.createCustomerPortal(customerId, returnUrl);

      return res.status(200).json({
        success: true,
        data: { url: portalUrl },
      });
    } catch (error: any) {
      console.error('Erreur route portal:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la création du portail',
      });
    }
  }
);

/**
 * GET /api/subscriptions/prices
 * Récupérer les prix disponibles
 */
router.get('/prices', async (req: Request, res: Response) => {
  try {
    const prices = await StripeService.getPrices();

    return res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error: any) {
    console.error('Erreur route prices:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des prix',
    });
  }
});

/**
 * POST /api/subscriptions/webhook
 * Webhook Stripe (pas de auth middleware)
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  try {
    await StripeService.handleWebhook(req.body, signature);

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erreur webhook:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
