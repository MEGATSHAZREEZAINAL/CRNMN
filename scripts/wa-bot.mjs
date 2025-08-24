import http from 'http';
import { parse as parseUrl } from 'url';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import pkg from '@adiwajshing/baileys';
const { 
  default: makeWASocket, 
  fetchLatestBaileysVersion, 
  DisconnectReason,
  useMultiFileAuthState
} = pkg;
import qrcode from 'qrcode-terminal';

const PORT = process.env.WA_BOT_PORT || 4001;
const HOST = process.env.WA_BOT_HOST || '0.0.0.0';

// Persist session to a folder (newer API)
const SESSION_FOLDER = process.env.WA_SESSION_FOLDER || './wa-auth-info';
const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

let sock;
let isReady = false;
let startedAt = null;
let messagesReceived = 0;
let messagesSent = 0;
let lastQrAscii = null;

async function startWA() {
  const { version } = await fetchLatestBaileysVersion();
  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger,
    browser: ['CORNMAN HQ', 'Chrome', '123'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      logger.info('QR received. Scan with WhatsApp to login.');
      qrcode.generate(qr, { small: true }, (ascii) => {
        lastQrAscii = ascii;
        process.stdout.write(`${ascii}\n`);
      });
    }

    if (connection === 'open') {
      isReady = true;
      startedAt = new Date();
      logger.info('WhatsApp bot connected.');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.warn({ shouldReconnect }, 'Connection closed');
      isReady = false;
      lastQrAscii = null;
      if (shouldReconnect) startWA().catch(err => logger.error({ err }, 'Reconnect failed'));
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      messagesReceived += 1;
      const remoteJid = msg.key.remoteJid;
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      logger.info({ from: remoteJid, text }, 'Incoming message');

      const reply = await handleCommand(text);
      if (reply) {
        await sock.sendMessage(remoteJid, { text: reply });
        messagesSent += 1;
      }
    }
  });
}

async function handleCommand(raw) {
  const body = (raw || '').trim();
  const lower = body.toLowerCase();

  // Basic commands mirrored from UI/business logic
  if (lower === 'help' || lower === '/help' || lower.includes('tolong')) {
    return '🤖 CORNMAN Strategic HQ\n\nCommands:\n• stock\n• sales\n• catalog\n• restock [item]\n• status\n• contact\n• delivery';
  }
  if (lower.includes('stock') || lower.includes('inventory') || lower.includes('stok')) {
    return '📦 Inventory:\n• Urban Tee - 45\n• Street Hoodie - 32\n• Denim Jacket - 18\nLow stock: Cargo Pants (8), Baseball Cap (5)';
  }
  if (lower.includes('sales') || lower.includes('jualan') || lower.includes('pendapatan')) {
    return '💰 Today: RM 2,847.50 | Orders: 23 | New customers: 8';
  }
  if (lower.startsWith('restock ')) {
    const item = body.slice(8).trim();
    if (item) return `✅ Restock initiated for ${item} (50 units).`;
  }
  if (lower.includes('catalog')) {
    return '🛍️ Catalog:\nUrban Tee RM45, Hoodie RM89, Cargo RM125, Jacket RM149';
  }
  if (lower.includes('status') || lower.includes('laporan')) {
    return '📊 Status: Revenue RM 2,847.50 · Inventory 485 · Pending 3';
  }
  if (lower.includes('contact') || lower.includes('hubungi')) {
    return '📞 +601168444656 · hello@cornman.my · cornman.my';
  }
  if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('hantar')) {
    return '🚚 Delivery: Klang Valley RM8 (next day), Other states 2-3 days';
  }
  return null;
}

// HTTP control plane without Express
function writeJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const { pathname } = parseUrl(req.url || '/', true);

  // Helper to read JSON
  const readJson = () =>
    new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          resolve({});
        }
      });
    });

  try {
    if (req.method === 'GET' && pathname === '/health') {
      return writeJson(res, 200, { ok: true, connected: isReady });
    }

    if (req.method === 'POST' && pathname === '/start') {
      if (!isReady) startWA().catch((err) => logger.error({ err }, 'Start failed'));
      return writeJson(res, 200, { ok: true, starting: true });
    }

    if (req.method === 'POST' && pathname === '/stop') {
      try {
        await sock?.logout();
        isReady = false;
        return writeJson(res, 200, { ok: true });
      } catch (err) {
        return writeJson(res, 500, { ok: false, error: String(err) });
      }
    }

    if (req.method === 'POST' && pathname === '/send') {
      const body = (await readJson()) || {};
      if (!isReady) return writeJson(res, 400, { ok: false, error: 'not_connected' });
      const to = body.to;
      const text = body.text;
      if (!to || !text) return writeJson(res, 400, { ok: false, error: 'missing_params' });
      await sock.sendMessage(to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`, { text });
      messagesSent += 1;
      return writeJson(res, 200, { ok: true });
    }

    if (req.method === 'GET' && pathname === '/qr') {
      if (lastQrAscii) return writeJson(res, 200, { ok: true, qr: lastQrAscii });
      return writeJson(res, 404, { ok: false, error: 'no_qr' });
    }

    if (req.method === 'GET' && pathname === '/metrics') {
      return writeJson(res, 200, {
        connected: isReady,
        startedAt,
        messagesReceived,
        messagesSent,
      });
    }

    return writeJson(res, 404, { ok: false, error: 'not_found' });
  } catch (err) {
    return writeJson(res, 500, { ok: false, error: String(err) });
  }
});

server.listen(PORT, HOST, () => {
  logger.info(`WA bot server listening on http://${HOST}:${PORT}`);
});
