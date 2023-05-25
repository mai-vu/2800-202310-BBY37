require("../utils.js");
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 12;
const crypto = require('crypto');
const express = require('express')
const router = express.Router()
const expireTime = 60 * 60 * 1000; // 1 hour
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');
const userCollection = database.db(mongodb_database).collection('users');

// const imageFilePath = '../img/entreepreneurIconOnly.png';

const sendResetPasswordEmail = (email, resetLink) => {
//   const image = fs.readFileSync(imageFilePath);
//   const encodedImage = image.toString('base64');
//   const dataUrl = `data:image/png;base64,${encodedImage}`;

  const msg = {
    to: email,
    from: 'noreply.entreepreneur@gmail.com',
    subject: 'Entreepreneur - Password Reset',
    html: `
      <p>Hello,<br>
      You have requested a password reset for your account. Please follow the instructions below to reset your password:</p>
      <ol>
        <li>Visit the password reset page by clicking on the link below:<br>
          <a href="https://entreepreneur.cyclic.app/password/forgot-password">Reset Password</a>
        </li>
        <li>If the link doesn't work, copy and paste the following URL into your web browser:<br>
          <a href="https://entreepreneur.cyclic.app/password/forgot-password">https://entreepreneur.cyclic.app/password/forgot-password</a>
        </li>
        <li>You will be directed to a page where you can enter your new password.</li>
      </ol>
      <p>If you did not initiate this password reset request, please ignore this email. No further action is required.</p>
      <p>Best,<br>
      - The Entreepreneur Team</p>
    `
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

// Generate a random token
function generateToken() {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
}

// Route for rendering forgot password form
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// Route for handling password reset request
router.post('/forgot-password', async (req, res) => {
    const {
        email
    } = req.body;

    const Joi = require('joi');

    // Validate email using Joi
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    const {error} = schema.validate({email});
    if (error) {
        return res.status(400).send('Invalid email');
    }

    try {
        // Check if user exists in the database
        const user = await userCollection.findOne({ email: email });
        console.log('Email: ' + email);
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('User: ' + user.name);

        // Generate unique token and store it in the database along with user email and expiration time
        const resetToken = generateToken();
        const expirationTime = Date.now() + expireTime;
        console.log(resetToken);
        console.log(expirationTime);
        const result = await userCollection.updateOne({
            email: email
        }, {
            $set: {
                resetToken: resetToken,
                expirationTime: expirationTime
            }
        });
        
        // Send password reset email with reset token
        const resetLink = `http://localhost:3000/password/reset-password?token=${resetToken}`;
        // const resetLink = `https://entreepreneur.cyclic.app/password/reset-password?token=${resetToken}`;
        sendResetPasswordEmail(email, resetLink);
        console.log(resetLink);

        res.send('Password reset email sent');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});


// Route for rendering password reset form
router.get('/reset-password', async (req, res) => {
    const { token } = req.query;

    try {
        // Check if token exists and hasn't expired
        const user = await userCollection.findOne({
            resetToken: token,
            expirationTime: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }

        res.render('reset-password', { token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Route for handling password reset
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        // Check if token exists and hasn't expired
        const user = await userCollection.findOne({
            resetToken: token,
            expirationTime: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }

        // Hash new password and update in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userCollection.updateOne(
            { email: user.email },
            { $set: { password: hashedPassword } }
        );

        // Redirect to login page after password reset
        res.redirect('/join/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;