import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class WholeLifeCostPage extends GovUkFormPage {
  get appraisalInput() {
    return $('input[name*="whole_life_pv"], input[name*="appraisal"], #whole_life_pv_costs')
  }

  get designConstructionInput() {
    return $('input[name*="design"], input[name*="construction"], #design_construction_costs')
  }

  get riskContingencyInput() {
    return $('input[name*="risk"], input[name*="contingency"], #risk_contingency_costs')
  }

  get futureCostsInput() {
    return $('input[name*="future"], #future_costs')
  }

  get allCostInputs() {
    return $$('input[type="number"], input[type="text"].govuk-input')
  }

  get hintText() {
    return $('.govuk-hint')
  }

  get tableHeaders() {
    return $$('table th, .govuk-table__head th')
  }

  async open(ref) {
    return browser.url(`/project/${ref}/whole-life-cost`)
  }

  async enterAllCosts(appraisal = 100000, design = 200000, risk = 50000, future = 30000) {
    const inputs = await this.allCostInputs
    const values = [appraisal, design, risk, future]
    for (let i = 0; i < Math.min(inputs.length, values.length); i++) {
      await inputs[i].clearValue()
      await inputs[i].setValue(String(values[i]))
    }
  }
}

export default new WholeLifeCostPage()
