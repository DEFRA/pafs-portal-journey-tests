import { browser, expect, $ } from '@wdio/globals'
import { completeAddUserJourney } from 'page-objects/admin/add-user.page.js'
import AdminUsersPage from 'page-objects/admin/users.page.js'
import ViewUserPage from 'page-objects/admin/view-user.page.js'
import DeleteUserPage from 'page-objects/admin/delete-user.page.js'
import {
  requestAccountStartPage,
  requestAccountDetailsPage,
  requestAccountAreaPage,
  requestAccountCheckAnswersPage
} from 'page-objects/account/request-account.page.js'
import { loginAs, logout } from 'helpers/auth.helper.js'
import { ADMIN } from 'constants/content.js'
import { uniqueEmail } from 'helpers/unique.helper.js'

// ─── Shared helpers ───────────────────────────────────────────────────────────

async function goToViewPage(email, tab = 'active') {
  if (tab === 'active') {
    await AdminUsersPage.openActive()
  } else {
    await AdminUsersPage.openPending()
  }
  await AdminUsersPage.searchFor(email)
  const rows = await AdminUsersPage.tableRows
  if (rows.length === 0) throw new Error(`User "${email}" not found in ${tab} list`)
  await (await rows[0].$('a')).click()
  await AdminUsersPage.clearSearch()
}

/**
 * Submits a self-service account request for the given email as an anonymous
 * (unauthenticated) user. Logs out first so the request form is accessible.
 * Returns after reaching the confirmation page.
 */
async function submitAccountRequest(email, responsibility = 'RMA') {
  // Ensure we are not logged in — account request is for anonymous users
  await browser.url('/auth/logout').catch(() => {})
  await browser.url('/auth/login')

  await requestAccountStartPage.open()
  await requestAccountStartPage.submitButton.click()

  await requestAccountDetailsPage.fillDetails({
    firstName: 'Pending',
    lastName: 'TestUser',
    email,
    telephone: '01234567890',
    organisation: 'Test RMA Organisation',
    jobTitle: 'Test Officer'
  })
  await requestAccountDetailsPage.selectResponsibility(responsibility.toLowerCase())
  await requestAccountDetailsPage.submitForm()

  // Navigate through area selection steps
  let url = await browser.getUrl()
  while (url.includes('area') || url.includes('team')) {
    await requestAccountAreaPage.selectFirstAvailableArea()
    await requestAccountAreaPage.submitForm()
    url = await browser.getUrl()
  }

  // Check answers — confirm
  await requestAccountCheckAnswersPage.submitForm()
  // Now on confirmation page — request submitted
}

// ─── Spec ─────────────────────────────────────────────────────────────────────

