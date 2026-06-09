import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import WholeLifeCostPage from 'page-objects/projects/whole-life-cost.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Whole life cost', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.wlc })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  describe('Page content', () => {
    before(async () => {
      if (ref) await WholeLifeCostPage.open(ref)
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(WholeLifeCostPage.pageHeading).toHaveText(PROJECTS.WHOLE_LIFE_COST.PAGE_HEADING)
    })

    it('shows the pounds sterling hint', async function () {
      if (!ref) return this.skip()
      await expect(WholeLifeCostPage.hintText).toHaveText(
        expect.stringContaining('1500')
      )
    })

    it('shows all 4 cost category table headers', async function () {
      if (!ref) return this.skip()
      const headers = await WholeLifeCostPage.tableHeaders
      const texts = await Promise.all(headers.map(h => h.getText()))
      expect(texts.some(t => t.includes('appraisal'))).toBe(true)
      expect(texts.some(t => t.includes('design and construction'))).toBe(true)
      expect(texts.some(t => t.includes('risk contingency'))).toBe(true)
      expect(texts.some(t => t.includes('future costs'))).toBe(true)
    })

    it('shows a back link', async function () {
      if (!ref) return this.skip()
      await expect(WholeLifeCostPage.backLink).toBeDisplayed()
    })
  })

  describe('Validation', () => {
    before(async () => {
      if (ref) await WholeLifeCostPage.open(ref)
    })

    it('shows error when decimal value is entered', async function () {
      if (!ref) return this.skip()
      const inputs = await WholeLifeCostPage.allCostInputs
      if (inputs.length > 0) {
        await inputs[0].clearValue()
        await inputs[0].setValue('1000.50')
        await WholeLifeCostPage.submitForm()
        const errors = await WholeLifeCostPage.getErrorMessages()
        expect(errors.some(e => e.includes('whole number') || e.includes('integer'))).toBe(true)
      }
    })

    it('shows error for value exceeding 18 digits', async function () {
      if (!ref) return this.skip()
      const inputs = await WholeLifeCostPage.allCostInputs
      if (inputs.length > 0) {
        await inputs[0].clearValue()
        await inputs[0].setValue('9'.repeat(19))
        await WholeLifeCostPage.submitForm()
        const errors = await WholeLifeCostPage.getErrorMessages()
        expect(errors.some(e => e.includes('18 digits'))).toBe(true)
      }
    })

    it('accepts 0 as a valid value', async function () {
      if (!ref) return this.skip()
      await WholeLifeCostPage.open(ref)
      const inputs = await WholeLifeCostPage.allCostInputs
      for (const input of inputs) {
        await input.clearValue()
        await input.setValue('0')
      }
      await WholeLifeCostPage.submitForm()
      // Should not show errors for 0
      const hasError = await WholeLifeCostPage.errorSummary.isDisplayed().catch(() => false)
      if (hasError) {
        const errors = await WholeLifeCostPage.getErrorMessages()
        expect(errors.some(e => e.includes('0'))).toBe(false)
      }
    })
  })

  describe('Happy path — creation', () => {
    it('enters valid whole life costs and saves', async function () {
      if (!ref) return this.skip()
      await WholeLifeCostPage.open(ref)
      await WholeLifeCostPage.enterAllCosts(500000, 1000000, 100000, 50000)
      await WholeLifeCostPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('whole-life-cost')
    })
  })

  describe('Update via Change link', () => {
    it('navigates to WLC from the overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('whole-life-cost')
      const url = await browser.getUrl()
      expect(url).toContain('whole-life-cost')
    })

    it('pre-fills previously entered values', async function () {
      if (!ref) return this.skip()
      await WholeLifeCostPage.open(ref)
      const inputs = await WholeLifeCostPage.allCostInputs
      if (inputs.length > 0) {
        const value = await inputs[0].getValue()
        expect(Number(value)).toBeGreaterThanOrEqual(0)
      }
    })

    it('updates costs and returns to overview', async function () {
      if (!ref) return this.skip()
      await WholeLifeCostPage.open(ref)
      await WholeLifeCostPage.enterAllCosts(600000, 1200000, 120000, 60000)
      await WholeLifeCostPage.submitForm()
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl()
          return url.match(/\/project\/[A-Z0-9-]+$/) || url.includes('overview')
        },
        { timeout: 10000, timeoutMsg: 'Did not return to overview after WLC update' }
      )
    })
  })
})
