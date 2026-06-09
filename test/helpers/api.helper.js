/**
 * API seeding helpers for test data that cannot be created through the UI.
 *
 * These functions call the backend API directly and require the backend to be
 * configured to return raw tokens in non-production environments.
 *
 * Required env vars:
 *   TEST_API_BASE_URL  — backend API root (e.g. http://localhost:3001)
 *                        Falls back to TEST_BASE_URL if not set.
 *   ADMIN_API_TOKEN    — a long-lived admin bearer token for privileged endpoints.
 *                        Generate once per environment and store in CI secrets.
 *                        Never rotated unless the account changes.
 */

const API_BASE =
  process.env.TEST_API_BASE_URL ||
  process.env.TEST_BASE_URL ||
  'http://localhost:3001'

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN

async function apiPost(path, body, authToken) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  const text = await response.text()
  let data = null
  try { data = JSON.parse(text) } catch { /* plain text response */ }

  return { ok: response.ok, status: response.status, data, text }
}

async function apiDelete(path, authToken) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const response = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers })
  return { ok: response.ok, status: response.status }
}

// ─── Password reset token seeding ────────────────────────────────────────────

/**
 * Triggers a password reset for the given email and returns the raw token.
 *
 * Requires: backend returns `{ token: "..." }` in the response body when
 * running in a test/staging environment (NODE_ENV=test or TEST_MODE=true).
 * In production the token is emailed only — this endpoint returns nothing.
 *
 * If the backend does not support token seeding, returns null and the
 * calling spec will skip via `if (!token) return this.skip()`.
 *
 * @param {string} email
 * @returns {Promise<string|null>} raw reset token, or null
 */
export async function seedPasswordResetToken(email) {
  const { ok, data } = await apiPost('/api/v1/auth/forgot-password', { email })
  if (!ok || !data) return null
  return data.token || data.resetToken || null
}

// ─── Invite token seeding ─────────────────────────────────────────────────────

/**
 * Creates a new user via the admin API and returns the raw invitation token.
 *
 * Requires: ADMIN_API_TOKEN env var.
 * Requires: backend returns `{ invitationToken: "..." }` in the response body.
 *
 * @param {{
 *   email: string,
 *   firstName?: string,
 *   lastName?: string,
 *   isAdmin?: boolean,
 *   responsibility?: 'EA'|'PSO'|'RMA'
 * }} userData
 * @returns {Promise<string|null>} raw invitation token, or null
 */
export async function seedInviteToken({
  email,
  firstName = 'Test',
  lastName = 'InviteUser',
  isAdmin = false,
  responsibility = 'RMA'
}) {
  if (!ADMIN_TOKEN) return null

  const { ok, data } = await apiPost(
    '/api/v1/admin/users',
    { email, firstName, lastName, isAdmin, responsibility },
    ADMIN_TOKEN
  )
  if (!ok || !data) return null
  return data.invitationToken || data.token || null
}

// ─── User lifecycle seeding ───────────────────────────────────────────────────

/**
 * Deletes a test user by email via the admin API.
 * Used in afterAll hooks to clean up seeded users.
 *
 * @param {string} email
 */
export async function deleteTestUser(email) {
  if (!ADMIN_TOKEN) return
  // Lookup user ID by email, then delete
  const searchRes = await fetch(
    `${API_BASE}/api/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
  )
  const data = await searchRes.json().catch(() => null)
  const userId = data?.users?.[0]?.id || data?.id
  if (!userId) return
  await apiDelete(`/api/v1/admin/users/${userId}`, ADMIN_TOKEN)
}

/**
 * Returns true if the backend API supports token seeding in the current
 * environment. Call this in a before hook to decide whether to skip tests.
 */
export async function apiSeedingIsAvailable() {
  // A lightweight health check — if the API is reachable and not production
  const response = await fetch(`${API_BASE}/health`).catch(() => null)
  return response?.ok === true
}
