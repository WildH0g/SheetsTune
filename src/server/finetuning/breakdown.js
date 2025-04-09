import { makeRandomValuesColumn } from './random-values-column.js';
import {VALIDATION_SHARE, TEST_SHARE } from './ENV.js';

/**
 * Creates a breakdown column in the active sheet that randomly assigns rows to validation and test datasets
 * based on the configured shares in ENV.js
 * @returns {void}
 */
export function breakdown() {
  const ws = SpreadsheetApp.getActive().getActiveSheet();
  const values = ws.getDataRange().getValues();
  const ttlRows = values.length;
  const breakdown = makeRandomValuesColumn(ttlRows, [
    { name: 'VALIDATE', count: Math.floor(ttlRows * VALIDATION_SHARE) },
    { name: 'TEST', count: Math.floor(ttlRows * TEST_SHARE) },
  ]);
  breakdown.unshift(['dataset']);
  ws.getRange(
    1,
    values[0].length + 1,
    breakdown.length,
    breakdown[0].length
  ).setValues(breakdown);
}
