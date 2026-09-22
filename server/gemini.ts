/**
 * Framework-agnostic Gemini proxy handler.
 * Shared by the Vite dev middleware (Node) and the Cloudflare Worker (prod).
 * The API key NEVER leaves the server — the browser only ever talks to /api/gemini.
 */

export interface GeminiResult {
  status: number;
  headers: Record<string, string>;
  /** JSON string, or a passthrough SSE stream when streaming. */
  body: string | ReadableStream<Uint8Array>;
}

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta';

// Allow-list: only cheap/safe models can be reached through the proxy, so a
// leaked endpoint can't be abused to run expensive video/music models.
// `*-latest` aliases auto-track Google's current stable flash models.
const ALLOWED_MODELS = new Set<string>([
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image',
]);
const DEFAULT_MODEL = 'gemini-flash-lite-latest';
const HARD_MAX_OUTPUT_TOKENS = 2048;
const TIMEOUT_MS = 30000;

function json(status: number, obj: unknown): GeminiResult {
  return {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(obj),
  };
}

function sanitize(text: string): string {
  // Defensive: never echo anything key-shaped back to the client.
  return text.replace(/AQ\.[A-Za-z0-9._-]+/g, '[redacted]').replace(/AIza[A-Za-z0-9._-]+/g, '[redacted]').slice(0, 600);
}

export async function handleGemini(
  rawBody: string,
  apiKey: string | undefined
): Promise<GeminiResult> {
  if (!apiKey) {
    return json(500, { error: 'IA indisponível: GEMINI_API_KEY não configurada no servidor.' });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody || '{}');
  } catch {
    return json(400, { error: 'Corpo da requisição inválido (JSON esperado).' });
  }

  if (!Array.isArray(payload.contents) || payload.contents.length === 0) {
    return json(400, { error: 'O campo "contents" é obrigatório.' });
  }

  const model = ALLOWED_MODELS.has(payload.model) ? payload.model : DEFAULT_MODEL;
  const stream = Boolean(payload.stream);

  const generationConfig: Record<string, unknown> = {
    ...(payload.generationConfig || {}),
    maxOutputTokens: Math.min(
      Number(payload.generationConfig?.maxOutputTokens) || 1024,
      HARD_MAX_OUTPUT_TOKENS
    ),
  };
  // The "lite" models reject thinkingConfig with a 400 — strip it defensively.
  if (model.includes('lite')) {
    delete generationConfig.thinkingConfig;
  }

  const upstreamBody: Record<string, unknown> = {
    contents: payload.contents,
    generationConfig,
  };
  if (payload.systemInstruction) upstreamBody.systemInstruction = payload.systemInstruction;
  if (payload.safetySettings) upstreamBody.safetySettings = payload.safetySettings;
  if (payload.tools) upstreamBody.tools = payload.tools;

  const method = stream ? 'streamGenerateContent' : 'generateContent';
  const query = stream ? `?alt=sse&key=${apiKey}` : `?key=${apiKey}`;
  const url = `${ENDPOINT}/models/${model}:${method}${query}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(upstreamBody),
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timer);
    return json(502, { error: 'Não foi possível contatar o serviço de IA. Tente novamente.' });
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    clearTimeout(timer);
    return json(upstream.status, {
      error: 'O serviço de IA retornou um erro.',
      detail: sanitize(detail),
    });
  }

  if (stream && upstream.body) {
    clearTimeout(timer); // headers received; let the stream flow freely
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
      body: upstream.body,
    };
  }

  const data = await upstream.text();
  clearTimeout(timer);
  return { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: data };
}
