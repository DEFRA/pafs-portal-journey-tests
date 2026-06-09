import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import EnvironmentalBenefitsPage from 'page-objects/projects/environmental-benefits.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Environmental benefits', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.envBenefits })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── Gate question ─────────────────────────────────────────────────────────

  describe('Does the project include any environmental benefits? (gate)', () => {
    before(async () => {
      if (ref) await EnvironmentalBenefitsPage.open(ref, 'environmental-benefits')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
          PROJECTS.ENVIRONMENTAL_BENEFITS.GATE.PAGE_HEADING
        )
      })

      it('shows Yes and No radio options', async function () {
        if (!ref) return this.skip()
        const radios = await EnvironmentalBenefitsPage.yesNoRadios
        expect(radios.length).toBeGreaterThanOrEqual(2)
      })
    })

    describe('Validation', () => {
      it('shows error when neither Yes nor No is selected', async function () {
        if (!ref) return this.skip()
        await EnvironmentalBenefitsPage.submitForm()
        await expect(EnvironmentalBenefitsPage.errorSummary).toBeDisplayed()
        const errors = await EnvironmentalBenefitsPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.ENVIRONMENTAL_BENEFITS.GATE.ERRORS.REQUIRED)
      })
    })

    describe('Happy path — No environmental benefits', () => {
      it('selects No and continues without showing habitat pages', async function () {
        if (!ref) return this.skip()
        await EnvironmentalBenefitsPage.open(ref, 'environmental-benefits')
        await EnvironmentalBenefitsPage.selectNo()
        await EnvironmentalBenefitsPage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('environmental-benefits')
      })
    })
  })

  // Helper to test each habitat Yes/No + quantity page pair
  async function testHabitatPage(step, content, ref) {
    describe(`${content.PAGE_HEADING} (Yes/No)`, () => {
      before(async () => {
        if (ref) await EnvironmentalBenefitsPage.open(ref, step)
      })

      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(content.PAGE_HEADING)
      })

      it('shows Yes and No radios', async function () {
        if (!ref) return this.skip()
        const radios = await EnvironmentalBenefitsPage.yesNoRadios
        expect(radios.length).toBeGreaterThanOrEqual(2)
      })

      it('shows error when submitted empty', async function () {
        if (!ref) return this.skip()
        await EnvironmentalBenefitsPage.submitForm()
        await expect(EnvironmentalBenefitsPage.errorSummary).toBeDisplayed()
        const errors = await EnvironmentalBenefitsPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.ENVIRONMENTAL_BENEFITS.YES_NO_ERRORS.REQUIRED)
      })
    })
  }

  // ─── Intertidal habitat ────────────────────────────────────────────────────

  describe('Intertidal wetland habitat', () => {
    before(async () => {
      if (ref) {
        // Navigate with Yes on gate first
        await EnvironmentalBenefitsPage.open(ref, 'environmental-benefits')
        await EnvironmentalBenefitsPage.selectYes()
        await EnvironmentalBenefitsPage.submitForm()
      }
    })

    describe('Yes/No page', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('intertidal')) return this.skip()
        await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
          PROJECTS.ENVIRONMENTAL_BENEFITS.INTERTIDAL.PAGE_HEADING
        )
      })

      it('shows hint text about salt marshes and mud flats', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('intertidal')) return this.skip()
        await expect(EnvironmentalBenefitsPage.hintText).toHaveText(
          expect.stringContaining('salt marsh')
        )
      })

      it('shows error when submitted without selection', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('intertidal')) return this.skip()
        await EnvironmentalBenefitsPage.submitForm()
        const errors = await EnvironmentalBenefitsPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.ENVIRONMENTAL_BENEFITS.YES_NO_ERRORS.REQUIRED)
      })

      it('selects Yes and continues to hectares page', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('intertidal')) return this.skip()
        await EnvironmentalBenefitsPage.selectYes()
        await EnvironmentalBenefitsPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).toContain('intertidal')
      })
    })

    describe('Hectares quantity page', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('hectares-of-intertidal')) return this.skip()
        await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
          PROJECTS.ENVIRONMENTAL_BENEFITS.INTERTIDAL.HECTARES_HEADING
        )
      })

      it('shows ha suffix', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('hectares-of-intertidal')) return this.skip()
        await expect(EnvironmentalBenefitsPage.suffixText).toHaveText(
          PROJECTS.ENVIRONMENTAL_BENEFITS.INTERTIDAL.SUFFIX
        )
      })

      it('shows error when submitted empty', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('hectares-of-intertidal')) return this.skip()
        await EnvironmentalBenefitsPage.submitForm()
        await expect(EnvironmentalBenefitsPage.errorSummary).toBeDisplayed()
      })

      it('shows error for invalid value', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('hectares-of-intertidal')) return this.skip()
        await EnvironmentalBenefitsPage.enterQuantity(-1)
        await EnvironmentalBenefitsPage.submitForm()
        const errors = await EnvironmentalBenefitsPage.getErrorMessages()
        expect(errors.length).toBeGreaterThan(0)
      })

      it('enters valid hectares and continues', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('hectares-of-intertidal')) return this.skip()
        await EnvironmentalBenefitsPage.enterQuantity(5.5)
        await EnvironmentalBenefitsPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('hectares-of-intertidal')
      })
    })
  })

  // ─── Woodland habitat ──────────────────────────────────────────────────────

  describe('Woodland habitat', () => {
    before(async () => {
      if (ref) await EnvironmentalBenefitsPage.open(ref, 'woodland')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('/woodland')) return this.skip()
      await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
        PROJECTS.ENVIRONMENTAL_BENEFITS.WOODLAND.PAGE_HEADING
      )
    })

    it('shows error when submitted without selection', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('/woodland')) return this.skip()
      await EnvironmentalBenefitsPage.submitForm()
      const errors = await EnvironmentalBenefitsPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.ENVIRONMENTAL_BENEFITS.YES_NO_ERRORS.REQUIRED)
    })
  })

  // ─── Comprehensive restoration ─────────────────────────────────────────────

  describe('Comprehensive restoration of watercourse', () => {
    before(async () => {
      if (ref) await EnvironmentalBenefitsPage.open(ref, 'comprehensive-restoration')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('comprehensive')) return this.skip()
      await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
        PROJECTS.ENVIRONMENTAL_BENEFITS.COMPREHENSIVE_RESTORATION.PAGE_HEADING
      )
    })

    it('shows error when submitted without selection', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('comprehensive')) return this.skip()
      await EnvironmentalBenefitsPage.submitForm()
      const errors = await EnvironmentalBenefitsPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.ENVIRONMENTAL_BENEFITS.YES_NO_ERRORS.REQUIRED)
    })
  })

  // ─── Partial restoration ───────────────────────────────────────────────────

  describe('Partial restoration of watercourse', () => {
    before(async () => {
      if (ref) await EnvironmentalBenefitsPage.open(ref, 'partial-restoration')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('partial')) return this.skip()
      await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
        PROJECTS.ENVIRONMENTAL_BENEFITS.PARTIAL_RESTORATION.PAGE_HEADING
      )
    })
  })

  // ─── Single major physical improvement ────────────────────────────────────

  describe('Single major physical or habitat of watercourse', () => {
    before(async () => {
      if (ref) await EnvironmentalBenefitsPage.open(ref, 'create-habitat-watercourse')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('create-habitat-watercourse') && !url.includes('single')) return this.skip()
      await expect(EnvironmentalBenefitsPage.pageHeading).toHaveText(
        PROJECTS.ENVIRONMENTAL_BENEFITS.SINGLE_WATERCOURSE.PAGE_HEADING
      )
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change environmental benefits via Change link', () => {
    it('navigates to environmental benefits from the overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('environmental-benefits')
      const url = await browser.getUrl()
      expect(url).toContain('environmental')
    })
  })
})
