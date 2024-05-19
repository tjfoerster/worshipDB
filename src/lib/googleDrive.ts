import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';

const TOKEN_PATH = path.join(process.cwd(), 'token.json');

export async function authorize(code?: string): Promise<OAuth2Client> {
    const clientID = import.meta.env.CLIENT_ID;
    const clientSecret = import.meta.env.CLIENT_SECRET;
    const redirectURI = import.meta.env.REDIRECT_URI;
    const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI);

    if (fs.existsSync(TOKEN_PATH)) {
        const tokenData = fs.readFileSync(TOKEN_PATH, 'utf-8');
        oAuth2Client.setCredentials(JSON.parse(tokenData));
        console.log('Token loaded from token.json');
        return oAuth2Client;
    } else {
        // Check whether the authorisation code is available as the URL parameter 'code'.
        if (!code) {
            // If no authorisation code is available, display the authorisation link in the browser.
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/drive.readonly'],
            });
            console.log('Authorize this app by visiting this URL:', authUrl);
            throw new Error('Token not found. Please authorise this app by visiting this URL: ' + authUrl);
        } else {
            // If the authorisation code is available, get the token and save it.
            try {
                const { tokens } = await oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(tokens);
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
                console.log('Token generated and stored in token.json');
                return oAuth2Client;
            } catch (err) {
                console.error('Error retrieving access token:', err);
                throw new Error('Failed to generate access token.');
            }
        }
    }
}

async function getFile(auth: OAuth2Client, fileId: string): Promise<string> {
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  const filePath = path.join(process.cwd(), 'downloaded.sqlite');
  const dest = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    res.data
      .on('end', () => {
        console.log('Downloaded file.');
        resolve(filePath);
      })
      .on('error', err => {
        console.error('Error downloading file.', err);
        reject(err);
      })
      .pipe(dest);
  });
}

export async function downloadSQLiteFile(auth: OAuth2Client, fileId: string): Promise<string> {
    const filePath = await getFile(auth, fileId);
    return filePath;
}
