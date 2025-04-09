import ServiceAccount from "./service-account.js";

/**
 * Class for interacting with Google Cloud Storage
 */
export default class GoogleCloudStorage {
  /**
   * Creates a new GoogleCloudStorage instance
   * @param {Object|string} serviceAccountKey - The service account key object or JSON string
   */
  constructor(serviceAccountKey) {
    this.serviceAccount = new ServiceAccount(serviceAccountKey);
  }

  /**
   * Uploads JSON data to Google Cloud Storage
   * @param {string} bucketName - The name of the GCS bucket
   * @param {string} fileName - The name of the file to create in the bucket
   * @param {string} jsonData - The JSON data to upload
   * @returns {void}
   */
  uploadJsonToGCS(bucketName, fileName, jsonData) {
    const accessToken = this.serviceAccount.getAccessToken();
    const url = `https://www.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${fileName}`;

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: jsonData,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    // @ts-ignore
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
  }
}
