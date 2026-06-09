import { $ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ForgotPasswordPage extends GovUkFormPage {
  get descriptionText() {
    return $('.govuk-body')
  }

  get emailField() {
    return $('#email')
  }

  get emailLabel() {
    return $('label[for="email"]')
  }

  get backToSignInLink() {
    return $('a=Back to sign in')
  }

  open() {
    return super.open('/forgot-password')
  }

  async submitEmail(email) {
    await this.emailField.setValue(email)
    await this.submitForm()
  }
}

class ForgotPasswordConfirmationPage extends GovUkFormPage {
  get panelTitle() {
    return $('.govuk-panel__title')
  }

  get panelBody() {
    return $('.govuk-panel__body')
  }

  get whatHappensNextHeading() {
    return $('h2=What happens next')
  }

  get linkExpiryText() {
    return $('.govuk-list--bullet')
  }

  get backToSignInLink() {
    return $('a=Back to sign in')
  }
}

export const forgotPasswordPage = new ForgotPasswordPage()
export const forgotPasswordConfirmationPage = new ForgotPasswordConfirmationPage()
