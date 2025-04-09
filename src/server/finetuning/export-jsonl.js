import { makeDataset } from './make-dataset.js';

/**
 * Exports data from the active spreadsheet as JSONL format for model training or validation
 * @param {string} target - The target dataset to export ('training' or 'validation')
 * @returns {string} The JSONL formatted data
 */
export function exportJsonl(target = 'training') {
  const ar = SpreadsheetApp.getActive()
    .getActiveSheet()
    .getDataRange()
    .getDisplayValues();
  let trainingDataset = [['user', 'model']];
  let validationDataset = [['user', 'model']];

  ar.forEach(row => {
    if ('' === row[2]) return trainingDataset.push(row.slice(0, -1));
    if ('VALIDATE' === row[2]) return validationDataset.push(row.slice(0, -1));
  });
  return 'training' === target
    ? makeDataset(trainingDataset)
    : makeDataset(validationDataset);
}
