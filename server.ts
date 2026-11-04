import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { runPreAiBot } from './src/services/preAiBot.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DEV_PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface ServerWorkLog {
  id: string;
  phone_number: string;
  latitude: number | null;
  longitude: number | null;
  message_type: 'location' | 'text';
  raw_message: string;
  estimated_wage: number;
  created_at: string;
  worker_name?: string;
  location_name?: string;
  status: 'verified' | 'pending' | 'disputed';
  verification_token: string;
}

const DATA_FILE = path.resolve('work_logs_db.json');

const INITIAL_LOGS: ServerWorkLog[] = [
  {
    id: 'rec_89f1a23e',
    phone_number: '+919876543210',
    latitude: 28.7159,
    longitude: 77.1691,
    message_type: 'location',
    raw_message: 'Location Pin: Azadpur Mandi Yard 4, Delhi',
    estimated_wage: 600,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    worker_name: 'Rameshwar Yadav',
    location_name: 'Azadpur Mandi Wholesale Hub, North Delhi',
    status: 'verified',
    verification_token: 'SS-DEL-2026-0891A',
  },
  {
    id: 'rec_76b4c12d',
    phone_number: '+919811234567',
    latitude: 19.0402,
    longitude: 72.8508,
    message_type: 'location',
    raw_message: 'Location Pin: Dharavi Redevelopment Sector 5',
    estimated_wage: 600,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    worker_name: 'Bablu Kumar',
    location_name: 'Dharavi Transit Camp Site, Mumbai',
    status: 'verified',
    verification_token: 'SS-MUM-2026-7641B',
  },
  {
    id: 'rec_54d9e87f',
    phone_number: '+919822012345',
    latitude: 13.0285,
    longitude: 77.5197,
    message_type: 'location',
    raw_message: 'Location Pin: Peenya Industrial Estate Phase 2',
    estimated_wage: 600,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    worker_name: 'Suresh Paswan',
    location_name: 'Peenya Fabrication Hub, Bengaluru',
    status: 'verified',
    verification_token: 'SS-BLR-2026-5498E',
  },
  {
    id: 'rec_43a8b76c',
    phone_number: '+919433187654',
    latitude: 26.8467,
    longitude: 80.9462,
    message_type: 'location',
    raw_message: 'Location Pin: Shaheed Path Flyover Expansion',
    estimated_wage: 600,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    worker_name: 'Dharmendra Bind',
    location_name: 'Gomti Nagar Extension, Lucknow',
    status: 'verified',
    verification_token: 'SS-LKO-2026-4387B',
  },
  {
    id: 'rec_32c7a65b',
    phone_number: '+919876543210',
    latitude: 28.7165,
    longitude: 77.1685,
    message_type: 'location',
    raw_message: 'Location Pin: Azadpur Mandi Gate 2',
    estimated_wage: 600,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    worker_name: 'Rameshwar Yadav',
    location_name: 'Azadpur Mandi Gate 2, Delhi',
    status: 'verified',
    verification_token: 'SS-DEL-2026-0890A',
  },
];

function loadLogs(): ServerWorkLog[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading logs DB, using initial', e);
  }
  return INITIAL_LOGS;
}

function persistLogs(logs: ServerWorkLog[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing logs DB', e);
  }
}

let workLogsStore: ServerWorkLog[] = loadLogs();

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function buildTwiML(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;
}

// Twilio WhatsApp Webhook: Handled by Advanced Pre-AI Deterministic Rule Engine
const handleTwilioWebhook = (req: express.Request, res: express.Response) => {
  const from = (req.body.From || req.body.from || req.query.From || '').toString().trim();
  const body = (req.body.Body || req.body.body || req.query.Body || '').toString().trim();
  const latRaw = req.body.Latitude || req.body.latitude || req.query.Latitude;
  const lngRaw = req.body.Longitude || req.body.longitude || req.query.Longitude;

  const lat = latRaw !== undefined && latRaw !== '' ? parseFloat(latRaw) : null;
  const lng = lngRaw !== undefined && lngRaw !== '' ? parseFloat(lngRaw) : null;

  console.log(`[Twilio Webhook] Received from ${from} | Body: "${body}" | Lat: ${lat}, Lng: ${lng}`);

  // Execute Pre-AI Deterministic Rule-Based Expert System
  const botResult = runPreAiBot(from, body, lat, lng, undefined, workLogsStore);

  // If the rule engine triggered an attendance log or dispute docket, persist to ledger
  if (botResult.logData) {
    const cleanPhone = from.replace(/^whatsapp:/, '').trim() || '+919876543210';
    const cleanLast4 = cleanPhone.replace(/\D/g, '').slice(-4);
    const token = botResult.logData.status === 'disputed'
      ? `DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      : `SS-TEL-${new Date().getFullYear()}-${cleanLast4}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

    const newLog: ServerWorkLog = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      phone_number: cleanPhone,
      latitude: botResult.logData.latitude,
      longitude: botResult.logData.longitude,
      message_type: 'location',
      raw_message: botResult.logData.rawMessage,
      estimated_wage: botResult.logData.estimatedWage || 600.0,
      created_at: new Date().toISOString(),
      location_name: botResult.logData.locationName || 'GPS Verified Work Site',
      status: botResult.logData.status || 'verified',
      verification_token: token,
    };

    workLogsStore = [newLog, ...workLogsStore];
    persistLogs(workLogsStore);
    console.log(`[Telegraph Dispatch] Persisted new entry to ledger: ${newLog.id} (status: ${newLog.status})`);
  }

  res.header('Content-Type', 'application/xml');
  return res.send(buildTwiML(botResult.reply));
};

