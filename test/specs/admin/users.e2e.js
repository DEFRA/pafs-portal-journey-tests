import { browser, expect } from '@wdio/globals'
import AdminUsersPage from 'page-objects/admin/users.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { ADMIN, COMMON } from 'constants/content.js'

/**
 * Admin — Manage users spec.
 *
 * Covers everything visible on /admin/users and its sub-routes:
 *   - Page heading
 *   - Tab labels (Pending, Active)
 *   - Tab URLs (/admin/users/pending, /admin/users/active)
 *   - Filter form: label, hint, area filter, button labels, link text
 *   - Table structure: caption, ALL column headers, column count
 *   - Row-level action link text ("View")
 *   - Pagination: component presence, aria-label, Showing text, Prev/Next links
 *   - Bottom page action links: "Add new user", "Download all users"
 *   - Empty state messages
 *   - Suspended/inactive users: status badge, Reactivate link
 *   - Service title and navigation
 *   - Phase banner and footer
 */
describe('Admin — Manage users', () => {
  before(async () => {
    await loginAs('admin')
    await AdminUsersPage.open()
  })

  after(async () => {
    await logout()
  })

  // ── Page heading & service chrome ──────────────────────────────────────────

  describe('Page heading and chrome', () => {
    it('has the correct page heading', async () => {
      await expect(AdminUsersPage.pageHeading).toHaveText(
        ADMIN.USERS.PAGE_HEADING
      )
    })

    it('shows the admin service title', async () => {
      await expect(AdminUsersPage.serviceTitle).toBeDisplayed()
    })

    it('shows the BETA phase banner tag', async () => {
      await expect(AdminUsersPage.phaseBannerTag).toHaveText(COMMON.PHASE_BANNER_TAG)
    })

    it('shows the Privacy footer link', async () => {
      await expect(AdminUsersPage.privacyLink).toBeDisplayed()
    })

    it('shows the Cookies footer link', async () => {
      await expect(AdminUsersPage.cookiesLink).toBeDisplayed()
    })

    it('shows the Accessibility footer link', async () => {
      await expect(AdminUsersPage.accessibilityLink).toBeDisplayed()
    })

    it('shows a Sign out link', async () => {
      await expect(AdminUsersPage.signOutLink).toBeDisplayed()
      await expect(AdminUsersPage.signOutLink).toHaveText(COMMON.SIGN_OUT_LINK)
    })
  })

  // ── Tabs ──────────────────────────────────────────────────────────────────

  describe('Tabs', () => {
    before(async () => {
      await AdminUsersPage.open()
    })

    it('shows exactly 2 tabs', async () => {
      const tabs = await AdminUsersPage.allTabs
      expect(tabs.length).toBe(2)
    })

    it('shows a Pending tab with correct label', async () => {
      await expect(AdminUsersPage.pendingTab).toBeDisplayed()
      const text = await AdminUsersPage.pendingTab.getText()
      expect(text).toContain(ADMIN.USERS.TABS.PENDING)
    })

    it('shows an Active tab with correct label', async () => {
      await expect(AdminUsersPage.activeTab).toBeDisplayed()
      const text = await AdminUsersPage.activeTab.getText()
      expect(text).toContain(ADMIN.USERS.TABS.ACTIVE)
    })

    it('Pending tab links to /admin/users/pending', async () => {
      const href = await AdminUsersPage.pendingTab.getAttribute('href')
      expect(href).toContain('pending')
    })

    it('Active tab links to /admin/users/active', async () => {
      const href = await AdminUsersPage.activeTab.getAttribute('href')
      expect(href).toContain('active')
    })

    it('navigating to /admin/users/pending shows pending URL', async () => {
      await AdminUsersPage.openPending()
      const url = await browser.getUrl()
      expect(url).toContain('/admin/users/pending')
    })

    it('navigating to /admin/users/active shows active URL', async () => {
      await AdminUsersPage.openActive()
      const url = await browser.getUrl()
      expect(url).toContain('/admin/users/active')
    })
  })

  // ── Filter form ───────────────────────────────────────────────────────────

  describe('Filter form', () => {
    before(async () => {
      await AdminUsersPage.openActive()
    })

    it('shows the search field', async () => {
      await expect(AdminUsersPage.searchField).toBeDisplayed()
    })

    it('search field has correct label text', async () => {
      await expect(AdminUsersPage.searchLabel).toHaveText(
        ADMIN.USERS.FILTER.SEARCH_LABEL
      )
    })

    it('search field has correct hint text', async () => {
      const hint = await AdminUsersPage.searchHint
      const text = await hint.getText()
      expect(text).toContain('name or email')
    })

    it('shows an area filter dropdown', async () => {
      await expect(AdminUsersPage.areaFilterSelect).toBeDisplayed()
    })

    it('area filter label is correct', async () => {
      await expect(AdminUsersPage.areaFilterLabel).toHaveText(
        ADMIN.USERS.FILTER.AREA_LABEL
      )
    })

    it('area filter default option is All areas', async () => {
      const select = AdminUsersPage.areaFilterSelect
      const defaultOption = await select.$('option:first-child')
      const text = await defaultOption.getText()
      expect(text).toContain('All areas')
    })

    it('shows a Filter button with correct label', async () => {
      await expect(AdminUsersPage.filterButton).toBeDisplayed()
      await expect(AdminUsersPage.filterButton).toHaveText(
        ADMIN.USERS.FILTER.FILTER_BUTTON
      )
    })

    it('shows a Clear filters link with correct label', async () => {
      await expect(AdminUsersPage.clearFiltersLink).toBeDisplayed()
      await expect(AdminUsersPage.clearFiltersLink).toHaveText(
        ADMIN.USERS.FILTER.CLEAR_FILTERS
      )
    })

    it('Clear filters link resets search and returns to base URL', async () => {
      await AdminUsersPage.searchFor('test')
      const urlAfterSearch = await browser.getUrl()
      expect(urlAfterSearch).toContain('search')

      await AdminUsersPage.clearSearch()
      const urlAfterClear = await browser.getUrl()
      expect(urlAfterClear).not.toContain('search=test')
    })
  })

  // ── Active users table ─────────────────────────────────────────────────────

  describe('Active users table', () => {
    before(async () => {
      await AdminUsersPage.openActive()
    })

    it('table caption is correct', async () => {
      const caption = AdminUsersPage.activeTableCaption
      const captionExists = await caption.isDisplayed().catch(() => false)
      if (captionExists) {
        await expect(caption).toHaveText(ADMIN.USERS.ACTIVE_TABLE.CAPTION)
      }
    })

    it('table has the correct column headers', async () => {
      const headers = await AdminUsersPage.getTableHeaderTexts()
      for (const expectedHeader of ADMIN.USERS.ACTIVE_TABLE.HEADERS) {
        expect(headers).toContain(expectedHeader)
      }
    })

    it('table has correct column count (including Actions)', async () => {
      const headers = await AdminUsersPage.tableHeaders
      expect(headers.length).toBe(ADMIN.USERS.ACTIVE_TABLE.COLUMN_COUNT)
    })

    it('each table row has a View action link', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        const firstRowLink = await rows[0].$('a')
        const linkText = await firstRowLink.getText()
        expect(linkText).toContain(ADMIN.USERS.ROW_ACTIONS.VIEW)
      }
    })

    it('View link in a row points to an /admin/users/ URL', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        const firstRowLink = await rows[0].$('a')
        const href = await firstRowLink.getAttribute('href')
        expect(href).toContain('/admin/users/')
      }
    })

    it('shows empty state message when no active users match filter', async () => {
      await AdminUsersPage.searchFor('zzz-no-match-xyz-999')
      const rows = await AdminUsersPage.tableRows
      if (rows.length === 0) {
        const msg = await AdminUsersPage.emptyStateMessage.getText()
        expect(msg).toContain(ADMIN.USERS.EMPTY.ACTIVE)
      }
      await AdminUsersPage.clearSearch()
    })
  })

  // ── Pending users table ────────────────────────────────────────────────────

  describe('Pending users tab — page and URL', () => {
    before(async () => {
      await AdminUsersPage.openPending()
    })

    it('URL is /admin/users/pending', async () => {
      const url = await browser.getUrl()
      expect(url).toContain('/admin/users/pending')
    })

    it('page heading remains Manage users', async () => {
      await expect(AdminUsersPage.pageHeading).toHaveText(ADMIN.USERS.PAGE_HEADING)
    })
  })

  describe('Pending users tab — filter form', () => {
    before(async () => {
      await AdminUsersPage.openPending()
    })

    it('search field is displayed on pending tab', async () => {
      await expect(AdminUsersPage.searchField).toBeDisplayed()
    })

    it('search label is correct on pending tab', async () => {
      await expect(AdminUsersPage.searchLabel).toHaveText(
        ADMIN.USERS.FILTER.SEARCH_LABEL
      )
    })

    it('search hint is correct on pending tab', async () => {
      const hint = await AdminUsersPage.searchHint
      const text = await hint.getText()
      expect(text).toContain('name or email')
    })

    it('Filter button is displayed on pending tab', async () => {
      await expect(AdminUsersPage.filterButton).toHaveText(
        ADMIN.USERS.FILTER.FILTER_BUTTON
      )
    })

    it('Clear filters link is displayed on pending tab', async () => {
      await expect(AdminUsersPage.clearFiltersLink).toHaveText(
        ADMIN.USERS.FILTER.CLEAR_FILTERS
      )
    })
  })

  describe('Pending users tab — table structure', () => {
    before(async () => {
      await AdminUsersPage.openPending()
    })

    it('table caption is correct', async () => {
      const caption = AdminUsersPage.activeTableCaption
      const captionExists = await caption.isDisplayed().catch(() => false)
      if (captionExists) {
        await expect(caption).toHaveText(ADMIN.USERS.PENDING_TABLE.CAPTION)
      }
    })

    it('table has the correct column headers', async () => {
      const headers = await AdminUsersPage.getTableHeaderTexts()
      // Pending table must have Name, Email, Area, Requested
      for (const expectedHeader of ADMIN.USERS.PENDING_TABLE.HEADERS) {
        expect(headers).toContain(expectedHeader)
      }
    })

    it('table has correct column count (including Actions)', async () => {
      const headers = await AdminUsersPage.tableHeaders
      expect(headers.length).toBe(ADMIN.USERS.PENDING_TABLE.COLUMN_COUNT)
    })

    it('pending table does NOT show an Admin column', async () => {
      const headers = await AdminUsersPage.getTableHeaderTexts()
      expect(headers).not.toContain('Admin')
    })

    it('pending table does NOT show a Last sign in column', async () => {
      const headers = await AdminUsersPage.getTableHeaderTexts()
      expect(headers).not.toContain('Last sign in')
    })

    it('pending table shows Requested column instead', async () => {
      const headers = await AdminUsersPage.getTableHeaderTexts()
      expect(headers).toContain('Requested')
    })
  })

  describe('Pending users tab — row actions', () => {
    before(async () => {
      await AdminUsersPage.openPending()
    })

    it('each pending row has a View action link', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        const firstRowLink = await rows[0].$('a')
        const linkText = await firstRowLink.getText()
        expect(linkText).toContain(ADMIN.USERS.ROW_ACTIONS.VIEW)
      }
    })

    it('View link in pending row points to an /admin/users/ URL', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        const firstRowLink = await rows[0].$('a')
        const href = await firstRowLink.getAttribute('href')
        expect(href).toContain('/admin/users/')
      }
    })

    it('navigating to a pending user detail page shows an Approve user action', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        const firstRowLink = await rows[0].$('a')
        await firstRowLink.click()
        const url = await browser.getUrl()
        expect(url).toContain('/admin/users/')
        // Approve link or button should be present on a pending user's detail page
        const approveAction = await $('a=Approve user, button=Approve user')
        await expect(approveAction).toBeDisplayed()
        await browser.back()
      }
    })
  })

  describe('Pending users tab — empty state', () => {
    before(async () => {
      await AdminUsersPage.openPending()
    })

    it('shows "No pending user requests" when the list is empty', async () => {
      const rows = await AdminUsersPage.tableRows
      if (rows.length === 0) {
        const msg = await AdminUsersPage.emptyStateMessage.getText()
        expect(msg).toContain(ADMIN.USERS.EMPTY.PENDING)
      }
    })

    it('searching for a non-existent user on pending tab shows empty state', async () => {
      await AdminUsersPage.searchFor('zzz-no-match-xyz-pending-999')
      const rows = await AdminUsersPage.tableRows
      if (rows.length === 0) {
        const msg = await AdminUsersPage.emptyStateMessage.getText()
        expect(msg).toContain(ADMIN.USERS.EMPTY.PENDING)
      }
      await AdminUsersPage.clearSearch()
    })
  })

  describe('Pending users tab — bottom page actions', () => {
    before(async () => {
      await AdminUsersPage.openPending()
    })

    it('shows Add new user link on pending tab', async () => {
      await expect(AdminUsersPage.addNewUserLink).toBeDisplayed()
      await expect(AdminUsersPage.addNewUserLink).toHaveText(
        ADMIN.USERS.ACTIONS.ADD_USER
      )
    })

    it('shows Download all users link on pending tab', async () => {
      await expect(AdminUsersPage.downloadUsersLink).toBeDisplayed()
      await expect(AdminUsersPage.downloadUsersLink).toHaveText(
        ADMIN.USERS.ACTIONS.DOWNLOAD_USERS
      )
    })
  })

  // ── Pagination ─────────────────────────────────────────────────────────────

  describe('Pagination (when results exceed page size)', () => {
    before(async () => {
      await AdminUsersPage.openActive()
    })

    it('pagination component has correct aria-label when visible', async () => {
      const paginationVisible = await AdminUsersPage.pagination
        .isDisplayed()
        .catch(() => false)

      if (paginationVisible) {
        const nav = AdminUsersPage.paginationNav
        const ariaLabel = await nav.getAttribute('aria-label')
        expect(ariaLabel).toContain('pagination')
      }
    })

    it('pagination shows Showing X to Y of Z users summary when visible', async () => {
      const paginationVisible = await AdminUsersPage.pagination
        .isDisplayed()
        .catch(() => false)

      if (paginationVisible) {
        const summary = AdminUsersPage.resultsSummary
        const text = await summary.getText()
        expect(text).toContain(ADMIN.USERS.PAGINATION.SHOWING_TEXT)
        // Matches "Showing 1 to 25 of 47 users"
        expect(text).toMatch(/Showing \d+ to \d+ of \d+/)
      }
    })

    it('pagination Next link has correct label when on first page', async () => {
      const paginationVisible = await AdminUsersPage.pagination
        .isDisplayed()
        .catch(() => false)

      if (paginationVisible) {
        const nextLink = AdminUsersPage.paginationNext
        const nextVisible = await nextLink.isDisplayed().catch(() => false)
        if (nextVisible) {
          const text = await nextLink.getText()
          expect(text).toContain(ADMIN.USERS.PAGINATION.NEXT)
        }
      }
    })

    it('clicking Next navigates to the next page URL', async () => {
      const paginationVisible = await AdminUsersPage.pagination
        .isDisplayed()
        .catch(() => false)

      if (paginationVisible) {
        const nextLink = AdminUsersPage.paginationNext
        const nextVisible = await nextLink.isDisplayed().catch(() => false)
        if (nextVisible) {
          const currentUrl = await browser.getUrl()
          await nextLink.click()
          const newUrl = await browser.getUrl()
          expect(newUrl).not.toBe(currentUrl)
          expect(newUrl).toMatch(/page=|offset=|p=/)
          await browser.back()
        }
      }
    })
  })

  // ── Bottom page action links ───────────────────────────────────────────────

  describe('Bottom page action links', () => {
    before(async () => {
      await AdminUsersPage.openActive()
    })

    it('shows Add new user link with correct label', async () => {
      await expect(AdminUsersPage.addNewUserLink).toBeDisplayed()
      await expect(AdminUsersPage.addNewUserLink).toHaveText(
        ADMIN.USERS.ACTIONS.ADD_USER
      )
    })

    it('Add new user link points to /admin/user-account', async () => {
      const href = await AdminUsersPage.addNewUserLink.getAttribute('href')
      expect(href).toContain('user-account')
    })

    it('shows Download all users link with correct label', async () => {
      await expect(AdminUsersPage.downloadUsersLink).toBeDisplayed()
      await expect(AdminUsersPage.downloadUsersLink).toHaveText(
        ADMIN.USERS.ACTIONS.DOWNLOAD_USERS
      )
    })

    it('Download all users link points to /admin/users/download', async () => {
      const href = await AdminUsersPage.downloadUsersLink.getAttribute('href')
      expect(href).toContain('download')
    })
  })

  // ── Suspended / inactive users ─────────────────────────────────────────────

  describe('Suspended users (inactive accounts in Active tab)', () => {
    before(async () => {
      await AdminUsersPage.openActive()
    })

    it('suspended users show a red Suspended status badge when present', async () => {
      const suspended = await AdminUsersPage.suspendedStatusBadges
      if (suspended.length > 0) {
        const text = await suspended[0].getText()
        expect(text).toContain(ADMIN.USERS.SUSPENDED.STATUS_VALUE)
      }
    })

    it('suspended users have a Reactivate account action link when present', async () => {
      const reactivateLinks = await AdminUsersPage.reactivateLinks
      if (reactivateLinks.length > 0) {
        await expect(reactivateLinks[0]).toHaveText(
          ADMIN.USERS.SUSPENDED.REACTIVATE_LINK
        )
        const href = await reactivateLinks[0].getAttribute('href')
        expect(href).toContain('reactivate')
      }
    })

    it('Reactivate account link URL includes the user ID and /reactivate', async () => {
      const reactivateLinks = await AdminUsersPage.reactivateLinks
      if (reactivateLinks.length > 0) {
        const href = await reactivateLinks[0].getAttribute('href')
        expect(href).toMatch(/\/admin\/users\/.+\/reactivate/)
      }
    })
  })

  // ── Navigation ─────────────────────────────────────────────────────────────

  describe('Admin navigation links', () => {
    before(async () => {
      await AdminUsersPage.openActive()
    })

    it('shows admin navigation with Users link', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts.join(' ')).toContain(COMMON.NAV.ADMIN.USERS)
    })

    it('shows admin navigation with Organisations link', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      const texts = await Promise.all(navLinks.map((el) => el.getText()))
      expect(texts.join(' ')).toContain(COMMON.NAV.ADMIN.ORGANISATIONS)
    })

    it('Users navigation link points to /admin/users', async () => {
      const navLinks = await AdminUsersPage.navigationLinks
      for (const link of navLinks) {
        const text = await link.getText()
        if (text.includes(COMMON.NAV.ADMIN.USERS)) {
          const href = await link.getAttribute('href')
          expect(href).toContain('admin/users')
          break
        }
      }
    })
  })
})
