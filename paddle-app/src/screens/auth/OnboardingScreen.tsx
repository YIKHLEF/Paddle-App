/**
 * Écran d'onboarding - Introduction à l'application
 * Affiche 3 slides de présentation avant de diriger vers Login/SignUp
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Trouvez des Partenaires',
    description: 'Connectez-vous avec des joueurs de votre niveau près de chez vous pour des matchs inoubliables.',
    icon: 'account-group',
    iconColor: '#0066FF',
  },
  {
    id: '2',
    title: 'Réservez des Terrains',
    description: 'Réservez facilement des terrains de padel dans les meilleurs clubs de votre région.',
    icon: 'tennis',
    iconColor: '#00D084',
  },
  {
    id: '3',
    title: 'Suivez vos Performances',
    description: 'Analysez vos statistiques, suivez votre progression et améliorez votre jeu.',
    icon: 'chart-line',
    iconColor: '#FF6B35',
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const handleGetStarted = () => {
    navigation.navigate('SignUp');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}15` }]}>
        <Icon name={item.icon} size={80} color={item.iconColor} />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor:
                index === currentIndex ? theme.colors.primary : theme.colors.border,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
          Passer
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        {currentIndex === slides.length - 1 ? (
          <>
            <Button
              title="Commencer"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              fullWidth
            />
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.loginLinkText, { color: theme.colors.textSecondary }]}>
                Déjà un compte ?{' '}
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  Se connecter
                </Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button
            title="Suivant"
            onPress={handleNext}
            variant="primary"
            size="large"
            fullWidth
            icon="arrow-right"
            iconPosition="right"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
  },
});

export default OnboardingScreen;
