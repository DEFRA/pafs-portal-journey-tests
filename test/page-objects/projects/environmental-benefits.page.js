import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class EnvironmentalBenefitsPage extends GovUkFormPage {
  get yesRadio() {
    return $('input[value="true"], input[value="yes"]')
  }

  get noRadio() {
    return $('input[value="false"], input[value="no"]')
  }

  get yesNoRadios() {
    return $$('input[type="radio"]')
  }

  get quantityInput() {
    return $('input[type="number"], input[type="text"].govuk-input--width-5, input[name*="hectares"], input[name*="kilometres"]')
  }

  get suffixText() {
    return $('.govuk-input__suffix')
  }

  get hintText() {
    return $('.govuk-hint')
  }

  async open(ref, step) {
    return browser.url(`/project/${ref}/${step}`)
  }

  async selectYes() {
    await this.yesRadio.click()
  }

  async selectNo() {
    await this.noRadio.click()
  }

  async enterQuantity(value) {
    await this.quantityInput.clearValue()
    await this.quantityInput.setValue(String(value))
  }
}

export default new EnvironmentalBenefitsPage()
