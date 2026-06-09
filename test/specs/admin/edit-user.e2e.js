import { browser, expect, $ } from '@wdio/globals'
import {
  addUserDetailsPage,
  addUserCheckAnswersPage,
  addUserIsAdminPage,
  addUserMainAreaPage,
  addUserAdditionalAreasPage,
  completeAddUserJourney
} from 'page-objects/admin/add-user.page.js'
import AdminUsersPage from 'page-objects/admin/users.page.js'
import ViewUserPage from 'page-objects/admin/view-user.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { ADMIN, COMMON } from 'constants/content.js'
import { uniqueEmail, uniqueEaEmail } from 'helpers/unique.helper.js'

const C = ADMIN.ADD_USER

// ─── Shared helper ────────────────────────────────────────────────────────────

/**
 * Searches the active users list for a user by email and navigates to their
 * view page. Throws clearly if the user is not found.
 */
async function goToViewPage(email) {
  await AdminUsersPage.openActive()
  await AdminUsersPage.searchFor(email)
  const rows = await AdminUsersPage.tableRows
  if (rows.length === 0) {
    throw new Error(`User "${email}" not found in active list — check if add-user setup ran`)
  }
  const link = await rows[0].$('a')
  await link.click()
  await AdminUsersPage.clearSearch()
}

/**
 * After changing personal details on a non-admin user, the app routes through
 * area pages before reaching check-answers. This skips through all of them
 * unchanged (just continuing), arriving at check-answers.
 */
async function skipThroughAreaPages() {
  let url = await browser.getUrl()
  while (
    url.includes('parent-areas') ||
    url.includes('main-area') ||
    url.includes('additional-areas')
  ) {
    await $('button[type="submit"]').click()
    url = await browser.getUrl()
  }
}

// ─── Spec ─────────────────────────────────────────────────────────────────────

