const FREE_ACTIVE_LIMIT = 2;
const PAID_ACTIVE_LIMIT = 10;

/**
 * Max active ('live') listings a user may have at once. Free-tier users get
 * 2; anyone on a paid subscription_tier gets 10 ("Plus"-equivalent). Builder
 * accounts don't have a subscription flow yet, so they're manually treated
 * as Plus per the brief, keyed off profiles.role rather than tier.
 */
export function getActiveListingLimit(
  subscriptionTier: string | null | undefined,
  role: string | null | undefined
): number {
  if (role === "builder") return PAID_ACTIVE_LIMIT;
  if (subscriptionTier && subscriptionTier !== "free") return PAID_ACTIVE_LIMIT;
  return FREE_ACTIVE_LIMIT;
}
