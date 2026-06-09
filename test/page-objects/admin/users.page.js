import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class AdminUsersPage extends GovUkFormPage {
  // ── URL paths ───────────────────────────────────────────────────────────────
  static PATHS = {
    BASE: '/admin/users',
    ACTIVE: '/admin/users/active',
    PENDING: '/admin/users/pending'
  }

  // ── Tabs ────────────────────────────────────────────────────────────────────

  get tabList() {
    return $('[role="tablist"], .govuk-tabs__list')
  }

  get allTabs() {
    return $$('[role="tab"], .govuk-tabs__tab')
  }

  get pendingTab() {
    return $('a[href*="pending"], [role="tab"]:first-child')
  }

  get activeTab() {
    return $('a[href*="active"], [role="tab"]:last-child')
  }

  // ── Filter form ─────────────────────────────────────────────────────────────

  get filterForm() {
    return $('form[aria-label*="Filter"], form[aria-label*="filter"]')
  }

  get searchField() {
    return $('#search')
  }

  get searchLabel() {
    return $('label[for="search"]')
  }

  get searchHint() {
    return $('#search-hint, [id$="search-hint"]')
  }

  get areaFilterSelect() {
    return $('select[name="area"], select[name*="area"]')
  }

  get areaFilterLabel() {
    return $('label[for*="area"]')
  }

  get filterButton() {
    return $('button=Filter')
  }

  get clearFiltersLink() {
    return $('a=Clear filters')
  }

  // ── Active users table ───────────────────────────────────────────────────────

  get activeTableCaption() {
    return $('caption')
  }

  get tableHeaders() {
    return $$('table thead th, table th')
  }

  get tableRows() {
    return $$('table tbody tr')
  }

  get tableRowCount() {
    return this.tableRows.then((rows) => rows.length)
  }

  // Returns all cell values for a given column index (0-based)
  async getColumnValues(columnIndex) {
    const rows = await this.tableRows
    return Promise.all(
      rows.map(async (row) => {
        const cells = await row.$$('td')
        return cells[columnIndex]?.getText() ?? ''
      })
    )
  }

  // Returns all header texts as an array
  async getTableHeaderTexts() {
    const headers = await this.tableHeaders
    return Promise.all(headers.map((h) => h.getText()))
  }

  // ── Pagination ───────────────────────────────────────────────────────────────

  get pagination() {
    return $('.govuk-pagination')
  }

  get paginationNav() {
    return $('nav[aria-label*="pagination"], nav[aria-label*="Results"]')
  }

  get paginationPrev() {
    return $('.govuk-pagination__prev a, a=Previous')
  }

  get paginationNext() {
    return $('.govuk-pagination__next a, a=Next')
  }

  get paginationPageLinks() {
    return $$('.govuk-pagination__page a, .govuk-pagination__number a')
  }

  get paginationCurrentPage() {
    return $('.govuk-pagination__item--current')
  }

  get paginationSummaryText() {
    // "Showing X to Y of Z users"
    return $('.govuk-body:has-text("Showing"), p=Showing')
  }

  get resultsSummary() {
    // Handles "Showing X to Y of Z users" wherever it renders
    return $('*=Showing')
  }

  // ── Bottom page actions ───────────────────────────────────────────────────────

  get addNewUserLink() {
    return $('a=Add new user')
  }

  get downloadUsersLink() {
    return $('a=Download all users')
  }

  // ── Row-level actions ─────────────────────────────────────────────────────────

  // Get the View link for a user row by their visible name
  async getViewLinkForUser(nameText) {
    const rows = await this.tableRows
    for (const row of rows) {
      const text = await row.getText()
      if (text.includes(nameText)) {
        return row.$('a')
      }
    }
    return null
  }

  // ── Suspended users ───────────────────────────────────────────────────────────

  get suspendedStatusBadges() {
    return $$('.govuk-tag--red, .govuk-tag[class*="red"]')
  }

  get reactivateLinks() {
    return $$('a=Reactivate account')
  }

  // ── Empty states ──────────────────────────────────────────────────────────────

  get emptyStateMessage() {
    return $('.govuk-body')
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  open() {
    return super.open(AdminUsersPage.PATHS.BASE)
  }

  openActive() {
    return super.open(AdminUsersPage.PATHS.ACTIVE)
  }

  openPending() {
    return super.open(AdminUsersPage.PATHS.PENDING)
  }

  async clickPendingTab() {
    await this.pendingTab.click()
  }

  async clickActiveTab() {
    await this.activeTab.click()
  }

  async searchFor(term) {
    await this.searchField.setValue(term)
    await this.filterButton.click()
  }

  async clearSearch() {
    await this.clearFiltersLink.click()
  }
}

export default new AdminUsersPage()
