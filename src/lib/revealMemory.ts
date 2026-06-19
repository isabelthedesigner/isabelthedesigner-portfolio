/**
 * Module-level memory of which intro reveals have already played.
 *
 * Lives for the lifetime of the loaded JS bundle, so it survives client-side
 * route changes (e.g. Home → Info → Home) but resets on a full page refresh.
 * This lets reveals play once "on load" without replaying on every navigation.
 */
const played = new Set<string>()

export function hasRevealed(key: string): boolean {
  return played.has(key)
}

export function markRevealed(key: string): void {
  played.add(key)
}
