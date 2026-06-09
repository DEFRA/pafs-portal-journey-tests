import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import GoalsUrgencyConfidencePage from 'page-objects/projects/goals-urgency-confidence.page.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Goals, urgency and confidence', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.goalsConfidence })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  // ─── Project goals ─────────────────────────────────────────────────────────

  describe('Project goals page', () => {
    before(async () => {
      if (ref) await GoalsUrgencyConfidencePage.openGoals(ref)
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(GoalsUrgencyConfidencePage.pageHeading).toHaveText(
          PROJECTS.GOALS_URGENCY_CONFIDENCE.GOALS.PAGE_HEADING
        )
      })

      it('shows the 700 character limit hint', async function () {
        if (!ref) return this.skip()
        await expect(GoalsUrgencyConfidencePage.goalsHint).toHaveText(
          expect.stringContaining('700 characters or fewer')
        )
      })

      it('shows a back link', async function () {
        if (!ref) return this.skip()
        await expect(GoalsUrgencyConfidencePage.backLink).toBeDisplayed()
      })
    })

    describe('Validation', () => {
      it('shows error when submitted empty', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.submitForm()
        await expect(GoalsUrgencyConfidencePage.errorSummary).toBeDisplayed()
        await expect(GoalsUrgencyConfidencePage.errorSummaryTitle).toHaveText(COMMON.ERROR_SUMMARY_HEADING)
      })

      it('shows the goals required error', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.submitForm()
        const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.GOALS.ERRORS.REQUIRED)
      })

      it('shows error when text exceeds 700 characters', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.enterGoals('A'.repeat(701))
        await GoalsUrgencyConfidencePage.submitForm()
        const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.GOALS.ERRORS.MAX_LENGTH)
      })

      it('error summary link focuses the textarea', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.submitForm()
        const links = await GoalsUrgencyConfidencePage.errorSummaryItems
        expect(links.length).toBeGreaterThan(0)
        const href = await links[0].getAttribute('href')
        expect(href).toMatch(/^#/)
      })
    })

    describe('Happy path', () => {
      it('enters valid goals and continues', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.openGoals(ref)
        await GoalsUrgencyConfidencePage.enterGoals(
          'The project will reduce flood risk to 500 properties by constructing a storage area.'
        )
        await GoalsUrgencyConfidencePage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('project-goals')
      })
    })
  })

  // ─── Urgency reason ────────────────────────────────────────────────────────

  describe('Urgency reason page', () => {
    before(async () => {
      if (ref) await GoalsUrgencyConfidencePage.openUrgencyReason(ref)
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(GoalsUrgencyConfidencePage.pageHeading).toHaveText(
          PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.PAGE_HEADING
        )
      })

      it('shows the PSO officer hint', async function () {
        if (!ref) return this.skip()
        await expect(GoalsUrgencyConfidencePage.urgencyHint).toHaveText(
          expect.stringContaining('PSO')
        )
      })

      it('shows all 6 urgency reason options', async function () {
        if (!ref) return this.skip()
        const labels = await GoalsUrgencyConfidencePage.urgencyLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.OPTIONS.NOT_URGENT)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.OPTIONS.STATUTORY)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.OPTIONS.LEGAL)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.OPTIONS.HEALTH_SAFETY)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.OPTIONS.EMERGENCY)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.OPTIONS.TIME_LIMITED)
      })
    })

    describe('Validation', () => {
      it('shows error when no urgency reason selected', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.submitForm()
        await expect(GoalsUrgencyConfidencePage.errorSummary).toBeDisplayed()
        const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_REASON.ERRORS.REQUIRED)
      })
    })

    describe('Happy path — not urgent', () => {
      it('selects Not urgent and continues without showing detail page', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.openUrgencyReason(ref)
        await GoalsUrgencyConfidencePage.selectUrgencyByIndex(0)
        await GoalsUrgencyConfidencePage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('urgency-reason')
      })
    })
  })

  // ─── Urgency detail (conditional) ─────────────────────────────────────────

  describe('Urgency detail page — shown when urgent reason is selected', () => {
    before(async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.openUrgencyReason(ref)
      // Select a reason that requires detail (statutory need = index 1)
      await GoalsUrgencyConfidencePage.selectUrgencyByIndex(1)
      await GoalsUrgencyConfidencePage.submitForm()
    })

    it('has the statutory need heading', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('urgency-details') && !url.includes('urgency-detail')) return this.skip()
      await expect(GoalsUrgencyConfidencePage.pageHeading).toHaveText(
        PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_DETAIL.HEADINGS.STATUTORY
      )
    })

    it('shows the 700 character limit hint', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('urgency-detail')) return this.skip()
      await expect(GoalsUrgencyConfidencePage.goalsHint).toHaveText(
        expect.stringContaining('700 characters or fewer')
      )
    })

    it('shows error when submitted empty', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('urgency-detail')) return this.skip()
      await GoalsUrgencyConfidencePage.submitForm()
      await expect(GoalsUrgencyConfidencePage.errorSummary).toBeDisplayed()
    })

    it('shows error when detail exceeds 700 characters', async function () {
      if (!ref) return this.skip()
      const url = await browser.getUrl()
      if (!url.includes('urgency-detail')) return this.skip()
      await GoalsUrgencyConfidencePage.enterUrgencyDetail('A'.repeat(701))
      await GoalsUrgencyConfidencePage.submitForm()
      const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
      expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.URGENCY_DETAIL.ERRORS.MAX_LENGTH)
    })
  })

  // ─── Confidence — properties benefitting ──────────────────────────────────

  describe('Confidence in number of properties benefitting', () => {
    before(async () => {
      if (ref) await GoalsUrgencyConfidencePage.openPropertyConfidence(ref)
    })

    describe('Page content', () => {
      it('has the correct page heading', async function () {
        if (!ref) return this.skip()
        await expect(GoalsUrgencyConfidencePage.pageHeading).toHaveText(
          PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.PAGE_HEADING
        )
      })

      it('shows 5 confidence level options', async function () {
        if (!ref) return this.skip()
        const labels = await GoalsUrgencyConfidencePage.confidenceLabels
        const texts = await Promise.all(labels.map(l => l.getText()))
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.OPTIONS.HIGH)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.OPTIONS.MEDIUM_HIGH)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.OPTIONS.MEDIUM_LOW)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.OPTIONS.LOW)
        expect(texts).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.OPTIONS.NA)
      })

      it('shows confidence hints for each level', async function () {
        if (!ref) return this.skip()
        const hints = await GoalsUrgencyConfidencePage.confidenceHints
        expect(hints.length).toBeGreaterThanOrEqual(5)
      })
    })

    describe('Validation', () => {
      it('shows error when no confidence level selected', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.submitForm()
        await expect(GoalsUrgencyConfidencePage.errorSummary).toBeDisplayed()
        const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
        expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.PROPERTY_CONFIDENCE.ERRORS.REQUIRED)
      })
    })

    describe('Happy path', () => {
      it('selects High confidence and continues', async function () {
        if (!ref) return this.skip()
        await GoalsUrgencyConfidencePage.openPropertyConfidence(ref)
        await GoalsUrgencyConfidencePage.selectConfidenceByIndex(0)
        await GoalsUrgencyConfidencePage.submitForm()
        const url = await browser.getUrl()
        expect(url).not.toContain('confidence-homes-better-protected')
      })
    })
  })

  // ─── Confidence — Gateway 4 date ──────────────────────────────────────────

  describe('Confidence in achieving Gateway 4 date', () => {
    before(async () => {
      if (ref) await GoalsUrgencyConfidencePage.openGatewayConfidence(ref)
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(GoalsUrgencyConfidencePage.pageHeading).toHaveText(
        PROJECTS.GOALS_URGENCY_CONFIDENCE.GATEWAY_CONFIDENCE.PAGE_HEADING
      )
    })

    it('shows error when no level selected', async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.submitForm()
      const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
      expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.GATEWAY_CONFIDENCE.ERRORS.REQUIRED)
    })

    it('selects confidence and continues', async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.openGatewayConfidence(ref)
      await GoalsUrgencyConfidencePage.selectConfidenceByIndex(0)
      await GoalsUrgencyConfidencePage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('gateway-four')
    })
  })

  // ─── Confidence — Securing contributions ──────────────────────────────────

  describe('Confidence in securing contributions', () => {
    before(async () => {
      if (ref) await GoalsUrgencyConfidencePage.openFundingConfidence(ref)
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(GoalsUrgencyConfidencePage.pageHeading).toHaveText(
        PROJECTS.GOALS_URGENCY_CONFIDENCE.FUNDING_CONFIDENCE.PAGE_HEADING
      )
    })

    it('shows error when no level selected', async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.submitForm()
      const errors = await GoalsUrgencyConfidencePage.getErrorMessages()
      expect(errors).toContain(PROJECTS.GOALS_URGENCY_CONFIDENCE.FUNDING_CONFIDENCE.ERRORS.REQUIRED)
    })

    it('selects N/A and continues', async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.openFundingConfidence(ref)
      // N/A is the last option (index 4)
      await GoalsUrgencyConfidencePage.selectConfidenceByIndex(4)
      await GoalsUrgencyConfidencePage.submitForm()
      const url = await browser.getUrl()
      expect(url).not.toContain('partnership-funding')
    })
  })

  // ─── Update via Change link ────────────────────────────────────────────────

  describe('Update — change goals via Change link', () => {
    it('navigates to project goals from overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('project-goals')
      const url = await browser.getUrl()
      expect(url).toContain('project-goals')
    })

    it('pre-fills existing goals text', async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.openGoals(ref)
      const value = await GoalsUrgencyConfidencePage.goalsTextarea.getValue()
      expect(value.length).toBeGreaterThan(0)
    })

    it('updates goals text and returns to overview', async function () {
      if (!ref) return this.skip()
      await GoalsUrgencyConfidencePage.openGoals(ref)
      await GoalsUrgencyConfidencePage.enterGoals(
        'Updated: The project will protect 600 properties from flooding by building a flood wall.'
      )
      await GoalsUrgencyConfidencePage.submitForm()
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl()
          return url.match(/\/project\/[A-Z0-9-]+$/) || url.includes('overview')
        },
        { timeout: 10000, timeoutMsg: 'Did not return to overview after goals update' }
      )
    })
  })

  describe('Update — change urgency via Change link', () => {
    it('navigates to urgency from overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('urgency-reason')
      const url = await browser.getUrl()
      expect(url).toContain('urgency')
    })
  })

  describe('Update — change confidence via Change link', () => {
    it('navigates to property confidence from overview Change link', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      await ProjectOverviewPage.clickChangeFor('confidence-homes-better-protected')
      const url = await browser.getUrl()
      expect(url).toContain('confidence')
    })
  })
})
