/**
 * Middleware de gestion des erreurs
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

// Classe d'erreur personnalisée
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware de gestion globale des erreurs
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Erreur interne du serveur';
  let errors: any = undefined;

  // Erreur personnalisée AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Erreurs Prisma
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case 'P2002':
        // Violation de contrainte unique
        const target = (err.meta?.target as string[]) || [];
        message = `Cette valeur existe déjà: ${target.join(', ')}`;
        break;

      case 'P2025':
        // Enregistrement non trouvé
        message = 'Ressource non trouvée';
        statusCode = 404;
        break;

      case 'P2003':
        // Violation de clé étrangère
        message = 'Référence invalide';
        break;

      default:
        message = 'Erreur de base de données';
    }
  }

  // Erreurs de validation Prisma
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Données invalides';
  }

  // Erreurs JWT
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
  }

  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
  }

  // Erreurs de validation
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Erreur de validation';
  }

  // Logger l'erreur
  if (statusCode >= 500) {
    logger.error('Erreur serveur:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn('Erreur client:', {
      message: err.message,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Réponse
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
    }),
  });
};

/**
 * Wrapper pour les fonctions async
 * Permet d'éviter les try/catch dans chaque route
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware 404 - Route non trouvée
 */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.originalUrl}`,
  });
};