describe('Admin — Edit user', () => {
  before(async () => {
    await loginAs('admin')
  })

  after(async () => {
    await logout()
  })

  // ── Edit ALL fields — Admin user ─────────────────────────────────────────────

  describe('Edit all personal fields — Admin user (firstName, lastName, email)', () => {
    const originalEmail = uniqueEmail('edit-admin-orig')
    const updatedEmail = uniqueEmail('edit-admin-updated')
    const updated = { firstName: 'UpdatedFirst', lastName: 'UpdatedLast' }

    before(async () => {
      await completeAddUserJourney({
        isAdmin: true,
        firstName: 'OriginalFirst',
        lastName: 'OriginalLast',
        email: originalEmail
      })
      await goToViewPage(originalEmail)
    })

    it('view page shows original first name', async () => {
      expect(await ViewUserPage.getValueForKey('First name')).toContain('OriginalFirst')
    })

    it('view page shows original last name', async () => {
      expect(await ViewUserPage.getValueForKey('Last name')).toContain('OriginalLast')
    })

    it('view page shows original email', async () => {
      expect(await ViewUserPage.getValueForKey('Email')).toContain(originalEmail)
    })

    it('Change link for First name navigates to edit details page', async () => {
      const href = await ViewUserPage.getChangeLinkHrefForKey('First name')
      expect(href).toContain('details')
    })

    it('edit details form is pre-populated with all 3 original values', async () => {
      await ViewUserPage.clickChangeForKey('First name')
      expect(await addUserDetailsPage.firstNameField.getValue()).toBe('OriginalFirst')
      expect(await addUserDetailsPage.lastNameField.getValue()).toBe('OriginalLast')
      expect(await addUserDetailsPage.emailField.getValue()).toBe(originalEmail)
    })

    it('updates all 3 fields simultaneously', async () => {
      await addUserDetailsPage.firstNameField.clearValue()
      await addUserDetailsPage.firstNameField.setValue(updated.firstName)
      await addUserDetailsPage.lastNameField.clearValue()
      await addUserDetailsPage.lastNameField.setValue(updated.lastName)
      await addUserDetailsPage.emailField.clearValue()
      await addUserDetailsPage.emailField.setValue(updatedEmail)
      await addUserDetailsPage.submitForm()
    })

    it('check answers shows the Review changes heading', async () => {
      await expect(addUserCheckAnswersPage.pageHeading).toHaveText(
        C.CHECK_ANSWERS.EDIT_PAGE_HEADING
      )
    })

    it('check answers shows updated first name', async () => {
      expect(await addUserCheckAnswersPage.getValueForKey('First name')).toContain(
        updated.firstName
      )
    })

    it('check answers shows updated last name', async () => {
      expect(await addUserCheckAnswersPage.getValueForKey('Last name')).toContain(
        updated.lastName
      )
    })

    it('check answers shows updated email', async () => {
      expect(await addUserCheckAnswersPage.getValueForKey('Email')).toContain(updatedEmail)
    })

    it('check answers submit button says Confirm and update user', async () => {
      await expect(addUserCheckAnswersPage.submitButton).toHaveText(
        C.CHECK_ANSWERS.EDIT_SUBMIT_BUTTON
      )
    })

    it('submitting shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page heading reflects updated full name', async () => {
      await expect(ViewUserPage.pageHeading).toHaveText(
        `${updated.firstName} ${updated.lastName}`
      )
    })

    it('view page shows updated first name', async () => {
      expect(await ViewUserPage.getValueForKey('First name')).toContain(updated.firstName)
    })

    it('view page shows updated last name', async () => {
      expect(await ViewUserPage.getValueForKey('Last name')).toContain(updated.lastName)
    })

    it('view page shows updated email', async () => {
      expect(await ViewUserPage.getValueForKey('Email')).toContain(updatedEmail)
    })
  })

  // ── Edit ALL fields — EA user (all 6 personal fields) ────────────────────────

  describe('Edit all personal fields — EA user (all 6 fields)', () => {
    const originalEmail = uniqueEaEmail()
    const updatedEmail = uniqueEaEmail()
    const original = {
      firstName: 'EAOrig',
      lastName: 'UserOrig',
      telephone: '01111111111',
      organisation: 'Original EA Org',
      jobTitle: 'Original Job'
    }
    const updated = {
      firstName: 'EAUpdated',
      lastName: 'UserUpdated',
      telephone: '02222222222',
      organisation: 'Updated EA Org',
      jobTitle: 'Updated Job Title'
    }

    before(async () => {
      await completeAddUserJourney({
        isAdmin: false,
        ...original,
        email: originalEmail,
        responsibility: 'EA'
      })
      await goToViewPage(originalEmail)
    })

    it('view page shows original values for all 6 fields', async () => {
      const fields = await ViewUserPage.getAllFieldValues()
      expect(fields['First name']).toContain(original.firstName)
      expect(fields['Last name']).toContain(original.lastName)
      expect(fields['Email']).toContain(originalEmail)
      expect(fields['Telephone']).toContain(original.telephone)
      expect(fields['Organisation']).toContain(original.organisation)
      expect(fields['Job title']).toContain(original.jobTitle)
    })

    it('edit form is pre-populated with all 6 original values', async () => {
      await ViewUserPage.clickChangeForKey('First name')
      expect(await addUserDetailsPage.firstNameField.getValue()).toBe(original.firstName)
      expect(await addUserDetailsPage.lastNameField.getValue()).toBe(original.lastName)
      expect(await addUserDetailsPage.emailField.getValue()).toBe(originalEmail)
      expect(await addUserDetailsPage.telephoneField.getValue()).toBe(original.telephone)
      expect(await addUserDetailsPage.organisationField.getValue()).toBe(original.organisation)
      expect(await addUserDetailsPage.jobTitleField.getValue()).toBe(original.jobTitle)
    })

    it('updates all 6 fields simultaneously', async () => {
      await addUserDetailsPage.firstNameField.clearValue()
      await addUserDetailsPage.firstNameField.setValue(updated.firstName)
      await addUserDetailsPage.lastNameField.clearValue()
      await addUserDetailsPage.lastNameField.setValue(updated.lastName)
      await addUserDetailsPage.emailField.clearValue()
      await addUserDetailsPage.emailField.setValue(updatedEmail)
      await addUserDetailsPage.telephoneField.clearValue()
      await addUserDetailsPage.telephoneField.setValue(updated.telephone)
      await addUserDetailsPage.organisationField.clearValue()
      await addUserDetailsPage.organisationField.setValue(updated.organisation)
      await addUserDetailsPage.jobTitleField.clearValue()
      await addUserDetailsPage.jobTitleField.setValue(updated.jobTitle)
      await addUserDetailsPage.submitForm()
      await skipThroughAreaPages()
    })

    it('check answers shows all 6 updated values', async () => {
      await expect(addUserCheckAnswersPage.pageHeading).toHaveText(
        C.CHECK_ANSWERS.EDIT_PAGE_HEADING
      )
      expect(await addUserCheckAnswersPage.getValueForKey('First name')).toContain(updated.firstName)
      expect(await addUserCheckAnswersPage.getValueForKey('Last name')).toContain(updated.lastName)
      expect(await addUserCheckAnswersPage.getValueForKey('Email')).toContain(updatedEmail)
      expect(await addUserCheckAnswersPage.getValueForKey('Telephone')).toContain(updated.telephone)
      expect(await addUserCheckAnswersPage.getValueForKey('Organisation')).toContain(updated.organisation)
      expect(await addUserCheckAnswersPage.getValueForKey('Job title')).toContain(updated.jobTitle)
    })

    it('submitting shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page reflects all 6 updated values', async () => {
      const fields = await ViewUserPage.getAllFieldValues()
      expect(fields['First name']).toContain(updated.firstName)
      expect(fields['Last name']).toContain(updated.lastName)
      expect(fields['Email']).toContain(updatedEmail)
      expect(fields['Telephone']).toContain(updated.telephone)
      expect(fields['Organisation']).toContain(updated.organisation)
      expect(fields['Job title']).toContain(updated.jobTitle)
    })
  })

  // ── Edit ALL fields — PSO user ────────────────────────────────────────────────

  describe('Edit all personal fields — PSO user (all 6 fields)', () => {
    const originalEmail = uniqueEmail('edit-pso-orig')
    const updatedEmail = uniqueEmail('edit-pso-updated')
    const updated = {
      firstName: 'PSOUpdated',
      lastName: 'UserUpdated',
      telephone: '03333333333',
      organisation: 'Updated PSO Org',
      jobTitle: 'Updated PSO Title'
    }

    before(async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'PSOOrig',
        lastName: 'UserOrig',
        email: originalEmail,
        telephone: '01234567890',
        organisation: 'Original PSO Org',
        jobTitle: 'Original PSO Title',
        responsibility: 'PSO'
      })
      await goToViewPage(originalEmail)
    })

    it('edit form is pre-populated with all PSO user fields', async () => {
      await ViewUserPage.clickChangeForKey('First name')
      expect(await addUserDetailsPage.firstNameField.getValue()).toBe('PSOOrig')
      expect(await addUserDetailsPage.lastNameField.getValue()).toBe('UserOrig')
      expect(await addUserDetailsPage.emailField.getValue()).toBe(originalEmail)
      expect(await addUserDetailsPage.telephoneField.getValue()).toBe('01234567890')
      expect(await addUserDetailsPage.organisationField.getValue()).toBe('Original PSO Org')
      expect(await addUserDetailsPage.jobTitleField.getValue()).toBe('Original PSO Title')
    })

    it('updates all 6 PSO user fields', async () => {
      await addUserDetailsPage.firstNameField.clearValue()
      await addUserDetailsPage.firstNameField.setValue(updated.firstName)
      await addUserDetailsPage.lastNameField.clearValue()
      await addUserDetailsPage.lastNameField.setValue(updated.lastName)
      await addUserDetailsPage.emailField.clearValue()
      await addUserDetailsPage.emailField.setValue(updatedEmail)
      await addUserDetailsPage.telephoneField.clearValue()
      await addUserDetailsPage.telephoneField.setValue(updated.telephone)
      await addUserDetailsPage.organisationField.clearValue()
      await addUserDetailsPage.organisationField.setValue(updated.organisation)
      await addUserDetailsPage.jobTitleField.clearValue()
      await addUserDetailsPage.jobTitleField.setValue(updated.jobTitle)
      await addUserDetailsPage.submitForm()
      await skipThroughAreaPages()
    })

    it('check answers shows all 6 updated PSO values', async () => {
      const fields = {
        'First name': updated.firstName,
        'Last name': updated.lastName,
        Email: updatedEmail,
        Telephone: updated.telephone,
        Organisation: updated.organisation,
        'Job title': updated.jobTitle
      }
      for (const [key, val] of Object.entries(fields)) {
        expect(await addUserCheckAnswersPage.getValueForKey(key)).toContain(val)
      }
    })

    it('submitting shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page reflects all 6 updated PSO values', async () => {
      const pageFields = await ViewUserPage.getAllFieldValues()
      expect(pageFields['First name']).toContain(updated.firstName)
      expect(pageFields['Last name']).toContain(updated.lastName)
      expect(pageFields['Email']).toContain(updatedEmail)
      expect(pageFields['Telephone']).toContain(updated.telephone)
      expect(pageFields['Organisation']).toContain(updated.organisation)
      expect(pageFields['Job title']).toContain(updated.jobTitle)
    })
  })

  // ── Edit ALL fields — RMA user ────────────────────────────────────────────────

  describe('Edit all personal fields — RMA user (all 6 fields)', () => {
    const originalEmail = uniqueEmail('edit-rma-orig')
    const updatedEmail = uniqueEmail('edit-rma-updated')
    const updated = {
      firstName: 'RMAUpdated',
      lastName: 'UserUpdated',
      telephone: '04444444444',
      organisation: 'Updated RMA Org',
      jobTitle: 'Updated RMA Title'
    }

    before(async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'RMAOrig',
        lastName: 'UserOrig',
        email: originalEmail,
        telephone: '01234567890',
        organisation: 'Original RMA Org',
        jobTitle: 'Original RMA Title',
        responsibility: 'RMA'
      })
      await goToViewPage(originalEmail)
    })

    it('edit form is pre-populated with all RMA user fields', async () => {
      await ViewUserPage.clickChangeForKey('First name')
      expect(await addUserDetailsPage.firstNameField.getValue()).toBe('RMAOrig')
      expect(await addUserDetailsPage.lastNameField.getValue()).toBe('UserOrig')
      expect(await addUserDetailsPage.emailField.getValue()).toBe(originalEmail)
      expect(await addUserDetailsPage.telephoneField.getValue()).toBe('01234567890')
      expect(await addUserDetailsPage.organisationField.getValue()).toBe('Original RMA Org')
      expect(await addUserDetailsPage.jobTitleField.getValue()).toBe('Original RMA Title')
    })

    it('updates all 6 RMA user fields', async () => {
      await addUserDetailsPage.firstNameField.clearValue()
      await addUserDetailsPage.firstNameField.setValue(updated.firstName)
      await addUserDetailsPage.lastNameField.clearValue()
      await addUserDetailsPage.lastNameField.setValue(updated.lastName)
      await addUserDetailsPage.emailField.clearValue()
      await addUserDetailsPage.emailField.setValue(updatedEmail)
      await addUserDetailsPage.telephoneField.clearValue()
      await addUserDetailsPage.telephoneField.setValue(updated.telephone)
      await addUserDetailsPage.organisationField.clearValue()
      await addUserDetailsPage.organisationField.setValue(updated.organisation)
      await addUserDetailsPage.jobTitleField.clearValue()
      await addUserDetailsPage.jobTitleField.setValue(updated.jobTitle)
      await addUserDetailsPage.submitForm()
      await skipThroughAreaPages()
    })

    it('check answers shows all 6 updated RMA values', async () => {
      const fields = {
        'First name': updated.firstName,
        'Last name': updated.lastName,
        Email: updatedEmail,
        Telephone: updated.telephone,
        Organisation: updated.organisation,
        'Job title': updated.jobTitle
      }
      for (const [key, val] of Object.entries(fields)) {
        expect(await addUserCheckAnswersPage.getValueForKey(key)).toContain(val)
      }
    })

    it('submitting shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page reflects all 6 updated RMA values', async () => {
      const pageFields = await ViewUserPage.getAllFieldValues()
      expect(pageFields['First name']).toContain(updated.firstName)
      expect(pageFields['Last name']).toContain(updated.lastName)
      expect(pageFields['Email']).toContain(updatedEmail)
      expect(pageFields['Telephone']).toContain(updated.telephone)
      expect(pageFields['Organisation']).toContain(updated.organisation)
      expect(pageFields['Job title']).toContain(updated.jobTitle)
    })
  })

  // ── Edit admin status — both directions ───────────────────────────────────────

  describe('Edit admin status — non-admin → admin', () => {
    const email = uniqueEaEmail()

    before(async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'Promote',
        lastName: 'ToAdmin',
        email,
        telephone: '01234567890',
        organisation: 'EA',
        jobTitle: 'Officer',
        responsibility: 'EA'
      })
      await goToViewPage(email)
    })

    it('view page shows Is admin? = No', async () => {
      expect(await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)).toContain(
        ADMIN.VIEW_USER.IS_ADMIN_NO
      )
    })

    it('Change admin status link points to the is-admin edit route', async () => {
      const href = await ViewUserPage.getChangeLinkHrefForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)
      expect(href).toContain('is-admin')
    })

    it('is-admin edit page is pre-populated with No selected', async () => {
      await ViewUserPage.clickChangeForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)
      const noSelected = await addUserIsAdminPage.noRadio.isSelected()
      expect(noSelected).toBe(true)
    })

    it('selecting Yes and continuing updates check answers to show Yes', async () => {
      await addUserIsAdminPage.yesRadio.click()
      await addUserIsAdminPage.submitForm()
      const value = await addUserCheckAnswersPage.getValueForKey(
        C.CHECK_ANSWERS.WILL_BE_ADMIN_LABEL
      )
      expect(value).toContain('Yes')
    })

    it('confirming shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page shows Is admin? = Yes after update', async () => {
      expect(await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)).toContain(
        ADMIN.VIEW_USER.IS_ADMIN_YES
      )
    })
  })

  describe('Edit admin status — admin → non-admin (requires area selection)', () => {
    const email = uniqueEmail('demote-admin')

    before(async () => {
      await completeAddUserJourney({
        isAdmin: true,
        firstName: 'Demote',
        lastName: 'FromAdmin',
        email
      })
      await goToViewPage(email)
    })

    it('view page shows Is admin? = Yes initially', async () => {
      expect(await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)).toContain(
        ADMIN.VIEW_USER.IS_ADMIN_YES
      )
    })

    it('is-admin edit page is pre-populated with Yes selected', async () => {
      await ViewUserPage.clickChangeForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)
      const yesSelected = await addUserIsAdminPage.yesRadio.isSelected()
      expect(yesSelected).toBe(true)
    })

    it('selecting No routes through area selection steps', async () => {
      await addUserIsAdminPage.noRadio.click()
      await addUserIsAdminPage.submitForm()
      // Now on details page — responsibility selection required
      const url = await browser.getUrl()
      expect(url).toContain('details')
    })

    it('responsibility selection is shown for the now non-admin user', async () => {
      const radios = await addUserDetailsPage.responsibilityRadios
      expect(radios.length).toBe(3)
    })

    it('selecting RMA responsibility and completing area steps reaches check answers', async () => {
      await addUserDetailsPage.selectResponsibility('RMA')
      await addUserDetailsPage.submitForm()
      await skipThroughAreaPages()
      await expect(addUserCheckAnswersPage.pageHeading).toHaveText(
        C.CHECK_ANSWERS.EDIT_PAGE_HEADING
      )
    })

    it('check answers shows Will be an administrator = No', async () => {
      const value = await addUserCheckAnswersPage.getValueForKey(
        C.CHECK_ANSWERS.WILL_BE_ADMIN_LABEL
      )
      expect(value).toContain('No')
    })

    it('confirming shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page shows Is admin? = No after update', async () => {
      expect(await ViewUserPage.getValueForKey(ADMIN.VIEW_USER.IS_ADMIN_LABEL)).toContain(
        ADMIN.VIEW_USER.IS_ADMIN_NO
      )
    })
  })

  // ── Edit main area ────────────────────────────────────────────────────────────

  describe('Edit main area — EA user', () => {
    const email = uniqueEmail('edit-area')
    let originalAreaName
    let newAreaName

    before(async () => {
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'AreaEdit',
        lastName: 'User',
        email,
        telephone: '01234567890',
        organisation: 'Test Org',
        jobTitle: 'Officer',
        responsibility: 'EA'
      })
      await goToViewPage(email)
      // Capture the original area name before any edit
      originalAreaName = await ViewUserPage.getValueForKey('Main area')
    })

    it('view page shows the original area in the Area selection card', async () => {
      expect(originalAreaName).toBeTruthy()
      expect(originalAreaName.length).toBeGreaterThan(0)
    })

    it('Change link for Main area is present and points to the edit route', async () => {
      const href = await ViewUserPage.getChangeLinkHrefForKey('Main area')
      expect(href).toBeTruthy()
      expect(href).toContain('main-area')
    })

    it('clicking Change main area navigates to the area edit page', async () => {
      await ViewUserPage.clickChangeForKey('Main area')
      const url = await browser.getUrl()
      expect(url).toContain('main-area')
    })

    it('the area select dropdown is pre-populated with the current area', async () => {
      const selectedValue = await addUserMainAreaPage.areaSelect.getValue()
      // A value should already be selected (not the empty placeholder)
      expect(selectedValue).toBeTruthy()
      expect(selectedValue).not.toBe('')
    })

    it('selects a different area from the dropdown', async () => {
      newAreaName = await addUserMainAreaPage.selectDifferentFromCurrent()
      // New selection must differ from what was there before
      expect(newAreaName).toBeTruthy()
      expect(newAreaName).not.toBe(originalAreaName)
    })

    it('continuing moves to additional-areas or check-answers page', async () => {
      await addUserMainAreaPage.submitForm()
      const url = await browser.getUrl()
      expect(
        url.includes('additional-areas') || url.includes('check-answers')
      ).toBe(true)
    })

    it('navigates through additional-areas to check-answers', async () => {
      const url = await browser.getUrl()
      if (url.includes('additional-areas')) {
        await addUserAdditionalAreasPage.submitForm()
      }
      await expect(addUserCheckAnswersPage.pageHeading).toHaveText(
        C.CHECK_ANSWERS.EDIT_PAGE_HEADING
      )
    })

    it('check-answers shows the newly selected area in the Area selection section', async () => {
      const areaValue = await addUserCheckAnswersPage.getValueForKey('Main area')
      expect(areaValue).toContain(newAreaName)
    })

    it('check-answers does NOT show the old area as main area', async () => {
      const areaValue = await addUserCheckAnswersPage.getValueForKey('Main area')
      expect(areaValue).not.toContain(originalAreaName)
    })

    it('check-answers shows Confirm and update user button', async () => {
      await expect(addUserCheckAnswersPage.submitButton).toHaveText(
        C.CHECK_ANSWERS.EDIT_SUBMIT_BUTTON
      )
    })

    it('confirming shows success notification with correct message', async () => {
      await addUserCheckAnswersPage.submitForm()
      await expect(ViewUserPage.successNotification).toBeDisplayed()
      const msg = await ViewUserPage.getSuccessNotificationText()
      expect(msg).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.UPDATED)
    })

    it('view page shows the new area in the Area selection card', async () => {
      const areaValue = await ViewUserPage.getValueForKey('Main area')
      expect(areaValue).toContain(newAreaName)
    })

    it('view page does NOT show the old area as the main area', async () => {
      const areaValue = await ViewUserPage.getValueForKey('Main area')
      expect(areaValue).not.toContain(originalAreaName)
    })
  })

  // ── Validation ────────────────────────────────────────────────────────────────

  describe('Edit validation — all error messages', () => {
    const email = uniqueEmail('edit-validation')

    before(async () => {
      await completeAddUserJourney({
        isAdmin: true,
        firstName: 'ValidateEdit',
        lastName: 'User',
        email
      })
      await goToViewPage(email)
      await ViewUserPage.clickChangeForKey('First name')
    })

    it('shows error summary when first name is cleared', async () => {
      await addUserDetailsPage.firstNameField.clearValue()
      await addUserDetailsPage.submitForm()
      await expect(addUserDetailsPage.errorSummary).toBeDisplayed()
      await expect(addUserDetailsPage.errorSummaryTitle).toHaveText(
        COMMON.ERROR_SUMMARY_HEADING
      )
    })

    it('shows first name required error', async () => {
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.FIRST_NAME_REQUIRED)
    })

    it('shows last name required error when last name cleared', async () => {
      await addUserDetailsPage.firstNameField.setValue('Valid')
      await addUserDetailsPage.lastNameField.clearValue()
      await addUserDetailsPage.submitForm()
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.LAST_NAME_REQUIRED)
    })

    it('shows email format error for invalid email', async () => {
      await addUserDetailsPage.lastNameField.setValue('Valid')
      await addUserDetailsPage.emailField.clearValue()
      await addUserDetailsPage.emailField.setValue('not-an-email')
      await addUserDetailsPage.submitForm()
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.EMAIL_INVALID)
    })

    it('shows email required error when email is cleared entirely', async () => {
      await addUserDetailsPage.emailField.clearValue()
      await addUserDetailsPage.submitForm()
      const errors = await addUserDetailsPage.getErrorMessages()
      expect(errors).toContain(C.DETAILS.ERRORS.EMAIL_REQUIRED)
    })
  })
})
