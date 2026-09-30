// test.js — runs your operations end to end and checks them.
// COPY THIS FILE AS-IS. Do not edit it. Run with:  npm test
import { redis } from "./redisClient.js";
import {
  incrementViews,
  getProduct,
  recordPurchase,
  getTopProducts,
  issueCoupon,
  redeemCoupon,
} from "./operations.js";

let passed = 0;
let failed = 0;
function check(name, condition) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}`);
    failed++;
  }
}

async function main() {
  // Start from a clean slate so results are repeatable.
  await redis.del(
    "views:1",
    "product:1",
    "product:999",
    "trending:products",
    "coupon:SAVE20"
  );

  console.log("\nTask 1 — Atomic view counter (INCR)");
  const v1 = await incrementViews("1");
  const v2 = await incrementViews("1");
  console.log(`  views after two increments: ${v2}`);
  check("first increment returns 1", v1 === 1);
  check("second increment returns 2", v2 === 2);

  console.log("\nTask 2 — Cache-aside read with TTL");
  const miss = await getProduct("1");
  const hit = await getProduct("1");
  const missing = await getProduct("999");
  console.log(`  first read source: ${miss?.source}, second read source: ${hit?.source}`);
  check("first read comes from the DB", miss?.source === "db" && miss?.product?.id === "1");
  check("second read comes from the cache", hit?.source === "cache" && hit?.product?.id === "1");
  check("unknown product returns null product", missing?.product === null);
  const ttl = await redis.ttl("product:1");
  console.log(`  product:1 TTL = ${ttl}s`);
  check("cached product has a TTL between 1 and 60s", ttl > 0 && ttl <= 60);

  console.log("\nTask 3 — Trending leaderboard (sorted set)");
  await recordPurchase("1"); // 1
  await recordPurchase("2");
  await recordPurchase("2");
  await recordPurchase("2"); // 3
  const s = await recordPurchase("3"); // 1  (returns new score)
  const top = await getTopProducts(3);
  const rows = Array.isArray(top) ? top : [];
  console.log("  top 3:", JSON.stringify(top));
  check("recordPurchase returns the new score as a number", s === 1);
  check("getTopProducts returns an array of {productId, score}", rows.length === 3 && rows[0] && "productId" in rows[0] && "score" in rows[0]);
  check("product 2 is ranked #1 with score 3", rows[0]?.productId === "2" && rows[0]?.score === 3);
  check("scores are in descending order", rows.length === 3 && rows[0].score >= rows[1].score && rows[1].score >= rows[2].score);

  console.log("\nTask 4 — One-time coupon (SET EX + GETDEL)");
  await issueCoupon("SAVE20", 20, 300);
  const first = await redeemCoupon("SAVE20");
  const second = await redeemCoupon("SAVE20");
  console.log(`  first redeem: ${JSON.stringify(first)}, second redeem: ${JSON.stringify(second)}`);
  check("first redeem succeeds with the discount", first?.ok === true && first?.discountPercent === 20);
  check("second redeem fails (single-use)", second?.ok === false && second?.reason === "invalid_or_used");

  console.log(`\n────────────────────────────────────────`);
  console.log(`  RESULT: ${passed} passed, ${failed} failed`);
  console.log(`────────────────────────────────────────`);
  if (failed === 0) console.log("✓ All tests passed!\n");
  else console.log("✗ Some tests failed — fix the TODOs above.\n");

  await redis.quit();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Test run crashed:", err);
  process.exit(1);
});
