import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class WholeLifeBenefitsPage extends GovUkFormPage {
  get allBenefitInputs() {
    return $$('input[type="number"], input[type="text"].govuk-input')
  }

  get hintText() {
    return $('.govuk-hint')
  }

  get tableHeaders() {
    return $$('table th, label.govuk-label')
  }

  async open(ref) {
    return browser.url(`/project/${ref}/whole-life-benefits`)
  }

  async enterWholeLifeBenefit(value) {
    const inputs = await this.allBenefitInputs
    if (inputs.length > 0) {
      await inputs[0].clearValue()
      await inputs[0].setValue(String(value))
    }
  }

  async enterAllBenefits(values = [500000, 0, 0, 0, 0]) {
    const inputs = await this.allBenefitInputs
    for (let i = 0; i < Math.min(inputs.length, values.length); i++) {
      if (values[i] !== null) {
        await inputs[i].clearValue()
        await inputs[i].setValue(String(values[i]))
      }
    }
  }
}

export default new WholeLifeBenefitsPage()
