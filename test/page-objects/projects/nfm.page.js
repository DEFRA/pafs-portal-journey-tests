import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class NfmPage extends GovUkFormPage {
  get yesRadio() {
    return $('input[value="true"], input[value="yes"]')
  }

  get noRadio() {
    return $('input[value="false"], input[value="no"]')
  }

  get measureCheckboxes() {
    return $$('input[type="checkbox"]')
  }

  get measureCheckboxLabels() {
    return $$('.govuk-checkboxes__label')
  }

  get areaInput() {
    return $('input[name*="area"], #area')
  }

  get volumeInput() {
    return $('input[name*="volume"], #volume')
  }

  get lengthInput() {
    return $('input[name*="length"], #length')
  }

  get widthInput() {
    return $('input[name*="width"], #width, input[name*="breadth"]')
  }

  get landUseCheckboxes() {
    return $$('input[type="checkbox"]')
  }

  get landUseLabels() {
    return $$('.govuk-checkboxes__label')
  }

  get consentRadios() {
    return $$('input[type="radio"]')
  }

  get consentLabels() {
    return $$('.govuk-radios__label')
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

  async selectMeasureByIndex(index) {
    const checkboxes = await this.measureCheckboxes
    await checkboxes[index].click()
  }

  async enterArea(value) {
    await this.areaInput.clearValue()
    await this.areaInput.setValue(String(value))
  }

  async enterLength(value) {
    await this.lengthInput.clearValue()
    await this.lengthInput.setValue(String(value))
  }

  async enterWidth(value) {
    await this.widthInput.clearValue()
    await this.widthInput.setValue(String(value))
  }

  async selectRadioByIndex(index) {
    const radios = await this.consentRadios
    await radios[index].click()
  }
}

export default new NfmPage()
