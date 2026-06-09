import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ProjectNamePage extends GovUkFormPage {
  get nameInput() {
    return $('#name, input[name="name"]')
  }

  get nameLabel() {
    return $('label[for="name"], label.govuk-label--xl')
  }

  get hintText() {
    return $('.govuk-hint')
  }

  async open() {
    return browser.url('/project/name')
  }

  async enterName(name) {
    await this.nameInput.clearValue()
    await this.nameInput.setValue(name)
  }

  async enterNameAndSubmit(name) {
    await this.enterName(name)
    await this.submitForm()
  }
}

export default new ProjectNamePage()
