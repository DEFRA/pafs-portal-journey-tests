import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class CarbonImpactPage extends GovUkFormPage {
  get carbonInput() {
    return $('input[type="number"], input[type="text"].govuk-input')
  }

  get allInputs() {
    return $$('input[type="number"], input[type="text"].govuk-input')
  }

  get suffixText() {
    return $('.govuk-input__suffix')
  }

  get labelText() {
    return $('label.govuk-label')
  }

  // Summary / calculated pages
  get summaryRows() {
    return $$('.govuk-summary-list__row')
  }

  get calculatedValues() {
    return $$('.govuk-table td, .govuk-summary-list__value')
  }

  async open(ref, step) {
    return browser.url(`/project/${ref}/${step}`)
  }

  async enterValue(value) {
    await this.carbonInput.clearValue()
    await this.carbonInput.setValue(String(value))
  }
}

export default new CarbonImpactPage()
