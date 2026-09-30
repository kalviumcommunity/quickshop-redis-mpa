# QuickShop — Redis mini project

A tiny online-store backend. Everything is wired except **four Redis functions**
in `operations.js` — that is your job.

## What you edit

- **`operations.js`** — fill in every `// TODO`. **This is the only file you change.**

## Already done for you (do not edit)

- `redisClient.js` — the Redis connection
- `db.js` — a pretend slow product database
- `test.js` — the test runner

## Setup & run

You need **Node.js** and a running **Redis** server on `localhost:6379`.

```bash
npm install
cp .env.example .env

# start Redis (any one of these):
docker run -d --name redis -p 6379:6379 redis     # Docker
# or:  redis-server                                # if installed locally

npm test
```

A correct solution ends with:

```
  RESULT: 12 passed, 0 failed
✓ All tests passed!
```

## The four functions (in operations.js)

1. `incrementViews(productId)` — count product views (`INCR`)
2. `getProduct(productId)` — read through a cache with a 60-second expiry
3. `recordPurchase` / `getTopProducts` — a best-sellers leaderboard (sorted set)
4. `issueCoupon` / `redeemCoupon` — a one-time coupon code (`SET … EX` + `GETDEL`)

## Submit

Fill in your name + roll number below, then ZIP the whole project **without
`node_modules`** and upload it. Also paste your `npm test` output into `RESULT.txt`.

- **Name:**
- **Roll number:**
