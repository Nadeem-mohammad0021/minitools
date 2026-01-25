import type { Redis } from '@upstash/redis';

let redis: Redis | null = null;
try {
  // Dynamically import only if env is present to avoid missing deps in dev
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = await import('@upstash/redis');
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch {
  // No redis available; fall back to in-memory
  redis = null;
}

const memory = new Map<string, string>();

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function shortenUrl(original: string): Promise<string> {
  const code = generateShortCode();
  if (redis) {
    await redis.set(`url:${code}`, original);
  } else {
    memory.set(code, original);
  }
  return code;
}

export async function resolveUrl(code: string): Promise<string | null> {
  if (redis) {
    const value = await redis.get<string>(`url:${code}`);
    return value ?? null;
  }
  return memory.get(code) ?? null;
}