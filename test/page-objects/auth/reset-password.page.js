import { $ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ResetPasswordPage extends GovUkFormPage {
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

  // The token is provided via URL — page objects navigate with it
  open(token) {
    return super.open(`/reset-password?token=${token}`)
  }

  async setPassword(password, confirmPassword) {
    await this.passwordField.setValue(password)
    await this.confirmPasswordField.setValue(confirmPassword || password)
    await this.submitForm()
  }
}

class ResetPasswordSuccessPage extends GovUkFormPage {
  get backToSignInLink() {
    return $('a=Back to sign in')
  }
}

class ResetPasswordTokenExpiredPage extends GovUkFormPage {
  get requestNewLinkButton() {
    return $('a=Request new reset link, button=Request new reset link')
  }

  get backToSignInLink() {
    return $('a=Back to sign in')
  }

  // Accessible without a token — for testing the expired state
  open() {
    return super.open('/reset-password/token-expired')
  }
}

export const resetPasswordPage = new ResetPasswordPage()
export const resetPasswordSuccessPage = new ResetPasswordSuccessPage()
export const resetPasswordTokenExpiredPage = new ResetPasswordTokenExpiredPage()
