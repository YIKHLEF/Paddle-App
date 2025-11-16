/**
 * Écran de souscription
 * Affiche les plans disponibles et permet de souscrire
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { StripePaymentService } from '@/services/stripe.service';
import { useSubscription } from '@/hooks/useSubscription';
import Config from 'react-native-config';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceId: string;
  interval: string;
  popular: boolean;
  features: string[];
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: '9,99€',
    priceId: Config.STRIPE_STANDARD_MONTHLY_PRICE_ID || '',
    interval: 'mois',
    popular: false,
    color: '#0066FF',
    features: [
      'Réservation de terrains',
      'Recherche illimitée de joueurs',
      'Statistiques avancées',
      'Organisation de matchs',
      'Chat avec les joueurs',
      'Sans publicité',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '14,99€',
    priceId: Config.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
    interval: 'mois',
    popular: true,
    color: '#FF6B35',
    features: [
      'Tout le plan Standard',
      'Analyse vidéo des matchs',
      'Coaching IA personnalisé',
      'Accès prioritaire aux tournois',
      'Badge Premium',
      'Statistiques comparatives',
      'Calendrier intelligent',
      'Matching IA optimisé',
    ],
  },
];

export const SubscriptionScreen: React.FC = () => {
  const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { tier, refresh } = useSubscription();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  /**
   * Gérer la souscription à un plan
   */
  const handleSubscribe = async (plan: Plan) => {
    try {
      setLoading(true);
      setSelectedPlan(plan);

      // Utiliser Stripe Payment Service
      const result = await StripePaymentService.subscribe(plan.priceId, 14);

      if (result.success) {
        Alert.alert(
          'Succès ! 🎉',
          `Bienvenue dans le plan ${plan.name} ! Vous bénéficiez de 14 jours d'essai gratuit.`,
          [
            {
              text: 'OK',
              onPress: () => {
                refresh(); // Rafraîchir le statut d'abonnement
                // TODO: Navigate to home or success screen
              },
            },
          ]
        );
      } else {
        if (result.error !== 'Paiement annulé') {
          Alert.alert('Erreur', result.error || 'Échec de la souscription');
        }
      }
    } catch (error) {
      console.error('Erreur souscription:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la souscription');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  /**
   * Rendre une carte de plan
   */
  const renderPlanCard = (plan: Plan) => {
    const isCurrentPlan = tier === plan.id.toUpperCase();
    const isDisabled = loading || isCurrentPlan;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: plan.popular ? plan.color : theme.colors.border,
            borderWidth: plan.popular ? 2 : 1,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
        onPress={() => !isDisabled && handleSubscribe(plan)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {plan.popular && (
          <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
            <Text style={styles.popularText}>POPULAIRE</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.text }]}>{plan.price}</Text>
            <Text style={[styles.interval, { color: theme.colors.textSecondary }]}>
              /{plan.interval}
            </Text>
          </View>
          <Text style={[styles.trial, { color: theme.colors.textSecondary }]}>
            14 jours d'essai gratuit
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Icon name="check-circle" size={20} color={plan.color} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {isCurrentPlan ? (
            <View style={[styles.currentButton, { backgroundColor: theme.colors.success }]}>
              <Text style={styles.currentButtonText}>Plan actuel</Text>
            </View>
          ) : loading && selectedPlan?.id === plan.id ? (
            <View style={[styles.subscribeButton, { backgroundColor: plan.color }]}>
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <View style={[styles.subscribeButton, { backgroundColor: plan.color }]}>
              <Text style={styles.subscribeButtonText}>Commencer l'essai</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <StripeProvider publishableKey={Config.STRIPE_PUBLISHABLE_KEY || ''}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Choisissez votre plan
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Essayez gratuitement pendant 14 jours, annulez quand vous voulez
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>{PLANS.map(renderPlanCard)}</View>

        {/* Footer info */}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Icon name="lock" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Paiement sécurisé par Stripe
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="refresh" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Annulation simple à tout moment
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Rappel avant la fin de l'essai
            </Text>
          </View>
        </View>

        {/* Current tier display */}
        {tier !== 'FREE' && (
          <View style={[styles.currentTierBanner, { backgroundColor: theme.colors.primary }]}>
            <Icon name="star" size={20} color="white" />
            <Text style={styles.currentTierText}>
              Vous êtes actuellement sur le plan {tier}
            </Text>
          </View>
        )}
      </ScrollView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  interval: {
    fontSize: 18,
    marginLeft: 4,
  },
  trial: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  currentTierBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  currentTierText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
