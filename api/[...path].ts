import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: false,
  },
};

const FORWARD_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'x-requested-with',
];

async function readBody(req: VercelRequest): Promise<Buffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const base = process.env.API_PROXY_URL?.replace(/\/$/, '');
  if (!base) {
    res.status(503).json({
      error:
        'API proxy not configured. Set API_PROXY_URL on Vercel (your Render API URL).',
    });
    return;
  }

  const segments = req.query.path;
  const path = Array.isArray(segments) ? segments.join('/') : segments || '';
  const queryStart = req.url?.indexOf('?') ?? -1;
  const query = queryStart >= 0 ? req.url!.slice(queryStart) : '';
  const url = `${base}/api/${path}${query}`;

  const headers: Record<string, string> = {};
  for (const key of FORWARD_HEADERS) {
    const value = req.headers[key];
    if (typeof value === 'string') headers[key] = value;
  }

  const body = await readBody(req);

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body: body as BodyInit | undefined,
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error('API proxy error:', err);
    res.status(502).json({ error: 'Failed to reach API server' });
  }
}
