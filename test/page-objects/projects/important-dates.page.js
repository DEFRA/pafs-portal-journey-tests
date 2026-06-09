import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ImportantDatesPage extends GovUkFormPage {
  get monthInput() {
    return $('input[name*="month"], #month, input[id$="month"]')
  }

  get yearInput() {
    return $('input[name*="year"], #year, input[id$="year"]')
  }

  get monthLabel() {
    return $('label[for="month"], label*=Month')
  }

  get yearLabel() {
    return $('label[for="year"], label*=Year')
  }

  get dateHint() {
    return $('.govuk-hint')
  }

  // Could start earlier radios
  get yesRadio() {
    return $('input[value="true"], input[value="yes"]')
  }

  get noRadio() {
    return $('input[value="false"], input[value="no"]')
  }

  async open(ref, step) {
    return browser.url(`/project/${ref}/${step}`)
  }

  async enterDate(month, year) {
    await this.monthInput.clearValue()
    await this.monthInput.setValue(String(month))
    await this.yearInput.clearValue()
    await this.yearInput.setValue(String(year))
  }

  async selectYes() {
    await this.yesRadio.click()
  }

  async selectNo() {
    await this.noRadio.click()
  }
}

export default new ImportantDatesPage()
