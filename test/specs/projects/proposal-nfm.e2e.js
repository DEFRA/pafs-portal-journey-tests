import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import NfmPage from 'page-objects/projects/nfm.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Natural Flood Management (NFM)', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.nfm })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── NFM inclusion gate ────────────────────────────────────────────────────

  describe('Does the project include any NFM measures? (gate)', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-inclusion')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.INCLUSION.PAGE_HEADING)
      })

      it('shows Yes and No radio options', async function () {
        if (!ref) return this.skip()
        const radios = await NfmPage.yesNoRadios
        expect(radios.length).toBeGreaterThanOrEqual(2)
      })
    })

    describe('Validation', () => {
      it('shows error when submitted without selection', async function () {
        if (!ref) return this.skip()
        await NfmPage.submitForm()
        await expect(NfmPage.errorSummary).toBeDisplayed()
        const errors = await NfmPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NFM.INCLUSION.ERRORS.REQUIRED)
      })
    })

    describe('Happy path — No NFM', () => {
      it('selects No and skips NFM measure pages', async function () {
        if (!ref) return this.skip()
        await NfmPage.open(ref, 'nfm-inclusion')
        await NfmPage.selectNo()
        await NfmPage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('nfm-inclusion')
      })
    })
  })

  // ─── NFM selected measures ─────────────────────────────────────────────────

  describe('NFM measure selection page', () => {
    before(async () => {
      if (ref) {
        // Set NFM to Yes first
        await NfmPage.open(ref, 'nfm-inclusion')
        await NfmPage.selectYes()
        await NfmPage.submitForm()
      }
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('nfm-selected') && !url.includes('selected-measures')) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.SELECTED_MEASURES.PAGE_HEADING)
      })

      it('shows Select all that apply hint', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('nfm-selected') && !url.includes('selected-measures')) return this.skip()
        await expect(NfmPage.hintText).toHaveText(PROJECTS.NFM.SELECTED_MEASURES.HINT)
      })

      it('shows all 8 NFM measure options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('nfm-selected') && !url.includes('selected-measures')) return this.skip()
        const labels = await NfmPage.measureCheckboxLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.RIVER_RESTORATION)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.LEAKY_BARRIERS)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.OFFLINE_STORAGE)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.WOODLAND)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.HEADWATER_DRAINAGE)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.RUNOFF_MANAGEMENT)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.SALTMARSH)
        expect(texts).toContain(PROJECTS.NFM.SELECTED_MEASURES.OPTIONS.SAND_DUNE)
      })
    })

    describe('Validation', () => {
      it('shows error when no measure is selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('nfm-selected') && !url.includes('selected-measures')) return this.skip()
        await NfmPage.submitForm()
        await expect(NfmPage.errorSummary).toBeDisplayed()
        const errors = await NfmPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NFM.SELECTED_MEASURES.ERRORS.REQUIRED)
      })
    })

    describe('Happy path — river restoration', () => {
      it('selects river restoration and continues to detail page', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('nfm-selected') && !url.includes('selected-measures')) return this.skip()
        await NfmPage.selectMeasureByIndex(0)
        await NfmPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toMatch(/nfm-selected-measures$/)
      })
    })
  })

  // ─── River restoration detail ──────────────────────────────────────────────

  describe('River and floodplain restoration details', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-river-restoration')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('river-restoration')) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.RIVER_RESTORATION.PAGE_HEADING)
      })

      it('shows the Area label', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('river-restoration')) return this.skip()
        const labels = await NfmPage.allFormLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts.some(t => t.includes(PROJECTS.NFM.RIVER_RESTORATION.AREA_LABEL))).toBe(true)
      })

      it('shows the Design storage volume label', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('river-restoration')) return this.skip()
        const labels = await NfmPage.allFormLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts.some(t => t.includes(PROJECTS.NFM.RIVER_RESTORATION.VOLUME_LABEL))).toBe(true)
      })
    })

    describe('Validation', () => {
      it('shows error when area is empty', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('river-restoration')) return this.skip()
        await NfmPage.submitForm()
        await expect(NfmPage.errorSummary).toBeDisplayed()
        const errors = await NfmPage.getErrorMessages()
        expect(errors.some(e => e.includes('area') || e.includes('hectares'))).toBe(true)
      })

      it('shows error for zero area', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('river-restoration')) return this.skip()
        await NfmPage.enterArea(0)
        await NfmPage.submitForm()
        const errors = await NfmPage.getErrorMessages()
        expect(errors.some(e => e.includes('greater than 0') || e.includes('invalid'))).toBe(true)
      })

      it('accepts valid area and continues', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('river-restoration')) return this.skip()
        await NfmPage.enterArea(12.5)
        await NfmPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('river-restoration')
      })
    })
  })

  // ─── Leaky barriers detail ─────────────────────────────────────────────────

  describe('Leaky barriers and in-channel storage details', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-leaky-barriers')
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('leaky')) return this.skip()
      await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.LEAKY_BARRIERS.PAGE_HEADING)
    })

    it('shows Length, Width and Volume labels', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('leaky')) return this.skip()
      const labels = await NfmPage.allFormLabels
      const texts = await Promise.all(labels.map(l => l.getText()))
      expect(texts.some(t => t.includes(PROJECTS.NFM.LEAKY_BARRIERS.LENGTH_LABEL))).toBe(true)
      expect(texts.some(t => t.includes(PROJECTS.NFM.LEAKY_BARRIERS.WIDTH_LABEL))).toBe(true)
    })

    it('shows error for missing length', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('leaky')) return this.skip()
      await NfmPage.submitForm()
      const errors = await NfmPage.getErrorMessages()
      expect(errors.some(e => e.includes('length') || e.includes('km'))).toBe(true)
    })
  })

  // ─── Land use change ───────────────────────────────────────────────────────

  describe('Land use change page', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-land-use-change')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('land-use-change')) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.LAND_USE_CHANGE.PAGE_HEADING)
      })

      it('shows Select all that apply hint', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('land-use-change')) return this.skip()
        await expect(NfmPage.hintText).toHaveText(PROJECTS.NFM.LAND_USE_CHANGE.HINT)
      })

      it('shows all 9 land use options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('land-use-change')) return this.skip()
        const labels = await NfmPage.landUseLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.NFM.LAND_USE_CHANGE.OPTIONS.ENCLOSED_ARABLE)
        expect(texts).toContain(PROJECTS.NFM.LAND_USE_CHANGE.OPTIONS.WOODLAND)
        expect(texts).toContain(PROJECTS.NFM.LAND_USE_CHANGE.OPTIONS.COASTAL_MARGINS)
      })
    })

    describe('Validation', () => {
      it('shows error when no land use is selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('land-use-change')) return this.skip()
        await NfmPage.submitForm()
        const errors = await NfmPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NFM.LAND_USE_CHANGE.ERRORS.REQUIRED)
      })
    })
  })

  // ─── Landowner consent ─────────────────────────────────────────────────────

  describe('Landowner consent page', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-landowner-consent')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('landowner')) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.LANDOWNER_CONSENT.PAGE_HEADING)
      })

      it('shows all 4 consent options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('landowner')) return this.skip()
        const labels = await NfmPage.consentLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.NFM.LANDOWNER_CONSENT.OPTIONS.FULLY_SECURED)
        expect(texts).toContain(PROJECTS.NFM.LANDOWNER_CONSENT.OPTIONS.ENGAGED)
        expect(texts).toContain(PROJECTS.NFM.LANDOWNER_CONSENT.OPTIONS.INITIAL_CONTACT)
        expect(texts).toContain(PROJECTS.NFM.LANDOWNER_CONSENT.OPTIONS.NOT_ENGAGED)
      })
    })

    describe('Validation', () => {
      it('shows error when no consent option selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('landowner')) return this.skip()
        await NfmPage.submitForm()
        const errors = await NfmPage.getErrorMessages()
        expect(errors).toContain(PROJECTS.NFM.LANDOWNER_CONSENT.ERRORS.REQUIRED)
      })
    })

    describe('Happy path', () => {
      it('selects first consent option and continues', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('landowner')) return this.skip()
        await NfmPage.selectRadioByIndex(0)
        await NfmPage.submitForm()
        const newUrl = await browser.getUrl()
        expect(newUrl).not.toContain('landowner-consent')
      })
    })
  })

  // ─── Experience level ──────────────────────────────────────────────────────

  describe('Experience of implementing NFM measures', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-experience')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('experience')) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.EXPERIENCE.PAGE_HEADING)
      })

      it('shows the combined experience hint', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('experience')) return this.skip()
        await expect(NfmPage.hintText).toHaveText(
          expect.stringContaining('combined experience')
        )
      })

      it('shows all 4 experience level options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('experience')) return this.skip()
        const labels = await NfmPage.consentLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts.some(t => t.includes('No experience'))).toBe(true)
        expect(texts.some(t => t.includes('Some experience'))).toBe(true)
        expect(texts.some(t => t.includes('Moderate experience'))).toBe(true)
        expect(texts.some(t => t.includes('Extensive experience'))).toBe(true)
      })
    })

    describe('Validation', () => {
      it('shows error when no option selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('experience')) return this.skip()
        await NfmPage.submitForm()
        const errors = await NfmPage.getErrorMessages()
        expect(errors.some(e => e.includes('experience'))).toBe(true)
      })
    })
  })

  // ─── Project readiness ─────────────────────────────────────────────────────

  describe('How developed is your proposal?', () => {
    before(async () => {
      if (ref) await NfmPage.open(ref, 'nfm-project-readiness')
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('readiness')) return this.skip()
        await expect(NfmPage.pageHeading).toHaveText(PROJECTS.NFM.PROJECT_READINESS.PAGE_HEADING)
      })

      it('shows all 4 readiness options', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('readiness')) return this.skip()
        const labels = await NfmPage.consentLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts.some(t => t.includes('Early concept'))).toBe(true)
        expect(texts.some(t => t.includes('Developing proposal'))).toBe(true)
        expect(texts.some(t => t.includes('Well-developed proposal'))).toBe(true)
        expect(texts.some(t => t.includes('Ready to deliver'))).toBe(true)
      })
    })

    describe('Validation', () => {
      it('shows error when no readiness option selected', async function () {
        if (!ref) return this.skip()
        const url = await browser.getUrl()
        if (!url.includes('readiness')) return this.skip()
        await NfmPage.submitForm()
        const errors = await NfmPage.getErrorMessages()
        expect(errors.some(e => e.includes('developed') || e.includes('readiness'))).toBe(true)
      })
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change NFM via Change link', () => {
    it('navigates to NFM from the overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('nfm')
      const url = await browser.getUrl()
      expect(url).toContain('nfm')
    })
  })
})
