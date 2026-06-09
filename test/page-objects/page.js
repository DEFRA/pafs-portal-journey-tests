import { browser, $ } from '@wdio/globals'

class Page {
  get pageHeading() {
    return $('h1')
  }

  get pageTitle() {
    return browser.getTitle()
  }

  open(path) {
    return browser.url(path)
  }
}

export { Page }
