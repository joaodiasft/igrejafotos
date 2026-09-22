/**
 * Cloudflare Worker entry (production).
 * Handles /api/* server-side (Gemini proxy) and serves the built SPA for
 * everything else via the static-assets binding.
 */
import { handleGemini } from '../server/gemini';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/gemini') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      const body = await request.text();
      const result = await handleGemini(body, env.GEMINI_API_KEY);
      return new Response(result.body as BodyInit, {
        status: result.status,
        headers: result.headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
