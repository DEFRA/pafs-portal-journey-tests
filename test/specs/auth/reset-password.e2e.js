import { browser, expect, $ } from '@wdio/globals'
import {
  resetPasswordPage,
  resetPasswordSuccessPage,
  resetPasswordTokenExpiredPage
} from 'page-objects/auth/reset-password.page.js'
import { AUTH, COMMON } from 'constants/content.js'
import { seedPasswordResetToken } from 'helpers/api.helper.js'
import { uniqueEmail } from 'helpers/unique.helper.js'

/**
 * Reset password spec.
 *
 * Group A — Token-expired page: no dependencies, always runs.
 *
 * Group B — Reset password form: a fresh token is seeded via the backend API
 * in the before hook. No env var is needed — the token is generated
 * automatically each run so it is never stale or expired.
 *
 * Backend requirement: POST /api/v1/auth/forgot-password must return
 * { token: "..." } in non-production environments. Set TEST_API_BASE_URL
 * to the backend API root. If the backend does not support token seeding,
 * Group B tests skip with a clear reason and appear as "skipped — API
 * seeding not available" in the Allure report.
 */
describe('Auth — Reset password', () => {
  // ── A: Token-expired page (no dependencies) ────────────────────────────────

  describe('Token expired page', () => {
    before(async () => {
      await resetPasswordTokenExpiredPage.open()
    })

    it('has the correct page heading', async () => {
      await expect(resetPasswordTokenExpiredPage.pageHeading).toHaveText(
        AUTH.RESET_PASSWORD.TOKEN_EXPIRED.PAGE_HEADING
      )
    })

    it('shows body text explaining the link has expired', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain('expired')
    })

    it('shows the 6-hour expiry reason', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain('6 hours')
    })

    it('shows What you can do heading', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(AUTH.RESET_PASSWORD.TOKEN_EXPIRED.WHAT_YOU_CAN_DO)
    })

    it('shows a Request new reset link', async () => {
      await expect(resetPasswordTokenExpiredPage.requestNewLinkButton).toBeDisplayed()
    })

    it('Request new reset link points to forgot-password', async () => {
      const href = await resetPasswordTokenExpiredPage.requestNewLinkButton
        .getAttribute('href')
      expect(href).toContain('forgot-password')
    })

    it('shows Back to sign in link with correct text', async () => {
      await expect(resetPasswordTokenExpiredPage.backToSignInLink).toHaveText(
        AUTH.RESET_PASSWORD.TOKEN_EXPIRED.BACK_LINK
      )
    })

    it('Back to sign in link points to login', async () => {
      const href = await resetPasswordTokenExpiredPage.backToSignInLink.getAttribute('href')
      expect(href).toMatch(/login|sign_in/)
    })
  })

  // ── B: Reset password form (auto-seeded token) ─────────────────────────────

  describe('Reset password form — page content', () => {
    let token
    const testEmail = uniqueEmail('reset-test')

    before(async () => {
      token = await seedPasswordResetToken(testEmail)
      if (!token) console.warn('API seeding not available — reset-password form tests will skip')
    })

    it('has the correct page heading', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await expect(resetPasswordPage.pageHeading).toHaveText(
        AUTH.RESET_PASSWORD.PAGE_HEADING
      )
    })

    it('shows the password requirements intro text', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      const pageText = await $('main').getText()
      expect(pageText).toContain(AUTH.RESET_PASSWORD.REQUIREMENTS.INTRO)
    })

    it('lists all 5 password requirement items', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      const items = await resetPasswordPage.requirementsList
      expect(items.length).toBe(AUTH.RESET_PASSWORD.REQUIREMENTS.COUNT)
      const texts = await Promise.all(items.map((el) => el.getText()))
      for (const req of AUTH.RESET_PASSWORD.REQUIREMENTS.ITEMS) {
        expect(texts).toContain(req)
      }
    })

    it('shows Password label', async function () {
      if (!token) return this.skip()
      await expect(resetPasswordPage.passwordLabel).toHaveText(
        AUTH.RESET_PASSWORD.PASSWORD_LABEL
      )
    })

    it('shows Confirm password label', async function () {
      if (!token) return this.skip()
      await expect(resetPasswordPage.confirmPasswordLabel).toHaveText(
        AUTH.RESET_PASSWORD.CONFIRM_LABEL
      )
    })

    it('shows Reset password submit button', async function () {
      if (!token) return this.skip()
      await expect(resetPasswordPage.submitButton).toHaveText(
        AUTH.RESET_PASSWORD.SUBMIT_BUTTON
      )
    })
  })

  describe('Reset password form — validation', () => {
    let token
    const testEmail = uniqueEmail('reset-validation')

    before(async () => {
      token = await seedPasswordResetToken(testEmail)
    })

    it('shows error summary on empty submit', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.submitForm()
      await expect(resetPasswordPage.errorSummary).toBeDisplayed()
      await expect(resetPasswordPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
    })

    it('shows password required error', async function () {
      if (!token) return this.skip()
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.PASSWORD_REQUIRED)
    })

    it('shows confirm password required error', async function () {
      if (!token) return this.skip()
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.CONFIRM_REQUIRED)
    })

    it('shows too-short error for password under 8 characters', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.setPassword('Sh0rt!', 'Sh0rt!')
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.PASSWORD_TOO_SHORT)
    })

    it('shows mismatch error when passwords do not match', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.setPassword('ValidPass1!', 'DifferentPass1!')
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.PASSWORDS_MISMATCH)
    })

    it('shows uppercase required error', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.setPassword('alllower1!', 'alllower1!')
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.PASSWORD_UPPERCASE)
    })

    it('shows number required error', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.setPassword('NoNumbers!ABC', 'NoNumbers!ABC')
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.PASSWORD_NUMBER)
    })

    it('shows special character required error', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.setPassword('NoSpecial1ABC', 'NoSpecial1ABC')
      const errors = await resetPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.RESET_PASSWORD.ERRORS.PASSWORD_SPECIAL)
    })
  })

  describe('Reset password — happy path', () => {
    let token
    const testEmail = uniqueEmail('reset-happy')

    before(async () => {
      // Fresh token — single-use, must be seeded just before this test
      token = await seedPasswordResetToken(testEmail)
    })

    it('sets password successfully and shows success panel', async function () {
      if (!token) return this.skip()
      await resetPasswordPage.open(token)
      await resetPasswordPage.setPassword('ValidP@ss1!ABC', 'ValidP@ss1!ABC')
      await expect(resetPasswordSuccessPage.panelTitle).toHaveText(
        AUTH.RESET_PASSWORD.SUCCESS.PANEL_TITLE
      )
    })

    it('success panel body says you can now sign in', async function () {
      if (!token) return this.skip()
      await expect(resetPasswordSuccessPage.panelBody).toHaveText(
        AUTH.RESET_PASSWORD.SUCCESS.PANEL_BODY
      )
    })

    it('success page shows Back to sign in link', async function () {
      if (!token) return this.skip()
      await expect(resetPasswordSuccessPage.backToSignInLink).toBeDisplayed()
      await expect(resetPasswordSuccessPage.backToSignInLink).toHaveText(
        AUTH.RESET_PASSWORD.SUCCESS.BACK_LINK
      )
    })
  })
})
