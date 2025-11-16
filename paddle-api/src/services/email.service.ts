/**
 * Service Email - Envoi d'emails transactionnels
 * Utilise Nodemailer pour SMTP
 */

import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true pour 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Envoyer un email générique
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const info = await transporter.sendMail({
        from: `"Paddle App" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML pour version texte
      });

      console.log('Email envoyé:', info.messageId);
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  /**
   * Envoyer l'email de vérification
   */
  static async sendVerificationEmail(userId: string, email: string): Promise<boolean> {
    try {
      // Générer un token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Stocker le token dans la base (vous pouvez créer une table dédiée ou utiliser un champ user)
      // Pour simplifier, on peut stocker dans un cache Redis ou ajouter un champ dans User
      // Ici on stocke dans un cache temporaire (à implémenter avec Redis en production)

      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0066FF 0%, #00D084 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #0066FF;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎾 Bienvenue sur Paddle App !</h1>
          </div>
          <div class="content">
            <h2>Vérifiez votre adresse email</h2>
            <p>Merci de vous être inscrit sur Paddle App ! Pour commencer à utiliser l'application, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>

            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Vérifier mon email</a>
            </div>

            <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${verificationLink}
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              <strong>Note :</strong> Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Paddle App - Trouvez des partenaires, réservez des terrains, suivez vos performances</p>
          </div>
        </body>
        </html>
      `;

      const success = await this.sendEmail({
        to: email,
        subject: 'Vérifiez votre email - Paddle App',
        html,
      });

      // Stocker le token (dans Redis en production, ici simplifié)
      // await redis.setex(`email_verification:${verificationToken}`, 86400, userId);

      return success;
    } catch (error) {
      console.error('Erreur envoi email vérification:', error);
      return false;
    }
  }

  /**
   * Envoyer l'email de réinitialisation de mot de passe
   */
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #0066FF;
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: #FF6B35;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔒 Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
          <h2>Demande de réinitialisation</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
          </div>

          <p>Si le bouton ne fonctionne pas, copiez-collez ce lien :</p>
          <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">
            ${resetLink}
          </p>

          <div class="warning">
            <strong>⚠️ Important :</strong> Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: email,
      subject: 'Réinitialisation de mot de passe - Paddle App',
      html,
    });
  }

  /**
   * Envoyer l'email de bienvenue
   */
  static async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0066FF 0%, #00D084 100%);
            color: white;
            padding: 40px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
          }
          .feature {
            background: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #0066FF;
          }
          .cta {
            background: #0066FF;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Bienvenue ${firstName} !</h1>
          <p>Vous faites maintenant partie de la communauté Paddle App</p>
        </div>
        <div class="content">
          <h2>Commencez votre aventure paddle</h2>
          <p>Félicitations ! Votre compte est maintenant activé. Voici ce que vous pouvez faire :</p>

          <div class="feature">
            <h3>🔍 Trouvez des partenaires</h3>
            <p>Découvrez des joueurs de votre niveau près de chez vous</p>
          </div>

          <div class="feature">
            <h3>📅 Réservez des terrains</h3>
            <p>Accédez à des centaines de clubs et réservez en un clic</p>
          </div>

          <div class="feature">
            <h3>📊 Suivez vos performances</h3>
            <p>Analysez vos stats, progressez et montez dans le classement</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" class="cta">Commencer à jouer</a>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: email,
      subject: '🎾 Bienvenue sur Paddle App !',
      html,
    });
  }

  /**
   * Envoyer l'email de confirmation de réservation
   */
  static async sendBookingConfirmation(
    email: string,
    bookingDetails: {
      courtName: string;
      date: string;
      time: string;
      duration: number;
      price: number;
    }
  ): Promise<boolean> {
    const { courtName, date, time, duration, price } = bookingDetails;

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0066FF; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1>✅ Réservation confirmée !</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px;">
          <h2>Détails de votre réservation</h2>
          <table style="width: 100%; background: white; padding: 20px; border-radius: 8px;">
            <tr>
              <td><strong>Terrain :</strong></td>
              <td>${courtName}</td>
            </tr>
            <tr>
              <td><strong>Date :</strong></td>
              <td>${date}</td>
            </tr>
            <tr>
              <td><strong>Heure :</strong></td>
              <td>${time}</td>
            </tr>
            <tr>
              <td><strong>Durée :</strong></td>
              <td>${duration} minutes</td>
            </tr>
            <tr style="border-top: 2px solid #eee;">
              <td><strong>Prix :</strong></td>
              <td><strong>${price}€</strong></td>
            </tr>
          </table>
          <p style="margin-top: 20px;">Nous vous enverrons un rappel 1 heure avant votre réservation.</p>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: email,
      subject: `Réservation confirmée - ${courtName}`,
      html,
    });
  }
}
