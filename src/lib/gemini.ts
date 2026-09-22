/**
 * Browser-side client for the /api/gemini proxy.
 * The API key lives ONLY on the server — this just calls our own endpoint.
 */

export type GeminiRole = 'user' | 'model';

export interface GeminiTurn {
  role: GeminiRole;
  text: string;
}

export interface GeminiOptions {
  system?: string;
  model?: 'gemini-flash-latest' | 'gemini-flash-lite-latest';
  temperature?: number;
  maxOutputTokens?: number;
  signal?: AbortSignal;
}

const ENDPOINT = '/api/gemini';

function toContents(turns: GeminiTurn[]) {
  return turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] }));
}

function buildBody(turns: GeminiTurn[], opts: GeminiOptions, stream: boolean) {
  const body: Record<string, unknown> = {
    stream,
    model: opts.model || 'gemini-flash-lite-latest',
    contents: toContents(turns),
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
    },
  };
  if (opts.system) {
    body.systemInstruction = { role: 'system', parts: [{ text: opts.system }] };
  }
  return body;
}

function extractText(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map((p: any) => p?.text || '').join('');
}

/** One-shot generation. Returns the full text. */
export async function askGemini(
  turns: GeminiTurn[] | string,
  opts: GeminiOptions = {}
): Promise<string> {
  const normalized: GeminiTurn[] =
    typeof turns === 'string' ? [{ role: 'user', text: turns }] : turns;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildBody(normalized, opts, false)),
    signal: opts.signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status} ao chamar a IA.`);
  }
  const data = await res.json();
  return extractText(data).trim();
}

/**
 * Streaming generation. Yields incremental text chunks as they arrive.
 * Usage: for await (const chunk of streamGemini(turns, opts)) { ... }
 */
export async function* streamGemini(
  turns: GeminiTurn[] | string,
  opts: GeminiOptions = {}
): AsyncGenerator<string, void, unknown> {
  const normalized: GeminiTurn[] =
    typeof turns === 'string' ? [{ role: 'user', text: turns }] : turns;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildBody(normalized, opts, true)),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status} ao chamar a IA.`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  function* drain(frame: string): Generator<string> {
    // A frame may hold multiple `data:` lines; SSE uses CRLF or LF.
    for (const line of frame.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      const json = line.slice(5).trim();
      if (!json || json === '[DONE]') continue;
      try {
        const chunk = extractText(JSON.parse(json));
        if (chunk) yield chunk;
      } catch {
        /* ignore partial/non-JSON frames */
      }
    }
  }

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line (\r\n\r\n or \n\n).
    const frames = buffer.split(/\r?\n\r?\n/);
    buffer = frames.pop() || '';
    for (const frame of frames) yield* drain(frame);
  }

  // Flush anything left without a trailing blank line.
  if (buffer.trim()) yield* drain(buffer);
}
