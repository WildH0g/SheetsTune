import GoogleCloudStorage from './gcs.js';

/**
 * Uploads data to a Google Cloud Storage bucket
 * @param {Object|string} data - The data to upload (object or string)
 * @param {string} filename - The name of the file to create in the bucket
 * @param {string} bucketName - The name of the GCS bucket
 * @param {Object|string} saKey - The service account key object or JSON string
 * @returns {void}
 */
export function uploadToBucket(data, filename, bucketName, saKey) {
  // Convert object to JSON string
  const jsonData = 'string' === typeof data ? data : JSON.stringify(data);

  // Initialize service account key
  const gcs = new GoogleCloudStorage(saKey);

  // Call the method to upload JSON
  gcs.uploadJsonToGCS(bucketName, filename, jsonData);
}
