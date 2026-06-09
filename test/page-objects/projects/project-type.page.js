import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ProjectTypePage extends GovUkFormPage {
  // Project type radios (DEF, REP, REF, HCR, STR, STU, ELO)
  get typeRadios() {
    return $$('input[type="radio"]')
  }

  get typeRadioLabels() {
    return $$('.govuk-radios__label')
  }

  // Intervention types checkboxes (NFM, SUDS, PFR, Other)
  get interventionCheckboxes() {
    return $$('input[type="checkbox"]')
  }

  get interventionLabels() {
    return $$('.govuk-checkboxes__label')
  }

  get interventionHint() {
    return $('.govuk-fieldset__legend + .govuk-hint, .govuk-hint')
  }

  async selectTypeByValue(value) {
    await $(`input[value="${value}"]`).click()
  }

  async selectFirstType() {
    const radios = await this.typeRadios
    await radios[0].click()
  }

  async selectInterventionByIndex(index = 0) {
    const checkboxes = await this.interventionCheckboxes
    await checkboxes[index].click()
  }

  async selectPrimaryInterventionByIndex(index = 0) {
    const radios = await this.typeRadios
    await radios[index].click()
  }

  async openType() {
    return browser.url('/project/type')
  }

  async openInterventionTypes() {
    return browser.url('/project/intervention-types')
  }

  async openPrimaryInterventionType() {
    return browser.url('/project/primary-intervention-type')
  }
}

export default new ProjectTypePage()
