import { Duration, Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

export function createRateLimiter({ limit, window, prefix }: {
    limit: number;
    window: Duration;
    prefix: string
}) {
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, window),
        analytics: true,
        prefix,
    });
};


export const createCaseLimiter = createRateLimiter({
    limit: 5,
    window: "1h",
    prefix: "ratelimit:case_create",
});

export const createPresenceLimiter = createRateLimiter({
    limit: 100,
    window: "1m",
    prefix: "ratelimit:create_presence",
});