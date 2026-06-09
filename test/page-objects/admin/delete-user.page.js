import { $ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class DeleteUserPage extends GovUkFormPage {
  get warningText() {
    return $('.govuk-warning-text')
  }

  get confirmDeleteButton() {
    return $('button=Delete user, button=Confirm delete, button=Yes\\, delete this user')
  }

  get cancelLink() {
    return $('a=Cancel')
  }

  get userNameInWarning() {
    return $('.govuk-warning-text strong, .govuk-warning-text b')
  }
}

export default new DeleteUserPage()