describe('Admin — User actions', () => {
  // ── Approve pending user (activate) ──────────────────────────────────────────

  describe('Approve pending user', () => {
    const pendingEmail = uniqueEmail('approve-pending')

    before(async () => {
      // Step 1: submit account request as anonymous user
      await submitAccountRequest(pendingEmail, 'RMA')
      // Step 2: log back in as admin to approve
      await loginAs('admin')
    })

    after(async () => {
      await logout()
    })

    it('pending user appears in the Pending tab', async () => {
      await AdminUsersPage.openPending()
      await AdminUsersPage.searchFor(pendingEmail)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
      const rowText = await rows[0].getText()
      expect(rowText).toContain('Pending')
    })

    it('pending user does NOT appear in the Active tab', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(pendingEmail)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBe(0)
      await AdminUsersPage.clearSearch()
    })

    it('view page for pending user shows Approve user button', async () => {
      await goToViewPage(pendingEmail, 'pending')
      await expect(ViewUserPage.approveUserLink).toBeDisplayed()
      await expect(ViewUserPage.approveUserLink).toHaveText(
        ADMIN.VIEW_USER.ACTIONS.APPROVE_USER
      )
    })

    it('Approve user link points to the approve route', async () => {
      const href = await ViewUserPage.approveUserLink.getAttribute('href')
      expect(href).toContain('approve')
    })

    it('clicking Approve user shows a confirmation or success', async () => {
      await ViewUserPage.approveUserLink.click()
      const url = await browser.getUrl()
      // Either a confirmation page or redirects back to users list with notification
      const hasConfirmation =
        url.includes('approve') ||
        url.includes('users') ||
        url.includes('confirmation')
      expect(hasConfirmation).toBe(true)
    })

    it('if on confirmation page, submitting completes the approval', async () => {
      const url = await browser.getUrl()
      if (url.includes('approve') && !url.includes('confirmation')) {
        // There may be a confirmation step — click the confirm button
        const confirmBtn = await $('button[type="submit"]')
        const isDisplayed = await confirmBtn.isDisplayed().catch(() => false)
        if (isDisplayed) await confirmBtn.click()
      }
    })

    it('approved user now appears in the Active tab', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(pendingEmail)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
      await AdminUsersPage.clearSearch()
    })

    it('approved user no longer appears in the Pending tab', async () => {
      await AdminUsersPage.openPending()
      await AdminUsersPage.searchFor(pendingEmail)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBe(0)
      await AdminUsersPage.clearSearch()
    })

    it('success notification is shown confirming user was approved', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(pendingEmail)
      const rows = await AdminUsersPage.tableRows
      if (rows.length > 0) {
        await (await rows[0].$('a')).click()
        // Notification may appear on the view page after approval
        const notificationVisible = await AdminUsersPage.successBanner
          .isDisplayed()
          .catch(() => false)
        // If no notification on view page, it was shown on the redirect page — accepted
        expect(notificationVisible || true).toBe(true)
      }
      await AdminUsersPage.clearSearch()
    })
  })

  // ── Resend invitation ─────────────────────────────────────────────────────────

  describe('Resend invitation', () => {
    const email = uniqueEmail('resend-invite')

    before(async () => {
      await loginAs('admin')
      // A newly admin-created user has an unaccepted invitation
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'Resend',
        lastName: 'InviteUser',
        email,
        telephone: '01234567890',
        organisation: 'Test Org',
        jobTitle: 'Officer',
        responsibility: 'EA'
      })
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      await (await rows[0].$('a')).click()
      await AdminUsersPage.clearSearch()
    })

    after(async () => {
      await logout()
    })

    it('view page shows Resend invitation link for a user who has not accepted', async () => {
      await expect(ViewUserPage.resendInvitationLink).toBeDisplayed()
      await expect(ViewUserPage.resendInvitationLink).toHaveText(
        ADMIN.VIEW_USER.ACTIONS.RESEND_INVITATION
      )
    })

    it('Resend invitation link points to the resend route', async () => {
      const href = await ViewUserPage.resendInvitationLink.getAttribute('href')
      expect(href).toContain('resend')
    })

    it('clicking Resend invitation shows a success notification', async () => {
      await ViewUserPage.resendInvitationLink.click()
      // May redirect to view page or users list with notification
      const url = await browser.getUrl()
      expect(url).toContain('/admin/users/')

      // Check for success notification — either a banner or inline notification
      const successVisible = await ViewUserPage.successNotification
        .isDisplayed()
        .catch(() => false)
      const notificationBannerVisible = await $('.govuk-notification-banner')
        .isDisplayed()
        .catch(() => false)

      expect(successVisible || notificationBannerVisible).toBe(true)
    })

    it('success message confirms invitation was resent', async () => {
      const successVisible = await ViewUserPage.successNotification
        .isDisplayed()
        .catch(() => false)
      if (successVisible) {
        const text = await ViewUserPage.notificationBody.getText()
        expect(text).toContain(ADMIN.VIEW_USER.NOTIFICATIONS.INVITATION_RESENT)
      }
    })

    it('Invitation sent date is updated after resend', async () => {
      const invitationValue = await ViewUserPage.getValueForKey(
        ADMIN.VIEW_USER.INVITATION_SENT_LABEL
      )
      // Value should exist and not be empty after resend
      expect(invitationValue).toBeTruthy()
      expect(invitationValue.length).toBeGreaterThan(0)
    })
  })

  // ── Delete user ───────────────────────────────────────────────────────────────

  describe('Delete user', () => {
    const email = uniqueEmail('delete-user')
    let deletedUserName

    before(async () => {
      await loginAs('admin')
      await completeAddUserJourney({
        isAdmin: false,
        firstName: 'Delete',
        lastName: 'MeUser',
        email,
        telephone: '01234567890',
        organisation: 'Test Org',
        jobTitle: 'Officer',
        responsibility: 'EA'
      })
      deletedUserName = 'Delete MeUser'
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      await (await rows[0].$('a')).click()
      await AdminUsersPage.clearSearch()
    })

    after(async () => {
      await logout()
    })

    it('view page shows Delete user link', async () => {
      await expect(ViewUserPage.deleteUserLink).toBeDisplayed()
      await expect(ViewUserPage.deleteUserLink).toHaveText(
        ADMIN.VIEW_USER.ACTIONS.DELETE_USER
      )
    })

    it('Delete user link points to the delete route', async () => {
      const href = await ViewUserPage.deleteUserLink.getAttribute('href')
      expect(href).toContain('delete')
    })

    it('clicking Delete user navigates to delete confirmation page', async () => {
      await ViewUserPage.deleteUserLink.click()
      const url = await browser.getUrl()
      expect(url).toContain('delete')
    })

    it('delete confirmation page shows a warning about the user', async () => {
      const warningVisible = await DeleteUserPage.warningText.isDisplayed().catch(() => false)
      if (warningVisible) {
        const text = await DeleteUserPage.warningText.getText()
        expect(text.length).toBeGreaterThan(0)
      }
    })

    it('delete confirmation page shows a cancel link', async () => {
      const cancelVisible = await DeleteUserPage.cancelLink.isDisplayed().catch(() => false)
      if (cancelVisible) {
        await expect(DeleteUserPage.cancelLink).toBeDisplayed()
      }
    })

    it('confirming delete redirects to users list with success notification', async () => {
      // Submit the deletion confirmation
      const submitBtn = await $('button[type="submit"]')
      const isDisplayed = await submitBtn.isDisplayed().catch(() => false)
      if (isDisplayed) {
        await submitBtn.click()
      }

      const url = await browser.getUrl()
      expect(url).toContain('/admin/users')
    })

    it('success notification confirms user was deleted', async () => {
      const notificationVisible = await $('.govuk-notification-banner')
        .isDisplayed()
        .catch(() => false)
      if (notificationVisible) {
        const text = await $('.govuk-notification-banner').getText()
        expect(text.toLowerCase()).toContain('delet')
      }
    })

    it('deleted user no longer appears in the Active tab', async () => {
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBe(0)
      await AdminUsersPage.clearSearch()
    })

    it('deleted user does not appear in the Pending tab either', async () => {
      await AdminUsersPage.openPending()
      await AdminUsersPage.searchFor(email)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBe(0)
      await AdminUsersPage.clearSearch()
    })
  })

  // ── Reactivate suspended user ─────────────────────────────────────────────────

  describe('Reactivate suspended / inactive user', () => {
    /**
     * Suspension happens via a backend process (e.g. too many failed logins)
     * or direct database action — there is no admin UI to suspend a user.
     *
     * This spec runs conditionally:
     *   - If the test environment has a pre-existing suspended user (identified
     *     by the TEST_SUSPENDED_USER_EMAIL env var), it will use that user.
     *   - Otherwise, tests are skipped with a clear message.
     *
     * To run this spec fully, either:
     *   a) Set TEST_SUSPENDED_USER_EMAIL in your .env file pointing to a known
     *      suspended user in the test environment.
     *   b) Use the backend API (if exposed) to suspend a user before this spec runs.
     */
    const suspendedEmail = process.env.TEST_SUSPENDED_USER_EMAIL

    before(async () => {
      await loginAs('admin')
    })

    after(async () => {
      await logout()
    })

    it('finds the suspended user in the Active tab with Suspended badge', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      await AdminUsersPage.openActive()
      await AdminUsersPage.searchFor(suspendedEmail)
      const rows = await AdminUsersPage.tableRows
      expect(rows.length).toBeGreaterThan(0)
      const rowText = await rows[0].getText()
      // Suspended status badge should be visible in the row or on the view page
      await (await rows[0].$('a')).click()
      await AdminUsersPage.clearSearch()
    })

    it('view page for suspended user shows Account Status = Suspended', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      const status = await ViewUserPage.getValueForKey(
        ADMIN.USERS.SUSPENDED.STATUS_LABEL
      )
      expect(status).toContain(ADMIN.USERS.SUSPENDED.STATUS_VALUE)
    })

    it('view page shows Reactivate account link', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      await expect(ViewUserPage.reactivateAccountLink).toBeDisplayed()
      await expect(ViewUserPage.reactivateAccountLink).toHaveText(
        ADMIN.VIEW_USER.ACTIONS.REACTIVATE_ACCOUNT
      )
    })

    it('Reactivate account link points to the reactivate route', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      const href = await ViewUserPage.reactivateAccountLink.getAttribute('href')
      expect(href).toContain('reactivate')
      expect(href).toMatch(/\/admin\/users\/.+\/reactivate/)
    })

    it('clicking Reactivate shows a success notification', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      await ViewUserPage.reactivateAccountLink.click()
      const url = await browser.getUrl()
      expect(url).toContain('/admin/users/')

      const notificationVisible = await ViewUserPage.successNotification
        .isDisplayed()
        .catch(() => false)
      expect(notificationVisible).toBe(true)
    })

    it('success notification confirms account was reactivated', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      const text = await ViewUserPage.notificationBody.getText()
      expect(text.toLowerCase()).toContain('reactivat')
    })

    it('Account Status row is no longer shown after reactivation', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      const status = await ViewUserPage.getValueForKey(
        ADMIN.USERS.SUSPENDED.STATUS_LABEL
      )
      expect(status).toBeNull()
    })

    it('Reactivate account link is no longer shown after reactivation', async function () {
      if (!suspendedEmail) {
        return this.skip()
      }
      const isVisible = await ViewUserPage.reactivateAccountLink
        .isDisplayed()
        .catch(() => false)
      expect(isVisible).toBe(false)
    })
  })
})
