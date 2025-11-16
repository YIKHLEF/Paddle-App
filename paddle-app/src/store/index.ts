/**
 * Configuration du store Redux avec Redux Toolkit
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des reducers
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';

// Configuration de Redux Persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'app'], // Seulement ces reducers seront persistés
  blacklist: [], // Reducers à ne pas persister
};

// Combiner les reducers
const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  user: userReducer,
});

// Créer le reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurer le store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Créer le persistor
export const persistor = persistStore(store);

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
