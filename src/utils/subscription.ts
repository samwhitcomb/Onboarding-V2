/**
 * Subscription management utility
 * Uses localStorage for demo/mock purposes
 */

const STORAGE_KEY = 'rapsodo_subscription'
const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  STUDIO: 'studio'
}

/**
 * Get current subscription tier
 * @returns 'free' or 'studio'
 */
export function getSubscriptionTier(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return data.tier || SUBSCRIPTION_TIERS.FREE
    }
  } catch (e) {
    console.error('Error reading subscription:', e)
  }
  return SUBSCRIPTION_TIERS.FREE
}

/**
 * Check if user has Studio subscription
 * @returns boolean
 */
export function hasStudioAccess(): boolean {
  return getSubscriptionTier() === SUBSCRIPTION_TIERS.STUDIO
}

/**
 * Check if user is subscribed (any tier)
 * @returns boolean
 */
export function isSubscribed(): boolean {
  return getSubscriptionTier() !== SUBSCRIPTION_TIERS.FREE
}

/**
 * Set subscription tier
 * @param tier - 'free' or 'studio'
 */
export function setSubscriptionTier(tier: string): void {
  try {
    const data = {
      tier: tier,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error setting subscription:', e)
  }
}

/**
 * Upgrade to Studio subscription
 */
export function upgradeToStudio(): void {
  setSubscriptionTier(SUBSCRIPTION_TIERS.STUDIO)
}

/**
 * Cancel subscription (downgrade to free)
 */
export function cancelSubscription(): void {
  setSubscriptionTier(SUBSCRIPTION_TIERS.FREE)
}

/**
 * Get subscription info
 * @returns Subscription data
 */
export function getSubscriptionInfo() {
  const tier = getSubscriptionTier()
  return {
    tier,
    hasStudioAccess: tier === SUBSCRIPTION_TIERS.STUDIO,
    isSubscribed: tier !== SUBSCRIPTION_TIERS.FREE
  }
}


