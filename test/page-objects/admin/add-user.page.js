import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

// ─── Step 1: Start ────────────────────────────────────────────────────────────

class AddUserStartPage extends GovUkFormPage {
  get introText() {
    return $('.govuk-body')
  }

  get beforeYouStartHeading() {
    return $('h2=Before you start')
  }

  get checklistItems() {
    return $$('.govuk-list--bullet li')
  }

  get startButton() {
    return $('a.govuk-button--start, button=Start now, a=Start now')
  }

  get backLink() {
    return $('a.govuk-back-link')
  }

  open() {
    return super.open('/admin/user-account')
  }

  async start() {
    await this.startButton.click()
  }
}

// ─── Step 2: Administrator status ─────────────────────────────────────────────

class AddUserIsAdminPage extends GovUkFormPage {
  get yesRadio() {
    return $('input[name="admin"][value="true"], input[name="admin"][value="yes"]')
  }

  get noRadio() {
    return $('input[name="admin"][value="false"], input[name="admin"][value="no"]')
  }

  get yesLabel() {
    return $('label[for*="admin"]')
  }

  open() {
    return super.open('/admin/user-account/is-admin')
  }

  async selectYes() {
    await this.yesRadio.click()
    await this.continueButton.click()
  }

  async selectNo() {
    await this.noRadio.click()
    await this.continueButton.click()
  }
}

// ─── Step 3: User details ──────────────────────────────────────────────────────

class AddUserDetailsPage extends GovUkFormPage {
  get firstNameField() {
    return $('#firstName')
  }

  get lastNameField() {
    return $('#lastName')
  }

  get emailField() {
    return $('#email')
  }

  get telephoneField() {
    return $('#telephoneNumber')
  }

  get organisationField() {
    return $('#organisation')
  }

  get jobTitleField() {
    return $('#jobTitle')
  }

  get firstNameLabel() {
    return $('label[for="firstName"]')
  }

  get lastNameLabel() {
    return $('label[for="lastName"]')
  }

  get emailLabel() {
    return $('label[for="email"]')
  }

  get telephoneLabel() {
    return $('label[for="telephoneNumber"]')
  }

  get organisationLabel() {
    return $('label[for="organisation"]')
  }

  get jobTitleLabel() {
    return $('label[for="jobTitle"]')
  }

  get responsibilityLegend() {
    return $('fieldset legend')
  }

  get responsibilityRadios() {
    return $$('input[name="responsibility"]')
  }

  open() {
    return super.open('/admin/user-account/details')
  }

  async fillDetails({
    firstName,
    lastName,
    email,
    telephone,
    organisation,
    jobTitle
  }) {
    await this.firstNameField.setValue(firstName)
    await this.lastNameField.setValue(lastName)
    await this.emailField.setValue(email)
    if (telephone) await this.telephoneField.setValue(telephone)
    if (organisation) await this.organisationField.setValue(organisation)
    if (jobTitle) await this.jobTitleField.setValue(jobTitle)
  }

  async selectResponsibility(type) {
    // type: 'EA' | 'PSO' | 'RMA'
    await $(`input[name="responsibility"][value="${type}"]`).click()
  }
}

// ─── Step 4: Parent areas (EA areas for PSO/RMA; PSO teams for RMA) ───────────

class AddUserParentAreasPage extends GovUkFormPage {
  get areaCheckboxes() {
    return $$('.govuk-checkboxes__input')
  }

  get areaLabels() {
    return $$('.govuk-checkboxes__label')
  }

  get fieldsetLegend() {
    return $('fieldset legend')
  }

  async selectFirstArea() {
    const checkboxes = await this.areaCheckboxes
    if (checkboxes.length > 0) {
      await checkboxes[0].click()
    }
  }

  async selectAllAreas() {
    const checkboxes = await this.areaCheckboxes
    for (const cb of checkboxes) {
      const checked = await cb.isSelected()
      if (!checked) await cb.click()
    }
  }
}

// ─── Step 5: Main area ─────────────────────────────────────────────────────────

class AddUserMainAreaPage extends GovUkFormPage {
  get areaSelect() {
    return $('select[name="mainArea"], select#mainArea')
  }

  get areaLabel() {
    return $('label[for="mainArea"]')
  }

  get areaHint() {
    return $('#mainArea-hint, [id*="mainArea-hint"]')
  }

  async selectFirstAvailableArea() {
    const options = await $$('select option')
    // Skip the placeholder "Select an area" option at index 0
    if (options.length > 1) {
      const value = await options[1].getAttribute('value')
      await this.areaSelect.selectByAttribute('value', value)
    }
  }

  /**
   * Selects an option that is different from the currently selected value.
   * Returns the visible text of the newly selected option so callers can
   * assert the change was applied to the check-answers page and view page.
   *
   * @returns {Promise<string>} The label text of the newly selected area.
   */
  async selectDifferentFromCurrent() {
    const currentValue = await this.areaSelect.getValue()
    const options = await $$('select option')
    for (const opt of options) {
      const value = await opt.getAttribute('value')
      const text = (await opt.getText()).trim()
      if (value && value !== '' && value !== currentValue) {
        await this.areaSelect.selectByAttribute('value', value)
        return text
      }
    }
    throw new Error(
      'No alternative area option found — only one area available in test environment'
    )
  }

