/**
 * Extracts data from an AG Grid row element.
 * Converts a string representation of a row element into a DOM element if necessary,
 * and then extracts data from each cell within the row.
 * 
 * @param {HTMLElement|string} rowElement - The AG Grid row element or its HTML string.
 * @returns {Object|null} An object containing the extracted cell data, or null if the input is invalid.
 */
function extractRowData(rowElement) {
    // If a string is provided, create a temporary element to parse it
    if (typeof rowElement === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = rowElement;
      rowElement = tempDiv.firstChild;
    }
    
    // If element is null or not a DOM element, return null
    if (!rowElement || !(rowElement instanceof Element)) {
      return null;
    }
    
    // Find all cell elements
    const cellElements = rowElement.querySelectorAll('.ag-cell');
    const rowData = {};
    
    // Extract data from each cell
    cellElements.forEach(cell => {
      // Get column ID from the col-id attribute
      const colId = cell.getAttribute('col-id');
      if (colId) {
        // Find the cell value span element
        const valueElement = cell.querySelector('.ag-cell-value');
        let value = valueElement ? valueElement.textContent.trim() : '';
        
        // For cells that might have nested components (like the action column)
        if (value === '' && valueElement) {
          const nestedElement = valueElement.querySelector('div');
          if (nestedElement) {
            value = nestedElement.textContent.trim();
          }
        }
        
        // Add to row data object
        rowData[colId] = value;
      }
    });
    
    return rowData;
}

/**
 * Extracts data from all rows in the current page of an AG Grid table.
 * 
 * @returns {Array<Object>} An array of objects, each representing the data from a row in the table.
 */
function extractTableData() {
  let table_in_one_page = document.querySelector('.ag-center-cols-container');
  let rows = table_in_one_page.querySelectorAll('.ag-row');
  let data = [];
  rows.forEach(row => {
    data.push(extractRowData(row));
  });
  return data;
}

/**
 * Simulates a click on the "First" button of the AG Grid pagination controls.
 * Waits for the action to complete before returning.
 */
async function clickFirstButton() {
    // Get the "First" button element by its reference attribute
    const firstButton = document.querySelector('[ref="btFirst"]');

    // Click the button if it exists and is not disabled
    if (firstButton && !firstButton.classList.contains('ag-disabled')) {
        // Wait for the action to complete
        firstButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

/**
 * Simulates a click on the "Next" button of the AG Grid pagination controls.
 * Waits for the action to complete before returning.
 */
async function clickNextButton(nextButtonDelay = 1000) {
    // Get the "Next" button element by its reference attribute
    const nextButton = document.querySelector('[ref="btNext"]');

    // Click the button if it exists and is not disabled
    if (nextButton && !nextButton.classList.contains('ag-disabled')) {
        nextButton.click();
        // Wait for the action to complete
        await new Promise(resolve => setTimeout(resolve, nextButtonDelay));
    }
}

/**
 * Gathers data from all pages of an AG Grid table, up to a specified maximum number of pages.
 * 
 * @param {number} [maxPages=Infinity] - The maximum number of pages to gather data from.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each representing the data from a row in the table.
 */
async function gatherAllData(maxPages = Infinity, nextButtonDelay = 1000) {
    let allData = [];
    let hasNextPage = true;
    let currentPage = 0;

    await clickFirstButton();
    await new Promise(resolve => setTimeout(resolve, 500));

    while (hasNextPage && currentPage < maxPages) {
        // Extract data from the current page
        const pageData = extractTableData();
        allData = allData.concat(pageData);

        // Check if there is a next page and click the next button
        const nextButton = document.querySelector('[ref="btNext"]');
        if (nextButton && !nextButton.classList.contains('ag-disabled')) {
            await clickNextButton(nextButtonDelay);
            // Wait for the next page to load
            currentPage++;
        } else {
            break;
        }
        await new Promise(resolve => setTimeout(resolve, nextButtonDelay));
    }

    return allData;
}

// Gather data from up to 3 pages and log it to the console
N = 3;
data = await gatherAllData(N, nextButtonDelay=1000);
console.log(data);


// Example usage:
// 1. If you have access to the DOM element
// const rowElement = document.querySelector('.ag-row');
// const data = extractRowData(rowElement);

// 2. Or using the HTML string directly
// const htmlString = `<div style="transform: translateY(0px); height: 50px;" class="ag-row-even ag-row ag-row-level-0 ag-row-position-absolute ag-row-first ag-row-not-inline-editing ag-row-focus" aria-rowindex="2" role="row" row-index="0" row-id="0"><div class="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-focus" aria-colindex="1" style="left: 0px; width: 196px; display: flex; align-items: center;" tabindex="-1" role="gridcell" col-id="timestamp"><div class="ag-cell-wrapper" role="presentation"><span role="presentation" id="cell-timestamp-0" class="ag-cell-value">04/06/2025, 05:08 PM</span></div></div><div class="ag-cell ag-cell-not-inline-editing ag-cell-normal-height" aria-colindex="2" style="left: 196px; width: 196px; display: flex; align-items: center;" tabindex="-1" role="gridcell" col-id="email"><div class="ag-cell-wrapper" role="presentation"><span role="presentation" id="cell-email-1" class="ag-cell-value">djzhao@ucsd.edu</span></div></div><div class="ag-cell ag-cell-not-inline-editing ag-cell-normal-height" aria-colindex="3" style="left: 392px; width: 196px; display: flex; align-items: center;" tabindex="-1" role="gridcell" col-id="resourceType"><div class="ag-cell-wrapper" role="presentation"><span role="presentation" id="cell-resourceType-2" class="ag-cell-value">pod</span></div></div><div class="ag-cell ag-cell-not-inline-editing ag-cell-normal-height" aria-colindex="4" style="left: 588px; width: 196px; display: flex; align-items: center;" tabindex="-1" role="gridcell" col-id="resourceId"><div class="ag-cell-wrapper" role="presentation"><span role="presentation" id="cell-resourceId-3" class="ag-cell-value">chokt3ovlbncem</span></div></div><div class="ag-cell ag-cell-not-inline-editing ag-cell-normal-height" aria-colindex="5" style="left: 784px; width: 196px; display: flex; align-items: center;" tabindex="-1" role="gridcell" col-id="action"><div class="ag-cell-wrapper" role="presentation"><span role="presentation" id="cell-action-4" class="ag-cell-value"><div class="MuiTypography-root MuiTypography-body1 css-9u3vz2">create</div></span></div></div></div>`;
// const data = extractRowData(htmlString);
// console.log(data);

// Expected output:
// {
//   timestamp: "04/06/2025, 05:08 PM",
//   email: "djzhao@ucsd.edu",
//   resourceType: "pod",
//   resourceId: "chokt3ovlbncem",
//   action: "create"
// }