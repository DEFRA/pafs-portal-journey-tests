import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class RiskPropertiesPage extends GovUkFormPage {
  get riskCheckboxes() {
    return $$('input[type="checkbox"]')
  }

  get riskCheckboxLabels() {
    return $$('.govuk-checkboxes__label')
  }

  get mainRiskRadios() {
    return $$('input[type="radio"]')
  }

  get mainRiskLabels() {
    return $$('.govuk-radios__label')
  }

  // Properties affected by flooding table inputs
  get propertyInputs() {
    return $$('input[type="number"], input[type="text"][name*="propert"]')
  }

  get noPropertiesCheckbox() {
    return $('input[name*="no_properties"], input[name*="noProperties"]')
  }

  // Percentage inputs (deprived areas)
  get percentageInput() {
    return $('input[type="number"], input[type="text"]')
  }

  // Flood risk level radios
  get floodRiskRadios() {
    return $$('input[type="radio"]')
  }

  async open(ref, step) {
    return browser.url(`/project/${ref}/${step}`)
  }

  async selectRiskByIndex(index) {
    const checkboxes = await this.riskCheckboxes
    await checkboxes[index].click()
  }

  async selectAllRisks() {
    const checkboxes = await this.riskCheckboxes
    for (const cb of checkboxes) await cb.click()
  }

  async selectMainRiskByIndex(index = 0) {
    const radios = await this.mainRiskRadios
    await radios[index].click()
  }

  async enterPercentage(value) {
    await this.percentageInput.clearValue()
    await this.percentageInput.setValue(String(value))
  }

  async selectFloodRiskByIndex(index = 0) {
    const radios = await this.floodRiskRadios
    await radios[index].click()
  }
}

export default new RiskPropertiesPage()
