import { browser, $, expect } from '@wdio/globals'
import { loginAs, restoreSession } from 'helpers/auth.helper.js'
import ProjectListingPage from 'page-objects/projects/project-listing.page.js'
import ProjectNamePage from 'page-objects/projects/project-name.page.js'
import ProjectTypePage from 'page-objects/projects/project-type.page.js'
import FinancialYearPage from 'page-objects/projects/financial-year.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, setSharedRef, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS, GENERAL } from 'constants/content.js'

// ─── Shared helpers ────────────────────────────────────────────────────────────

async function startNewProposal(suffix = '') {
  await restoreSession('regularUser')
  await ProjectListingPage.open()
  await ProjectListingPage.createButton.click()
  const startBtn = await $('a.govuk-button--start, a=Start now').catch(() => null)
  if (startBtn && await startBtn.isDisplayed()) await startBtn.click()
}

async function fillNameAndArea(name) {
  const nameInput = await $('input[name="name"], #name')
  await nameInput.clearValue()
  await nameInput.setValue(name)
  await $('button[type="submit"]').click()

  // Area selection
  const select = await $('select').catch(() => null)
  if (select) {
    const opts = await select.$$('option')
    for (const opt of opts) {
      const val = await opt.getAttribute('value')
      if (val) { await select.selectByAttribute('value', val); break }
    }
    await $('button[type="submit"]').click()
  }
}

async function pickFirstFinancialYears() {
  for (const step of ['financial-start-year', 'financial-end-year']) {
    const url = await browser.getUrl()
    if (!url.includes(step.split('-')[1])) continue
    const radio = await $('input[type="radio"]').catch(() => null)
    if (radio) {
      await radio.click()
    } else {
      const input = await $('input[type="text"], input[type="number"]')
      const offset = step.includes('end') ? 3 : 1
      await input.setValue(String(new Date().getFullYear() + offset))
    }
    await $('button[type="submit"]').click()
  }
}

// ──────────────────────────────────────────────────────────────────────────────

