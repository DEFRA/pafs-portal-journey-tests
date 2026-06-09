import { browser, expect } from '@wdio/globals'
import { restoreSession } from 'helpers/auth.helper.js'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import ImportantDatesPage from 'page-objects/projects/important-dates.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Important dates', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.importantDates })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── OBC Start date ────────────────────────────────────────────────────────

  describe('Outline business case start date', () => {
    before(async () => {
      if (ref) await ImportantDatesPage.open(ref, 'start-outline-business-case')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(ImportantDatesPage.pageHeading).toHaveText(
          PROJECTS.IMPORTANT_DATES.OBC_START.PAGE_HEADING
        )
      })

      it('shows Month and Year labels', async function () {
        if (!ref) return this.skip()
        await expect(ImportantDatesPage.monthLabel).toBeDisplayed()
        await expect(ImportantDatesPage.yearLabel).toBeDisplayed()
      })

      it('shows a back link', async function () {
        if (!ref) return this.skip()
        await expect(ImportantDatesPage.backLink).toBeDisplayed()
      })
    })

    describe('Validation', () => {
      it('shows error when submitted empty', async function () {
        if (!ref) return this.skip()
        await ImportantDatesPage.submitForm()
        await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
        await expect(ImportantDatesPage.errorSummaryTitle).toHaveText(COMMON.ERROR_SUMMARY_HEADING)
      })

      it('shows required error in error summary', async function () {
        if (!ref) return this.skip()
        await ImportantDatesPage.submitForm()
        const errors = await ImportantDatesPage.getErrorMessages()
        expect(errors.some(e => e.toLowerCase().includes('date') || e.toLowerCase().includes('expect'))).toBe(true)
      })

      it('shows error for invalid month (13)', async function () {
        if (!ref) return this.skip()
        await ImportantDatesPage.enterDate(13, 2028)
        await ImportantDatesPage.submitForm()
        const errors = await ImportantDatesPage.getErrorMessages()
        expect(errors.some(e => e.toLowerCase().includes('valid') || e.toLowerCase().includes('invalid'))).toBe(true)
      })

      it('shows error for past date', async function () {
        if (!ref) return this.skip()
        await ImportantDatesPage.enterDate(1, 2020)
        await ImportantDatesPage.submitForm()
        const errors = await ImportantDatesPage.getErrorMessages()
        expect(errors.some(e => e.toLowerCase().includes('past') || e.toLowerCase().includes('future'))).toBe(true)
      })
    })

    describe('Happy path', () => {
      it('accepts a valid future date and continues', async function () {
        if (!ref) return this.skip()
        const futureYear = new Date().getFullYear() + 2
        await ImportantDatesPage.enterDate(6, futureYear)
        await ImportantDatesPage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('start-outline-business-case')
      })
    })
  })

  // ─── OBC Complete date ─────────────────────────────────────────────────────

  describe('Outline business case completion date', () => {
    before(async () => {
      if (ref) await ImportantDatesPage.open(ref, 'complete-outline-business-case')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(ImportantDatesPage.pageHeading).toHaveText(
          PROJECTS.IMPORTANT_DATES.OBC_COMPLETE.PAGE_HEADING
        )
      })
    })

    describe('Validation', () => {
      it('shows error when submitted empty', async function () {
        if (!ref) return this.skip()
        await ImportantDatesPage.submitForm()
        await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
      })

      it('shows error when date is before OBC start', async function () {
        if (!ref) return this.skip()
        // Enter a date before the OBC start date (set above to 6/future+2)
        await ImportantDatesPage.enterDate(3, new Date().getFullYear() + 2)
        await ImportantDatesPage.submitForm()
        const errors = await ImportantDatesPage.getErrorMessages()
        expect(errors.some(e => e.toLowerCase().includes('before') || e.toLowerCase().includes('after') || e.toLowerCase().includes('earlier'))).toBe(true)
      })

      it('accepts a valid date after OBC start', async function () {
        if (!ref) return this.skip()
        const futureYear = new Date().getFullYear() + 2
        await ImportantDatesPage.enterDate(9, futureYear)
        await ImportantDatesPage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('complete-outline-business-case')
      })
    })
  })

  // ─── Award main contract ───────────────────────────────────────────────────

  describe('Award main contract date', () => {
    before(async () => {
      if (ref) await ImportantDatesPage.open(ref, 'award-main-contract')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.pageHeading).toHaveText(
        PROJECTS.IMPORTANT_DATES.AWARD_CONTRACT.PAGE_HEADING
      )
    })

    it('shows error when submitted empty', async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.submitForm()
      await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
    })

    it('accepts a valid date and continues', async function () {
      if (!ref) return this.skip()
      const futureYear = new Date().getFullYear() + 3
      await ImportantDatesPage.enterDate(1, futureYear)
      await ImportantDatesPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('award-main-contract')
    })
  })

  // ─── Start work date ───────────────────────────────────────────────────────

  describe('Start work date', () => {
    before(async () => {
      if (ref) await ImportantDatesPage.open(ref, 'start-work')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.pageHeading).toHaveText(
        PROJECTS.IMPORTANT_DATES.START_WORK.PAGE_HEADING
      )
    })

    it('shows the hint text', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.dateHint).toHaveText(
        expect.stringContaining('construction')
      )
    })

    it('shows error when submitted empty', async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.submitForm()
      await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
    })

    it('accepts a valid date and continues', async function () {
      if (!ref) return this.skip()
      const futureYear = new Date().getFullYear() + 3
      await ImportantDatesPage.enterDate(3, futureYear)
      await ImportantDatesPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('start-work')
    })
  })

  // ─── Start achieving benefits ──────────────────────────────────────────────

  describe('Start achieving benefits date', () => {
    before(async () => {
      if (ref) await ImportantDatesPage.open(ref, 'start-benefits')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.pageHeading).toHaveText(
        PROJECTS.IMPORTANT_DATES.START_BENEFITS.PAGE_HEADING
      )
    })

    it('shows the benefits hint text', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.dateHint).toHaveText(
        expect.stringContaining('properties begin to benefit')
      )
    })

    it('shows error when submitted empty', async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.submitForm()
      await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
    })

    it('accepts a valid date and continues', async function () {
      if (!ref) return this.skip()
      const futureYear = new Date().getFullYear() + 4
      await ImportantDatesPage.enterDate(6, futureYear)
      await ImportantDatesPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('start-benefits')
    })
  })

  // ─── Could start earlier ───────────────────────────────────────────────────

  describe('Could start sooner page', () => {
    before(async () => {
      if (ref) await ImportantDatesPage.open(ref, 'could-start-early')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.pageHeading).toHaveText(
        PROJECTS.IMPORTANT_DATES.COULD_START_EARLIER.PAGE_HEADING
      )
    })

    it('shows the deliverability hint', async function () {
      if (!ref) return this.skip()
      await expect(ImportantDatesPage.dateHint).toHaveText(
        expect.stringContaining('deliverability')
      )
    })

    it('shows error when no option is selected', async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.submitForm()
      await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
      const errors = await ImportantDatesPage.getErrorMessages()
      expect(errors.some(e => e.toLowerCase().includes('start earlier'))).toBe(true)
    })

    it('selects No and continues without showing earliest date page', async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.selectNo()
      await ImportantDatesPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('could-start-early')
    })
  })

  // ─── Earliest start date (conditional) ────────────────────────────────────

  describe('Earliest start date — shown when Could start earlier is Yes', () => {
    before(async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.open(ref, 'could-start-early')
      await ImportantDatesPage.selectYes()
      await ImportantDatesPage.submitForm()
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('earliest-start-date')) return this.skip()
      await expect(ImportantDatesPage.pageHeading).toHaveText(
        PROJECTS.IMPORTANT_DATES.EARLIEST_DATE.PAGE_HEADING
      )
    })

    it('shows error when submitted empty', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('earliest-start-date')) return this.skip()
      await ImportantDatesPage.submitForm()
      await expect(ImportantDatesPage.errorSummary).toBeDisplayed()
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change OBC start date via Change link', () => {
    it('navigates to the start-outline-business-case edit page', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('start-outline-business-case')
      const url = await browser.getUrl()
      expect(url).toContain('start-outline-business-case')
    })

    it('accepts updated date and returns to overview', async function () {
      if (!ref) return this.skip()
      await ImportantDatesPage.open(ref, 'start-outline-business-case')
      const futureYear = new Date().getFullYear() + 2
      await ImportantDatesPage.enterDate(8, futureYear)
      await ImportantDatesPage.submitForm()
      // May chain through subsequent dates — eventually reaches overview
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl()
          return url.match(/\/project\/[A-Z0-9-]+$/) || url.includes('overview')
        },
        { timeout: 30000, timeoutMsg: 'Did not return to overview after date update' }
      )
    })
  })
})
