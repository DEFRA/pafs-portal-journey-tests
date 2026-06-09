import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class BenefitAreaPage extends GovUkFormPage {
  get fileInput() {
    return $('input[type="file"]')
  }

  get fileLabel() {
    return $('label[for="benefit_area_file"], label.govuk-label')
  }

  get hintText() {
    return $('.govuk-hint')
  }

  get introduction() {
    return $('main .govuk-body')
  }

  get uploadStatus() {
    return $('.govuk-inset-text, .upload-status')
  }

  get deleteButton() {
    return $('button=Yes, delete this file, a=Delete')
  }

  get processingHeading() {
    return $('h1')
  }

  async open(ref) {
    return browser.url(`/project/${ref}/benefit-area`)
  }

  async openDelete(ref) {
    return browser.url(`/project/${ref}/benefit-area/delete`)
  }
}

export default new BenefitAreaPage()
