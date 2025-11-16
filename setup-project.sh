#!/bin/bash

# Script de création de la structure du projet Paddle App
# Ce script crée tous les dossiers nécessaires pour le backend et le mobile

echo "🎾 Création de la structure du projet Paddle App..."

# ===========================================
# BACKEND (Node.js + Prisma)
# ===========================================

echo "📦 Création de la structure backend..."

mkdir -p paddle-api/src/{config,controllers,services,routes,middleware,utils,types,jobs}
mkdir -p paddle-api/prisma/migrations
mkdir -p paddle-api/tests/{unit,integration}

# Créer des fichiers .gitkeep pour Git
touch paddle-api/src/config/.gitkeep
touch paddle-api/src/controllers/.gitkeep
touch paddle-api/src/services/.gitkeep
touch paddle-api/src/routes/.gitkeep
touch paddle-api/src/middleware/.gitkeep
touch paddle-api/src/utils/.gitkeep
touch paddle-api/src/types/.gitkeep
touch paddle-api/src/jobs/.gitkeep
touch paddle-api/tests/unit/.gitkeep
touch paddle-api/tests/integration/.gitkeep

# ===========================================
# MOBILE (React Native)
# ===========================================

echo "📱 Création de la structure mobile..."

mkdir -p paddle-app/src/{api,assets,components,navigation,screens,store,hooks,utils,constants,theme,types}

# API
mkdir -p paddle-app/src/api/services

# Assets
mkdir -p paddle-app/src/assets/{images,icons,fonts,lottie}

# Components
mkdir -p paddle-app/src/components/{common,features,layouts}

# Screens
mkdir -p paddle-app/src/screens/{auth,home,search,booking,matches,profile,subscription,settings}

# Store
mkdir -p paddle-app/src/store/slices

# Tests
mkdir -p paddle-app/__tests__/{components,screens,services}
mkdir -p paddle-app/e2e

# Créer des fichiers .gitkeep
touch paddle-app/src/api/services/.gitkeep
touch paddle-app/src/assets/images/.gitkeep
touch paddle-app/src/assets/icons/.gitkeep
touch paddle-app/src/assets/fonts/.gitkeep
touch paddle-app/src/assets/lottie/.gitkeep
touch paddle-app/src/components/common/.gitkeep
touch paddle-app/src/components/features/.gitkeep
touch paddle-app/src/components/layouts/.gitkeep
touch paddle-app/src/screens/auth/.gitkeep
touch paddle-app/src/screens/home/.gitkeep
touch paddle-app/src/screens/search/.gitkeep
touch paddle-app/src/screens/booking/.gitkeep
touch paddle-app/src/screens/matches/.gitkeep
touch paddle-app/src/screens/profile/.gitkeep
touch paddle-app/src/screens/subscription/.gitkeep
touch paddle-app/src/screens/settings/.gitkeep
touch paddle-app/src/store/slices/.gitkeep
touch paddle-app/__tests__/components/.gitkeep
touch paddle-app/__tests__/screens/.gitkeep
touch paddle-app/__tests__/services/.gitkeep

# ===========================================
# DOCUMENTATION
# ===========================================

mkdir -p docs

echo "✅ Structure du projet créée avec succès !"
echo ""
echo "Structure créée :"
echo "  📁 paddle-api/    - Backend Node.js + Prisma"
echo "  📁 paddle-app/    - Application mobile React Native"
echo "  📁 docs/          - Documentation"
echo ""
echo "Prochaines étapes :"
echo "  1. Générer les fichiers de configuration (package.json, tsconfig, etc.)"
echo "  2. Installer les dépendances"
echo "  3. Développer l'application"
echo ""
echo "🎾 Bon développement !"
