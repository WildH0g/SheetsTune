/**
 * Opens a sidebar in the Google Sheets UI displaying the HTML content from 'ui/index'
 * @returns {void}
 */
export function openSideBar() {
  SpreadsheetApp.getUi().showSidebar(
    HtmlService.createHtmlOutputFromFile('ui/index')
  );
}
