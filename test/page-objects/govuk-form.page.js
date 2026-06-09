import { $, $$ } from '@wdio/globals'
import { Page } from 'page-objects/page.js'

/**
 * Base page for all GOV.UK Design System pages in PAFS.
 * Provides selectors for every standard element visible on-screen:
 * service chrome, form elements, validation, success banners, summary lists.
 *
 * All feature page objects extend this class.
 */
class GovUkFormPage extends Page {
  // ─── Service chrome ────────────────────────────────────────────────────────

  get serviceTitle() {
    return $('.govuk-header__service-name')
  }

  get phaseBannerTag() {
    return $('.govuk-phase-banner .govuk-tag')
  }

  get phaseBannerText() {
    return $('.govuk-phase-banner__text')
  }

  get navigationLinks() {
    return $$('.govuk-header__navigation-item a')
  }

  get signOutLink() {
    return $('a=Sign out')
  }

  // ─── Footer ────────────────────────────────────────────────────────────────

  get footerLinks() {
    return $$('.govuk-footer__link')
  }

  get privacyLink() {
    return $('a=Privacy')
  }

  get cookiesLink() {
    return $('a=Cookies')
  }

  get accessibilityLink() {
    return $('a=Accessibility')
  }

  // ─── Page content ──────────────────────────────────────────────────────────

  get pageHeading() {
    return $('h1')
  }

  get sectionHeadings() {
    return $$('h2')
  }

  get bodyParagraphs() {
    return $$('main .govuk-body')
  }

  get insetText() {
    return $('.govuk-inset-text')
  }

  get panelTitle() {
    return $('.govuk-panel__title')
  }

  get panelBody() {
    return $('.govuk-panel__body')
  }

  get notificationBanner() {
    return $('.govuk-notification-banner')
  }

  get successBanner() {
    return $('.govuk-notification-banner--success')
  }

  get warningText() {
    return $('.govuk-warning-text')
  }

  // ─── Form elements ─────────────────────────────────────────────────────────

  get allFormLabels() {
    return $$('label.govuk-label')
  }

  get allHintTexts() {
    return $$('.govuk-hint')
  }

  get radioItems() {
    return $$('.govuk-radios__item')
  }

  get radioLabels() {
    return $$('.govuk-radios__label')
  }

  get radioHints() {
    return $$('.govuk-radios__hint')
  }

  get checkboxItems() {
    return $$('.govuk-checkboxes__item')
  }

  get checkboxLabels() {
    return $$('.govuk-checkboxes__label')
  }

  get checkboxHints() {
    return $$('.govuk-checkboxes__hint')
  }

  get conditionalReveal() {
    return $('.govuk-radios__conditional:not([hidden])')
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  get submitButton() {
    return $('button[type="submit"]')
  }

  get continueButton() {
    return $('button=Continue')
  }

  get startButton() {
    return $('a.govuk-button--start, a=Start now, button=Start now')
  }

  get backLink() {
    return $('a.govuk-back-link')
  }

  // ─── Validation ────────────────────────────────────────────────────────────

  get errorSummary() {
    return $('.govuk-error-summary')
  }

  get errorSummaryTitle() {
    return $('.govuk-error-summary__title')
  }

  get errorSummaryItems() {
    return $$('.govuk-error-summary__list li a')
  }

  get fieldErrors() {
    return $$('.govuk-error-message')
  }

  // ─── Summary list (check-answers / overview pages) ─────────────────────────

  get summaryRows() {
    return $$('.govuk-summary-list__row')
  }

  get summaryKeys() {
    return $$('.govuk-summary-list__key')
  }

  get summaryValues() {
    return $$('.govuk-summary-list__value')
  }

  get changeLinks() {
    return $$('.govuk-summary-list__actions a')
  }

  // ─── Table ─────────────────────────────────────────────────────────────────

  get tableCaption() {
    return $('table caption')
  }

  get tableHeaders() {
    return $$('table th')
  }

  get tableRows() {
    return $$('table tbody tr')
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  async getErrorMessages() {
    const items = await this.errorSummaryItems
    return Promise.all(items.map((el) => el.getText()))
  }

  async getRadioOptionTexts() {
    const labels = await this.radioLabels
    return Promise.all(labels.map((el) => el.getText()))
  }

  async getFooterLinkTexts() {
    const links = await this.footerLinks
    return Promise.all(links.map((el) => el.getText()))
  }

  async submitForm() {
    await this.submitButton.click()
  }
}

export { GovUkFormPage }
