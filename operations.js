// operations.js — YOUR WORK GOES HERE.
//
// Implement the four Redis operations for the QuickShop store.
// Fill in every `// TODO`. Do NOT change the function names or their return
// shapes — the test file depends on them.

import { redis } from "./redisClient.js";
import { findProductInDB } from "./db.js";

// ─────────────────────────────────────────────────────────────────────────────
// Task 1 — Count product views
// ─────────────────────────────────────────────────────────────────────────────
// Every time a product page is opened, add 1 to its view count.
export async function incrementViews(productId) {
  // TODO:
  //   Use INCR on the key `views:${productId}` and return the new count (a Number).
  //   Hint:  return await redis.incr(...)
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 2 — Read a product through the cache
// ─────────────────────────────────────────────────────────────────────────────
// The database is slow. Check Redis first; only go to the DB if it is not cached.
export async function getProduct(productId) {
  // TODO:
  //   1. key = `product:${productId}`
  //   2. const cached = await redis.get(key)
  //        if cached: return { source: "cache", product: JSON.parse(cached) }
  //   3. const product = await findProductInDB(productId)
  //        if !product: return { source: "db", product: null }
  //   4. save it for next time with a 60-second expiry:
  //        await redis.set(key, JSON.stringify(product), "EX", 60)
  //      then return { source: "db", product }
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 3 — Best-sellers leaderboard
// ─────────────────────────────────────────────────────────────────────────────
// Track purchases in a sorted set so we can read the best-sellers instantly.
export async function recordPurchase(productId) {
  // TODO:
  //   Add 1 to this product's score in the sorted set `trending:products`
  //   using ZINCRBY, and return the new score as a Number.
}

export async function getTopProducts(n) {
  // TODO:
  //   Read the top n products (highest score first) WITH their scores:
  //     const flat = await redis.zrevrange("trending:products", 0, n - 1, "WITHSCORES")
  //   `flat` looks like [ id, score, id, score, ... ]. Turn it into:
  //     [ { productId, score }, ... ]   (score as a Number)
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 4 — One-time coupon code
// ─────────────────────────────────────────────────────────────────────────────
// A coupon can be used at most once.
export async function issueCoupon(code, discountPercent, ttlSeconds) {
  // TODO:
  //   Save { discountPercent } as JSON under `coupon:${code}` with an expiry:
  //     await redis.set(`coupon:${code}`, JSON.stringify({ discountPercent }), "EX", ttlSeconds)
  //   Return the code.
}

export async function redeemCoupon(code) {
  // TODO:
  //   Read AND delete the coupon in one step with GETDEL:
  //     const raw = await redis.getdel(`coupon:${code}`)
  //   If raw exists: return { ok: true, discountPercent }
  //   Otherwise:     return { ok: false, reason: "invalid_or_used" }
}
