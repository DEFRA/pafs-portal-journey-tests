import { expect } from '@wdio/globals'
import {
  forgotPasswordPage,
  forgotPasswordConfirmationPage
} from 'page-objects/auth/forgot-password.page.js'
import { AUTH, COMMON } from 'constants/content.js'
import { uniqueEmail } from 'helpers/unique.helper.js'

describe('Auth — Forgot password', () => {
  describe('Page content', () => {
    before(async () => {
      await forgotPasswordPage.open()
    })

    it('has the correct page heading', async () => {
      await expect(forgotPasswordPage.pageHeading).toHaveText(
        AUTH.FORGOT_PASSWORD.PAGE_HEADING
      )
    })

    it('shows the description text', async () => {
      const text = await forgotPasswordPage.descriptionText.getText()
      expect(text).toContain(AUTH.FORGOT_PASSWORD.DESCRIPTION)
    })

    it('shows the Email address label', async () => {
      await expect(forgotPasswordPage.emailLabel).toHaveText(
        AUTH.FORGOT_PASSWORD.EMAIL_LABEL
      )
    })

    it('shows the Send reset link submit button', async () => {
      await expect(forgotPasswordPage.submitButton).toHaveText(
        AUTH.FORGOT_PASSWORD.SUBMIT_BUTTON
      )
    })

    it('shows a Back to sign in link', async () => {
      await expect(forgotPasswordPage.backToSignInLink).toBeDisplayed()
      await expect(forgotPasswordPage.backToSignInLink).toHaveText(
        AUTH.FORGOT_PASSWORD.BACK_LINK
      )
    })

    it('Back to sign in link points to the login page', async () => {
      const href = await forgotPasswordPage.backToSignInLink.getAttribute('href')
      expect(href).toMatch(/\/login|\/sign_in/)
    })
  })

  describe('Validation', () => {
    beforeEach(async () => {
      await forgotPasswordPage.open()
    })

    it('shows error summary when submitted empty', async () => {
      await forgotPasswordPage.submitForm()
      await expect(forgotPasswordPage.errorSummary).toBeDisplayed()
      await expect(forgotPasswordPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
    })

    it('shows email required error on empty submit', async () => {
      await forgotPasswordPage.submitForm()
      const errors = await forgotPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.LOGIN.ERRORS.EMAIL_REQUIRED)
    })

    it('shows email format error for invalid email', async () => {
      await forgotPasswordPage.submitEmail('not-an-email')
      const errors = await forgotPasswordPage.getErrorMessages()
      expect(errors).toContain(AUTH.LOGIN.ERRORS.EMAIL_INVALID)
    })
  })

  describe('Happy path — confirmation page', () => {
    before(async () => {
      await forgotPasswordPage.open()
      await forgotPasswordPage.submitEmail(uniqueEmail('reset'))
    })

    it('shows the confirmation panel title', async () => {
      await expect(forgotPasswordConfirmationPage.panelTitle).toBeDisplayed()
      await expect(forgotPasswordConfirmationPage.panelTitle).toHaveText(
        AUTH.FORGOT_PASSWORD.CONFIRMATION.PANEL_TITLE
      )
    })

    it('confirmation panel body says reset link was sent', async () => {
      await expect(forgotPasswordConfirmationPage.panelBody).toHaveText(
        AUTH.FORGOT_PASSWORD.CONFIRMATION.PANEL_BODY
      )
    })

    it('shows a What happens next heading', async () => {
      await expect(forgotPasswordConfirmationPage.whatHappensNextHeading).toBeDisplayed()
      await expect(forgotPasswordConfirmationPage.whatHappensNextHeading).toHaveText(
        AUTH.FORGOT_PASSWORD.CONFIRMATION.WHAT_HAPPENS_NEXT
      )
    })

    it('shows the link expiry message (6 hours)', async () => {
      const bodyText = await forgotPasswordConfirmationPage.bodyParagraphs
      let found = false
      for (const el of bodyText) {
        const text = await el.getText()
        if (text.includes('6 hours')) { found = true; break }
      }
      expect(found).toBe(true)
    })

    it('shows the "If you don\'t receive the email" heading', async () => {
      const headings = await forgotPasswordConfirmationPage.sectionHeadings
      const texts = await Promise.all(headings.map((h) => h.getText()))
      expect(texts).toContain(AUTH.FORGOT_PASSWORD.CONFIRMATION.IF_NO_EMAIL_HEADING)
    })

    it('shows the check spam folder bullet point', async () => {
      const body = await forgotPasswordConfirmationPage.bodyParagraphs
      let found = false
      for (const el of body) {
        const text = await el.getText()
        if (text.includes('spam') || text.includes('junk')) { found = true; break }
      }
      // Also check in list items
      const listItems = await $$(
        '.govuk-list--bullet li, ul li'
      )
      for (const li of listItems) {
        const text = await li.getText()
        if (text.includes('spam') || text.includes('junk')) { found = true; break }
      }
      expect(found).toBe(true)
    })

    it('shows the "correct email address" bullet point', async () => {
      const listItems = await $$('.govuk-list--bullet li, ul li')
      let found = false
      for (const li of listItems) {
        const text = await li.getText()
        if (text.includes('correct email')) { found = true; break }
      }
      expect(found).toBe(true)
    })

    it('shows the Need help heading or details summary', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(AUTH.FORGOT_PASSWORD.CONFIRMATION.NEED_HELP_HEADING)
    })

    it('Need help section contains the helpline phone number', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(AUTH.FORGOT_PASSWORD.CONFIRMATION.NEED_HELP_CONTACT)
    })

    it('shows a Back to sign in link', async () => {
      await expect(forgotPasswordConfirmationPage.backToSignInLink).toBeDisplayed()
      await expect(forgotPasswordConfirmationPage.backToSignInLink).toHaveText(
        AUTH.FORGOT_PASSWORD.CONFIRMATION.BACK_LINK
      )
    })

    it('Back to sign in link returns to the login page', async () => {
      const href = await forgotPasswordConfirmationPage.backToSignInLink.getAttribute('href')
      expect(href).toMatch(/login|sign_in/)
    })

    it('URL stays on the forgot-password flow after submission', async () => {
      const url = await browser.getUrl()
      expect(url).toMatch(/forgot-password|confirmation/)
    })
  })
})
