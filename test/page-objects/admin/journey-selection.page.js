import { $ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class JourneySelectionPage extends GovUkFormPage {
  get contextHintText() {
    return $('.govuk-body')
  }

  get adminJourneyRadio() {
    return $('input[value="admin"]')
  }

  get userJourneyRadio() {
    return $('input[value="user"]')
  }

  get adminJourneyLabel() {
    return $('label[for*="admin"]')
  }

  get userJourneyLabel() {
    return $('label[for*="user"]')
  }

  open() {
    return super.open('/admin/journey-selection')
  }

  async selectAdminJourney() {
    await this.adminJourneyRadio.click()
    await this.continueButton.click()
  }

  async selectUserJourney() {
    await this.userJourneyRadio.click()
    await this.continueButton.click()
  }
}

export default new JourneySelectionPage()
