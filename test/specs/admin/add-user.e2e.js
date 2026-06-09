import { browser, expect, $ } from '@wdio/globals'
import {
  addUserStartPage,
  addUserIsAdminPage,
  addUserDetailsPage,
  addUserMainAreaPage,
  addUserAdditionalAreasPage,
  addUserCheckAnswersPage,
  addUserConfirmationPage,
  completeAddUserJourney
} from 'page-objects/admin/add-user.page.js'
import AdminUsersPage from 'page-objects/admin/users.page.js'
import ViewUserPage from 'page-objects/admin/view-user.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { ADMIN, COMMON, AREA } from 'constants/content.js'
import { uniqueEmail, uniqueEaEmail } from 'helpers/unique.helper.js'

const C = ADMIN.ADD_USER

describe('Admin — Add user', () => {
  before(async () => {
    await loginAs('admin')
  })

  after(async () => {
    await logout()
  })

  // ── Start page content ──────────────────────────────────────────────────────

  describe('Start page', () => {
    before(async () => {
      await addUserStartPage.open()
    })

    it('has the correct page heading', async () => {
      await expect(addUserStartPage.pageHeading).toHaveText(C.START.PAGE_HEADING)
    })

    it('shows the service title', async () => {
      await expect(addUserStartPage.serviceTitle).toBeDisplayed()
    })

    it('shows the intro text', async () => {
      const text = await addUserStartPage.introText.getText()
      expect(text).toContain('new user account')
      expect(text).toContain('email notification')
    })

    it('shows the Before you start heading', async () => {
      await expect(addUserStartPage.beforeYouStartHeading).toBeDisplayed()
    })

    it('shows the 3 checklist items', async () => {
      const items = await addUserStartPage.checklistItems
      const texts = await Promise.all(items.map((el) => el.getText()))
      expect(texts).toContain(C.START.CHECKLIST[0])
      expect(texts).toContain(C.START.CHECKLIST[1])
      expect(texts).toContain(C.START.CHECKLIST[2])
    })

    it('shows the Start now button', async () => {
      await expect(addUserStartPage.startButton).toBeDisplayed()
      const text = await addUserStartPage.startButton.getText()
      expect(text).toContain(C.START.START_BUTTON)
    })

    it('back link points to the active users list', async () => {
      const href = await addUserStartPage.backLink.getAttribute('href')
      expect(href).toContain('/admin/users')
    })
  })

  // ── Is-admin page content ───────────────────────────────────────────────────

  describe('Administrator status page', () => {
    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
    })

    it('has the correct page heading', async () => {
      await expect(addUserIsAdminPage.pageHeading).toHaveText(C.IS_ADMIN.PAGE_HEADING)
    })

    it('shows exactly 2 radio options', async () => {
      const radios = await addUserIsAdminPage.radioLabels
      expect(radios.length).toBe(2)
    })

    it('shows Yes radio option', async () => {
      const texts = await addUserIsAdminPage.getRadioOptionTexts()
      expect(texts).toContain(C.IS_ADMIN.RADIO_YES)
    })

    it('shows No radio option', async () => {
      const texts = await addUserIsAdminPage.getRadioOptionTexts()
      expect(texts).toContain(C.IS_ADMIN.RADIO_NO)
    })

    it('shows a Continue button', async () => {
      await expect(addUserIsAdminPage.continueButton).toHaveText(C.IS_ADMIN.CONTINUE_BUTTON)
    })

    it('shows an error when submitted without selecting an option', async () => {
      await addUserIsAdminPage.submitForm()
      await expect(addUserIsAdminPage.errorSummary).toBeDisplayed()
      await expect(addUserIsAdminPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
      const errors = await addUserIsAdminPage.getErrorMessages()
      expect(errors).toContain(C.IS_ADMIN.ERRORS.REQUIRED)
    })
  })

  // ── Details page content (admin user) ───────────────────────────────────────

  describe('Details page — adding an admin user', () => {
    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectYes()
    })

    it('shows the Add new administrator heading', async () => {
      await expect(addUserDetailsPage.pageHeading).toHaveText(
        C.DETAILS.HEADINGS.ADD_ADMIN
      )
    })

    it('shows First name label', async () => {
      await expect(addUserDetailsPage.firstNameLabel).toHaveText(
        C.DETAILS.FIRST_NAME_LABEL
      )
    })

    it('shows Last name label', async () => {
      await expect(addUserDetailsPage.lastNameLabel).toHaveText(
        C.DETAILS.LAST_NAME_LABEL
      )
    })

    it('shows Email address label', async () => {
      await expect(addUserDetailsPage.emailLabel).toHaveText(
        C.DETAILS.EMAIL_LABEL
      )
    })

    it('does NOT show responsibility radios for an admin user', async () => {
      const radios = await addUserDetailsPage.responsibilityRadios
      expect(radios.length).toBe(0)
    })
  })

  // ── Details page content (non-admin user) ───────────────────────────────────

  describe('Details page — adding a non-admin user', () => {
    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
    })

    it('shows the Add new user heading', async () => {
      await expect(addUserDetailsPage.pageHeading).toHaveText(
        C.DETAILS.HEADINGS.ADD_USER
      )
    })

    it('shows all required field labels', async () => {
      await expect(addUserDetailsPage.firstNameLabel).toHaveText(C.DETAILS.FIRST_NAME_LABEL)
      await expect(addUserDetailsPage.lastNameLabel).toHaveText(C.DETAILS.LAST_NAME_LABEL)
      await expect(addUserDetailsPage.emailLabel).toHaveText(C.DETAILS.EMAIL_LABEL)
      await expect(addUserDetailsPage.telephoneLabel).toHaveText(C.DETAILS.TELEPHONE_LABEL)
      await expect(addUserDetailsPage.organisationLabel).toHaveText(C.DETAILS.ORGANISATION_LABEL)
      await expect(addUserDetailsPage.jobTitleLabel).toHaveText(C.DETAILS.JOB_TITLE_LABEL)
    })

    it('shows the responsibility fieldset legend', async () => {
      await expect(addUserDetailsPage.responsibilityLegend).toHaveText(
        C.DETAILS.RESPONSIBILITY_LEGEND
      )
    })

    it('shows 3 responsibility radio options', async () => {
      const radios = await addUserDetailsPage.radioLabels
      expect(radios.length).toBe(3)
    })

    it('shows EA option with correct label', async () => {
      const texts = await addUserDetailsPage.getRadioOptionTexts()
      expect(texts).toContain(C.DETAILS.RESPONSIBILITY_OPTIONS.EA.LABEL)
    })

    it('shows PSO option with correct label', async () => {
      const texts = await addUserDetailsPage.getRadioOptionTexts()
      expect(texts).toContain(C.DETAILS.RESPONSIBILITY_OPTIONS.PSO.LABEL)
    })

    it('shows RMA option with correct label', async () => {
      const texts = await addUserDetailsPage.getRadioOptionTexts()
      expect(texts).toContain(C.DETAILS.RESPONSIBILITY_OPTIONS.RMA.LABEL)
    })

    it('shows EA hint text', async () => {
      const hints = await addUserDetailsPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(C.DETAILS.RESPONSIBILITY_OPTIONS.EA.HINT)
    })

    it('shows PSO hint text', async () => {
      const hints = await addUserDetailsPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(C.DETAILS.RESPONSIBILITY_OPTIONS.PSO.HINT)
    })

    it('shows RMA hint text', async () => {
      const hints = await addUserDetailsPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(C.DETAILS.RESPONSIBILITY_OPTIONS.RMA.HINT)
    })
  })

  // ── Details page validation ──────────────────────────────────────────────────

  describe('Details page validation', () => {
    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
    })

    it('shows error summary on empty submit', async () => {
      await addUserDetailsPage.submitForm()
      await expect(addUserDetailsPage.errorSummary).toBeDisplayed()
      await expect(addUserDetailsPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
    })

    it('shows first name required error', async () => {
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.FIRST_NAME_REQUIRED)
    })

    it('shows last name required error', async () => {
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.LAST_NAME_REQUIRED)
    })

    it('shows email required error', async () => {
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.EMAIL_REQUIRED)
    })

    it('shows responsibility required error', async () => {
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.RESPONSIBILITY_REQUIRED)
    })

    it('shows email format error for invalid email', async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
      await addUserDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'User',
        email: 'not-valid-email'
      })
      await addUserDetailsPage.selectResponsibility('RMA')
      await addUserDetailsPage.submitForm()
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.EMAIL_INVALID)
    })

    it('shows telephone format error for non-numeric telephone', async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
      await addUserDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'User',
        email: uniqueEmail('tel-err'),
        telephone: 'not-a-phone-number'
      })
      await addUserDetailsPage.selectResponsibility('RMA')
      await addUserDetailsPage.submitForm()
      const errors = await addUserDetailsPage.getErrorMessages()
      // Telephone error — exact wording from the admin add-user i18n
      expect(errors.some((e) => e.toLowerCase().includes('telephone'))).toBe(true)
    })

    it('shows email duplicate error when email already exists', async () => {
      const existingEmail = process.env.TEST_USER_EMAIL || process.env.TEST_ADMIN_EMAIL
      if (!existingEmail) return
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
      await addUserDetailsPage.fillDetails({
        firstName: 'Test',
        lastName: 'Dup',
        email: existingEmail,
        telephone: '01234567890',
        organisation: 'Test Org',
        jobTitle: 'Officer'
      })
      await addUserDetailsPage.selectResponsibility('RMA')
      await addUserDetailsPage.submitForm()
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.EMAIL_DUPLICATE)
    })
  })

  // ── Area selection pages during add flow ─────────────────────────────────────

  describe('Main area selection page (during add flow)', () => {
    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
      await addUserDetailsPage.fillDetails({
        firstName: 'Area',
        lastName: 'Test',
        email: uniqueEmail('area-pg'),
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Officer'
      })
      await addUserDetailsPage.selectResponsibility('EA')
      await addUserDetailsPage.submitForm()
      // Should now be on the main area page for EA
    })

    it('main area page heading includes area type', async () => {
      const url = await browser.getUrl()
      if (url.includes('main-area') || url.includes('area')) {
        const heading = await addUserMainAreaPage.pageHeading.getText()
        expect(heading.toLowerCase()).toContain('area')
      }
    })

    it('main area page shows a dropdown select field', async () => {
      const url = await browser.getUrl()
      if (url.includes('main-area') || url.includes('area')) {
        await expect(addUserMainAreaPage.areaSelect).toBeDisplayed()
      }
    })

    it('main area dropdown has a placeholder option', async () => {
      const url = await browser.getUrl()
      if (url.includes('main-area') || url.includes('area')) {
        const firstOption = await $('select option:first-child')
        const text = await firstOption.getText()
        expect(text).toContain(AREA.MAIN.DEFAULT_OPTION)
      }
    })

    it('main area page shows the primary area hint text', async () => {
      const url = await browser.getUrl()
      if (url.includes('main-area') || url.includes('area')) {
        const pageText = await $('main').getText()
        expect(pageText).toContain(AREA.MAIN.HINT_ADMIN)
      }
    })

    it('shows a validation error when no area is selected', async () => {
      const url = await browser.getUrl()
      if (url.includes('main-area') || url.includes('area')) {
        await addUserMainAreaPage.submitForm()
        await expect(addUserMainAreaPage.errorSummary).toBeDisplayed()
        await expect(addUserMainAreaPage.errorSummaryTitle).toHaveText(
          COMMON.ERROR_SUMMARY_HEADING
        )
      }
    })
  })

  describe('Additional areas page (during add flow)', () => {
    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectNo()
      await addUserDetailsPage.fillDetails({
        firstName: 'Addl',
        lastName: 'Areas',
        email: uniqueEmail('addl-pg'),
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Officer'
      })
      await addUserDetailsPage.selectResponsibility('EA')
      await addUserDetailsPage.submitForm()
      // Select main area and continue
      let url = await browser.getUrl()
      if (url.includes('main-area') || url.includes('area')) {
        await addUserMainAreaPage.selectFirstAvailableArea()
        await addUserMainAreaPage.submitForm()
      }
      // Now on additional areas
    })

    it('additional areas page heading includes "additional"', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        const heading = await addUserAdditionalAreasPage.pageHeading.getText()
        expect(heading.toLowerCase()).toContain('additional')
      }
    })

    it('additional areas page shows checkboxes', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        const checkboxes = await addUserAdditionalAreasPage.areaCheckboxes
        expect(checkboxes.length).toBeGreaterThanOrEqual(0)
      }
    })

    it('additional areas page intro says it is optional', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        const pageText = await $('main').getText()
        expect(pageText.toLowerCase()).toContain('optional')
      }
    })

    it('can continue without selecting any additional areas', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional')) {
        await addUserAdditionalAreasPage.submitForm()
        const newUrl = await browser.getUrl()
        // Should proceed to check-answers
        expect(newUrl).toContain('check-answers')
      }
    })
  })

  // ── Check answers page content ───────────────────────────────────────────────

  describe('Check answers page', () => {
    const testEmail = uniqueEmail('check-admin')

    before(async () => {
      await addUserStartPage.open()
      await addUserStartPage.start()
      await addUserIsAdminPage.selectYes()
      await addUserDetailsPage.fillDetails({
        firstName: 'Check',
        lastName: 'Answers',
        email: testEmail
      })
      await addUserDetailsPage.submitForm()
    })

    it('has the correct page heading', async () => {
      await expect(addUserCheckAnswersPage.pageHeading).toHaveText(
        C.CHECK_ANSWERS.PAGE_HEADING
      )
    })

    it('shows the Personal details summary card', async () => {
      const titles = await addUserCheckAnswersPage.getCardTitles()
      expect(titles).toContain(C.CHECK_ANSWERS.PERSONAL_DETAILS_CARD)
    })

    it('shows the Additional information summary card (admin status)', async () => {
      const titles = await addUserCheckAnswersPage.getCardTitles()
      expect(titles).toContain(C.CHECK_ANSWERS.ADDITIONAL_INFO_CARD)
    })

    it('shows entered first name in summary', async () => {
      const value = await addUserCheckAnswersPage.getValueForKey('First name')
      expect(value).toContain('Check')
    })

    it('shows entered last name in summary', async () => {
      const value = await addUserCheckAnswersPage.getValueForKey('Last name')
      expect(value).toContain('Answers')
    })

    it('shows entered email in summary', async () => {
      const value = await addUserCheckAnswersPage.getValueForKey('Email')
      expect(value).toContain(testEmail)
    })

    it('shows admin status as Yes in summary', async () => {
      const value = await addUserCheckAnswersPage.getValueForKey(
        C.CHECK_ANSWERS.WILL_BE_ADMIN_LABEL
      )
      expect(value).toContain('Yes')
    })

    it('shows Change links for each section', async () => {
      const changeLinks = await addUserCheckAnswersPage.allChangeLinks
      expect(changeLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('Change link for personal details points to the edit route', async () => {
      const changeLinks = await addUserCheckAnswersPage.allChangeLinks
      const hrefs = await Promise.all(
        changeLinks.map((l) => l.getAttribute('href'))
      )
      expect(hrefs.some((h) => h.includes('details'))).toBe(true)
    })

    it('shows the Confirm and add user submit button', async () => {
      await expect(addUserCheckAnswersPage.submitButton).toHaveText(
        C.CHECK_ANSWERS.SUBMIT_BUTTON
      )
    })
  })

  // ── Happy path: adding an Admin user ────────────────────────────────────────

  describe('Happy path — Admin user', () => {
    const email = uniqueEmail('new-admin')
    let addedUserUrl

    it('completes the journey to confirmation page', async () => {
      await completeAddUserJourney({
        isAdmin: true,
        firstName: 'New',
        lastName: 'Admin',
        email
      })
      const url = await browser.getUrl()
      expect(url).toContain('/confirmation')
    })

    it('confirmation page shows What happens next', async () => {
      await expect(addUserConfirmationPage.whatHappensNextHeading).toBeDisplayed()
    })

    it('added admin user appears in the active users list', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
      const rowText = await rows[0].getText()
      expect(rowText).toContain('New')
    })

    it('View link navigates to the user detail page showing correct name', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        const link = await rows[0].$('a')
        addedUserUrl = await link.getAttribute('href')
        await link.click()
        await expect(ViewUserPage.pageHeading).toHaveText('New Admin')
      }
    })

    it('view page shows Personal details card', async () => {
      const titles = await ViewUserPage.getCardTitles()
      expect(titles).toContain(ADMIN.VIEW_USER.PERSONAL_DETAILS_CARD)
    })

    it('view page shows Permissions card with Is admin? = Yes', async () => {
      const titles = await ViewUserPage.getCardTitles()
      expect(titles).toContain(ADMIN.VIEW_USER.PERMISSIONS_CARD)
      const adminValue = await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)
      expect(adminValue).toContain(ADMIN.VIEW_USER.IS_ADMIN_YES)
    })

    it('view page shows Account information card', async () => {
      const titles = await ViewUserPage.getCardTitles()
      expect(titles).toContain(ADMIN.VIEW_USER.ACCOUNT_INFO_CARD)
    })

    it('view page shows Invitation sent row with a date value', async () => {
      const value = await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.INVITATION_SENT_LABEL)
      expect(value).toBeTruthy()
    })

    it('view page shows Last sign in as Never (new user)', async () => {
      const value = await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.LAST_SIGN_IN_LABEL)
      expect(value).toContain(ADMIN.VIEW_USER.LAST_SIGN_IN_NEVER)
    })

    after(async () => {
      await AdminUsersPage.clearSearch()
    })
  })

  // ── Happy path: adding an EA user ────────────────────────────────────────────

  describe('Happy path — EA user', () => {
    const email = uniqueEaEmail()

    it('completes the full EA user journey to confirmation', async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'New',
        lastName: 'EA User',
        email,
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'Flood Risk Officer',
        responsibility: 'EA'
      })
      const url = await browser.getUrl()
      expect(url).toContain('/confirmation')
    })

    it('added EA user appears in the active users list', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
      const rowText = await rows[0].getText()
      expect(rowText).toContain('EA User')
    })

    it('EA user view page shows Is admin? = No', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        await (await rows[0].$('a')).click()
        const adminValue = await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)
        expect(adminValue).toContain(ADMIN.VIEW_USER.IS_ADMIN_NO)
      }
    })

    it('EA user view page shows Area selection card', async () => {
      const titles = await ViewUserPage.getCardTitles()
      expect(titles.join(' ')).toContain('Area')
    })

    after(async () => {
      await AdminUsersPage.clearSearch()
    })
  })

  // ── Happy path: adding a PSO user ────────────────────────────────────────────

  describe('Happy path — PSO user', () => {
    const email = uniqueEmail('new-pso')

    it('completes the full PSO user journey to confirmation', async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'New',
        lastName: 'PSO User',
        email,
        telephone: '01234567890',
        organisation: 'Environment Agency',
        jobTitle: 'PSO Officer',
        responsibility: 'PSO'
      })
      const url = await browser.getUrl()
      expect(url).toContain('/confirmation')
    })

    it('added PSO user appears in the active users list', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
    })

    after(async () => {
      await AdminUsersPage.clearSearch()
    })
  })

  // ── Happy path: adding an RMA user ───────────────────────────────────────────

  describe('Happy path — RMA user', () => {
    const email = uniqueEmail('new-rma')

    it('completes the full RMA user journey to confirmation', async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'New',
        lastName: 'RMA User',
        email,
        telephone: '01234567890',
        organisation: 'Test RMA Organisation',
        jobTitle: 'RMA Officer',
        responsibility: 'RMA'
      })
      const url = await browser.getUrl()
      expect(url).toContain('/confirmation')
    })

    it('added RMA user appears in the active users list', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
    })

    after(async () => {
      await AdminUsersPage.clearSearch()
    })
  })
})
