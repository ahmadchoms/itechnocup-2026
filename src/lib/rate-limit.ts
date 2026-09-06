interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Bersihkan key yang kadaluarsa setiap 5 menit
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 300000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

/**
 * Periksa rate limit berdasarkan identifier (IP atau User ID).
 * @param key Kunci unik (contoh: `auth:192.168.1.1` atau `chat:user_123`)
 * @param maxRequests Batas maksimal request dalam jendela waktu
 * @param windowSeconds Durasi jendela waktu dalam detik
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): { success: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const threshold = now - windowMs;

  const record = rateLimitStore.get(key) || { timestamps: [] };
  // Saring hanya request dalam rentang window
  const validTimestamps = record.timestamps.filter((t) => t > threshold);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const resetInSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  return {
    success: true,
    remaining: maxRequests - validTimestamps.length,
    resetInSeconds: windowSeconds,
  };
}
