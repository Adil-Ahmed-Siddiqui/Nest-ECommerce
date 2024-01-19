import { Injectable } from '@nestjs/common';
const sgMail = require('@sendgrid/mail');

interface IsendEmail {
    to: string,
    subject: string,
    html: string
}

interface IsendVerificationEmail {
    name: string,
    email: string,
    verificationToken: string,
    origin: string
}

interface IresetPasswordEmail {
    name: string,
    email: string,
    token: string,
    origin: string
}

@Injectable()
export class EmailService {
    sendEmail({ to, subject, html }: IsendEmail){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
        return sgMail.send({
          from: 'madilas565@gmail.com', // sender address
          to,
          subject,
          html,
        });
    };

    sendVerificationEmail({name, email, verificationToken, origin}: IsendVerificationEmail){
        const verifyEmail = `${origin}/auth/verify-email?token=${verificationToken}&email=${email}`;
      
        const message= `<p>Please confirm your email by clicking on the following link : 
        <a clicktracking=off href="${verifyEmail}">Verify Email</a> </p>`;
      
        return this.sendEmail({
          to: email,
          subject: 'Email Confirmation',
          html: `<h4> Hello, ${name}</h4>
          ${message}
          `,
        });
    };

    sendResetPasswordEmail({ name, email, token, origin }: IresetPasswordEmail){
        const resetURL = `${origin}/auth/reset-password?token=${token}&email=${email}`;
        const message = `<p>Please reset password by clicking on the following link : 
        <a clicktracking=off href="${resetURL}">Reset Password</a></p>`;
      
        return this.sendEmail({
          to: email,
          subject: 'Reset Password',
          html: `<h4>Hello, ${name}</h4>
         ${message}
         `,
        });
    };
}
