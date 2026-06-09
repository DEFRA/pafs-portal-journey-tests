import { $, $$ } from '@wdio/globals'
import { GovUkFormPage } from 'page-objects/govuk-form.page.js'

class GeneralHomePage extends GovUkFormPage {
  get createProposalButton() {
    return $('a=Create a new proposal')
  }

  get searchField() {
    return $('#search')
  }

  get searchLabel() {
    return $('label[for="search"]')
  }

  get searchHint() {
    return $('#search-hint')
  }

  get filterButton() {
    return $('button=Filter')
  }

  get clearFiltersLink() {
    return $('a=Clear filters')
  }

  get insetText() {
    return $('.govuk-inset-text')
  }

  get proposalTableRows() {
    return $$('table tbody tr')
  }

  get navigationLinks() {
    return $$('.govuk-header__navigation-item a, nav .govuk-service-navigation__link')
  }

  open() {
    return super.open('/')
  }
}

export default new GeneralHomePage()
