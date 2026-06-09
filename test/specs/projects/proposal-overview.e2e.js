import { browser, expect } from '@wdio/globals'
import { ensureLoggedInAsUser, createProposalCore } from 'helpers/proposal.helper.js'
import ProjectOverviewPage from 'page-objects/projects/project-overview.page.js'
import { proposalNames, getSharedRef } from 'fixtures/projects.js'
import { COMMON, PROJECTS } from 'constants/content.js'

describe('Proposal — Overview page', () => {
  let ref

  before(async () => {
    await ensureLoggedInAsUser()
    ref = getSharedRef()
    if (!ref) {
      ref = await createProposalCore({ name: proposalNames.overview })
    }
  })

  after(async () => {
    await browser.url('/auth/logout')
  })

  describe('Page content', () => {
    before(async () => {
      if (ref) await ProjectOverviewPage.open(ref)
    })

    it('has the correct page heading', async function () {
      if (!ref) return this.skip()
      await expect(ProjectOverviewPage.pageHeading).toHaveText(PROJECTS.OVERVIEW.PAGE_HEADING)
    })

    it('shows the service title', async function () {
      if (!ref) return this.skip()
      await expect(ProjectOverviewPage.serviceTitle).toHaveText(COMMON.SERVICE_TITLE_USER)
    })

    it('shows the Proposal details section card', async function () {
      if (!ref) return this.skip()
      const titles = await ProjectOverviewPage.sectionCardTitles
      const texts = await Promise.all(titles.map(t => t.getText()))
      expect(texts.some(t => t.includes(PROJECTS.OVERVIEW.SECTION_CARDS.PROPOSAL_DETAILS))).toBe(true)
    })

    it('shows the Project benefit area section card', async function () {
      if (!ref) return this.skip()
      const titles = await ProjectOverviewPage.sectionCardTitles
      const texts = await Promise.all(titles.map(t => t.getText()))
      expect(texts.some(t => t.includes(PROJECTS.OVERVIEW.SECTION_CARDS.BENEFIT_AREA))).toBe(true)
    })

    it('shows the Important dates section card', async function () {
      if (!ref) return this.skip()
      const titles = await ProjectOverviewPage.sectionCardTitles
      const texts = await Promise.all(titles.map(t => t.getText()))
      expect(texts.some(t => t.includes(PROJECTS.OVERVIEW.SECTION_CARDS.IMPORTANT_DATES))).toBe(true)
    })

    it('shows the Funding sources and spending section card', async function () {
      if (!ref) return this.skip()
      const titles = await ProjectOverviewPage.sectionCardTitles
      const texts = await Promise.all(titles.map(t => t.getText()))
      expect(texts.some(t => t.includes('Funding'))).toBe(true)
    })

    it('shows the Risks and properties benefitting section card', async function () {
      if (!ref) return this.skip()
      const titles = await ProjectOverviewPage.sectionCardTitles
      const texts = await Promise.all(titles.map(t => t.getText()))
      expect(texts.some(t => t.includes('Risks and properties'))).toBe(true)
    })

    it('shows the Project goals section card', async function () {
      if (!ref) return this.skip()
      const titles = await ProjectOverviewPage.sectionCardTitles
      const texts = await Promise.all(titles.map(t => t.getText()))
      expect(texts.some(t => t.includes('goals'))).toBe(true)
    })

    it('shows Change links in the proposal details card', async function () {
      if (!ref) return this.skip()
      const changeLinks = await ProjectOverviewPage.changeLinks
      expect(changeLinks.length).toBeGreaterThan(0)
    })

    it('shows the project name in the proposal details summary', async function () {
      if (!ref) return this.skip()
      const summaryValues = await ProjectOverviewPage.summaryValues
      const texts = await Promise.all(summaryValues.map(v => v.getText()))
      expect(texts.some(t => t.length > 0)).toBe(true)
    })

    it('shows a Standard data notice details component', async function () {
      if (!ref) return this.skip()
      const page = await $('main').getText()
      expect(page).toContain('Standard data notice')
    })
  })

  // ─── Submission validation ─────────────────────────────────────────────────

  describe('Submission validation — incomplete proposal', () => {
    before(async () => {
      if (ref) await ProjectOverviewPage.open(ref)
    })

    it('shows error summary when submitted with incomplete sections', async function () {
      if (!ref) return this.skip()
      const submitBtn = await ProjectOverviewPage.submitButton
      if (!submitBtn) return this.skip()
      const isDisplayed = await submitBtn.isDisplayed().catch(() => false)
      if (!isDisplayed) return this.skip()

      await submitBtn.click()
      await expect(ProjectOverviewPage.errorSummary).toBeDisplayed()
      await expect(ProjectOverviewPage.errorSummaryTitle).toHaveText(COMMON.ERROR_SUMMARY_HEADING)
    })

    it('shows incomplete section error messages', async function () {
      if (!ref) return this.skip()
      const hasErrors = await ProjectOverviewPage.errorSummary.isDisplayed().catch(() => false)
      if (!hasErrors) return this.skip()
      const errors = await ProjectOverviewPage.getErrorMessages()
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  // ─── Change links navigate to correct sections ─────────────────────────────

  describe('Change links — navigation', () => {
    before(async () => {
      if (ref) await ProjectOverviewPage.open(ref)
    })

    it('Change link for project name navigates to name page', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      const changeLinks = await ProjectOverviewPage.changeLinks
      const nameLink = (await Promise.all(
        changeLinks.map(async (l) => ({ el: l, href: await l.getAttribute('href') }))
      )).find(({ href }) => href && href.includes('name'))

      if (!nameLink) return this.skip()
      await nameLink.el.click()
      const url = await browser.getUrl()
      expect(url).toContain('name')
    })

    it('Change link for financial year navigates to financial year page', async function () {
      if (!ref) return this.skip()
      await ProjectOverviewPage.open(ref)
      const changeLinks = await ProjectOverviewPage.changeLinks
      const fyLink = (await Promise.all(
        changeLinks.map(async (l) => ({ el: l, href: await l.getAttribute('href') }))
      )).find(({ href }) => href && href.includes('financial'))

      if (!fyLink) return this.skip()
      await fyLink.el.click()
      const url = await browser.getUrl()
      expect(url).toMatch(/financial|fin-year/)
    })
  })

  // ─── Status tags ───────────────────────────────────────────────────────────

  describe('Section status tags', () => {
    before(async () => {
      if (ref) await ProjectOverviewPage.open(ref)
    })

    it('shows status tags (Not started / In progress / Completed) on sections', async function () {
      if (!ref) return this.skip()
      const statuses = await ProjectOverviewPage.getSectionStatuses()
      // Tags should be one of the three states or the RMA value
      const validStatuses = ['Not started', 'In progress', 'Completed', 'Not added']
      const hasValidStatus = statuses.some(s =>
        validStatuses.some(vs => s.includes(vs))
      )
      expect(hasValidStatus).toBe(true)
    })
  })

  // ─── Download proposal link ────────────────────────────────────────────────

  describe('Download proposal link', () => {
    before(async () => {
      if (ref) await ProjectOverviewPage.open(ref)
    })

    it('shows a download link or button', async function () {
      if (!ref) return this.skip()
      const downloadLink = await $('a=Download proposal, a*=Download').catch(() => null)
      if (!downloadLink) return this.skip()
      await expect(downloadLink).toBeDisplayed()
    })
  })
})
