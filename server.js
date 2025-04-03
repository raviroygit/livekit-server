const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const apiKey = process.env.LIVEKIT_API_KEY || 'APIDYozXqMJhYv3';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'RoRjUz7GiZEuFzjKfhqbGuPINwkn9NffC92MxtB53ksB';

app.get('/token', async (req, res) => {
  const room = req.query.room;
  const username = req.query.username;

  if (!room || !username) {
    return res.status(400).json({ error: 'Missing room or username' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      ttl: 60 * 60 * 24,
    });

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    console.log('✅ Token generated for:', username);
    res.json({ token });
  } catch (err) {
    console.error('❌ Error generating token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});



// Extra error logs
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

app.listen(port, () => {
  console.log(`🚀 LiveKit token server running at http://localhost:${port}`);
});