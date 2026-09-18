// Seeded random draws and the summary statistics over them. Nothing here
// knows about programs or costs. A fixed seed gives the same draws on every
// machine, which is what lets a stranger rebuild a committed brief exactly.

/** mulberry32, a small seeded generator. Integer math only, so it is portable. */
export function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One draw from a triangle-shaped spread. Never below low, never above high,
 * most often near likely. When low equals high the input is fixed.
 */
export function triangular(next, low, likely, high) {
  if (high === low) return low;
  const u = next();
  const cut = (likely - low) / (high - low);
  if (u < cut) return low + Math.sqrt(u * (high - low) * (likely - low));
  return high - Math.sqrt((1 - u) * (high - low) * (high - likely));
}

/**
 * The value below which share p of the runs fall. Runs with no finite answer
 * are Infinity and sort last, so they count as the most expensive runs and
 * are never dropped.
 */
export function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[i];
}
