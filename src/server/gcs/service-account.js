/**
 * Class for handling Google Cloud Platform service account authentication
 */
export default class ServiceAccount {
  /**
   * Creates a new ServiceAccount instance
   * @param {Object|string} serviceAccountKey - The service account key as a JSON object or string
   */
  constructor(serviceAccountKey) {
    this.serviceAccountKey =
      'string' === typeof serviceAccountKey
        ? JSON.parse(serviceAccountKey)
        : serviceAccountKey;
  }

  /**
   * Creates a JWT (JSON Web Token) for authentication with Google Cloud APIs
   * @returns {string} The JWT token string
   */
  createJwt() {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
      iss: this.serviceAccountKey.client_email,
      scope: 'https://www.googleapis.com/auth/devstorage.full_control',
      aud: this.serviceAccountKey.token_uri,
      exp: now + 3600,
      iat: now,
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
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: this.createJwt(),
    };

    const options = {
      method: 'post',
      payload: payload,
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    return result.access_token;
  }
}
