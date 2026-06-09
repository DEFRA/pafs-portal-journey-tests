import { browser, $ } from '@wdio/globals'
import { loginAs, restoreSession } from 'helpers/auth.helper.js'
import { setSharedRef } from 'fixtures/projects.js'

/**
 * Ensures the browser is on the home page as a logged-in regular user.
 * Attempts to restore an existing session before doing a full login.
 */
export async function ensureLoggedInAsUser() {
  await restoreSession('regularUser')
  const url = await browser.getUrl()
  if (!url.includes('/home') && !url.includes('/proposals')) {
    await loginAs('regularUser')
  }
}

/**
 * Navigates to the proposal overview page for the given reference number.
 * @param {string} ref  e.g. "PAFS-001-001-001"
 */
export async function goToOverview(ref) {
  await browser.url(`/project/${ref}`)
}

/**
 * Navigates to a specific proposal section via the Change link on the overview.
 * @param {string} ref         Proposal reference number
 * @param {string} sectionHref URL segment to match (e.g. 'funding-sources', 'risk')
 */
export async function navigateToSectionViaChange(ref, sectionHref) {
  await goToOverview(ref)
  const changeLinks = await $$('.govuk-summary-list__actions a, .govuk-link')
  for (const link of changeLinks) {
    const href = await link.getAttribute('href')
    if (href && href.includes(sectionHref)) {
      await link.click()
      return
    }
  }
  // Fallback: navigate directly
  await browser.url(`/project/${ref}/${sectionHref}`)
}

/**
 * Completes the minimal core creation journey (name → RMA → type → financial years)
 * and returns the proposal reference number extracted from the resulting overview URL.
 *
 * @param {{
 *   name: string,
 *   rmaName?: string,   RMA display text to select (partial match)
 *   projectType?: string  radio value, defaults to 'def'
 *   financialStartYear?: string  e.g. '2026'
 *   financialEndYear?: string    e.g. '2030'
 * }} opts
 * @returns {Promise<string>} proposal reference number
 */
export async function createProposalCore({
  name,
  rmaName,
  projectType = 'def',
  financialStartYear = null,
  financialEndYear = null
} = {}) {
  // Navigate to home and start creation
  await browser.url('/home')
  const createBtn = await $('a=Create a new proposal, button=Create a new proposal')
    .catch(() => $('a*=Create'))
  await createBtn.click()

  // Start proposal page — click Start now
  const startBtn = await $('a.govuk-button--start, a=Start now')
  await startBtn.click()

  // Project name
  await $('#name, input[name="name"]').setValue(name)
  await $('button[type="submit"]').click()

  // Area selection — select RMA by visible text if provided
  if (rmaName) {
    const select = await $('select#area, select[name="area"]')
    const options = await select.$$('option')
    for (const opt of options) {
      const text = await opt.getText()
      if (text.toLowerCase().includes(rmaName.toLowerCase())) {
        const val = await opt.getAttribute('value')
        await select.selectByAttribute('value', val)
        break
      }
    }
  } else {
    // Pick the first non-placeholder option
    const select = await $('select')
    const options = await select.$$('option')
    for (const opt of options) {
      const val = await opt.getAttribute('value')
      if (val && val !== '') {
        await select.selectByAttribute('value', val)
        break
      }
    }
  }
  await $('button[type="submit"]').click()

  // Project type — select the first radio (DEF) or the provided value
  await $(`input[value="${projectType}"]`).click()
  await $('button[type="submit"]').click()

  // Intervention types page may or may not appear (only for DEF/REP/REF)
  const url1 = await browser.getUrl()
  if (url1.includes('intervention-types')) {
    // Select first checkbox
    const firstCheckbox = await $('input[type="checkbox"]')
    await firstCheckbox.click()
    await $('button[type="submit"]').click()
  }

  // Primary intervention type
  const url2 = await browser.getUrl()
  if (url2.includes('primary-intervention-type')) {
    const firstRadio = await $('input[type="radio"]')
    await firstRadio.click()
    await $('button[type="submit"]').click()
  }

  // Financial year start
  const url3 = await browser.getUrl()
  if (url3.includes('financial-start-year')) {
    if (financialStartYear) {
      // Check if manual or radio list
      const manualInput = await $('#financial_year, input[name="financial_year"]').catch(() => null)
      if (manualInput && await manualInput.isDisplayed()) {
        await manualInput.setValue(financialStartYear)
      } else {
        const firstRadio = await $('input[type="radio"]')
        await firstRadio.click()
      }
    } else {
      const firstRadio = await $('input[type="radio"]').catch(() => null)
      if (firstRadio) {
        await firstRadio.click()
      } else {
        // manual entry
        const input = await $('input[type="text"], input[type="number"]')
        await input.setValue(String(new Date().getFullYear() + 1))
      }
    }
    await $('button[type="submit"]').click()
  }

  // Financial year end
  const url4 = await browser.getUrl()
  if (url4.includes('financial-end-year')) {
    if (financialEndYear) {
      const manualInput = await $('#financial_year, input[name="financial_year"]').catch(() => null)
      if (manualInput && await manualInput.isDisplayed()) {
        await manualInput.setValue(financialEndYear)
      } else {
        const firstRadio = await $('input[type="radio"]')
        await firstRadio.click()
      }
    } else {
      const firstRadio = await $('input[type="radio"]').catch(() => null)
      if (firstRadio) {
        await firstRadio.click()
      } else {
        const input = await $('input[type="text"], input[type="number"]')
        await input.setValue(String(new Date().getFullYear() + 3))
      }
    }
    await $('button[type="submit"]').click()
  }

  // Wait for overview
  await browser.waitUntil(
    async () => {
      const u = await browser.getUrl()
      return u.match(/\/project\/[A-Z0-9-]+$/) || u.includes('/project/overview')
    },
    { timeout: 15000, timeoutMsg: 'Proposal overview did not load after core creation' }
  )

  const finalUrl = await browser.getUrl()
  const match = finalUrl.match(/\/project\/([A-Z0-9-]+)/)
  const ref = match ? match[1] : null
  if (ref) setSharedRef(ref)
  return ref
}
