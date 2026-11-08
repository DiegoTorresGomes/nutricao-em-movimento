import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";

// Only monotonic views are dynamic. updatedAt and every other scalar field
// remain protected; this function never supplies a value to a database update.
export function assertBaselineCompatible(current: Record<string, unknown>, baseline: Record<string, unknown>) {
  for (const key of Object.keys(current)) {
    if (key === "views") {
      assert.ok(Number.isSafeInteger(current.views) && Number.isSafeInteger(baseline.views));
      assert.ok(Number(current.views) >= Number(baseline.views), "Views decreased: " + current.id);
    } else {
      assert.ok(isDeepStrictEqual(current[key], baseline[key]), "Editorial/structural divergence: " + current.id + "/" + key);
    }
  }
}
