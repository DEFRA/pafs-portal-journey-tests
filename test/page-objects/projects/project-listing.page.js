import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class ProjectListingPage extends GovUkFormPage {
  get createButton() {
    return $('a=Create a new proposal')
  }

  get searchInput() {
    return $('input[name="search"], #search')
  }

  get filterButton() {
    return $('button=Filter')
  }

  get clearFiltersLink() {
    return $('a=Clear filters')
  }

  get proposalRows() {
    return $$('table tbody tr')
  }

  async open() {
    return browser.url('/home')
  }
}

export default new ProjectListingPage()
