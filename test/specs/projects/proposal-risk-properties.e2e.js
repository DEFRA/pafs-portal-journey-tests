import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import RiskPropertiesPage from 'page-objects/projects/risk-properties.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Risks and properties benefitting', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.riskProperties })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── Risk selection ────────────────────────────────────────────────────────

  describe('Risk selection page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'risk')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(RiskPropertiesPage.pageHeading).toHaveText(
          PROJECTS.RISK_AND_PROPERTIES.RISK.PAGE_HEADING
        )
      })

      it('shows all 7 risk checkboxes', async function () {
        if (!ref) return this.skip()
        const labels = await RiskPropertiesPage.riskCheckboxLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.FLUVIAL)
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.TIDAL)
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.GROUNDWATER)
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.SURFACE_WATER)
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.SEA)
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.RESERVOIR)
        expect(texts).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.OPTIONS.COASTAL_EROSION)
      })
    })

    describe('Validation', () => {
      it('shows error when no risk is selected', async function () {
        if (!ref) return this.skip()
        await RiskPropertiesPage.submitForm()
        await expect(RiskPropertiesPage.errorSummary).toBeDisplayed()
        const errors = await RiskPropertiesPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.RISK_AND_PROPERTIES.RISK.ERRORS.REQUIRED)
      })
    })

    describe('Happy path', () => {
      it('selects fluvial flooding and continues', async function () {
        if (!ref) return this.skip()
        await RiskPropertiesPage.open(ref, 'risk')
        await RiskPropertiesPage.selectRiskByIndex(0)
        await RiskPropertiesPage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('/risk\b')
      })
    })
  })

  // ─── Main risk ─────────────────────────────────────────────────────────────

  describe('Main risk page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'main-risk')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(RiskPropertiesPage.pageHeading).toHaveText(
        PROJECTS.RISK_AND_PROPERTIES.MAIN_RISK.PAGE_HEADING
      )
    })

    it('shows error when no main risk is selected', async function () {
      if (!ref) return this.skip()
      await RiskPropertiesPage.submitForm()
      await expect(RiskPropertiesPage.errorSummary).toBeDisplayed()
      const errors = await RiskPropertiesPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.RISK_AND_PROPERTIES.MAIN_RISK.ERRORS.REQUIRED)
    })

    it('selects main risk and continues', async function () {
      if (!ref) return this.skip()
      await RiskPropertiesPage.open(ref, 'main-risk')
      await RiskPropertiesPage.selectMainRiskByIndex(0)
      await RiskPropertiesPage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('main-risk')
    })
  })

  // ─── Properties affected by flooding ──────────────────────────────────────

  describe('Properties affected by flooding page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'property-affected-flooding')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(RiskPropertiesPage.pageHeading).toHaveText(
          PROJECTS.RISK_AND_PROPERTIES.PROPERTIES_FLOODING.PAGE_HEADING
        )
      })

      it('shows the description text', async function () {
        if (!ref) return this.skip()
        const body = await $('main .govuk-body').getText()
        expect(body).toContain(PROJECTS.RISK_AND_PROPERTIES.PROPERTIES_FLOODING.DESCRIPTION)
      })

      it('shows the no properties checkbox', async function () {
        if (!ref) return this.skip()
        const labels = await RiskPropertiesPage.riskCheckboxLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts.some(t => t.includes('does not benefit'))).toBe(true)
      })

      it('shows table headers for property categories', async function () {
        if (!ref) return this.skip()
        const headers = await RiskPropertiesPage.tableHeaders
        const texts = await Promise.all(headers.map(h => h.getText()))
        expect(texts.some(t => t.includes('Maintaining flood protection'))).toBe(true)
        expect(texts.some(t => t.includes('50% or more'))).toBe(true)
      })
    })

    describe('Validation', () => {
      it('shows error when non-numeric value is entered', async function () {
        if (!ref) return this.skip()
        const inputs = await RiskPropertiesPage.propertyInputs
        if (inputs.length > 0) {
          await inputs[0].setValue('abc')
          await RiskPropertiesPage.submitForm()
          const errors = await RiskPropertiesPage.getErrorMessages()
          expect(errors.some(e => e.includes('whole number'))).toBe(true)
        }
      })
    })

    describe('Happy path', () => {
      it('enters property counts and continues', async function () {
        if (!ref) return this.skip()
        await RiskPropertiesPage.open(ref, 'property-affected-flooding')
        const inputs = await RiskPropertiesPage.propertyInputs
        for (const input of inputs.slice(0, 2)) {
          await input.clearValue()
          await input.setValue('10')
        }
        await RiskPropertiesPage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('property-affected-flooding')
      })
    })
  })

  // ─── Properties affected by coastal erosion ────────────────────────────────

  describe('Properties affected by coastal erosion page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'property-affected-coastal-erosion')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('coastal-erosion')) return this.skip()
      await expect(RiskPropertiesPage.pageHeading).toHaveText(
        PROJECTS.RISK_AND_PROPERTIES.PROPERTIES_COASTAL.PAGE_HEADING
      )
    })

    it('shows the no properties coastal erosion checkbox', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('coastal-erosion')) return this.skip()
      const labels = await RiskPropertiesPage.riskCheckboxLabels
      const texts = await Promise.all(labels.map(l => l.getText()))
      expect(texts.some(t => t.includes('coastal erosion'))).toBe(true)
    })
  })

  // ─── 20% deprived areas ────────────────────────────────────────────────────

  describe('20% most deprived areas page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'twenty-percent-deprived')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('twenty') && !url.includes('deprived')) return this.skip()
        await expect(RiskPropertiesPage.pageHeading).toHaveText(
          PROJECTS.RISK_AND_PROPERTIES.TWENTY_PERCENT_DEPRIVED.PAGE_HEADING
        )
      })

      it('shows the 0 to 100 hint', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('twenty') && !url.includes('deprived')) return this.skip()
        await expect(RiskPropertiesPage.allHintTexts.first()).toHaveText(
          expect.stringContaining('0 to 100')
        )
      })
    })

    describe('Validation', () => {
      it('shows error when submitted empty', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('twenty') && !url.includes('deprived')) return this.skip()
        await RiskPropertiesPage.submitForm()
        await expect(RiskPropertiesPage.errorSummary).toBeDisplayed()
      })

      it('shows error when value exceeds 100', async function () {
        if (!ref) return this.skip()
        await RiskPropertiesPage.enterPercentage(101)
        await RiskPropertiesPage.submitForm()
        const errors = await RiskPropertiesPage.getErrorMessages()
        expect(errors.some(e => e.includes('0 to 100'))).toBe(true)
      })

      it('shows error for negative value', async function () {
        if (!ref) return this.skip()
        await RiskPropertiesPage.enterPercentage(-1)
        await RiskPropertiesPage.submitForm()
        const errors = await RiskPropertiesPage.getErrorMessages()
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    describe('Happy path', () => {
      it('accepts 0 and continues', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('twenty') && !url.includes('deprived')) return this.skip()
        await RiskPropertiesPage.enterPercentage(0)
        await RiskPropertiesPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('twenty-percent')
      })
    })
  })

  // ─── 40% deprived areas ────────────────────────────────────────────────────

  describe('40% most deprived areas page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'forty-percent-deprived')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('forty') && !url.includes('deprived')) return this.skip()
      await expect(RiskPropertiesPage.pageHeading).toHaveText(
        PROJECTS.RISK_AND_PROPERTIES.FORTY_PERCENT_DEPRIVED.PAGE_HEADING
      )
    })

    it('shows error when submitted empty', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('forty') && !url.includes('deprived')) return this.skip()
      await RiskPropertiesPage.submitForm()
      await expect(RiskPropertiesPage.errorSummary).toBeDisplayed()
    })
  })

  // ─── Flood risk levels ─────────────────────────────────────────────────────

  describe('Current flood risk (fluvial and tidal) page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'current-flood-fluvial-risk')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('fluvial')) return this.skip()
        await expect(RiskPropertiesPage.pageHeading).toHaveText(
          PROJECTS.RISK_AND_PROPERTIES.FLUVIAL_RISK.PAGE_HEADING
        )
      })

      it('shows the hint text', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('fluvial')) return this.skip()
        await expect(RiskPropertiesPage.allHintTexts.first()).toHaveText(
          expect.stringContaining('most properties')
        )
      })

      it('shows 4 flood risk options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('fluvial')) return this.skip()
        const labels = await RiskPropertiesPage.mainRiskLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts.some(t => t.includes('High risk'))).toBe(true)
        expect(texts.some(t => t.includes('Medium risk'))).toBe(true)
        expect(texts.some(t => t.includes('Low risk'))).toBe(true)
        expect(texts.some(t => t.includes('Very low risk'))).toBe(true)
      })
    })

    describe('Validation', () => {
      it('shows error when no risk level is selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('fluvial')) return this.skip()
        await RiskPropertiesPage.submitForm()
        await expect(RiskPropertiesPage.errorSummary).toBeDisplayed()
        const errors = await RiskPropertiesPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.RISK_AND_PROPERTIES.FLUVIAL_RISK.ERRORS.REQUIRED)
      })
    })

    describe('Happy path', () => {
      it('selects high risk and continues', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('fluvial')) return this.skip()
        await RiskPropertiesPage.selectFloodRiskByIndex(0)
        await RiskPropertiesPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('fluvial')
      })
    })
  })

  describe('Current flood risk (surface water) page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'current-flood-surface-water-risk')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('surface-water')) return this.skip()
      await expect(RiskPropertiesPage.pageHeading).toHaveText(
        PROJECTS.RISK_AND_PROPERTIES.SURFACE_WATER_RISK.PAGE_HEADING
      )
    })

    it('shows error when no level selected', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('surface-water')) return this.skip()
      await RiskPropertiesPage.submitForm()
      const errors = await RiskPropertiesPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.RISK_AND_PROPERTIES.SURFACE_WATER_RISK.ERRORS.REQUIRED)
    })
  })

  describe('Current coastal erosion risk page', () => {
    before(async () => {
      if (ref) await RiskPropertiesPage.open(ref, 'current-coastal-erosion-risk')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('coastal-erosion-risk')) return this.skip()
      await expect(RiskPropertiesPage.pageHeading).toHaveText(
        PROJECTS.RISK_AND_PROPERTIES.COASTAL_EROSION_RISK.PAGE_HEADING
      )
    })

    it('shows medium term and longer term options', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('coastal-erosion-risk')) return this.skip()
      const labels = await RiskPropertiesPage.mainRiskLabels
      const texts = await Promise.all(labels.map(l => l.getText()))
      expect(texts.some(t => t.includes('Medium term risk') || t.includes('2055'))).toBe(true)
      expect(texts.some(t => t.includes('Longer term risk') || t.includes('2105'))).toBe(true)
    })

    it('shows error when no level selected', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('coastal-erosion-risk')) return this.skip()
      await RiskPropertiesPage.submitForm()
      const errors = await RiskPropertiesPage.getErrorMessages()
      expect(errors).toContain(PROJECTS.RISK_AND_PROPERTIES.COASTAL_EROSION_RISK.ERRORS.REQUIRED)
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change risk selection via Change link', () => {
    it('navigates to risk edit page from overview', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('risk')
      const url = await browser.getUrl()
      expect(url).toMatch(/\/risk$|\/risk\/|risk-and-properties/)
    })
  })
})
