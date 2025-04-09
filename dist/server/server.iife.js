var lib_ = function(exports) {
  "use strict";
  function makeRandomValuesColumn(ttlLen, optionsAr) {
    const newAr = new Array(ttlLen).fill([""]);
    optionsAr.forEach((option) => {
      for (let i = 0; i < option.count; i++)
        newAr[getEmptyRandom(newAr)] = [option.name];
    });
    return newAr;
  }
  function getRandom(len) {
    return Math.floor(Math.random() * len);
  }
  function getEmptyRandom(ar = [[]]) {
    const i = getRandom(ar.length);
    if ("" === ar[i][0])
      return i;
    return getEmptyRandom(ar);
  }
  const VALIDATION_SHARE = 0.15;
  const TEST_SHARE = 0.15;
  function breakdown() {
    const ws = SpreadsheetApp.getActive().getActiveSheet();
    const values = ws.getDataRange().getValues();
    const ttlRows = values.length;
    const breakdown2 = makeRandomValuesColumn(ttlRows, [
      { name: "VALIDATE", count: Math.floor(ttlRows * VALIDATION_SHARE) },
      { name: "TEST", count: Math.floor(ttlRows * TEST_SHARE) }
    ]);
    breakdown2.unshift(["dataset"]);
    ws.getRange(
      1,
      values[0].length + 1,
      breakdown2.length,
      breakdown2[0].length
    ).setValues(breakdown2);
  }
  function makeDataset(twoDimArr) {
    const headers = twoDimArr.shift();
    const objAr = twoDimArr.map(
      (row) => row.map((value, i) => ({ role: headers[i], parts: [{ text: value }] }))
    );
    return objAr.map((row) => JSON.stringify({ contents: [row[0], row[1]] })).join("\n");
  }
  function exportJsonl(target = "training") {
    const ar = SpreadsheetApp.getActive().getActiveSheet().getDataRange().getDisplayValues();
    let trainingDataset = [["user", "model"]];
    let validationDataset = [["user", "model"]];
    ar.forEach((row) => {
      if ("" === row[2])
        return trainingDataset.push(row.slice(0, -1));
      if ("VALIDATE" === row[2])
        return validationDataset.push(row.slice(0, -1));
    });
    return "training" === target ? makeDataset(trainingDataset) : makeDataset(validationDataset);
  }
  class ServiceAccount {
    /**
     * Creates a new ServiceAccount instance
     * @param {Object|string} serviceAccountKey - The service account key as a JSON object or string
     */
    constructor(serviceAccountKey) {
      this.serviceAccountKey = "string" === typeof serviceAccountKey ? JSON.parse(serviceAccountKey) : serviceAccountKey;
    }
    /**
     * Creates a JWT (JSON Web Token) for authentication with Google Cloud APIs
     * @returns {string} The JWT token string
     */
    createJwt() {
      const header = {
        alg: "RS256",
        typ: "JWT"
      };
      const now = Math.floor(Date.now() / 1e3);
      const claimSet = {
        iss: this.serviceAccountKey.client_email,
        scope: "https://www.googleapis.com/auth/devstorage.full_control",
        aud: this.serviceAccountKey.token_uri,
        exp: now + 3600,
        iat: now
      };
      const jwtHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header));
      const jwtClaimSet = Utilities.base64EncodeWebSafe(JSON.stringify(claimSet));
      const signatureInput = `${jwtHeader}.${jwtClaimSet}`;
      const signature = Utilities.computeRsaSha256Signature(
        signatureInput,
        this.serviceAccountKey.private_key
      );
      const jwtSignature = Utilities.base64EncodeWebSafe(signature);
      return `${signatureInput}.${jwtSignature}`;
    }
    /**
     * Gets an OAuth2 access token for Google Cloud APIs
     * @returns {string} The access token
     */
    getAccessToken() {
      const url = this.serviceAccountKey.token_uri;
      const payload = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: this.createJwt()
      };
      const options = {
        method: "post",
        payload
      };
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      return result.access_token;
    }
  }
  class GoogleCloudStorage {
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
        method: "post",
        contentType: "application/json",
        payload: jsonData,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      };
      const response = UrlFetchApp.fetch(url, options);
      Logger.log(response.getContentText());
    }
  }
  function uploadToBucket(data, filename, bucketName, saKey) {
    const jsonData = "string" === typeof data ? data : JSON.stringify(data);
    const gcs = new GoogleCloudStorage(saKey);
    gcs.uploadJsonToGCS(bucketName, filename, jsonData);
  }
  const UPLOAD_ROUTER = {
    jsonl: {
      call: exportJsonl,
      filename: "trainingDataset.jsonl"
    },
    validationJsonl: {
      call: () => exportJsonl("validation"),
      filename: "validationDataset.jsonl"
    }
  };
  Object.freeze(UPLOAD_ROUTER);
  function routeUploads(data, bucketName, saKey) {
    console.log({ data });
    const dataIsOk = data.every((item) => item in UPLOAD_ROUTER);
    if (!dataIsOk)
      throw new Error(`Les données ${JSON.stringify(data)} sont invalides`);
    breakdown();
    for (const item of data) {
      const route = UPLOAD_ROUTER[item];
      uploadToBucket(route.call(), route.filename, bucketName, saKey);
    }
  }
  function openSideBar() {
    SpreadsheetApp.getUi().showSidebar(
      HtmlService.createHtmlOutputFromFile("ui/index")
    );
  }
  function getContext() {
    const contexts = [
      { gasClass: DocumentApp, name: "DocumentApp" },
      { gasClass: FormApp, name: "FormApp" },
      { gasClass: SlidesApp, name: "SlidesApp" },
      { gasClass: SpreadsheetApp, name: "SpreadsheetApp" }
    ];
    let ui = null;
    let context = null;
    contexts.forEach((_context) => {
      if (null !== ui)
        return;
      try {
        ui = _context.gasClass.getUi();
        context = _context;
        context.ui = ui;
        console.log(`Selected context: ${_context.name}`);
      } catch (err) {
        ui = null;
        context = null;
      }
    });
    return context;
  }
  function onOpen() {
    const ui = getContext().ui;
    ui.createMenu("🔗 Extract JSONL").addSeparator().addItem("Export JSONL to GCS", "openSideBar").addToUi();
  }
  exports.breakdown = breakdown;
  exports.exportJsonl = exportJsonl;
  exports.onOpen = onOpen;
  exports.openSideBar = openSideBar;
  exports.routeUploads = routeUploads;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
}({});
