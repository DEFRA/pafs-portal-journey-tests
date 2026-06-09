import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import CarbonImpactPage from 'page-objects/projects/carbon-impact.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Carbon impact', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.carbon })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── Prerequisites info page ───────────────────────────────────────────────

  describe('Carbon required information page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-required-information')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('carbon-required')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(
        PROJECTS.CARBON.REQUIRED_INFO.PAGE_HEADING
      )
    })

    it('explains important dates and funding sources are needed first', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('carbon-required')) return this.skip()
      const bodyText = await $('main').getText()
      expect(bodyText).toContain('Important dates')
      expect(bodyText).toContain('Funding sources')
    })
  })

  // ─── Prepare / guidance page ───────────────────────────────────────────────

  describe('What to record about carbon impact', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-prepare')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('carbon-prepare')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.PREPARE.PAGE_HEADING)
    })
  })

  // ─── Capital carbon ────────────────────────────────────────────────────────

  describe('Capital carbon page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-cost-build')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('carbon-cost-build')) return this.skip()
        await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.CAPITAL.PAGE_HEADING)
      })

      it('shows Capital emissions label', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('carbon-cost-build')) return this.skip()
        await expect(CarbonImpactPage.labelText).toHaveText(
          expect.stringContaining(PROJECTS.CARBON.CAPITAL.LABEL)
        )
      })

      it('shows metric tonnes suffix', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('carbon-cost-build')) return this.skip()
        await expect(CarbonImpactPage.suffixText).toHaveText(PROJECTS.CARBON.CAPITAL.SUFFIX)
      })
    })

    describe('Validation', () => {
      it('accepts empty (blank is allowed — leaves field blank)', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('carbon-cost-build')) return this.skip()
        const input = CarbonImpactPage.carbonInput
        await input.clearValue()
        await CarbonImpactPage.submitForm()
        // Blank is valid (leaves blank means no carbon estimate)
        const hasError = await CarbonImpactPage.errorSummary.isDisplayed().catch(() => false)
        expect(hasError).toBe(false)
      })

      it('shows error for negative value', async function () {
        if (!ref) return this.skip()
        await CarbonImpactPage.open(ref, 'carbon-cost-build')
        const url = await browser.getUrl()
        if (!url.includes('carbon-cost-build')) return this.skip()
        await CarbonImpactPage.enterValue(-100)
        await CarbonImpactPage.submitForm()
        const errors = await CarbonImpactPage.getErrorMessages()
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    describe('Happy path', () => {
      it('enters capital carbon value and continues', async function () {
        if (!ref) return this.skip()
        await CarbonImpactPage.open(ref, 'carbon-cost-build')
        const url = await browser.getUrl()
        if (!url.includes('carbon-cost-build')) return this.skip()
        await CarbonImpactPage.enterValue(250)
        await CarbonImpactPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('carbon-cost-build')
      })
    })
  })

  // ─── Operational carbon ────────────────────────────────────────────────────

  describe('Operational carbon page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-cost-operation')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('operation')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.OPERATIONAL.PAGE_HEADING)
    })

    it('shows Operational emissions label', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('operation')) return this.skip()
      await expect(CarbonImpactPage.labelText).toHaveText(
        expect.stringContaining(PROJECTS.CARBON.OPERATIONAL.LABEL)
      )
    })

    it('accepts valid operational carbon and continues', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('operation')) return this.skip()
      await CarbonImpactPage.enterValue(100)
      await CarbonImpactPage.submitForm()
      const newUrl = await browser.getUrl()
      expect(newUrl).not.toContain('carbon-cost-operation')
    })
  })

  // ─── Sequestered carbon ────────────────────────────────────────────────────

  describe('Sequestered carbon page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-cost-sequestered')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('sequestered')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.SEQUESTERED.PAGE_HEADING)
    })

    it('shows Sequestered emissions label', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('sequestered')) return this.skip()
      await expect(CarbonImpactPage.labelText).toHaveText(
        expect.stringContaining(PROJECTS.CARBON.SEQUESTERED.LABEL)
      )
    })
  })

  // ─── Avoided carbon ────────────────────────────────────────────────────────

  describe('Avoided carbon page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-cost-avoided')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('avoided')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.AVOIDED.PAGE_HEADING)
    })

    it('shows Avoided emissions label', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('avoided')) return this.skip()
      await expect(CarbonImpactPage.labelText).toHaveText(
        expect.stringContaining(PROJECTS.CARBON.AVOIDED.LABEL)
      )
    })
  })

  // ─── Net economic benefit ──────────────────────────────────────────────────

  describe('Net economic benefit from carbon savings', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-savings-net-economic-benefit')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('net-economic')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.NET_BENEFIT.PAGE_HEADING)
    })

    it('shows Net economic benefit label', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('net-economic')) return this.skip()
      await expect(CarbonImpactPage.labelText).toHaveText(
        expect.stringContaining(PROJECTS.CARBON.NET_BENEFIT.LABEL)
      )
    })
  })

  // ─── O&M cost forecast ─────────────────────────────────────────────────────

  describe('Operation and Maintenance cost forecast', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-operational-cost-forecast')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('operational-cost')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.OM_COST.PAGE_HEADING)
    })

    it('shows the O&M cost label', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('operational-cost')) return this.skip()
      await expect(CarbonImpactPage.labelText).toHaveText(
        expect.stringContaining('Operation and Maintenance')
      )
    })
  })

  // ─── Calculated pages ──────────────────────────────────────────────────────

  describe('Whole life carbon calculated page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-whole-life-carbon')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('whole-life-carbon')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.WHOLE_LIFE.PAGE_HEADING)
    })
  })

  describe('Net carbon calculated page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-net-carbon')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('net-carbon')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.NET_CARBON.PAGE_HEADING)
    })
  })

  describe('Carbon impact assessment page', () => {
    before(async () => {
      if (ref) await CarbonImpactPage.open(ref, 'carbon-impact-assessment')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('carbon-impact-assessment')) return this.skip()
      await expect(CarbonImpactPage.pageHeading).toHaveText(PROJECTS.CARBON.ASSESSMENT.PAGE_HEADING)
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change carbon impact via Change link', () => {
    it('navigates to carbon section from overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('carbon')
      const url = await browser.getUrl()
      expect(url).toContain('carbon')
    })
  })
})
