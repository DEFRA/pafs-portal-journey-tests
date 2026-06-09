import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class FinancialYearPage extends GovUkFormPage {
  get yearInput() {
    return $('#financial_year, input[name="financial_year"]')
  }

  get yearLabel() {
    return $('label[for="financial_year"]')
  }

  get hintText() {
    return $('.govuk-hint')
  }

  get yearRadios() {
    return $$('input[type="radio"]')
  }

  get yearRadioLabels() {
    return $$('.govuk-radios__label')
  }

  get afterMarchLink() {
    return $('a*=after March')
  }

  get warningHeading() {
    return $('h1, h2')
  }

  async openStart() {
    return browser.url('/project/financial-start-year')
  }

  async openStartManual() {
    return browser.url('/project/financial-start-year-manual')
  }

  async openEnd(ref) {
    return browser.url(`/project/${ref}/financial-end-year`)
  }

  async openEndManual(ref) {
    return browser.url(`/project/${ref}/financial-end-year-manual`)
  }

  async enterYear(year) {
    await this.yearInput.clearValue()
    await this.yearInput.setValue(String(year))
  }

  async selectFirstRadio() {
    const radios = await this.yearRadios
    if (radios.length > 0) await radios[0].click()
  }

  async clickAfterMarchLink() {
    await this.afterMarchLink.click()
  }
}

export default new FinancialYearPage()
