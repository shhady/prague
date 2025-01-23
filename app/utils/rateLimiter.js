import rateLimit from 'express-rate-limit';
import { NextResponse } from 'next/server';

export function createRateLimiter() {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'لقد تجاوزت الحد المسموح به من المحاولات. الرجاء المحاولة لاحقاً' },
    handler: (_, __, ___, options) => {
      return NextResponse.json(options.message, { status: 429 });
    },
  });

  return limiter;
} 