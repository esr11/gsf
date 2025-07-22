const { google } = require('googleapis');
const fs = require('fs');

// Replace these with your actual credentials from Google Cloud Console
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'http://localhost'
);

const scopes = ['https://www.googleapis.com/auth/gmail.send'];

const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});

console.log('Visit this URL:', url);

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question('Enter the code from the URL: ', (code) => {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        console.log('Refresh token:', token.refresh_token);
        fs.writeFileSync('tokens.json', JSON.stringify(token));
        readline.close();
    });
}); 