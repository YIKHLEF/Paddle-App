/**
 * Service Stripe - Gestion des paiements et abonnements
 * Gère les souscriptions, webhooks et synchronisation avec la base de données
 */

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// IDs des prix Stripe (à configurer dans le Dashboard Stripe)
export const STRIPE_PRICE_IDS = {
  STANDARD_MONTHLY: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID!,
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
  PREMIUM_ANNUAL: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
};

interface CreateSubscriptionData {
  userId: string;
  priceId: string;
  paymentMethodId?: string;
  trialDays?: number;
}

interface UpdateSubscriptionData {
  subscriptionId: string;
  newPriceId: string;
}

export class StripeService {
  /**
   * Créer un client Stripe pour un utilisateur
   */
  static async createCustomer(userId: string, email: string, name: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });

      // Stocker le customerId dans la base
      await prisma.user.update({
        where: { id: userId },
        data: {
          // Vous devrez ajouter ce champ dans le schéma Prisma
          // stripeCustomerId: customer.id,
        },
      });

      return customer.id;
    } catch (error) {
      console.error('Erreur création client Stripe:', error);
      throw new Error('Impossible de créer le client Stripe');
    }
  }

  /**
   * Récupérer ou créer un client Stripe
   */
  static async getOrCreateCustomer(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Si le user a déjà un stripeCustomerId, le retourner
    // Sinon, créer un nouveau client
    // const customerId = user.stripeCustomerId ||
    //   await this.createCustomer(userId, user.email, `${user.firstName} ${user.lastName}`);

    // Pour l'instant, créer toujours un nouveau (à adapter)
    const customerId = await this.createCustomer(
      userId,
      user.email,
      `${user.firstName} ${user.lastName}`
    );

    return customerId;
  }

  /**
   * Créer une souscription avec essai gratuit
   */
  static async createSubscription(data: CreateSubscriptionData) {
    try {
      const { userId, priceId, paymentMethodId, trialDays = 14 } = data;

      // Récupérer ou créer le client Stripe
      const customerId = await this.getOrCreateCustomer(userId);

      // Attacher le moyen de paiement si fourni
      if (paymentMethodId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });

        // Définir comme moyen de paiement par défaut
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      // Créer l'abonnement
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: trialDays,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
        },
      });

      // Mettre à jour la base de données
      await this.updateUserSubscription(userId, subscription);

      return {
        subscriptionId: subscription.id,
        clientSecret:
          (subscription.latest_invoice as Stripe.Invoice)?.payment_intent &&
          typeof (subscription.latest_invoice as Stripe.Invoice).payment_intent !== 'string'
            ? ((subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent)
                .client_secret
            : null,
        status: subscription.status,
      };
    } catch (error: any) {
      console.error('Erreur création abonnement Stripe:', error);
      throw new Error(error.message || 'Impossible de créer l\'abonnement');
    }
  }

  /**
   * Annuler un abonnement
   */
  static async cancelSubscription(subscriptionId: string, immediate: boolean = false) {
    try {
      const subscription = immediate
        ? await stripe.subscriptions.cancel(subscriptionId)
        : await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
          });

      // Mettre à jour la base de données
      const userId = subscription.metadata.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'FREE',
            subscriptionEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      }

      return subscription;
    } catch (error) {
      console.error('Erreur annulation abonnement:', error);
      throw new Error('Impossible d\'annuler l\'abonnement');
    }
  }

  /**
   * Mettre à jour un abonnement (upgrade/downgrade)
   */
  static async updateSubscription(data: UpdateSubscriptionData) {
    try {
      const { subscriptionId, newPriceId } = data;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'always_invoice',
      });

      // Mettre à jour la base de données
      const userId = updatedSubscription.metadata.userId;
      if (userId) {
        await this.updateUserSubscription(userId, updatedSubscription);
      }

      return updatedSubscription;
    } catch (error) {
      console.error('Erreur mise à jour abonnement:', error);
      throw new Error('Impossible de mettre à jour l\'abonnement');
    }
  }

  /**
   * Récupérer un abonnement
   */
  static async getSubscription(subscriptionId: string) {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Erreur récupération abonnement:', error);
      throw new Error('Abonnement non trouvé');
    }
  }

  /**
   * Lister les abonnements d'un client
   */
  static async listCustomerSubscriptions(customerId: string) {
    try {
      return await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      });
    } catch (error) {
      console.error('Erreur listing abonnements:', error);
      return { data: [] };
    }
  }

  /**
   * Créer une session de paiement (Checkout)
   */
  static async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      const customerId = await this.getOrCreateCustomer(userId);

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            userId,
          },
        },
        metadata: {
          userId,
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Erreur création session checkout:', error);
      throw new Error('Impossible de créer la session de paiement');
    }
  }

  /**
   * Créer un Portal de gestion client
   */
  static async createCustomerPortal(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error) {
      console.error('Erreur création portal client:', error);
      throw new Error('Impossible d\'accéder au portail');
    }
  }

  /**
   * Gérer les webhooks Stripe
   */
  static async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      console.log(`Webhook reçu: ${event.type}`);

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          console.log(`Type d'événement non géré: ${event.type}`);
      }

      return { received: true };
    } catch (error: any) {
      console.error('Erreur traitement webhook:', error);
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }

  /**
   * Handlers pour les événements webhook
   */
  private static async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (userId) {
      await this.updateUserSubscription(userId, subscription);
    }
  }

  private static async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (userId) {
      await this.updateUserSubscription(userId, subscription);
    }
  }

  private static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: 'FREE',
          subscriptionId: null,
          subscriptionEnd: new Date(),
        },
      });
    }
  }

  private static async handleInvoicePaid(invoice: Stripe.Invoice) {
    // Enregistrer le paiement dans la base
    if (invoice.subscription && typeof invoice.subscription === 'string') {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const userId = subscription.metadata.userId;

      if (userId) {
        await prisma.payment.create({
          data: {
            userId,
            amount: invoice.amount_paid / 100, // Convertir de cents en euros
            currency: invoice.currency.toUpperCase(),
            status: 'COMPLETED',
            type: 'subscription',
            provider: 'stripe',
            providerPaymentId: invoice.id,
            metadata: {
              subscriptionId: subscription.id,
              invoiceId: invoice.id,
            },
          },
        });
      }
    }
  }

  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    // Notifier l'utilisateur de l'échec du paiement
    console.error('Paiement échoué pour invoice:', invoice.id);

    if (invoice.subscription && typeof invoice.subscription === 'string') {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const userId = subscription.metadata.userId;

      if (userId) {
        // TODO: Envoyer un email de notification à l'utilisateur
        console.log(`TODO: Notifier user ${userId} du paiement échoué`);
      }
    }
  }

  /**
   * Mettre à jour l'abonnement de l'utilisateur dans la base
   */
  private static async updateUserSubscription(userId: string, subscription: Stripe.Subscription) {
    const tier = this.getTierFromPriceId(subscription.items.data[0].price.id);

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionId: subscription.id,
        subscriptionStart: new Date(subscription.current_period_start * 1000),
        subscriptionEnd: new Date(subscription.current_period_end * 1000),
        trialUsed: subscription.status === 'trialing' ? false : true,
      },
    });
  }

  /**
   * Déterminer le tier à partir du priceId
   */
  private static getTierFromPriceId(priceId: string): 'FREE' | 'STANDARD' | 'PREMIUM' {
    if (priceId === STRIPE_PRICE_IDS.STANDARD_MONTHLY) {
      return 'STANDARD';
    } else if (
      priceId === STRIPE_PRICE_IDS.PREMIUM_MONTHLY ||
      priceId === STRIPE_PRICE_IDS.PREMIUM_ANNUAL
    ) {
      return 'PREMIUM';
    }
    return 'FREE';
  }

  /**
   * Récupérer les prix depuis Stripe
   */
  static async getPrices() {
    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });

      return prices.data.map((price) => ({
        id: price.id,
        product: price.product,
        currency: price.currency,
        unitAmount: price.unit_amount,
        recurring: price.recurring,
      }));
    } catch (error) {
      console.error('Erreur récupération prix:', error);
      return [];
    }
  }
}
