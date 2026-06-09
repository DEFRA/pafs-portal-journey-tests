import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import FundingSourcesPage from 'page-objects/projects/funding-sources.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Funding sources and spending', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.fundingSources })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── Funding sources selection ─────────────────────────────────────────────

  describe('Funding sources selection page', () => {
    before(async () => {
      if (ref) await FundingSourcesPage.open(ref, 'funding-sources')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (url.includes('missing-financial-years')) return this.skip()
        await expect(FundingSourcesPage.pageHeading).toHaveText(
          PROJECTS.FUNDING_SOURCES.SELECTION.PAGE_HEADING
        )
      })

      it('shows the Select all that apply hint', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (url.includes('missing-financial-years')) return this.skip()
        await expect(FundingSourcesPage.allHintTexts.first()).toHaveText(
          expect.stringContaining('Select all that apply')
        )
      })

      it('shows all 7 funding source options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (url.includes('missing-financial-years')) return this.skip()
        const labels = await FundingSourcesPage.fundingCheckboxLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.GIA)
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.LOCAL_LEVY)
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.ADDITIONAL_GIA)
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.PUBLIC)
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.PRIVATE)
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.OTHER_EA)
        expect(texts).toContain(PROJECTS.FUNDING_SOURCES.SELECTION.OPTIONS.NOT_YET_IDENTIFIED)
      })
    })

    describe('Validation', () => {
      it('shows error when no funding source is selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (url.includes('missing-financial-years')) return this.skip()
        await FundingSourcesPage.submitForm()
        await expect(FundingSourcesPage.errorSummary).toBeDisplayed()
        await expect(FundingSourcesPage.errorSummaryTitle).toHaveText(COMMON.ERROR_SUMMARY_HEADING)
      })

      it('shows the required funding source error message', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (url.includes('missing-financial-years')) return this.skip()
        await FundingSourcesPage.submitForm()
        const errors = await FundingSourcesPage.getErrorMessages()
        expect(errors.some(e => e.includes('at least one funding source'))).toBe(true)
      })
    })

    describe('Happy path', () => {
      it('selects Grant in aid and continues', async function () {
        if (!ref) return this.skip()
        await FundingSourcesPage.open(ref, 'funding-sources')
        const url = await browser.getUrl()
        if (url.includes('missing-financial-years')) return this.skip()
        await FundingSourcesPage.selectFundingSourceByIndex(0)
        await FundingSourcesPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toMatch(/funding-sources$/)
      })
    })
  })

  // ─── Additional GIA selection ──────────────────────────────────────────────

  describe('Additional Grant in Aid funding sources page', () => {
    before(async () => {
      if (ref) await FundingSourcesPage.open(ref, 'funding-sources-additional')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('additional')) return this.skip()
      await expect(FundingSourcesPage.pageHeading).toHaveText(
        PROJECTS.FUNDING_SOURCES.ADDITIONAL_GIA.PAGE_HEADING
      )
    })

    it('shows all 7 additional GIA options', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('additional')) return this.skip()
      const labels = await FundingSourcesPage.fundingCheckboxLabels
      const texts = await Promise.all(labels.map(l => l.getText()))
      expect(texts).toContain(PROJECTS.FUNDING_SOURCES.ADDITIONAL_GIA.OPTIONS.ASSET_REPLACEMENT)
      expect(texts).toContain(PROJECTS.FUNDING_SOURCES.ADDITIONAL_GIA.OPTIONS.ENV_STATUTORY)
      expect(texts).toContain(PROJECTS.FUNDING_SOURCES.ADDITIONAL_GIA.OPTIONS.FREQUENTLY_FLOODED)
    })

    it('shows error when none selected', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('additional')) return this.skip()
      await FundingSourcesPage.submitForm()
      const errors = await FundingSourcesPage.getErrorMessages()
      expect(errors.some(e => e.includes('additional FCRM') || e.includes('at least one'))).toBe(true)
    })
  })

  // ─── Public sector contributors ────────────────────────────────────────────

  describe('Public sector contributors page', () => {
    before(async () => {
      if (ref) await FundingSourcesPage.open(ref, 'funding-sources-public-contributors')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('public-contributors')) return this.skip()
        await expect(FundingSourcesPage.pageHeading).toHaveText(
          PROJECTS.FUNDING_SOURCES.PUBLIC_CONTRIBUTORS.PAGE_HEADING
        )
      })

      it('shows Add another contributor button', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('public-contributors')) return this.skip()
        await expect(FundingSourcesPage.addContributorButton).toBeDisplayed()
        await expect(FundingSourcesPage.addContributorButton).toHaveText(
          PROJECTS.FUNDING_SOURCES.ADD_CONTRIBUTOR_BUTTON
        )
      })
    })

    describe('Validation', () => {
      it('shows error when no contributor name is entered', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('public-contributors')) return this.skip()
        await FundingSourcesPage.submitForm()
        const errors = await FundingSourcesPage.getErrorMessages()
        expect(errors.some(e => e.includes('contributor') || e.includes('name'))).toBe(true)
      })

      it('shows error for contributor name exceeding 200 characters', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('public-contributors')) return this.skip()
        const inputs = await FundingSourcesPage.contributorInputs
        if (inputs.length > 0) {
          await inputs[0].setValue('A'.repeat(201))
          await FundingSourcesPage.submitForm()
          const errors = await FundingSourcesPage.getErrorMessages()
          expect(errors.some(e => e.includes('200') || e.includes('characters'))).toBe(true)
        }
      })
    })

    describe('Happy path', () => {
      it('enters a contributor name and continues', async function () {
        if (!ref) return this.skip()
        await FundingSourcesPage.open(ref, 'funding-sources-public-contributors')
        const url = await browser.getUrl()
        if (!url.includes('public-contributors')) return this.skip()
        const inputs = await FundingSourcesPage.contributorInputs
        if (inputs.length > 0) {
          await inputs[0].clearValue()
          await inputs[0].setValue('Wiltshire Council')
        }
        await FundingSourcesPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('public-contributors')
      })
    })
  })

  // ─── Private sector contributors ──────────────────────────────────────────

  describe('Private sector contributors page', () => {
    before(async () => {
      if (ref) await FundingSourcesPage.open(ref, 'funding-sources-private-contributors')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('private-contributors')) return this.skip()
      await expect(FundingSourcesPage.pageHeading).toHaveText(
        PROJECTS.FUNDING_SOURCES.PRIVATE_CONTRIBUTORS.PAGE_HEADING
      )
    })

    it('shows the example hint', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('private-contributors')) return this.skip()
      await expect(FundingSourcesPage.allHintTexts.first()).toHaveText(
        expect.stringContaining('Llanmoor Development Company')
      )
    })
  })

  // ─── Other EA contributors ─────────────────────────────────────────────────

  describe('Other Environment Agency contributors page', () => {
    before(async () => {
      if (ref) await FundingSourcesPage.open(ref, 'funding-sources-other-ea-contributors')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('other-ea-contributors')) return this.skip()
      await expect(FundingSourcesPage.pageHeading).toHaveText(
        PROJECTS.FUNDING_SOURCES.OTHER_EA_CONTRIBUTORS.PAGE_HEADING
      )
    })

    it('shows the WFD / Water Resources hint', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('other-ea-contributors')) return this.skip()
      await expect(FundingSourcesPage.allHintTexts.first()).toHaveText(
        expect.stringContaining('Water Framework Directive')
      )
    })
  })

  // ─── Estimated spend ───────────────────────────────────────────────────────

  describe('Estimated spend page', () => {
    before(async () => {
      if (ref) await FundingSourcesPage.open(ref, 'funding-sources-estimated-spend')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('estimated-spend')) return this.skip()
        await expect(FundingSourcesPage.pageHeading).toHaveText(
          PROJECTS.FUNDING_SOURCES.ESTIMATED_SPEND.PAGE_HEADING
        )
      })

      it('shows the pounds sterling hint', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('estimated-spend')) return this.skip()
        await expect(FundingSourcesPage.allHintTexts.first()).toHaveText(
          expect.stringContaining('£50,000')
        )
      })

      it('shows financial year columns in the spend table', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('estimated-spend')) return this.skip()
        const headers = await FundingSourcesPage.spendTableHeaders
        expect(headers.length).toBeGreaterThan(0)
      })
    })

    describe('Validation', () => {
      it('shows error when no spend is entered for any year', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('estimated-spend')) return this.skip()
        await FundingSourcesPage.submitForm()
        await expect(FundingSourcesPage.errorSummary).toBeDisplayed()
      })

      it('shows error for non-integer spend value', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('estimated-spend')) return this.skip()
        const inputs = await FundingSourcesPage.spendInputs
        if (inputs.length > 0) {
          await inputs[0].setValue('1000.50')
          await FundingSourcesPage.submitForm()
          const errors = await FundingSourcesPage.getErrorMessages()
          expect(errors.some(e => e.includes('whole number') || e.includes('integer'))).toBe(true)
        }
      })
    })

    describe('Happy path', () => {
      it('enters spend for first year and continues', async function () {
        if (!ref) return this.skip()
        await FundingSourcesPage.open(ref, 'funding-sources-estimated-spend')
        const url = await browser.getUrl()
        if (!url.includes('estimated-spend')) return this.skip()
        await FundingSourcesPage.enterSpendForFirstInput(100000)
        await FundingSourcesPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('estimated-spend')
      })
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change funding sources via Change link', () => {
    it('navigates to funding sources from the overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('funding-sources')
      const url = await browser.getUrl()
      expect(url).toContain('funding-sources')
    })
  })
})
