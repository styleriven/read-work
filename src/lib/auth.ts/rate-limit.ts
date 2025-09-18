interface RateLimitConfig {
  requests: number;
  window: number;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  "comic-creation": { requests: 5, window: 1000 }, // 5 comics per second
  comment: { requests: 60, window: 60 * 1000 }, // 60 comments per minute
  like: { requests: 50, window: 60 * 1000 }, // 50 likes per minute
  search: { requests: 100, window: 1000 }, // 100 searches per second
  upload: { requests: 10, window: 60 * 1000 }, // 10 uploads per minute
};

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  userId: string,
  action: keyof typeof rateLimitConfigs
): { allowed: boolean; resetTime?: number; remaining?: number } {
  const config = rateLimitConfigs[action];
  if (!config) return { allowed: true };

  const key = `${userId}:${action}`;
  const now = Date.now();

  let record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + config.window,
    };
  }

  record.count += 1;
  rateLimitStore.set(key, record);

  const allowed = record.count <= config.requests;

  return {
    allowed,
    resetTime: record.resetTime,
    remaining: Math.max(0, config.requests - record.count),
  };
}

// Clean up expired records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
