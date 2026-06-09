import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class GoalsUrgencyConfidencePage extends GovUkFormPage {
  // Goals textarea
  get goalsTextarea() {
    return $('textarea, #goals, textarea[name="goals"]')
  }

  get goalsHint() {
    return $('.govuk-hint')
  }

  get charCountHint() {
    return $('.govuk-character-count__message, .govuk-hint[id$="info"]')
  }

  // Urgency radios
  get urgencyRadios() {
    return $$('input[type="radio"]')
  }

  get urgencyLabels() {
    return $$('.govuk-radios__label')
  }

  get urgencyHint() {
    return $('.govuk-fieldset .govuk-hint')
  }

  // Urgency detail textarea
  get urgencyDetailTextarea() {
    return $('textarea, #urgency_detail')
  }

  // Confidence radios (shared across 3 pages)
  get confidenceRadios() {
    return $$('input[type="radio"]')
  }

  get confidenceLabels() {
    return $$('.govuk-radios__label')
  }

  get confidenceHints() {
    return $$('.govuk-radios__hint')
  }

  async openGoals(ref) {
    return browser.url(`/project/${ref}/project-goals`)
  }

  async openUrgencyReason(ref) {
    return browser.url(`/project/${ref}/urgency-reason`)
  }

  async openUrgencyDetails(ref) {
    return browser.url(`/project/${ref}/urgency-details`)
  }

  async openPropertyConfidence(ref) {
    return browser.url(`/project/${ref}/confidence-homes-better-protected`)
  }

  async openGatewayConfidence(ref) {
    return browser.url(`/project/${ref}/confidence-homes-by-gateway-four`)
  }

  async openFundingConfidence(ref) {
    return browser.url(`/project/${ref}/confidence-secured-partnership-funding`)
  }

  async enterGoals(text) {
    await this.goalsTextarea.clearValue()
    await this.goalsTextarea.setValue(text)
  }

  async selectUrgencyByIndex(index = 0) {
    const radios = await this.urgencyRadios
    await radios[index].click()
  }

  async selectConfidenceByIndex(index = 0) {
    const radios = await this.confidenceRadios
    await radios[index].click()
  }

  async enterUrgencyDetail(text) {
    await this.urgencyDetailTextarea.clearValue()
    await this.urgencyDetailTextarea.setValue(text)
  }
}

export default new GoalsUrgencyConfidencePage()
