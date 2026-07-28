export interface Env {
  ACCESS_CODE: string;
}

const ALLOWED_ORIGIN = 'https://bmmedinac.github.io';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Access-Code',
  };
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

/**
 * Único trabajo de este worker: guardar el código de acceso como secreto
 * (fuera del bundle estático) y decirle al widget si el que ingresó el
 * visitante es correcto. El chat en sí lo resuelve el webhook de Make.com;
 * esto es solo el portero.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const accessCode = request.headers.get('X-Access-Code') ?? '';
    if (!env.ACCESS_CODE || accessCode !== env.ACCESS_CODE) {
      return jsonResponse({ error: 'unauthorized' }, 401);
    }

    return jsonResponse({ ok: true }, 200);
  },
};
