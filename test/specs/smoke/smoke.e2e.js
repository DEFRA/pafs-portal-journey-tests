import { browser, expect } from '@wdio/globals'
import LoginPage from 'page-objects/auth/login.page.js'
import { COMMON, AUTH } from 'constants/content.js'

/**
 * Smoke suite — "is the service alive?"
 * Run after every deployment as a pre-gate before sanity/regression.
 * Must complete in under 2 minutes. Fails fast (bail: 1 in local config).
 */
describe('Smoke', () => {
  it('login page is reachable and shows service title', async () => {
    await LoginPage.open()
    await expect(LoginPage.serviceTitle).toHaveText(COMMON.SERVICE_TITLE_USER)
  })

  it('login page heading is correct', async () => {
    await expect(LoginPage.pageHeading).toHaveText(AUTH.LOGIN.PAGE_HEADING)
  })

  it('login page has email and password fields', async () => {
    await expect(LoginPage.emailField).toBeDisplayed()
    await expect(LoginPage.passwordField).toBeDisplayed()
  })

  it('login page shows validation error summary on empty submit', async () => {
    await LoginPage.submitForm()
    await expect(LoginPage.errorSummary).toBeDisplayed()
    await expect(LoginPage.errorSummaryTitle).toHaveText(
      COMMON.ERROR_SUMMARY_HEADING
    )
  })
})
