import { createClient } from '@supabase/supabase-js';

const SUPABASE_TIMEOUT_MS = 10000;

export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const timeoutFetch: typeof fetch = async (input, init) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT_MS);

    if (init?.signal) {
      if (init.signal.aborted) {
        controller.abort();
      } else {
        init.signal.addEventListener('abort', () => controller.abort(), { once: true });
      }
    }

    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: timeoutFetch,
    },
  });
}
