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
