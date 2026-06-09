import { $ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class SetPasswordPage extends GovUkFormPage {
  get requirementsIntro() {
    return $('.govuk-body')
  }

  get requirementsList() {
    return $$('.govuk-list--bullet li')
  }

  get passwordField() {
    return $('#password')
  }

  get confirmPasswordField() {
    return $('#confirmPassword')
  }

  get passwordLabel() {
    return $('label[for="password"]')
  }

  get confirmPasswordLabel() {
    return $('label[for="confirmPassword"]')
  }

  // Token supplied by the invite flow — passed in from API seed or fixture
  open(token) {
    return super.open(`/set-password?token=${token}`)
  }

  async setPassword(password, confirmPassword) {
    await this.passwordField.setValue(password)
    await this.confirmPasswordField.setValue(confirmPassword || password)
    await this.submitForm()
  }
}

class SetPasswordLinkExpiredPage extends GovUkFormPage {
  get contactMessage() {
    return $('.govuk-body')
  }

  get backToSignInLink() {
    return $('a=Back to sign in')
  }

  open() {
    return super.open('/set-password/link-expired')
  }
}

export const setPasswordPage = new SetPasswordPage()
export const setPasswordLinkExpiredPage = new SetPasswordLinkExpiredPage()
