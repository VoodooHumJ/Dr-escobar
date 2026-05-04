import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Health Check for monitoring (Railway/Render)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/auth', (req, res) => {
    console.log(`[AUTH] Login attempt at ${new Date().toISOString()}`);
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`
    );
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        console.error('[AUTH] Callback received without code');
        return res.status(400).send('Error: Missing code');
    }

    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const { access_token, error } = response.data;

        if (error) {
            console.error(`[AUTH] GitHub Error: ${error}`);
            return res.status(400).send(`Auth Error: ${error}`);
        }

        console.log('[AUTH] Token generated successfully');

        const postMessagePayload = JSON.stringify({
            token: access_token,
            provider: 'github',
        });

        res.send(`
            <html>
                <body>
                    <script>
                        (function() {
                            window.opener.postMessage(
                                'authorization:github:success:${postMessagePayload}',
                                '*'
                            );
                        })()
                    </script>
                </body>
            </html>
        `);
    } catch (err) {
        console.error(`[AUTH] Internal Error: ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`🚀 OAuth Gateway Production Ready on port ${port}`);
});