app.post('/api/webhook', handleTwilioWebhook);
app.post('/webhook', handleTwilioWebhook);

// Direct In-App Telegraph Dispatch Endpoint
app.post('/api/dispatch', (req, res) => {
  const phone = (req.body.phone || req.body.From || '+919876543210').toString().trim();
  const body = (req.body.body || req.body.Body || '').toString().trim();
  const lat = req.body.latitude !== undefined && req.body.latitude !== null ? parseFloat(req.body.latitude) : null;
  const lng = req.body.longitude !== undefined && req.body.longitude !== null ? parseFloat(req.body.longitude) : null;
  const siteName = req.body.locationName || req.body.siteName;

  const botResult = runPreAiBot(phone, body, lat, lng, siteName, workLogsStore);
  let createdLog: ServerWorkLog | null = null;

  if (botResult.logData) {
    const cleanPhone = phone.replace(/^whatsapp:/, '').trim() || '+919876543210';
    const cleanLast4 = cleanPhone.replace(/\D/g, '').slice(-4);
    const token = botResult.logData.status === 'disputed'
      ? `DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      : `SS-TEL-${new Date().getFullYear()}-${cleanLast4}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

    createdLog = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      phone_number: cleanPhone,
      latitude: botResult.logData.latitude,
      longitude: botResult.logData.longitude,
      message_type: 'location',
      raw_message: botResult.logData.rawMessage,
      estimated_wage: botResult.logData.estimatedWage || 600.0,
      created_at: new Date().toISOString(),
      location_name: botResult.logData.locationName || siteName || 'GPS Verified Work Site',
      status: botResult.logData.status || 'verified',
      verification_token: token,
    };

    workLogsStore = [createdLog, ...workLogsStore];
    persistLogs(workLogsStore);
  }

  res.json({ success: true, reply: botResult.reply, newLog: createdLog, action: botResult.actionTaken });
});

// REST API for frontend
app.get('/api/logs', (req, res) => {
  res.json({ success: true, logs: workLogsStore });
});

app.post('/api/logs', (req, res) => {
  const newLog = req.body;
  if (!newLog || !newLog.phone_number) {
    return res.status(400).json({ error: 'Invalid log object' });
  }
  workLogsStore = [newLog, ...workLogsStore];
  persistLogs(workLogsStore);
  res.json({ success: true, log: newLog });
});

app.post('/api/reset', (req, res) => {
  workLogsStore = [...INITIAL_LOGS];
  persistLogs(workLogsStore);
  res.json({ success: true, logs: workLogsStore });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    system: 'Shramik Sakshi Pre-AI Rule-Based Expert System',
    engine: 'Deterministic DFSA Lexical Matcher v1974',
    total_logs: workLogsStore.length,
    webhook_url: '/api/webhook',
  });
});

async function startServer() {
  const distPath = path.resolve('dist');
  const isProduction = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';

  if (!isProduction && fs.existsSync(distPath) && !process.env.VITE_DEV) {
    app.use(express.static(distPath));
    app.get('{*path}', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/webhook') return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('{*path}', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/webhook') return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind primary port required by Cloud Run (PORT env var, e.g. 8080)
  app.listen(PORT, HOST, () => {
    console.log(`[Shramik Sakshi] Primary Server listening on http://${HOST}:${PORT}`);
    console.log(`[Twilio Webhook Endpoint] Ready at http://${HOST}:${PORT}/api/webhook and /webhook`);
  });

  // Also bind dev port 3000 if PORT is 8080 (for local dev reverse proxy)
  if (PORT !== DEV_PORT) {
    try {
      const devServer = app.listen(DEV_PORT, HOST, () => {
        console.log(`[Shramik Sakshi] Dev port also bound on http://${HOST}:${DEV_PORT}`);
      });
      devServer.on('error', (err: any) => {
        if (err.code !== 'EADDRINUSE') {
          console.warn(`[Shramik Sakshi] Dev port ${DEV_PORT} warning:`, err.message);
        }
      });
    } catch (e) {
      // Ignored
    }
  }
}

startServer();
