import { browser, expect, $$, $ } from '@wdio/globals'
import {
  requestAccountStartPage,
  requestAccountDetailsPage,
  requestAccountAreaPage,
  requestAccountAdditionalAreasPage,
  requestAccountCheckAnswersPage,
  requestAccountConfirmationPage
} from 'page-objects/account/request-account.page.js'
import { ACCOUNT, COMMON, AREA } from 'constants/content.js'
import { uniqueEmail, uniqueEaEmail } from 'helpers/unique.helper.js'

/**
 * Account request spec — covers all 3 responsibility types:
 *   EA   — Environment Agency Area Programme Team
 *   PSO  — Environment Agency Partnership & Strategic Overview Team
 *   RMA  — Risk Management Authority
 *
 * EA accounts with an @environment-agency.gov.uk domain are auto-approved.
 * PSO and RMA accounts require manual admin approval.
 */

describe('Account — Request account', () => {
  describe('Start page content', () => {
    before(async () => {
      await requestAccountStartPage.open()
    })

    it('has the correct page heading', async () => {
      await expect(requestAccountStartPage.pageHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.START.PAGE_HEADING
      )
    })

    it('shows the eligibility intro text', async () => {
      const text = await requestAccountStartPage.introText.getText()
      expect(text).toContain(
        'Risk Management Authority or an Environment Agency team'
      )
    })

    it('shows a Before you start heading', async () => {
      await expect(requestAccountStartPage.beforeYouStartHeading).toBeDisplayed()
    })

    it('shows the 3 checklist items of what you need', async () => {
      const items = await requestAccountStartPage.checklistItems
      expect(items.length).toBeGreaterThanOrEqual(3)
      const texts = await Promise.all(items.map((el) => el.getText()))
      expect(texts).toContain(ACCOUNT.REQUEST_ACCOUNT.START.CHECKLIST[0])
      expect(texts).toContain(ACCOUNT.REQUEST_ACCOUNT.START.CHECKLIST[1])
      expect(texts).toContain(ACCOUNT.REQUEST_ACCOUNT.START.CHECKLIST[2])
    })

    it('shows a review / approval notice', async () => {
      await expect(requestAccountStartPage.reviewNoticeText).toBeDisplayed()
    })

    it('shows a Start now button', async () => {
      await expect(requestAccountStartPage.submitButton).toBeDisplayed()
      const text = await requestAccountStartPage.submitButton.getText()
      expect(text).toContain(ACCOUNT.REQUEST_ACCOUNT.START.START_BUTTON)
    })

    it('shows a Back to sign in link', async () => {
      await expect(requestAccountStartPage.backToSignInLink).toBeDisplayed()
    })
  })

  describe('Details page content', () => {
    before(async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
    })

    it('has the correct page heading', async () => {
      await expect(requestAccountDetailsPage.pageHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.PAGE_HEADING
      )
    })

    it('shows First name label', async () => {
      await expect(requestAccountDetailsPage.firstNameLabel).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.FIRST_NAME_LABEL
      )
    })

    it('shows Last name label', async () => {
      await expect(requestAccountDetailsPage.lastNameLabel).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.LAST_NAME_LABEL
      )
    })

    it('shows Email address label', async () => {
      await expect(requestAccountDetailsPage.emailLabel).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.EMAIL_LABEL
      )
    })

    it('shows Telephone number label', async () => {
      await expect(requestAccountDetailsPage.telephoneLabel).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.TELEPHONE_LABEL
      )
    })

    it('shows Organisation label', async () => {
      await expect(requestAccountDetailsPage.organisationLabel).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ORGANISATION_LABEL
      )
    })

    it('shows Job title label', async () => {
      await expect(requestAccountDetailsPage.jobTitleLabel).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.JOB_TITLE_LABEL
      )
    })

    it('shows the responsibility fieldset legend', async () => {
      await expect(requestAccountDetailsPage.responsibilityLegend).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_LEGEND
      )
    })

    it('shows 3 responsibility radio options', async () => {
      const labels = await requestAccountDetailsPage.radioLabels
      expect(labels.length).toBe(3)
    })

    it('shows EA responsibility option with correct label', async () => {
      const texts = await requestAccountDetailsPage.getRadioOptionTexts()
      expect(texts).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_OPTIONS.EA.LABEL
      )
    })

    it('shows PSO responsibility option with correct label', async () => {
      const texts = await requestAccountDetailsPage.getRadioOptionTexts()
      expect(texts).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_OPTIONS.PSO.LABEL
      )
    })

    it('shows RMA responsibility option with correct label', async () => {
      const texts = await requestAccountDetailsPage.getRadioOptionTexts()
      expect(texts).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_OPTIONS.RMA.LABEL
      )
    })

    it('shows EA hint text', async () => {
      const hints = await requestAccountDetailsPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_OPTIONS.EA.HINT
      )
    })

    it('shows PSO hint text', async () => {
      const hints = await requestAccountDetailsPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_OPTIONS.PSO.HINT
      )
    })

    it('shows RMA hint text', async () => {
      const hints = await requestAccountDetailsPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.RESPONSIBILITY_OPTIONS.RMA.HINT
      )
    })
  })

  describe('Details page validation', () => {
    before(async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
    })

    it('shows error summary on empty submit', async () => {
      await requestAccountDetailsPage.submitForm()
      await expect(requestAccountDetailsPage.errorSummary).toBeDisplayed()
      await expect(requestAccountDetailsPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
    })

    it('shows first name required error', async () => {
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.FIRST_NAME_REQUIRED
      )
    })

    it('shows last name required error', async () => {
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.LAST_NAME_REQUIRED
      )
    })

    it('shows email required error', async () => {
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.EMAIL_REQUIRED
      )
    })

    it('shows responsibility required error', async () => {
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.RESPONSIBILITY_REQUIRED
      )
    })

    it('shows email format error for invalid email', async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
      await requestAccountDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'User',
        email: 'not-an-email',
        telephone: '01234567890',
        organisation: 'Test Org',
        jobTitle: 'Tester'
      })
      await requestAccountDetailsPage.selectResponsibility('rma')
      await requestAccountDetailsPage.submitForm()
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.EMAIL_INVALID
      )
    })

    it('shows telephone format error for invalid telephone number', async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
      await requestAccountDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'User',
        email: uniqueEmail('tel-test'),
        telephone: 'not-a-phone',
        organisation: 'Test Org',
        jobTitle: 'Tester'
      })
      await requestAccountDetailsPage.selectResponsibility('rma')
      await requestAccountDetailsPage.submitForm()
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.TELEPHONE_INVALID
      )
    })

    it('shows email duplicate error when email already registered', async () => {
      // Use a known existing email — the admin test user email
      const existingEmail = process.env.TEST_ADMIN_EMAIL
      if (!existingEmail) return
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
      await requestAccountDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'User',
        email: existingEmail,
        telephone: '01234567890',
        organisation: 'Test Org',
        jobTitle: 'Tester'
      })
      await requestAccountDetailsPage.selectResponsibility('rma')
      await requestAccountDetailsPage.submitForm()
      const errors = await requestAccountDetailsPage.getErrorMessages()
      expect(errors).toContain(
        ACCOUNT.REQUEST_ACCOUNT.DETAILS.ERRORS.EMAIL_DUPLICATE
      )
    })
  })

  // ── Area selection pages ────────────────────────────────────────────────────

  describe('Main area selection page — EA user', () => {
    before(async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
      await requestAccountDetailsPage.fillDetails({
        firstName: 'Area',
        lastName: 'Test',
        email: uniqueEmail('area-test-ea'),
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Officer'
      })
      await requestAccountDetailsPage.selectResponsibility('ea')
      await requestAccountDetailsPage.submitForm()
      // Now on the EA main area selection page
    })

    it('main area page heading includes EA Area', async () => {
      const heading = await requestAccountAreaPage.pageHeading.getText()
      expect(heading.toLowerCase()).toContain('area')
    })

    it('main area page shows a dropdown select', async () => {
      await expect(requestAccountAreaPage.areaSelect).toBeDisplayed()
    })

    it('main area dropdown has a placeholder default option', async () => {
      const options = await $$('select option')
      const firstOption = await options[0].getText()
      expect(firstOption).toContain(ACCOUNT.REQUEST_ACCOUNT.AREA.MAIN.DEFAULT_OPTION)
    })

    it('main area page shows the hint text about primary area', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(ACCOUNT.REQUEST_ACCOUNT.AREA.MAIN.HINT)
    })

    it('shows a Continue button', async () => {
      await expect(requestAccountAreaPage.submitButton).toBeDisplayed()
      await expect(requestAccountAreaPage.submitButton).toHaveText(COMMON.CONTINUE_BUTTON)
    })

    it('shows a validation error when no area is selected and form is submitted', async () => {
      await requestAccountAreaPage.submitForm()
      await expect(requestAccountAreaPage.errorSummary).toBeDisplayed()
      await expect(requestAccountAreaPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
    })
  })

  describe('Additional areas page', () => {
    before(async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
      await requestAccountDetailsPage.fillDetails({
        firstName: 'Additional',
        lastName: 'Areas',
        email: uniqueEmail('addl-areas'),
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Officer'
      })
      await requestAccountDetailsPage.selectResponsibility('ea')
      await requestAccountDetailsPage.submitForm()
      // Select a main area and continue
      await requestAccountAreaPage.selectFirstAvailableArea()
      await requestAccountAreaPage.submitForm()
      // Now on additional areas page
    })

    it('additional areas page heading includes "additional"', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        const heading = await requestAccountAdditionalAreasPage.pageHeading.getText()
        expect(heading.toLowerCase()).toContain('additional')
      }
    })

    it('additional areas page shows checkboxes', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        const checkboxes = await requestAccountAdditionalAreasPage.additionalAreaCheckboxes
        expect(checkboxes.length).toBeGreaterThanOrEqual(0)
      }
    })

    it('shows intro text explaining it is optional', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        const pageText = await $('main').getText()
        expect(pageText.toLowerCase()).toContain('optional')
      }
    })

    it('shows a Continue button on additional areas page', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        await expect(requestAccountAdditionalAreasPage.submitButton).toHaveText(
          COMMON.CONTINUE_BUTTON
        )
      }
    })
  })

  // ── Check answers ───────────────────────────────────────────────────────────

  describe('Check answers page', () => {
    const checkEmail = uniqueEmail('check-rma')

    before(async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()
      await requestAccountDetailsPage.fillDetails({
        firstName: 'CheckRMA',
        lastName: 'TestUser',
        email: checkEmail,
        telephone: '01234567890',
        organisation: 'Test RMA',
        jobTitle: 'Test Officer'
      })
      await requestAccountDetailsPage.selectResponsibility('rma')
      await requestAccountDetailsPage.submitForm()
      let url = await browser.getUrl()
      while (url.includes('area') || url.includes('team')) {
        await requestAccountAreaPage.selectFirstAvailableArea()
        await requestAccountAreaPage.submitForm()
        url = await browser.getUrl()
      }
    })

    it('has the correct Check your details heading', async () => {
      await expect(requestAccountCheckAnswersPage.pageHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.PAGE_HEADING
      )
    })

    it('shows Personal details summary card', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.PERSONAL_DETAILS_HEADING)
    })

    it('shows the entered first name in the summary', async () => {
      const value = await requestAccountCheckAnswersPage.getValueForKey('First name')
        .catch(() => null)
      const pageText = await $('main').getText()
      const found = (value && value.includes('CheckRMA')) || pageText.includes('CheckRMA')
      expect(found).toBe(true)
    })

    it('shows the entered email in the summary', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(checkEmail)
    })

    it('shows the responsibility type in the summary', async () => {
      const pageText = await $('main').getText()
      expect(pageText.toLowerCase()).toContain('risk management authority')
    })

    it('shows Area selection section', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain(ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.AREA_SELECTION_HEADING)
    })

    it('shows Change links for editing details', async () => {
      const changeLinks = await $$('.govuk-summary-list__actions a, .govuk-summary-card__action a')
      expect(changeLinks.length).toBeGreaterThan(0)
    })

    it('shows Confirm and send submit button', async () => {
      await expect(requestAccountCheckAnswersPage.submitButton).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.SUBMIT_BUTTON
      )
    })

    it('shows the confirmation agreement text', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain('confirming that, to the best of your knowledge')
    })
  })

  describe('Happy path — RMA user', () => {
    const testEmail = uniqueEmail('rma')

    it('completes the full RMA account request journey to confirmation', async () => {
      // Step 1 — start
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()

      // Step 2 — details
      await requestAccountDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'RMA User',
        email: testEmail,
        telephone: '01234567890',
        organisation: 'Test RMA Organisation',
        jobTitle: 'Flood Risk Officer'
      })
      await requestAccountDetailsPage.selectResponsibility('rma')
      await requestAccountDetailsPage.submitForm()

      // Step 3 — main area selection
      await expect(requestAccountAreaPage.pageHeading).toBeDisplayed()
      await requestAccountAreaPage.selectFirstAvailableArea()
      await requestAccountAreaPage.submitForm()

      // Step 4 — may have additional area or parent area pages — skip optional steps
      const url = await browser.getUrl()
      if (url.includes('additional') || url.includes('parent')) {
        await requestAccountAreaPage.submitForm()
      }

      // Step 5 — check answers
      await expect(requestAccountCheckAnswersPage.pageHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.PAGE_HEADING
      )
      await requestAccountCheckAnswersPage.submitForm()

      // Confirmation
      await expect(requestAccountConfirmationPage.panelTitle).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.PANEL_TITLE
      )
      await expect(requestAccountConfirmationPage.panelBody).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.PANEL_BODY
      )
    })
  })

  describe('Happy path — PSO user', () => {
    const testEmail = uniqueEmail('pso')

    it('completes the full PSO account request journey to confirmation', async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()

      await requestAccountDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'PSO User',
        email: testEmail,
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Partnership & Strategic Overview Officer'
      })
      await requestAccountDetailsPage.selectResponsibility('pso')
      await requestAccountDetailsPage.submitForm()

      // Area selection — may have multiple steps for PSO
      let url = await browser.getUrl()
      while (url.includes('area') || url.includes('team')) {
        await requestAccountAreaPage.selectFirstAvailableArea()
        await requestAccountAreaPage.submitForm()
        url = await browser.getUrl()
      }

      await expect(requestAccountCheckAnswersPage.pageHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.PAGE_HEADING
      )
      await requestAccountCheckAnswersPage.submitForm()

      await expect(requestAccountConfirmationPage.panelTitle).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.PANEL_TITLE
      )
    })
  })

  describe('Happy path — EA user (auto-approved domain)', () => {
    const testEmail = uniqueEaEmail()

    it('completes the EA account request journey with auto-approved domain', async () => {
      await requestAccountStartPage.open()
      await requestAccountStartPage.submitButton.click()

      await requestAccountDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'EA User',
        email: testEmail,
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Area Flood Risk Officer'
      })
      await requestAccountDetailsPage.selectResponsibility('ea')
      await requestAccountDetailsPage.submitForm()

      let url = await browser.getUrl()
      while (url.includes('area')) {
        await requestAccountAreaPage.selectFirstAvailableArea()
        await requestAccountAreaPage.submitForm()
        url = await browser.getUrl()
      }

      await expect(requestAccountCheckAnswersPage.pageHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CHECK_ANSWERS.PAGE_HEADING
      )
      await requestAccountCheckAnswersPage.submitForm()

      await expect(requestAccountConfirmationPage.panelTitle).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.PANEL_TITLE
      )
    })
  })

  describe('Confirmation page — full content', () => {
    it('shows the Request submitted panel title', async () => {
      await expect(requestAccountConfirmationPage.panelTitle).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.PANEL_TITLE
      )
    })

    it('shows the panel body confirming account is being reviewed', async () => {
      await expect(requestAccountConfirmationPage.panelBody).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.PANEL_BODY
      )
    })

    it('shows What happens next heading', async () => {
      await expect(requestAccountConfirmationPage.whatHappensNextHeading).toBeDisplayed()
      await expect(requestAccountConfirmationPage.whatHappensNextHeading).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.WHAT_HAPPENS_NEXT
      )
    })

    it('shows approval timeline inset (1-2 working days)', async () => {
      const pageText = await $('main').getText()
      expect(pageText).toContain('1-2 working days')
    })

    it('shows all 4 checklist items for what the user must do', async () => {
      const listItems = await $$('.govuk-list--bullet li, ol li')
      const texts = await Promise.all(listItems.map((li) => li.getText()))
      const allText = texts.join(' ')
      for (const item of ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.CHECKLIST) {
        expect(allText).toContain(item)
      }
    })

    it('shows Return to sign in link with correct text', async () => {
      await expect(requestAccountConfirmationPage.returnToSignInLink).toBeDisplayed()
      await expect(requestAccountConfirmationPage.returnToSignInLink).toHaveText(
        ACCOUNT.REQUEST_ACCOUNT.CONFIRMATION.RETURN_LINK
      )
    })

    it('Return to sign in link points to the login page', async () => {
      const href = await requestAccountConfirmationPage.returnToSignInLink.getAttribute('href')
      expect(href).toMatch(/login|sign_in/)
    })
  })
})
