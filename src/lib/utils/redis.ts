import { Redis } from '@upstash/redis';

// Singleton for Upstash Redis (HTTP based)
// This works with the "https://..." URL provided in the .env file
export const redis = new Redis({
    url: process.env.REDIS_URL || 'https://mock-url',
    token: process.env.REDIS_TOKEN || 'mock-token',
    // Retry configuration is built-in to @upstash/redis
});

// Fallback checking wrapper (optional, but good for safety if env is missing)
// @upstash/redis throws error only when you make a call if creds are bad.
// Since we initialized it effectively, we'll let the error propagate if it fails,
// but our API routes wrap calls in try/catch so it's safe.
