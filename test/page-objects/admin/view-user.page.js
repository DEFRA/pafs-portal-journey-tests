import { $, $$, browser } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ViewUserPage extends GovUkFormPage {
  // ── Summary cards ────────────────────────────────────────────────────────────

  get allSummaryCards() {
    return $$('.govuk-summary-card')
  }

  get summaryCardTitles() {
    return $$('.govuk-summary-card__title')
  }

  get allSummaryKeys() {
    return $$('.govuk-summary-list__key')
  }

  get allSummaryValues() {
    return $$('.govuk-summary-list__value')
  }

  // ── Action links on view page ─────────────────────────────────────────────────

  get approveUserLink() {
    return $('a=Approve user, button=Approve user')
  }

  get deleteUserLink() {
    return $('a=Delete user')
  }

  get resendInvitationLink() {
    return $('a=Resend invitation')
  }

  get reactivateAccountLink() {
    return $('a=Reactivate account')
  }

  // ── Success / error notifications ────────────────────────────────────────────

  get successNotification() {
    return $('.govuk-notification-banner--success')
  }

  get notificationHeading() {
    return $('.govuk-notification-banner--success .govuk-notification-banner__heading')
  }

  get notificationBody() {
    return $('.govuk-notification-banner--success .govuk-body')
  }

  /**
   * Returns the full text of the success notification — checks both the
   * heading and body elements so the assertion works regardless of which
   * element the app renders the message in.
   */
  async getSuccessNotificationText() {
    const banner = await this.successNotification
    return banner.getText()
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  async getCardTitles() {
    const titles = await this.summaryCardTitles
    return Promise.all(titles.map((t) => t.getText()))
  }

  /**
   * Returns the display value for a given summary list key label.
   * Scans all summary list rows on the page.
   */
  async getValueForKey(keyText) {
    const rows = await $$('.govuk-summary-list__row')
    for (const row of rows) {
      const keyEl = await row.$('.govuk-summary-list__key')
      const text = await keyEl.getText().catch(() => '')
      if (text.trim() === keyText) {
        const valueEl = await row.$('.govuk-summary-list__value')
        return valueEl.getText()
      }
    }
    return null
  }

  /**
   * Returns all field values keyed by their label for easy assertion.
   * e.g. { 'First name': 'John', 'Last name': 'Doe', ... }
   */
  async getAllFieldValues() {
    const result = {}
    const rows = await $$('.govuk-summary-list__row')
    for (const row of rows) {
      const key = await row.$('.govuk-summary-list__key').getText().catch(() => '')
      const value = await row.$('.govuk-summary-list__value').getText().catch(() => '')
      if (key) result[key.trim()] = value.trim()
    }
    return result
  }

  /**
   * Clicks the Change link in the summary list row that contains the given key.
   * Uses direct DOM traversal within the row so it always hits the correct link.
   */
  async clickChangeForKey(keyText) {
    const rows = await $$('.govuk-summary-list__row')
    for (const row of rows) {
      const keyEl = await row.$('.govuk-summary-list__key')
      const text = await keyEl.getText().catch(() => '')
      if (text.trim() === keyText) {
        const link = await row.$('.govuk-summary-list__actions a')
        if (!link) throw new Error(`No Change link found in row for key: "${keyText}"`)
        await link.click()
        return
      }
    }
    throw new Error(`Summary list row with key "${keyText}" not found on page`)
  }

  /**
   * Returns the href of the Change link for a given key — useful for URL assertions.
   */
  async getChangeLinkHrefForKey(keyText) {
    const rows = await $$('.govuk-summary-list__row')
    for (const row of rows) {
      const keyEl = await row.$('.govuk-summary-list__key')
      const text = await keyEl.getText().catch(() => '')
      if (text.trim() === keyText) {
        const link = await row.$('.govuk-summary-list__actions a')
        return link?.getAttribute('href') ?? null
      }
    }
    return null
  }

  /**
   * Navigates to a user's view page directly by their encoded ID.
   */
  openForUser(encodedId) {
    return super.open(`/admin/users/${encodedId}/view`)
  }
}

export default new ViewUserPage()
