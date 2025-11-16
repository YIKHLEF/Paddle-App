/**
 * Navigateur principal avec Bottom Tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import type { MainTabParamList } from './types';

// Import des écrans (à créer)
// import HomeScreen from '@/screens/home/HomeScreen';
// import SearchScreen from '@/screens/search/SearchScreen';
// import MatchesScreen from '@/screens/matches/MatchesScreen';
// import ProfileScreen from '@/screens/profile/ProfileScreen';
// import MoreScreen from '@/screens/more/MoreScreen';

// Placeholder screens temporaires
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: theme.dimensions.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-variant" size={size} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen title="Accueil" />}
      </Tab.Screen>

      <Tab.Screen
        name="Search"
        options={{
          tabBarLabel: 'Rechercher',
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" size={size} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen title="Rechercher" />}
      </Tab.Screen>

      <Tab.Screen
        name="Matches"
        options={{
          tabBarLabel: 'Matchs',
          tabBarIcon: ({ color, size }) => (
            <Icon name="tennis" size={size} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen title="Matchs" />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen title="Profil" />}
      </Tab.Screen>

      <Tab.Screen
        name="More"
        options={{
          tabBarLabel: 'Plus',
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu" size={size} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen title="Plus" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default MainNavigator;
