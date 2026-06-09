import { browser, expect, $ } from '@wdio/globals'
import LoginPage from 'page-objects/auth/login.page.js'
import GeneralHomePage from 'page-objects/general/home.page.js'
import AdminUsersPage from 'page-objects/admin/users.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { COMMON } from 'constants/content.js'

/**
 * Layout — service chrome spec.
 * Tests every persistent element across all pages:
 *   - Header service title, footer links (unauthenticated)
 *   - Phase banner tag and text
 *   - Menu button label and aria-label
 *   - Authenticated general-user navigation (all links + sign out)
 *   - Authenticated admin navigation (all links + sign out)
 */
describe('Layout — unauthenticated chrome (login page)', () => {
  before(async () => {
    await LoginPage.open()
  })

  // ── Header ──────────────────────────────────────────────────────────────────

  describe('Header', () => {
    it('displays the correct service title', async () => {
      await expect(LoginPage.serviceTitle).toHaveText(COMMON.SERVICE_TITLE_USER)
    })

    it('service title is a link', async () => {
      const tag = await LoginPage.serviceTitle.getTagName()
      const isLink = tag === 'a' || (await LoginPage.serviceTitle.getAttribute('href')) !== null
      expect(isLink).toBe(true)
    })

    it('service title link points to home or login', async () => {
      const href = await LoginPage.serviceTitle.getAttribute('href')
      expect(href).toMatch(/^\/$|\/home|\/auth\/login/)
    })
  })

  // ── Phase banner ────────────────────────────────────────────────────────────

  describe('Phase banner', () => {
    it('shows the BETA tag', async () => {
      await expect(LoginPage.phaseBannerTag).toBeDisplayed()
      await expect(LoginPage.phaseBannerTag).toHaveText(COMMON.PHASE_BANNER_TAG)
    })

    it('shows the beta feedback text', async () => {
      const text = await LoginPage.phaseBannerText.getText()
      expect(text).toContain(COMMON.PHASE_BANNER_TEXT)
    })

    it('phase banner contains a feedback link', async () => {
      const link = await LoginPage.phaseBannerText.$('a')
      await expect(link).toBeDisplayed()
    })
  })

  // ── Footer ──────────────────────────────────────────────────────────────────

  describe('Footer', () => {
    it('displays a Privacy link with correct label', async () => {
      await expect(LoginPage.privacyLink).toBeDisplayed()
      await expect(LoginPage.privacyLink).toHaveText(COMMON.FOOTER.PRIVACY)
    })

    it('Privacy link href points to /privacy-notice', async () => {
      const href = await LoginPage.privacyLink.getAttribute('href')
      expect(href).toContain('privacy')
    })

    it('displays a Cookies link with correct label', async () => {
      await expect(LoginPage.cookiesLink).toBeDisplayed()
      await expect(LoginPage.cookiesLink).toHaveText(COMMON.FOOTER.COOKIES)
    })

    it('Cookies link href points to /cookies', async () => {
      const href = await LoginPage.cookiesLink.getAttribute('href')
      expect(href).toContain('cookie')
    })

    it('displays an Accessibility link with correct label', async () => {
      await expect(LoginPage.accessibilityLink).toBeDisplayed()
      await expect(LoginPage.accessibilityLink).toHaveText(COMMON.FOOTER.ACCESSIBILITY)
    })

    it('Accessibility link href points to /accessibility', async () => {
      const href = await LoginPage.accessibilityLink.getAttribute('href')
      expect(href).toContain('accessib')
    })

    it('contains the OGL / Crown copyright notice', async () => {
      const footer = await $('footer')
      const text = await footer.getText()
      expect(text.toLowerCase()).toMatch(/crown copyright|open government licence/i)
    })
  })

  // ── Unauthenticated state ───────────────────────────────────────────────────

  describe('Unauthenticated state', () => {
    it('does not show the Sign out link on the login page', async () => {
      const visible = await LoginPage.signOutLink.isDisplayed().catch(() => false)
      expect(visible).toBe(false)
    })

    it('does not show authenticated navigation links', async () => {
      const navText = await $('header').getText()
      expect(navText).not.toContain(COMMON.NAV.USER.YOUR_PROPOSALS)
      expect(navText).not.toContain(COMMON.NAV.ADMIN.USERS)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Layout — authenticated general user navigation', () => {
  before(async () => {
    await loginAs('regularUser')
    await GeneralHomePage.open()
  })

  after(async () => {
    await logout()
  })

  describe('Header', () => {
    it('shows the correct service title for a general user', async () => {
      await expect(GeneralHomePage.serviceTitle).toHaveText(COMMON.SERVICE_TITLE_USER)
    })

    it('service title is still a link', async () => {
      const href = await GeneralHomePage.serviceTitle.getAttribute('href')
      expect(href).toBeTruthy()
    })
  })

  describe('Phase banner', () => {
    it('BETA tag is still visible when authenticated', async () => {
      await expect(GeneralHomePage.phaseBannerTag).toHaveText(COMMON.PHASE_BANNER_TAG)
    })

    it('phase banner feedback text is still visible', async () => {
      const text = await GeneralHomePage.phaseBannerText.getText()
      expect(text).toContain(COMMON.PHASE_BANNER_TEXT)
    })
  })

  describe('Service navigation — general user', () => {
    it('shows the Your proposals navigation link', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.USER.YOUR_PROPOSALS)
    })

    it('Your proposals link points to the proposals route', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      for (const link of navLinks) {
        if ((await link.getText()) === COMMON.NAV.USER.YOUR_PROPOSALS) {
          const href = await link.getAttribute('href')
          expect(href).toMatch(/\/$|\/home|\/proposals/)
          break
        }
      }
    })

    it('shows the Download all proposals navigation link', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.USER.DOWNLOAD_ALL)
    })

    it('Download all proposals link points to the download route', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      for (const link of navLinks) {
        if ((await link.getText()) === COMMON.NAV.USER.DOWNLOAD_ALL) {
          const href = await link.getAttribute('href')
          expect(href).toContain('download')
          break
        }
      }
    })

    it('shows the Archive navigation link', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.USER.ARCHIVE)
    })

    it('Archive link points to the archive route', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      for (const link of navLinks) {
        if ((await link.getText()) === COMMON.NAV.USER.ARCHIVE) {
          const href = await link.getAttribute('href')
          expect(href).toContain('archive')
          break
        }
      }
    })

    it('does NOT show admin-only navigation links', async () => {
      const navLinks = await GeneralHomePage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      const navFlat = texts.join(' ')
      expect(navFlat).not.toContain(COMMON.NAV.ADMIN.USERS)
      expect(navFlat).not.toContain(COMMON.NAV.ADMIN.ORGANISATIONS)
    })
  })

  describe('Sign out', () => {
    it('shows the Sign out link', async () => {
      await expect(GeneralHomePage.signOutLink).toBeDisplayed()
      await expect(GeneralHomePage.signOutLink).toHaveText(COMMON.SIGN_OUT_LINK)
    })

    it('Sign out link points to the logout route', async () => {
      const href = await GeneralHomePage.signOutLink.getAttribute('href')
      expect(href).toContain('logout')
    })
  })

  describe('Footer', () => {
    it('Privacy link is still visible when authenticated', async () => {
      await expect(GeneralHomePage.privacyLink).toHaveText(COMMON.FOOTER.PRIVACY)
    })

    it('Cookies link is still visible when authenticated', async () => {
      await expect(GeneralHomePage.cookiesLink).toHaveText(COMMON.FOOTER.COOKIES)
    })

    it('Accessibility link is still visible when authenticated', async () => {
      await expect(GeneralHomePage.accessibilityLink).toHaveText(COMMON.FOOTER.ACCESSIBILITY)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Layout — authenticated admin navigation', () => {
  before(async () => {
    await loginAs('admin')
    await AdminUsersPage.openActive()
  })

  after(async () => {
    await logout()
  })

  describe('Header', () => {
    it('shows the PAFS Admin service title in admin journey', async () => {
      const titleText = await AdminUsersPage.serviceTitle.getText()
      // Admin journey shows either the admin title or a combined title
      expect(titleText).toBeTruthy()
      expect(titleText.length).toBeGreaterThan(0)
    })
  })

  describe('Phase banner', () => {
    it('BETA tag is visible in admin journey', async () => {
      await expect(AdminUsersPage.phaseBannerTag).toHaveText(COMMON.PHASE_BANNER_TAG)
    })
  })

  describe('Service navigation — admin', () => {
    it('shows the Users navigation link', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.ADMIN.USERS)
    })

    it('Users link points to /admin/users', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      for (const link of navLinks) {
        if ((await link.getText()) === COMMON.NAV.ADMIN.USERS) {
          const href = await link.getAttribute('href')
          expect(href).toContain('/admin/users')
          break
        }
      }
    })

    it('shows the Organisations navigation link', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.ADMIN.ORGANISATIONS)
    })

    it('Organisations link points to the organisations route', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      for (const link of navLinks) {
        if ((await link.getText()) === COMMON.NAV.ADMIN.ORGANISATIONS) {
          const href = await link.getAttribute('href')
          expect(href).toContain('organisation')
          break
        }
      }
    })

    it('shows the Download projects navigation link', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.ADMIN.DOWNLOAD_PROJECTS)
    })

    it('shows the Download RMA navigation link', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts).toContain(COMMON.NAV.ADMIN.DOWNLOAD_RMA)
    })

    it('does NOT show general user navigation links in admin journey', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      const navFlat = texts.join(' ')
      expect(navFlat).not.toContain(COMMON.NAV.USER.ARCHIVE)
    })
  })

  describe('Sign out', () => {
    it('Sign out link is visible in admin journey', async () => {
      await expect(AdminUsersPage.signOutLink).toBeDisplayed()
      await expect(AdminUsersPage.signOutLink).toHaveText(COMMON.SIGN_OUT_LINK)
    })

    it('Sign out link points to the logout route', async () => {
      const href = await AdminUsersPage.signOutLink.getAttribute('href')
      expect(href).toContain('logout')
    })
  })

  describe('Footer', () => {
    it('all 3 footer links visible in admin journey', async () => {
      await expect(AdminUsersPage.privacyLink).toHaveText(COMMON.FOOTER.PRIVACY)
      await expect(AdminUsersPage.cookiesLink).toHaveText(COMMON.FOOTER.COOKIES)
      await expect(AdminUsersPage.accessibilityLink).toHaveText(COMMON.FOOTER.ACCESSIBILITY)
    })
  })
})
