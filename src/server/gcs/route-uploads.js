import { uploadToBucket } from './upload-to-bucket.js';
import { exportJsonl } from '../finetuning/export-jsonl.js';
import { breakdown } from '../server.js';

/**
 * Configuration for different upload types
 * @type {Object.<string, {call: Function, filename: string}>}
 */
const UPLOAD_ROUTER = {
  jsonl: {
    call: exportJsonl,
    filename: 'trainingDataset.jsonl',
  },
  validationJsonl: {
    call: () => exportJsonl('validation'),
    filename: 'validationDataset.jsonl',
  },
};

Object.freeze(UPLOAD_ROUTER);

/**
 * Routes data uploads to the appropriate GCS bucket
 * @param {string[]} data - Array of upload types (keys from UPLOAD_ROUTER)
 * @param {string} bucketName - The name of the GCS bucket
 * @param {string|Object} saKey - The service account key as a JSON string or object
 * @throws {Error} If any data item is not a valid upload type
 * @returns {void}
 */
export function routeUploads(data, bucketName, saKey) {
  console.log({ data });

  const dataIsOk = data.every(item => item in UPLOAD_ROUTER);
  if (!dataIsOk)
    throw new Error(`Les données ${JSON.stringify(data)} sont invalides`);

  breakdown();

  for (const item of data) {
    const route = UPLOAD_ROUTER[item];
    uploadToBucket(route.call(), route.filename, bucketName, saKey);
  }
}

