import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ProjectOverviewPage extends GovUkFormPage {
  get nationalProposalNumber() {
    return $('.govuk-caption-xl, .govuk-caption-l')
  }

  get sectionCards() {
    return $$('.govuk-summary-card')
  }

  get sectionCardTitles() {
    return $$('.govuk-summary-card__title')
  }

  get changeLinks() {
    return $$('.govuk-summary-list__actions a, .govuk-summary-card__action a')
  }

  get submitButton() {
    return $('button=Submit proposal, input[value="Submit proposal"]')
  }

  get dataNoticeSummary() {
    return $('details summary, .govuk-details__summary')
  }

  get successBanner() {
    return $('.govuk-notification-banner--success')
  }

  get legacyBanner() {
    return $('.govuk-notification-banner--important, .govuk-inset-text')
  }

  get statusTags() {
    return $$('.govuk-tag')
  }

  async open(ref) {
    return browser.url(`/project/${ref}`)
  }

  async clickChangeFor(sectionHrefFragment) {
    const links = await this.changeLinks
    for (const link of links) {
      const href = await link.getAttribute('href')
      if (href && href.includes(sectionHrefFragment)) {
        await link.click()
        return
      }
    }
    throw new Error(`No Change link found for section: ${sectionHrefFragment}`)
  }

  async getSectionStatuses() {
    const tags = await this.statusTags
    return Promise.all(tags.map((el) => el.getText()))
  }
}

export default new ProjectOverviewPage()
