# EmailVerification
# This web application does:
1. Send an email confirmation when user registers
2. Have user confirm email before system allows them to log in
3. Email verification link will expires after 1 hour. Use needs to request a new one if the old one has expired.

Package dependencies:

{
    "bcrypt": "^3.0.6",
    "body-parser": "^1.19.0",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^3.0.0",
    "dotenv": "^8.0.0",
    "ejs": "^2.6.2",
    "express": "^4.17.1",
    "express-session": "^1.16.2",
    "googleapis": "^40.0.0",
    "mongoose": "^5.6.2",
    "nodemailer": "^6.2.1",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^5.0.1",
    "randomstring": "^1.1.5"
  }
