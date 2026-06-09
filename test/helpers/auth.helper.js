import { browser, $ } from '@wdio/globals'
import { users } from 'fixtures/users.js'

const SESSION_FILE_PREFIX = '/tmp/pafs-test-session'

/**
 * Logs in as the given user role and waits for successful redirect.
 * After login, saves the session cookie to a temp file so other specs
 * can call restoreSession() instead of repeating the login round-trip.
 *
 * @param {'regularUser'|'admin'|'eaUser'} role
 */
export async function loginAs(role = 'regularUser') {
  const user = users[role]
  if (!user?.email || !user?.password) {
    throw new Error(
      `No credentials configured for role "${role}". ` +
        'Set the corresponding TEST_*_EMAIL and TEST_*_PASSWORD env vars.'
    )
  }

  await browser.url('/auth/login')
  await $('#email').setValue(user.email)
  await $('#password').setValue(user.password)
  await $('button[type="submit"]').click()

  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl()
      return (
        url.includes('/home') ||
        url.includes('/admin') ||
        url.includes('/journey-selection')
      )
    },
    { timeout: 15000, timeoutMsg: `Login as "${role}" did not redirect as expected` }
  )

  await saveSession(role)
}

/**
 * Restores a saved session cookie.
 * Falls back to a full loginAs() if no saved session exists.
 *
 * @param {'regularUser'|'admin'|'eaUser'} role
 */
export async function restoreSession(role = 'regularUser') {
  const { readFileSync } = await import('node:fs')
  try {
    const raw = readFileSync(`${SESSION_FILE_PREFIX}-${role}.json`, 'utf8')
    const cookies = JSON.parse(raw)
    await browser.url('/')
    for (const cookie of cookies) {
      await browser.setCookies(cookie)
    }
  } catch {
    // No saved session — fall back to full login
    await loginAs(role)
  }
}

/**
 * Saves the current browser session cookies to a temp file.
 *
 * @param {string} role
 */
export async function saveSession(role) {
  const { writeFileSync } = await import('node:fs')
  const cookies = await browser.getCookies()
  writeFileSync(
    `${SESSION_FILE_PREFIX}-${role}.json`,
    JSON.stringify(cookies),
    'utf8'
  )
}

/**
 * Navigates to the logout URL and waits for redirect back to login.
 */
export async function logout() {
  await browser.url('/auth/logout')
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl()
      return url.includes('/login') || url.includes('/sign_in')
    },
    { timeout: 10000, timeoutMsg: 'Logout did not redirect to login page' }
  )
}
