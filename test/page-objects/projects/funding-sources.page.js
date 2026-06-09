import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class FundingSourcesPage extends GovUkFormPage {
  // Funding source selection checkboxes
  get fundingCheckboxes() {
    return $$('input[type="checkbox"]')
  }

  get fundingCheckboxLabels() {
    return $$('.govuk-checkboxes__label')
  }

  // Contributor name inputs
  get contributorInputs() {
    return $$('input[type="text"][name*="contributor"], input[name*="name"]')
  }

  get addContributorButton() {
    return $('button=Add another contributor, a=Add another contributor')
  }

  get removeContributorLinks() {
    return $$('a=Remove, button=Remove')
  }

  // Estimated spend table inputs
  get spendInputs() {
    return $$('table input[type="number"], table input[type="text"]')
  }

  get spendTableHeaders() {
    return $$('table th')
  }

  get totalCells() {
    return $$('table td.total, td[data-total]')
  }

  get missingFinancialYearsWarning() {
    return $('.govuk-warning-text, .govuk-inset-text')
  }

  async open(ref, step = 'funding-sources') {
    return browser.url(`/project/${ref}/${step}`)
  }

  async selectFundingSourceByIndex(index) {
    const checkboxes = await this.fundingCheckboxes
    await checkboxes[index].click()
  }

  async selectAllFundingSources() {
    const checkboxes = await this.fundingCheckboxes
    for (const cb of checkboxes) await cb.click()
  }

  async enterContributorName(index, name) {
    const inputs = await this.contributorInputs
    await inputs[index].clearValue()
    await inputs[index].setValue(name)
  }

  async enterSpendForFirstInput(amount) {
    const inputs = await this.spendInputs
    if (inputs.length > 0) {
      await inputs[0].clearValue()
      await inputs[0].setValue(String(amount))
    }
  }
}

export default new FundingSourcesPage()
