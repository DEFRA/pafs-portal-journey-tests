import { browser, expect } from '@wdio/globals'
import GeneralHomePage from 'page-objects/general/home.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { GENERAL, COMMON } from 'constants/content.js'

describe('General user — Home / Your Proposals', () => {
  before(async () => {
    await loginAs('regularUser')
    await GeneralHomePage.open()
  })

  after(async () => {
    await logout()
  })

  describe('Page content', () => {
    it('has the correct page heading', async () => {
      await expect(GeneralHomePage.pageHeading).toHaveText(GENERAL.HOME.PAGE_HEADING)
    })

    it('shows the service title', async () => {
      await expect(GeneralHomePage.serviceTitle).toHaveText(COMMON.SERVICE_TITLE_USER)
    })

    it('shows a Create a new proposal button', async () => {
      await expect(GeneralHomePage.createProposalButton).toBeDisplayed()
      await expect(GeneralHomePage.createProposalButton).toHaveText(
        GENERAL.HOME.CREATE_BUTTON
      )
    })

    it('shows a search field with the correct label', async () => {
      await expect(GeneralHomePage.searchLabel).toBeDisplayed()
      await expect(GeneralHomePage.searchLabel).toHaveText(GENERAL.HOME.SEARCH_LABEL)
    })

    it('shows the search field hint text', async () => {
      await expect(GeneralHomePage.searchHint).toBeDisplayed()
      const text = await GeneralHomePage.searchHint.getText()
      expect(text).toContain('project number or name')
    })

    it('shows a Filter button', async () => {
      await expect(GeneralHomePage.filterButton).toBeDisplayed()
      await expect(GeneralHomePage.filterButton).toHaveText(GENERAL.HOME.FILTER_BUTTON)
    })
  })

  describe('Navigation', () => {
    it('shows Your proposals navigation link', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      const flat = texts.join(' ')
      expect(flat).toContain(COMMON.NAV.USER.YOUR_PROPOSALS)
    })

    it('shows a Sign out link', async () => {
      await expect(GeneralHomePage.signOutLink).toBeDisplayed()
      await expect(GeneralHomePage.signOutLink).toHaveText(COMMON.SIGN_OUT_LINK)
    })

    it('Sign out link points to the logout route', async () => {
      const href = await GeneralHomePage.signOutLink.getAttribute('href')
      expect(href).toContain('logout')
    })
  })

  describe('Phase banner', () => {
    it('shows the BETA tag', async () => {
      await expect(GeneralHomePage.phaseBannerTag).toHaveText(COMMON.PHASE_BANNER_TAG)
    })

    it('shows the beta feedback text', async () => {
      const text = await GeneralHomePage.phaseBannerText.getText()
      expect(text).toContain(COMMON.PHASE_BANNER_TEXT)
    })
  })

  describe('Footer', () => {
    it('shows Privacy link', async () => {
      await expect(GeneralHomePage.privacyLink).toBeDisplayed()
    })

    it('shows Cookies link', async () => {
      await expect(GeneralHomePage.cookiesLink).toBeDisplayed()
    })

    it('shows Accessibility link', async () => {
      await expect(GeneralHomePage.accessibilityLink).toBeDisplayed()
    })
  })
})
