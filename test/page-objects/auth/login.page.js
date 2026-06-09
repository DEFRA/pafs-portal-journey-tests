import { $ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class LoginPage extends GovUkFormPage {
  get emailField() {
    return $('#email')
  }

  get passwordField() {
    return $('#password')
  }

  get emailLabel() {
    return $('label[for="email"]')
  }

  get passwordLabel() {
    return $('label[for="password"]')
  }

  get forgotPasswordLink() {
    return $('a=I have forgotten my password')
  }

  get requestAccountLink() {
    return $('a=Request an account')
  }

  get sessionTimeoutBanner() {
    return $('.govuk-notification-banner')
  }

  open() {
    return super.open('/auth/login')
  }

  async login(email, password) {
    await this.emailField.setValue(email)
    await this.passwordField.setValue(password)
    await this.submitForm()
  }

  async loginAndWait(email, password) {
    await this.login(email, password)
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl()
        return (
          url.includes('/home') ||
          url.includes('/admin') ||
          url.includes('/journey-selection') ||
          url.includes('/login')
        )
      },
      { timeout: 10000, timeoutMsg: 'Login did not redirect after submission' }
    )
  }
}

export default new LoginPage()
