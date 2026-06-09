import { browser, expect } from '@wdio/globals'
import JourneySelectionPage from 'page-objects/admin/journey-selection.page.js'
import AdminUsersPage from 'page-objects/admin/users.page.js'
import GeneralHomePage from 'page-objects/general/home.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { ADMIN, GENERAL, COMMON } from 'constants/content.js'

describe('Admin — Journey selection', () => {
  before(async () => {
    await loginAs('admin')
  })

  after(async () => {
    await logout()
  })

  describe('Page content', () => {
    before(async () => {
      await JourneySelectionPage.open()
    })

    it('has the correct page heading', async () => {
      await expect(JourneySelectionPage.pageHeading).toHaveText(
        ADMIN.JOURNEY_SELECTION.PAGE_HEADING
      )
    })

    it('shows context hint describing both journeys', async () => {
      const text = await JourneySelectionPage.contextHintText.getText()
      expect(text).toContain('administrator')
    })

    it('shows 2 journey radio options', async () => {
      const labels = await JourneySelectionPage.radioLabels
      expect(labels.length).toBe(2)
    })

    it('shows Admin journey radio option with correct label', async () => {
      const texts = await JourneySelectionPage.getRadioOptionTexts()
      expect(texts).toContain(ADMIN.JOURNEY_SELECTION.OPTIONS.ADMIN.LABEL)
    })

    it('shows General user journey radio option with correct label', async () => {
      const texts = await JourneySelectionPage.getRadioOptionTexts()
      expect(texts).toContain(ADMIN.JOURNEY_SELECTION.OPTIONS.USER.LABEL)
    })

    it('shows Admin journey hint text', async () => {
      const hints = await JourneySelectionPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(ADMIN.JOURNEY_SELECTION.OPTIONS.ADMIN.HINT)
    })

    it('shows General user journey hint text', async () => {
      const hints = await JourneySelectionPage.radioHints
      const hintTexts = await Promise.all(hints.map((el) => el.getText()))
      expect(hintTexts).toContain(ADMIN.JOURNEY_SELECTION.OPTIONS.USER.HINT)
    })

    it('shows a Continue button', async () => {
      await expect(JourneySelectionPage.continueButton).toBeDisplayed()
      await expect(JourneySelectionPage.continueButton).toHaveText(
        ADMIN.JOURNEY_SELECTION.CONTINUE_BUTTON
      )
    })

    it('shows the service title in admin mode', async () => {
      await expect(JourneySelectionPage.serviceTitle).toBeDisplayed()
    })
  })

  describe('Validation', () => {
    before(async () => {
      await JourneySelectionPage.open()
    })

    it('does not show an error when a journey option is pre-selected', async () => {
      await JourneySelectionPage.submitForm()
      const hasError = await JourneySelectionPage.errorSummary.isDisplayed().catch(() => false)
      // Pre-selection means no validation error expected by default
      expect(hasError).toBe(false)
    })
  })

  describe('Happy path — select Admin journey', () => {
    it('selecting Admin journey and continuing lands on admin area', async () => {
      await JourneySelectionPage.open()
      await JourneySelectionPage.selectAdminJourney()
      const url = await browser.getUrl()
      expect(url).toMatch(/\/admin\/users|\/admin/)
    })

    it('admin users page shows correct heading', async () => {
      await AdminUsersPage.open()
      await expect(AdminUsersPage.pageHeading).toHaveText(ADMIN.USERS.PAGE_HEADING)
    })
    // Full admin users coverage (table, tabs, pagination, buttons, links, URLs,
    // suspended users) is in test/specs/admin/users.e2e.js
  })

  describe('Happy path — select General user journey', () => {
    it('selecting General user journey lands on proposals home', async () => {
      await JourneySelectionPage.open()
      await JourneySelectionPage.selectUserJourney()
      const url = await browser.getUrl()
      expect(url).toMatch(/\/home|\/proposals|^\/$/)
    })

    it('general home shows Your Proposals heading', async () => {
      await expect(GeneralHomePage.pageHeading).toHaveText(GENERAL.HOME.PAGE_HEADING)
    })
  })
})
