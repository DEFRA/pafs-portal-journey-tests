import { browser, expect, $ } from '@wdio/globals'
import {
  setPasswordPage,
  setPasswordLinkExpiredPage
} from 'page-objects/auth/set-password.page.js'
import { AUTH, COMMON } from 'constants/content.js'

/**
 * Set password (invite flow) spec.
 *
 * Tests are split into two groups:
 *   A) Link-expired page — always accessible, no token needed
 *   B) Set password form — requires a valid unexpired invitation token
 *
 * To enable group B, set:
 *   TEST_INVITE_TOKEN=<token>   in your .env / CI secrets
 *
 * To seed a token, the backend must return the raw invitation token in the
 * POST /api/v1/admin/users response body (non-production environments only).
 * See JOURNEY_TEST_ARCHITECTURE.md §5, Option 1 for the full API seeding
 * approach. Alternatively, use Mailpit to intercept the invite email (Option 2).
 *
 * Without TEST_INVITE_TOKEN, group B tests skip cleanly with a reason.
 */
describe('Auth — Set password (invite flow)', () => {
  // ── A: Link-expired page (always runnable) ─────────────────────────────────

  describe('Link expired page', () => {
    before(async () => {
      await setPasswordLinkExpiredPage.open()
    })

    it('has the correct page heading', async () => {
      await expect(setPasswordLinkExpiredPage.pageHeading).toHaveText(
        AUTH.SET_PASSWORD.LINK_EXPIRED.PAGE_HEADING
      )
    })

    it('shows body text explaining the link has expired', async () => {
      const bodyText = await setPasswordLinkExpiredPage.bodyParagraphs
      let found = false
      for (const el of bodyText) {
        if ((await el.getText()).includes('expired')) { found = true; break }
      }
      expect(found).toBe(true)
    })

    it('shows the 30-day expiry reason', async () => {
      const bodyText = await setPasswordLinkExpiredPage.bodyParagraphs
      let found = false
      for (const el of bodyText) {
        if ((await el.getText()).includes('30 days')) { found = true; break }
      }
      expect(found).toBe(true)
    })

    it('shows What you can do heading', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(AUTH.SET_PASSWORD.LINK_EXPIRED.WHAT_YOU_CAN_DO)
    })

    it('tells the user to contact PAFS support', async () => {
      const pageText = await $('main').getText()
      expect(pageText.toLowerCase()).toContain(
        AUTH.SET_PASSWORD.LINK_EXPIRED.CONTACT_MESSAGE.toLowerCase().slice(0, 20)
      )
    })

    it('shows the support email address', async () => {
      const pageText = await $('main').getText()
      expect(pageText.toLowerCase()).toContain('pafs')
    })

    it('shows a Back to sign in link with correct text', async () => {
      await expect(setPasswordLinkExpiredPage.backToSignInLink).toBeDisplayed()
      await expect(setPasswordLinkExpiredPage.backToSignInLink).toHaveText(
        AUTH.SET_PASSWORD.LINK_EXPIRED.BACK_LINK
      )
    })

    it('Back to sign in link points to the login page', async () => {
      const href = await setPasswordLinkExpiredPage.backToSignInLink.getAttribute('href')
      expect(href).toMatch(/login|sign_in/)
    })
  })

  // ── B: Set password form (requires seeded invite token) ────────────────────

  describe('Set password form — page content', () => {
    const token = process.env.TEST_INVITE_TOKEN

    before(async function () {
      if (!token) return this.skip()
      await setPasswordPage.open(token)
    })

    it('has the correct page heading', async function () {
      if (!token) return this.skip()
      await expect(setPasswordPage.pageHeading).toHaveText(AUTH.SET_PASSWORD.PAGE_HEADING)
    })

    it('shows the password requirements intro text', async function () {
      if (!token) return this.skip()
      const pageText = await $('main').getText()
      expect(pageText).toContain(AUTH.RESET_PASSWORD.REQUIREMENTS.INTRO)
    })

    it('lists all 5 password requirement items', async function () {
      if (!token) return this.skip()
      const items = await setPasswordPage.requirementsList
      expect(items.length).toBe(AUTH.RESET_PASSWORD.REQUIREMENTS.COUNT)
      const texts = await Promise.all(items.map((el) => el.getText()))
      for (const req of AUTH.RESET_PASSWORD.REQUIREMENTS.ITEMS) {
        expect(texts).toContain(req)
      }
    })

    it('shows Password label', async function () {
      if (!token) return this.skip()
      await expect(setPasswordPage.passwordLabel).toHaveText(AUTH.SET_PASSWORD.PASSWORD_LABEL)
    })

    it('shows Confirm password label', async function () {
      if (!token) return this.skip()
      await expect(setPasswordPage.confirmPasswordLabel).toHaveText(
        AUTH.SET_PASSWORD.CONFIRM_LABEL
      )
    })

    it('shows Set password submit button', async function () {
      if (!token) return this.skip()
      await expect(setPasswordPage.submitButton).toHaveText(AUTH.SET_PASSWORD.SUBMIT_BUTTON)
    })
  })

  describe('Set password form — validation', () => {
    const token = process.env.TEST_INVITE_TOKEN

    before(async function () {
      if (!token) return this.skip()
      await setPasswordPage.open(token)
    })

    it('shows error summary on empty submit', async function () {
      if (!token) return this.skip()
      await setPasswordPage.submitForm()
      await expect(setPasswordPage.errorSummary).toBeDisplayed()
      await expect(setPasswordPage.errorSummaryTitle).toHaveText(COMMON.ERROR_SUMMARY_HEADING)
    })

    it('shows password required error', async function () {
      if (!token) return this.skip()
      const errors = await setPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.SET_PASSWORD.ERRORS.PASSWORD_REQUIRED)
    })

    it('shows confirm required error', async function () {
      if (!token) return this.skip()
      const errors = await setPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.SET_PASSWORD.ERRORS.CONFIRM_REQUIRED)
    })

    it('shows password too short error', async function () {
      if (!token) return this.skip()
      await setPasswordPage.open(token)
      await setPasswordPage.setPassword('Short1!', 'Short1!')
      const errors = await setPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.SET_PASSWORD.ERRORS.PASSWORD_TOO_SHORT)
    })

    it('shows mismatch error when passwords do not match', async function () {
      if (!token) return this.skip()
      await setPasswordPage.open(token)
      await setPasswordPage.setPassword('ValidPass1!', 'DifferentPass1!')
      const errors = await setPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.SET_PASSWORD.ERRORS.PASSWORDS_MISMATCH)
    })
  })

  describe('Set password form — happy path', () => {
    const token = process.env.TEST_INVITE_TOKEN

    it('sets password successfully and redirects to home or login', async function () {
      if (!token) return this.skip()
      await setPasswordPage.open(token)
      await setPasswordPage.setPassword('ValidInvite1!', 'ValidInvite1!')
      const url = await browser.getUrl()
      // After set-password, user is either redirected to home or shown a success page
      expect(url).toMatch(/\/home|\/login|\/sign_in|success/)
    })
  })
})