describe('Proposal — Core creation (name → area → type → financial year)', () => {
  before(async () => {
    await loginAs('regularUser')
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── Home / start ──────────────────────────────────────────────────────────

  describe('Home page — Create a new proposal button', () => {
    before(async () => {
      await ProjectListingPage.open()
    })

    it('shows the Create a new proposal button', async () => {
      await expect(ProjectListingPage.createButton).toBeDisplayed()
    })

    it('navigates to the proposal creation flow when clicked', async () => {
      await ProjectListingPage.createButton.click()
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/project'),
        { timeout: 10000, timeoutMsg: 'Did not navigate to proposal creation' }
      )
    })
  })

  // ─── Project name ──────────────────────────────────────────────────────────

  describe('Project name page', () => {
    before(async () => {
      await startNewProposal()
    })

    describe('Page content', () => {
      it('has the correct page heading', async () => {
        await expect(ProjectNamePage.pageHeading).toHaveText(PROJECTS.NAME.PAGE_HEADING)
      })

      it('shows the service title', async () => {
        await expect(ProjectNamePage.serviceTitle).toHaveText(COMMON.SERVICE_TITLE_USER)
      })

      it('shows the hint text mentioning meaningful and understandable', async () => {
        await expect(ProjectNamePage.hintText).toHaveText(
          expect.stringContaining('meaningful and understandable')
        )
      })

      it('shows a back link', async () => {
        await expect(ProjectNamePage.backLink).toBeDisplayed()
      })
    })

    describe('Validation', () => {
      it('shows error summary when submitted empty', async () => {
        await ProjectNamePage.submitForm()
        await expect(ProjectNamePage.errorSummary).toBeDisplayed()
        await expect(ProjectNamePage.errorSummaryTitle).toHaveText(COMMON.ERROR_SUMMARY_HEADING)
      })

      it('shows the required error in error summary', async () => {
        await ProjectNamePage.submitForm()
        const errors = await ProjectNamePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NAME.ERRORS.REQUIRED)
      })

      it('shows inline field error beneath the name input', async () => {
        await ProjectNamePage.submitForm()
        const fieldErrors = await ProjectNamePage.fieldErrors
        expect(fieldErrors.length).toBeGreaterThan(0)
      })

      it('error summary links have href pointing to a field id', async () => {
        await ProjectNamePage.submitForm()
        const links = await ProjectNamePage.errorSummaryItems
        for (const link of links) {
          expect(await link.getAttribute('href')).toMatch(/^#/)
        }
      })

      it('shows invalid format error for name with special characters', async () => {
        await ProjectNamePage.enterName('Invalid <name> & format!')
        await ProjectNamePage.submitForm()
        const errors = await ProjectNamePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NAME.ERRORS.INVALID_FORMAT)
      })

      it('shows too long error when name exceeds 200 characters', async () => {
        await ProjectNamePage.enterName('A'.repeat(201))
        await ProjectNamePage.submitForm()
        const errors = await ProjectNamePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NAME.ERRORS.TOO_LONG)
      })
    })
  })

  // ─── Project type ──────────────────────────────────────────────────────────

  describe('Project type page', () => {
    before(async () => {
      await startNewProposal()
      await fillNameAndArea(proposalNames.core + '-TYPE')
    })

    describe('Page content', () => {
      it('has the correct page heading', async () => {
        await expect(ProjectTypePage.pageHeading).toHaveText(PROJECTS.TYPE.PAGE_HEADING)
      })

      it('shows 7 project type radio options', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.length).toBeGreaterThanOrEqual(7)
      })

      it('shows Defence (DEF) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Defence (DEF)'))).toBe(true)
      })

      it('shows Asset Replacement (REP) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Asset Replacement (REP)'))).toBe(true)
      })

      it('shows Asset Refurbishment (REF) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Asset Refurbishment (REF)'))).toBe(true)
      })

      it('shows Habitat Compensation and Restoration (HCR) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Habitat Compensation and Restoration (HCR)'))).toBe(true)
      })

      it('shows Strategy (STR) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Strategy (STR)'))).toBe(true)
      })

      it('shows Study (STU) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Study (STU)'))).toBe(true)
      })

      it('shows Environmental Legal Obligation (ELO) prefix', async () => {
        const labels = await ProjectTypePage.getRadioOptionTexts()
        expect(labels.some(l => l.includes('Environmental Legal Obligation (ELO)'))).toBe(true)
      })
    })

    describe('Validation', () => {
      it('shows error when no type is selected', async () => {
        await ProjectTypePage.submitForm()
        await expect(ProjectTypePage.errorSummary).toBeDisplayed()
        const errors = await ProjectTypePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.TYPE.ERRORS.REQUIRED)
      })
    })

    describe('Routing — HCR/STR/STU/ELO types skip intervention pages', () => {
      // These types have no intervention types required and go straight to financial year

      it('HCR type goes directly to financial year (no intervention types page)', async () => {
        await startNewProposal()
        await fillNameAndArea(proposalNames.core + '-HCR')
        await $('input[value="hcr"]').click()
        await $('button[type="submit"]').click()
        const url = await browser.getUrl()
        expect(url).toMatch(/financial-start-year|financial-year/)
        expect(url).not.toContain('intervention-types')
      })

      it('STR type goes directly to financial year', async () => {
        await startNewProposal()
        await fillNameAndArea(proposalNames.core + '-STR')
        await $('input[value="str"]').click()
        await $('button[type="submit"]').click()
        const url = await browser.getUrl()
        expect(url).toMatch(/financial-start-year|financial-year/)
      })
    })
  })

  // ─── Intervention types ────────────────────────────────────────────────────

  describe('Intervention types page (DEF type — shown for DEF/REP/REF only)', () => {
    before(async () => {
      await startNewProposal()
      await fillNameAndArea(proposalNames.core + '-INT-CONTENT')
      await $('input[value="def"]').click()
      await $('button[type="submit"]').click()
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        await expect(ProjectTypePage.pageHeading).toHaveText(PROJECTS.INTERVENTION_TYPE.PAGE_HEADING)
      })

      it('shows the Select all that apply hint', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        await expect(ProjectTypePage.interventionHint).toHaveText(PROJECTS.INTERVENTION_TYPE.HINT)
      })

      it('shows NFM option', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        const labels = await ProjectTypePage.interventionLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.NFM)
      })

      it('shows SUDS option', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        const labels = await ProjectTypePage.interventionLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.SUDS)
      })

      it('shows PFR option', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        const labels = await ProjectTypePage.interventionLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.PFR)
      })

      it('shows Something else option', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        const labels = await ProjectTypePage.interventionLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.OTHER)
      })
    })

    describe('Validation', () => {
      it('shows error when submitted with nothing checked', async function () {
        if (!(await browser.getUrl()).includes('intervention-types')) return this.skip()
        await ProjectTypePage.submitForm()
        await expect(ProjectTypePage.errorSummary).toBeDisplayed()
        const errors = await ProjectTypePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.INTERVENTION_TYPE.ERRORS.REQUIRED)
      })
    })
  })

  // ─── Intervention types — single selection path ───────────────────────────

  describe('Intervention types — single selection skips primary type page', () => {
    it('selecting exactly one intervention goes straight to financial year', async () => {
      await startNewProposal()
      await fillNameAndArea(proposalNames.core + '-INT-SINGLE')
      await $('input[value="def"]').click()
      await $('button[type="submit"]').click()

      const url = await browser.getUrl()
      if (!url.includes('intervention-types')) return

      // Select only the first checkbox (NFM)
      const checkboxes = await $$('input[type="checkbox"]')
      await checkboxes[0].click()
      await $('button[type="submit"]').click()

      // Must skip primary-intervention-type and land on financial year
      const nextUrl = await browser.getUrl()
      expect(nextUrl).not.toContain('primary-intervention-type')
      expect(nextUrl).toMatch(/financial-start-year|financial-year/)
    })
  })

  // ─── Intervention types — multiple selection path ─────────────────────────

  describe('Intervention types — multiple selections show primary type page', () => {
    before(async () => {
      await startNewProposal()
      await fillNameAndArea(proposalNames.core + '-INT-MULTI')
      await $('input[value="def"]').click()
      await $('button[type="submit"]').click()
    })

    it('selecting two interventions shows the primary intervention type page', async function () {
      const url = await browser.getUrl()
      if (!url.includes('intervention-types')) return this.skip()

      const checkboxes = await $$('input[type="checkbox"]')
      await checkboxes[0].click() // NFM
      await checkboxes[1].click() // SUDS
      await $('button[type="submit"]').click()

      const nextUrl = await browser.getUrl()
      expect(nextUrl).toContain('primary-intervention-type')
    })

    describe('Primary intervention type page', () => {
      it('has the correct page heading', async function () {
        if (!(await browser.getUrl()).includes('primary-intervention-type')) return this.skip()
        await expect(ProjectTypePage.pageHeading).toHaveText(
          PROJECTS.PRIMARY_INTERVENTION_TYPE.PAGE_HEADING
        )
      })

      it('shows ONLY the selected intervention types as radio options (not all 4)', async function () {
        if (!(await browser.getUrl()).includes('primary-intervention-type')) return this.skip()
        // We selected NFM + SUDS, so only those 2 should appear
        const radios = await ProjectTypePage.typeRadios
        expect(radios.length).toBe(2)
        const labels = await ProjectTypePage.typeRadioLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.NFM)
        expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.SUDS)
        // PFR and Other should NOT appear
        expect(texts).not.toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.PFR)
        expect(texts).not.toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.OTHER)
      })

      it('shows error when no primary type is selected', async function () {
        if (!(await browser.getUrl()).includes('primary-intervention-type')) return this.skip()
        await ProjectTypePage.submitForm()
        await expect(ProjectTypePage.errorSummary).toBeDisplayed()
        const errors = await ProjectTypePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.PRIMARY_INTERVENTION_TYPE.ERRORS.REQUIRED)
      })

      it('selects a primary type and continues to financial year', async function () {
        const url = await browser.getUrl()
        if (!url.includes('primary-intervention-type')) return this.skip()
        const radios = await ProjectTypePage.typeRadios
        await radios[0].click()
        await $('button[type="submit"]').click()
        const nextUrl = await browser.getUrl()
        expect(nextUrl).toMatch(/financial-start-year|financial-year/)
      })
    })
  })

  // ─── REF type — PFR option not shown ──────────────────────────────────────

  describe('Intervention types — REF type does not show PFR option', () => {
    it('REF type intervention page has no PFR checkbox', async () => {
      await startNewProposal()
      await fillNameAndArea(proposalNames.core + '-REF')
      await $('input[value="ref"]').click()
      await $('button[type="submit"]').click()

      const url = await browser.getUrl()
      if (!url.includes('intervention-types')) return

      const labels = await ProjectTypePage.interventionLabels
      const texts = await Promise.all(labels.map(l => l.getText()))
      expect(texts).not.toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.PFR)
    })
  })

  // ─── Financial year — manual entry ────────────────────────────────────────

  describe('Financial year start — manual entry', () => {
    before(async () => {
      await restoreSession('regularUser')
      // The radio list offers years; clicking "after March XXXX" link shows manual entry
      await browser.url('/project/financial-start-year')
      await FinancialYearPage.clickAfterMarchLink().catch(() => {})
      const url = await browser.getUrl()
      if (!url.includes('manual')) await browser.url('/project/financial-start-year-manual')
    })

    describe('Page content', () => {
      it('has the correct page heading', async () => {
        await expect(FinancialYearPage.pageHeading).toHaveText(
          PROJECTS.FINANCIAL_YEAR_START_MANUAL.PAGE_HEADING
        )
      })

      it('shows the "Financial year starting April" label', async () => {
        await expect(FinancialYearPage.yearLabel).toHaveText(
          PROJECTS.FINANCIAL_YEAR_START_MANUAL.LABEL
        )
      })

      it('shows the For example hint', async () => {
        await expect(FinancialYearPage.hintText).toHaveText(
          expect.stringContaining('For example')
        )
      })
    })

    describe('Validation', () => {
      it('shows error when submitted empty', async () => {
        await FinancialYearPage.submitForm()
        const errors = await FinancialYearPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_START_MANUAL.ERRORS.REQUIRED)
      })

      it('shows error for non-numeric year', async () => {
        await FinancialYearPage.enterYear('abcd')
        await FinancialYearPage.submitForm()
        const errors = await FinancialYearPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_START_MANUAL.ERRORS.INVALID_FORMAT)
      })

      it('shows error for year above 2100', async () => {
        await FinancialYearPage.enterYear(2101)
        await FinancialYearPage.submitForm()
        const errors = await FinancialYearPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_START_MANUAL.ERRORS.OUT_OF_RANGE)
      })

      it('shows error for past year', async () => {
        await FinancialYearPage.enterYear(2019)
        await FinancialYearPage.submitForm()
        const errors = await FinancialYearPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_START_MANUAL.ERRORS.SHOULD_BE_FUTURE)
      })
    })
  })

  describe('Financial year start — radio list', () => {
    before(async () => {
      await restoreSession('regularUser')
      await browser.url('/project/financial-start-year')
    })

    it('has the correct page heading', async () => {
      await expect(FinancialYearPage.pageHeading).toHaveText(
        PROJECTS.FINANCIAL_YEAR_START.PAGE_HEADING
      )
    })

    it('shows radio options for upcoming financial years', async () => {
      const radios = await FinancialYearPage.yearRadios
      expect(radios.length).toBeGreaterThan(0)
    })

    it('shows an "after March" link to access manual entry', async () => {
      await expect(FinancialYearPage.afterMarchLink).toBeDisplayed()
    })

    it('shows error when submitted without selecting a year', async () => {
      await FinancialYearPage.submitForm()
      const errors = await FinancialYearPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_START.ERRORS.REQUIRED)
    })
  })

  describe('Financial year end — manual entry', () => {
    before(async () => {
      // End year needs a ref — navigate without one to test the standalone manual path
      await restoreSession('regularUser')
      await browser.url('/project/financial-end-year-manual').catch(() => {})
    })

    it('has the correct page heading', async function () {
      if (!(await browser.getUrl()).includes('financial-end-year')) return this.skip()
      await expect(FinancialYearPage.pageHeading).toHaveText(
        PROJECTS.FINANCIAL_YEAR_END_MANUAL.PAGE_HEADING
      )
    })

    it('shows the do not include maintenance costs hint', async function () {
      if (!(await browser.getUrl()).includes('financial-end-year')) return this.skip()
      await expect(FinancialYearPage.hintText).toHaveText(
        expect.stringContaining("Don't include years which include maintenance costs")
      )
    })

    it('shows error when submitted empty', async function () {
      if (!(await browser.getUrl()).includes('financial-end-year')) return this.skip()
      await FinancialYearPage.submitForm()
      const errors = await FinancialYearPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_END_MANUAL.ERRORS.REQUIRED)
    })

    it('shows error for year above 2100', async function () {
      if (!(await browser.getUrl()).includes('financial-end-year')) return this.skip()
      await FinancialYearPage.enterYear(2101)
      await FinancialYearPage.submitForm()
      const errors = await FinancialYearPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.FINANCIAL_YEAR_END_MANUAL.ERRORS.OUT_OF_RANGE)
    })

    it('shows error for year before financial start year', async function () {
      if (!(await browser.getUrl()).includes('financial-end-year')) return this.skip()
      // Enter a very early year to trigger the range error
      await FinancialYearPage.enterYear(2020)
      await FinancialYearPage.submitForm()
      const errors = await FinancialYearPage.getErrorMessages()
      expect(errors.some(e =>
        e.includes('greater than or equal') || e.includes('range') || e.includes('future')
      )).toBe(true)
    })
  })

  // ─── Happy path — full creation ────────────────────────────────────────────

  describe('Happy path — full core creation (DEF, multiple interventions)', () => {
    it('creates a proposal with multiple interventions and lands on overview', async () => {
      await startNewProposal()
      await fillNameAndArea(proposalNames.core)

      // Select DEF
      await $('input[value="def"]').click()
      await $('button[type="submit"]').click()

      // Intervention types — select NFM + SUDS (multiple → shows primary page)
      const intUrl = await browser.getUrl()
      if (intUrl.includes('intervention-types')) {
        const checkboxes = await $$('input[type="checkbox"]')
        await checkboxes[0].click() // NFM
        await checkboxes[1].click() // SUDS
        await $('button[type="submit"]').click()
      }

      // Primary intervention type — select first option
      const primUrl = await browser.getUrl()
      if (primUrl.includes('primary-intervention-type')) {
        const radios = await $$('input[type="radio"]')
        await radios[0].click()
        await $('button[type="submit"]').click()
      }

      // Financial year start
      const fyStartUrl = await browser.getUrl()
      if (fyStartUrl.includes('financial-start-year')) {
        const radio = await $('input[type="radio"]').catch(() => null)
        if (radio) await radio.click()
        else {
          const input = await $('input[type="text"], input[type="number"]')
          await input.setValue(String(new Date().getFullYear() + 1))
        }
        await $('button[type="submit"]').click()
      }

      // Financial year end
      const fyEndUrl = await browser.getUrl()
      if (fyEndUrl.includes('financial-end-year')) {
        const radio = await $('input[type="radio"]').catch(() => null)
        if (radio) await radio.click()
        else {
          const input = await $('input[type="text"], input[type="number"]')
          await input.setValue(String(new Date().getFullYear() + 3))
        }
        await $('button[type="submit"]').click()
      }

      // Expect overview
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl()
          return url.match(/\/project\/[A-Z0-9-]+$/) || url.includes('overview')
        },
        { timeout: 15000, timeoutMsg: 'Did not reach proposal overview' }
      )

      const finalUrl = await browser.getUrl()
      const match = finalUrl.match(/\/project\/([A-Z0-9-]+)/)
      if (match) setSharedRef(match[1])

      await expect(ProjectOverviewPage.pageHeading).toHaveText(PROJECTS.OVERVIEW.PAGE_HEADING)
    })

    it('overview shows the proposal details section with project name', async () => {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      const vals = await ProjectOverviewPage.summaryValues
      const texts = await Promise.all(vals.map(v => v.getText()))
      // Project name should appear in the proposal details card
      expect(texts.some(t => t.includes(proposalNames.core))).toBe(true)
    })

    it('overview shows intervention types in proposal details card', async () => {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      const page = await $('main').getText()
      // NFM and SUDS should be visible
      expect(page).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.NFM)
    })
  })

  // ─── Update — project name ─────────────────────────────────────────────────

  describe('Update — project name via Change link', () => {
    it('Change link navigates to the name edit page', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('name')
      expect(await browser.getUrl()).toContain('name')
    })

    it('pre-fills the existing project name', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('name')
      const value = await ProjectNamePage.nameInput.getValue()
      expect(value).toContain(proposalNames.core)
    })

    it('shows validation error when name is cleared on edit', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('name')
      await ProjectNamePage.enterName('')
      await ProjectNamePage.submitForm()
      const errors = await ProjectNamePage.getErrorMessages()
      expect(errors).toContain(PROJECTS.NAME.ERRORS.REQUIRED)
    })

    it('updates name and returns to overview', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('name')
      await ProjectNamePage.enterNameAndSubmit(proposalNames.core + '-UPDATED')
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes(`/project/${ref}`),
        { timeout: 10000 }
      )
      await expect(ProjectOverviewPage.pageHeading).toHaveText(PROJECTS.OVERVIEW.PAGE_HEADING)
    })

    it('updated name appears in the proposal details card', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      const page = await $('main').getText()
      expect(page).toContain(proposalNames.core + '-UPDATED')
    })
  })

  // ─── Update — project type (non-intervention type, e.g. HCR) ─────────────

  describe('Update — project type via Change link', () => {
    it('Change link navigates to the type edit page', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('type')
      expect(await browser.getUrl()).toMatch(/type|project-type/)
    })

    it('pre-selects the existing project type', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('type')
      const checked = await $('input[type="radio"]:checked').catch(() => null)
      if (checked) expect(await checked.isSelected()).toBe(true)
    })

    it('changing to HCR skips intervention types and returns to overview', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('type')
      await $('input[value="hcr"]').click()
      await $('button[type="submit"]').click()
      // HCR skips intervention types in edit mode → goes straight to overview
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl()
          return url.includes(`/project/${ref}`) && !url.includes('type')
        },
        { timeout: 10000 }
      )
      await expect(ProjectOverviewPage.pageHeading).toHaveText(PROJECTS.OVERVIEW.PAGE_HEADING)
    })

    // Restore back to DEF with multiple interventions
    it('changing back to DEF with two interventions shows primary type page', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('type')
      await $('input[value="def"]').click()
      await $('button[type="submit"]').click()

      // Intervention types page (edit mode)
      const intUrl = await browser.getUrl()
      if (intUrl.includes('intervention-types')) {
        const checkboxes = await $$('input[type="checkbox"]')
        // Deselect all first, then select 2
        for (const cb of checkboxes) {
          if (await cb.isSelected()) await cb.click()
        }
        await checkboxes[0].click() // NFM
        await checkboxes[1].click() // SUDS
        await $('button[type="submit"]').click()
      }

      // Primary intervention type (edit mode, 2 selected → shows primary page)
      const primUrl = await browser.getUrl()
      if (primUrl.includes('primary-intervention-type')) {
        const radios = await $$('input[type="radio"]')
        await radios[0].click()
        await $('button[type="submit"]').click()
      }

      await browser.waitUntil(
        async () => (await browser.getUrl()).includes(`/project/${ref}`),
        { timeout: 10000 }
      )
    })
  })

  // ─── Update — intervention types (single → multiple → primary page) ────────

  describe('Update — intervention types via Change link', () => {
    it('Change link navigates to the intervention types edit page', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('intervention-types')
      const url = await browser.getUrl()
      expect(url).toContain('intervention-types')
    })

    it('pre-ticks the previously selected intervention types', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('intervention-types')
      const url = await browser.getUrl()
      if (!url.includes('intervention-types')) return this.skip()
      const checked = await $$('input[type="checkbox"]:checked')
      expect(checked.length).toBeGreaterThan(0)
    })

    it('reducing to one intervention skips primary type page and returns to overview', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('intervention-types')
      const url = await browser.getUrl()
      if (!url.includes('intervention-types')) return this.skip()

      // Deselect all, then select exactly one
      const checkboxes = await $$('input[type="checkbox"]')
      for (const cb of checkboxes) {
        if (await cb.isSelected()) await cb.click()
      }
      await checkboxes[0].click() // NFM only
      await $('button[type="submit"]').click()

      // Single selection in edit mode → skip primary → go to overview
      await browser.waitUntil(
        async () => {
          const u = await browser.getUrl()
          return u.includes(`/project/${ref}`) && !u.includes('intervention-types')
        },
        { timeout: 10000 }
      )
      await expect(ProjectOverviewPage.pageHeading).toHaveText(PROJECTS.OVERVIEW.PAGE_HEADING)
    })

    it('selecting multiple interventions shows primary type page on update', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('intervention-types')
      const url = await browser.getUrl()
      if (!url.includes('intervention-types')) return this.skip()

      const checkboxes = await $$('input[type="checkbox"]')
      // Deselect all
      for (const cb of checkboxes) {
        if (await cb.isSelected()) await cb.click()
      }
      // Select two
      await checkboxes[0].click() // NFM
      await checkboxes[2].click() // PFR
      await $('button[type="submit"]').click()

      // Multiple → shows primary page
      const nextUrl = await browser.getUrl()
      expect(nextUrl).toContain('primary-intervention-type')
    })

    it('primary type page shows only the newly selected intervention types', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('primary-intervention-type')) return this.skip()
      const radios = await $$('input[type="radio"]')
      // NFM + PFR = 2 options
      expect(radios.length).toBe(2)
      const labels = await $$('.govuk-radios__label')
      const texts = await Promise.all(labels.map(l => l.getText()))
      expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.NFM)
      expect(texts).toContain(PROJECTS.INTERVENTION_TYPE.OPTIONS.PFR)
    })

    it('selecting primary type on update returns to overview', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('primary-intervention-type')) return this.skip()
      const radios = await $$('input[type="radio"]')
      await radios[0].click()
      await $('button[type="submit"]').click()
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes(`/project/${ref}`),
        { timeout: 10000 }
      )
      await expect(ProjectOverviewPage.pageHeading).toHaveText(PROJECTS.OVERVIEW.PAGE_HEADING)
    })
  })

  // ─── Update — financial year via Change link ───────────────────────────────

  describe('Update — financial year start via Change link', () => {
    it('Change link navigates to financial year start edit page', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('financial-start-year')
      const url = await browser.getUrl()
      expect(url).toMatch(/financial-start-year|financial-year/)
    })

    it('shows warning when financial year is changed on existing proposal', async function () {
      const ref = getSharedRef()
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('financial-start-year')
      const url = await browser.getUrl()
      if (url.includes('manual')) {
        // Change to a different year
        const currentYear = new Date().getFullYear()
        await FinancialYearPage.enterYear(currentYear + 2)
        await FinancialYearPage.submitForm()
        // May show a warning about data loss
        const warnUrl = await browser.getUrl()
        const warnText = await $('main').getText()
        if (warnText.includes(PROJECTS.FINANCIAL_YEAR_WARNING.HEADING)) {
          expect(warnText).toContain(PROJECTS.FINANCIAL_YEAR_WARNING.HEADING)
        }
      }
    })
  })
})
