# RunPod Billing Data Extractor

This JavaScript module provides utilities for extracting billing data from AG Grid tables, specifically designed for RunPod's billing interface. It includes functions for navigating through paginated tables and extracting structured data from individual rows.

## Quick Start

1. Copy the entire content of `billing.js` into your browser's console on the RunPod billing page
2. Run the following code to gather data from up to 3 pages:

```javascript
// Gather data from up to 3 pages
const data = await gatherAllData(3, 1000);
console.log(data);

// Extract data from a single row
const rowElement = document.querySelector('.ag-row');
const rowData = extractRowData(rowElement);
console.log(rowData);
```

## Features

- Extract data from individual AG Grid rows
- Navigate through paginated tables
- Gather data from multiple pages
- Support for both DOM elements and HTML strings as input
- Automatic handling of nested components within cells

## Functions

### `extractRowData(rowElement)`
Extracts data from a single AG Grid row element.

**Parameters:**
- `rowElement`: HTMLElement or string - The AG Grid row element or its HTML string representation

**Returns:**
- Object containing the extracted cell data, or null if the input is invalid

### `extractTableData()`
Extracts data from all rows in the current page of an AG Grid table.

**Returns:**
- Array of objects, each representing the data from a row in the table

### `clickFirstButton()`
Simulates a click on the "First" button of the AG Grid pagination controls.

### `clickNextButton(nextButtonDelay)`
Simulates a click on the "Next" button of the AG Grid pagination controls.

**Parameters:**
- `nextButtonDelay`: number (optional) - Delay in milliseconds before proceeding (default: 1000)

### `gatherAllData(maxPages, nextButtonDelay)`
Gathers data from all pages of an AG Grid table.

**Parameters:**
- `maxPages`: number (optional) - Maximum number of pages to gather data from (default: Infinity)
- `nextButtonDelay`: number (optional) - Delay between page transitions in milliseconds (default: 1000)

**Returns:**
- Promise that resolves to an array of objects containing all table data

## Expected Output Format

```javascript
{
  timestamp: "04/06/2025, 05:08 PM",
  email: "user@example.com",
  resourceType: "pod",
  resourceId: "unique-id",
  action: "create"
}
```

## Notes

- The module assumes the presence of AG Grid's standard DOM structure
- Make sure to handle the asynchronous nature of the data gathering functions
- Adjust the delay parameters based on your network conditions and page load times