  /**
   * Returns the visible text of the currently selected area option.
   */
  async getSelectedAreaName() {
    const select = this.areaSelect
    const value = await select.getValue()
    const option = await $(`select option[value="${value}"]`)
    return (await option.getText()).trim()
  }
}

// ─── Step 6: Additional areas (optional) ──────────────────────────────────────

class AddUserAdditionalAreasPage extends GovUkFormPage {
  get areaCheckboxes() {
    return $$('.govuk-checkboxes__input')
  }

  // Optional step — skip by just clicking Continue without selecting
}

// ─── Step 7: Check answers ────────────────────────────────────────────────────

class AddUserCheckAnswersPage extends GovUkFormPage {
  get personalDetailsCard() {
    return $('.govuk-summary-card')
  }

  get allSummaryCards() {
    return $$('.govuk-summary-card')
  }

  get summaryCardTitles() {
    return $$('.govuk-summary-card__title')
  }

  get allSummaryKeys() {
    return $$('.govuk-summary-list__key')
  }

  get allSummaryValues() {
    return $$('.govuk-summary-list__value')
  }

  get allChangeLinks() {
    return $$('.govuk-summary-list__actions a, .govuk-summary-card__action a')
  }

  async getValueForKey(keyText) {
    const keys = await this.allSummaryKeys
    for (let i = 0; i < keys.length; i++) {
      const text = await keys[i].getText()
      if (text.trim() === keyText) {
        const values = await this.allSummaryValues
        return values[i]?.getText() ?? ''
      }
    }
    return null
  }

  async getCardTitles() {
    const titles = await this.summaryCardTitles
    return Promise.all(titles.map((t) => t.getText()))
  }

  open() {
    return super.open('/admin/user-account/check-answers')
  }
}

// ─── Step 8: Confirmation ─────────────────────────────────────────────────────

class AddUserConfirmationPage extends GovUkFormPage {
  get whatHappensNextHeading() {
    return $('h2=What happens next')
  }

  get bodyParagraphs() {
    return $$('.govuk-body')
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const addUserStartPage = new AddUserStartPage()
export const addUserIsAdminPage = new AddUserIsAdminPage()
export const addUserDetailsPage = new AddUserDetailsPage()
export const addUserParentAreasPage = new AddUserParentAreasPage()
export const addUserMainAreaPage = new AddUserMainAreaPage()
export const addUserAdditionalAreasPage = new AddUserAdditionalAreasPage()
export const addUserCheckAnswersPage = new AddUserCheckAnswersPage()
export const addUserConfirmationPage = new AddUserConfirmationPage()

// ─── Shared journey helper ────────────────────────────────────────────────────

/**
 * Drives the complete add-user multi-step form for a given user type.
 * Returns the email used so callers can find the user in the list.
 *
 * @param {{
 *   isAdmin: boolean,
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   telephone?: string,
 *   organisation?: string,
 *   jobTitle?: string,
 *   responsibility?: 'EA'|'PSO'|'RMA'
 * }} userData
 */
export async function completeAddUserJourney(userData) {
  const {
    isAdmin,
    firstName,
    lastName,
    email,
    telephone,
    organisation,
    jobTitle,
    responsibility
  } = userData

  // Step 1 — start
  await addUserStartPage.open()
  await addUserStartPage.start()

  // Step 2 — is admin?
  if (isAdmin) {
    await addUserIsAdminPage.selectYes()
  } else {
    await addUserIsAdminPage.selectNo()
  }

  // Step 3 — details
  await addUserDetailsPage.fillDetails({
    firstName,
    lastName,
    email,
    telephone,
    organisation,
    jobTitle
  })
  if (!isAdmin && responsibility) {
    await addUserDetailsPage.selectResponsibility(responsibility)
  }
  await addUserDetailsPage.submitForm()

  if (!isAdmin) {
    const url = await browser.getUrl()

    // Step 4a — parent areas: EA areas (for PSO and RMA)
    if (
      (responsibility === 'PSO' || responsibility === 'RMA') &&
      url.includes('parent-areas')
    ) {
      await addUserParentAreasPage.selectFirstArea()
      await addUserParentAreasPage.submitForm()
    }

    // Step 4b — parent areas: PSO teams (for RMA only)
    const urlAfterEa = await browser.getUrl()
    if (responsibility === 'RMA' && urlAfterEa.includes('parent-areas')) {
      await addUserParentAreasPage.selectFirstArea()
      await addUserParentAreasPage.submitForm()
    }

    // Step 5 — main area
    const urlBeforeMain = await browser.getUrl()
    if (urlBeforeMain.includes('main-area')) {
      await addUserMainAreaPage.selectFirstAvailableArea()
      await addUserMainAreaPage.submitForm()
    }

    // Step 6 — additional areas (optional, just continue)
    const urlBeforeAdditional = await browser.getUrl()
    if (urlBeforeAdditional.includes('additional-areas')) {
      await addUserAdditionalAreasPage.submitForm()
    }
  }

  // Step 7 — check answers
  await addUserCheckAnswersPage.submitForm()

  return email
}
