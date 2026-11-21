import { IBookingQuoteResult, IBundleBreakdownItem } from "./cinema.interface";

/**
 * Finds the minimum number of seat bundles whose sizes sum to exactly `groupSize`.
 * Uses bottom-up dynamic programming (unbounded coin change).
 */
export function calculateBookingQuote(
    bundleSizes: number[],
    groupSize: number
): IBookingQuoteResult {
    const sortedSizes = [...new Set(bundleSizes)].sort((a, b) => b - a);
    const INF = Number.MAX_SAFE_INTEGER;

    const dp = new Array<number>(groupSize + 1).fill(INF);
    const choice = new Array<number>(groupSize + 1).fill(-1);
    dp[0] = 0;

    for (let s = 1; s <= groupSize; s++) {
        for (const size of sortedSizes) {
            if (size <= s && dp[s - size] !== INF && dp[s - size] + 1 < dp[s]) {
                dp[s] = dp[s - size] + 1;
                choice[s] = size;
            }
        }
    }

    if (dp[groupSize] === INF) {
        return {
            possible: false,
            groupSize,
            totalBundles: 0,
            breakdown: [],
            message: "Not possible",
        };
    }

    const counts = new Map<number, number>();
    let remaining = groupSize;
    while (remaining > 0) {
        const usedSize = choice[remaining];
        counts.set(usedSize, (counts.get(usedSize) ?? 0) + 1);
        remaining -= usedSize;
    }

    const breakdown: IBundleBreakdownItem[] = Array.from(counts.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([bundleSize, count]) => ({ bundleSize, count }));

    return {
        possible: true,
        groupSize,
        totalBundles: dp[groupSize],
        breakdown,
        message: "Booking quote calculated successfully",
    };
}
