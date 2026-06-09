import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import WholeLifeBenefitsPage from 'page-objects/projects/whole-life-benefits.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Whole life benefits', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.wlb })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  describe('Page content', () => {
    before(async () => {
      if (ref) await WholeLifeBenefitsPage.open(ref)
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(WholeLifeBenefitsPage.pageHeading).toHaveText(PROJECTS.WHOLE_LIFE_BENEFITS.PAGE_HEADING)
    })

    it('shows the pounds sterling hint', async function () {
      if (!ref) return this.skip()
      await expect(WholeLifeBenefitsPage.hintText).toHaveText(
        expect.stringContaining('1500')
      )
    })

    it('shows 5 benefit category fields', async function () {
      if (!ref) return this.skip()
      const headers = await WholeLifeBenefitsPage.tableHeaders
      const texts = await Promise.all(headers.map(h => h.getText()))
      expect(texts.some(t => t.includes('whole life present value benefits'))).toBe(true)
      expect(texts.some(t => t.includes('property damages avoided'))).toBe(true)
      expect(texts.some(t => t.includes('environmental benefits'))).toBe(true)
      expect(texts.some(t => t.includes('recreation and tourism'))).toBe(true)
      expect(texts.some(t => t.includes('land value uplift'))).toBe(true)
    })
  })

  describe('Validation', () => {
    before(async () => {
      if (ref) await WholeLifeBenefitsPage.open(ref)
    })

    it('shows error when decimal value entered for whole life benefit', async function () {
      if (!ref) return this.skip()
      const inputs = await WholeLifeBenefitsPage.allBenefitInputs
      if (inputs.length > 0) {
        await inputs[0].clearValue()
        await inputs[0].setValue('500.75')
        await WholeLifeBenefitsPage.submitForm()
        const errors = await WholeLifeBenefitsPage.getErrorMessages()
        expect(errors.some(e => e.includes('whole number') || e.includes('integer'))).toBe(true)
      }
    })

    it('shows error for value exceeding 18 digits', async function () {
      if (!ref) return this.skip()
      const inputs = await WholeLifeBenefitsPage.allBenefitInputs
      if (inputs.length > 0) {
        await inputs[0].clearValue()
        await inputs[0].setValue('9'.repeat(19))
        await WholeLifeBenefitsPage.submitForm()
        const errors = await WholeLifeBenefitsPage.getErrorMessages()
        expect(errors.some(e => e.includes('18 digits'))).toBe(true)
      }
    })

    it('allows optional fields to be left blank', async function () {
      if (!ref) return this.skip()
      await WholeLifeBenefitsPage.open(ref)
      // Only fill the mandatory whole life benefit field
      await WholeLifeBenefitsPage.enterWholeLifeBenefit(2000000)
      await WholeLifeBenefitsPage.submitForm()
      // Should not show error for blank optional fields
      const hasError = await WholeLifeBenefitsPage.errorSummary.isDisplayed().catch(() => false)
      expect(hasError).toBe(false)
    })
  })

  describe('Happy path — creation', () => {
    it('enters valid whole life benefits and saves', async function () {
      if (!ref) return this.skip()
      await WholeLifeBenefitsPage.open(ref)
      await WholeLifeBenefitsPage.enterAllBenefits([2000000, 500000, null, null, null])
      await WholeLifeBenefitsPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('whole-life-benefits')
    })
  })

  describe('Update via Change link', () => {
    it('navigates to WLB from overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('whole-life-benefits')
      const url = await browser.getUrl()
      expect(url).toContain('whole-life-benefits')
    })

    it('updates benefits and returns to overview', async function () {
      if (!ref) return this.skip()
      await WholeLifeBenefitsPage.open(ref)
      await WholeLifeBenefitsPage.enterAllBenefits([3000000, 600000, null, null, null])
      await WholeLifeBenefitsPage.submitForm()
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl()
          return url.match(/\/project\/[A-Z0-9-]+$/) || url.includes('overview')
        },
        { timeout: 10000, timeoutMsg: 'Did not return to overview after WLB update' }
      )
    })
  })
})
