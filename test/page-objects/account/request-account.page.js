import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class RequestAccountStartPage extends GovUkFormPage {
  get introText() {
    return $('.govuk-body')
  }

  get beforeYouStartHeading() {
    return $('h2=Before you start')
  }

  get checklistItems() {
    return $$('.govuk-list--bullet li')
  }

  get reviewNoticeText() {
    return $('.govuk-inset-text')
  }

  get backToSignInLink() {
    return $('a=Back to sign in')
  }

  open() {
    return super.open('/request-account')
  }
}

class RequestAccountDetailsPage extends GovUkFormPage {
  get firstNameField() {
    return $('#firstName')
  }

  get lastNameField() {
    return $('#lastName')
  }

  get emailField() {
    return $('#email')
  }

  get telephoneField() {
    return $('#telephone')
  }

  get organisationField() {
    return $('#organisation')
  }

  get jobTitleField() {
    return $('#jobTitle')
  }

  get firstNameLabel() {
    return $('label[for="firstName"]')
  }

  get lastNameLabel() {
    return $('label[for="lastName"]')
  }

  get emailLabel() {
    return $('label[for="email"]')
  }

  get telephoneLabel() {
    return $('label[for="telephone"]')
  }

  get organisationLabel() {
    return $('label[for="organisation"]')
  }

  get jobTitleLabel() {
    return $('label[for="jobTitle"]')
  }

  get responsibilityLegend() {
    return $('fieldset legend')
  }

  get responsibilityRadios() {
    return $$('input[name="responsibility"]')
  }

  async fillDetails({ firstName, lastName, email, telephone, organisation, jobTitle }) {
    await this.firstNameField.setValue(firstName)
    await this.lastNameField.setValue(lastName)
    await this.emailField.setValue(email)
    if (telephone) await this.telephoneField.setValue(telephone)
    if (organisation) await this.organisationField.setValue(organisation)
    if (jobTitle) await this.jobTitleField.setValue(jobTitle)
  }

  async selectResponsibility(type) {
    // type: 'ea' | 'pso' | 'rma'
    await $(`input[name="responsibility"][value="${type}"]`).click()
  }
}

class RequestAccountAreaPage extends GovUkFormPage {
  get areaSelect() {
    return $('select')
  }

  async selectFirstAvailableArea() {
    const options = await $$('select option')
    // Skip the placeholder option (index 0)
    if (options.length > 1) {
      const value = await options[1].getAttribute('value')
      await this.areaSelect.selectByAttribute('value', value)
    }
  }
}

class RequestAccountAdditionalAreasPage extends GovUkFormPage {
  get additionalAreaCheckboxes() {
    return $$('.govuk-checkboxes__input')
  }
}

class RequestAccountCheckAnswersPage extends GovUkFormPage {
  get personalDetailsCard() {
    return $('.govuk-summary-card')
  }

  get changeLinks() {
    return $$('.govuk-summary-list__actions a')
  }

  get confirmationText() {
    return $('.govuk-body')
  }
}

class RequestAccountConfirmationPage extends GovUkFormPage {
  get returnToSignInLink() {
    return $('a=Return to sign in')
  }

  get whatHappensNextHeading() {
    return $('h2=What happens next')
  }

  get insetApprovalTime() {
    return $('.govuk-inset-text')
  }
}

export const requestAccountStartPage = new RequestAccountStartPage()
export const requestAccountDetailsPage = new RequestAccountDetailsPage()
export const requestAccountAreaPage = new RequestAccountAreaPage()
export const requestAccountAdditionalAreasPage =
  new RequestAccountAdditionalAreasPage()
export const requestAccountCheckAnswersPage = new RequestAccountCheckAnswersPage()
export const requestAccountConfirmationPage = new RequestAccountConfirmationPage()
