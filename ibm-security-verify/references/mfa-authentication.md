# Multi-Factor Authentication

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Authentication Factors 2.0](#authentication-factors-20) (3 endpoints)
- [Authentication Manage User Sessions](#authentication-manage-user-sessions) (4 endpoints)
- [Authenticators](#authenticators) (11 endpoints)
- [Authenticator Clients](#authenticator-clients) (7 endpoints)
- [Email One-time Password Configuration 2.0](#email-one-time-password-configuration-20) (2 endpoints)
- [Email One-time Password 2.0](#email-one-time-password-20) (13 endpoints)
- [FIDO Configuration](#fido-configuration) (10 endpoints)
- [FIDO MDS Configuration](#fido-mds-configuration) (5 endpoints)
- [External MFA Providers](#external-mfa-providers) (12 endpoints)
- [FIDO](#fido) (9 endpoints)
- [Knowledge Questions](#knowledge-questions) (9 endpoints)
- [One-time Password](#one-time-password) (4 endpoints)
- [Knowledge Questions Configuration](#knowledge-questions-configuration) (3 endpoints)
- [One-time Password Configuration 2.0](#one-time-password-configuration-20) (2 endpoints)
- [Password Authentication](#password-authentication) (4 endpoints)
- [QR Code Login Configuration](#qr-code-login-configuration) (2 endpoints)
- [Push Credentials Management](#push-credentials-management) (5 endpoints)
- [SMS One-time Password 2.0](#sms-one-time-password-20) (13 endpoints)
- [SMS One-time Password Configuration 2.0](#sms-one-time-password-configuration-20) (2 endpoints)
- [QR Code Login](#qr-code-login) (4 endpoints)
- [Signature Authentication Configuration](#signature-authentication-configuration) (3 endpoints)
- [Signature Authentication](#signature-authentication) (5 endpoints)
- [Smartcard or certificate provider operations](#smartcard-or-certificate-provider-operations) (1 endpoints)
- [Smartcard and other X.509 certificate provider configuration](#smartcard-and-other-x509-certificate-provider-configuration) (7 endpoints)
- [Time-based One-time Password 2.0](#time-based-one-time-password-20) (6 endpoints)
- [Time-based One-time Password Configuration 2.0](#time-based-one-time-password-configuration-20) (2 endpoints)
- [Voice One-time Password](#voice-one-time-password) (13 endpoints)
- [Voice One-time Password Configuration](#voice-one-time-password-configuration) (2 endpoints)
- [reCAPTCHA](#recaptcha) (5 endpoints)

## Authentication Factors 2.0

### `GET` /v2.0/factors
**Retrieve the list of authentication factor enrollments.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/discover
**Discover the availability of all authentication factors.**

### `GET` /v2.0/factors/discover/:type
**Discover the availability of an authentication factor.**

Path params: `type`

## Authentication Manage User Sessions

### `GET` /v1.0/auth/sessions/:userId
**Get the sessions for the user.**

Path params: `userId`

### `PATCH` /v1.0/auth/sessions/:userId
**Revoke or take some other action on specific sessions for the user ID that is specified in the request path.**

Path params: `userId`

```json
{
  "sessions": [
    {
      "sessionId": "",
      "operation": "",
      "revokeGrantsAndTokens": false
    }
  ]
}
```

### `DELETE` /v1.0/auth/sessions
**Delete random session for the user.**

Query params: `userId`

### `DELETE` /v1.0/auth/sessions/:userId
**Revoke all sessions for the user.**

Path params: `userId`

## Authenticators

### `GET` /v1.0/authenticators
**Retrieve the list of registered authenticators.**

Query params: `pagination`, `search`, `filter`

### `GET` /v1.0/authenticators/:id
**Retrieve a specific authenticator registration.**

Path params: `id`

### `GET` /v1.0/authenticators/:id/verifications
**Retrieve the list of verification transactions.**

Path params: `id`
Query params: `pagination`, `sort`, `search`, `filter`

### `GET` /v1.0/authenticators/:id/verifications/:txrnId
**Retrieve a specific verification transaction.**

Path params: `id`, `txrnId`
Query params: `returnJwt`

### `GET` /v1.0/authenticators/discovery
**Retrieve the list of available authenticator clients.**

Query params: `pagination`, `search`, `filter`

### `POST` /v1.0/authenticators/:id/verifications
**Initiate a verification transaction.**

Path params: `id`

```json
{
  "transactionData": {
    "message": "",
    "originIpAddress": "",
    "originUserAgent": "",
    "additionalData": [
      {
        "name": "",
        "value": ""
      }
    ]
  },
  "pushNotification": {
    "message": "",
    "title": "",
    "send": false,
    "useDevCreds": false,
    "sound": ""
  },
  "authenticationMethods": [
    {
      "id": "",
      "methodType": ""
    }
  ],
  "logic": "",
  "expiresIn": 0
}
```

### `POST` /v1.0/authenticators/:id/verifications/:txrnId
**Complete a specific verification transaction.**

Path params: `id`, `txrnId`
Query params: `returnJwt`

Body: `[{'id': '', 'userAction': '', 'signedData': ''}]`

### `POST` /v1.0/authenticators/initiation
**Initiate an authenticator registration.**

Query params: `qrcodeInResponse`

```json
{
  "owner": "",
  "clientId": "",
  "accountName": ""
}
```

### `POST` /v1.0/authenticators/registration
**Complete or refresh an authenticator registration.**

Query params: `skipTotpEnrollment`, `metadataInResponse`

```json
{
  "code": "",
  "refreshToken": "",
  "attributes": {
    "pushToken": "",
    "accountName": "",
    "applicationId": "",
    "applicationVersion": "",
    "verifySdkVersion": "",
    "deviceName": "",
    "deviceType": "",
    "platformType": "",
    "deviceId": "",
    "osVersion": "",
    "faceSupport": false,
    "fingerprintSupport": false,
    "frontCameraSupport": false,
    "mdmDeviceId": "",
    "deviceInsecure": false
  }
}
```

### `PUT` /v1.0/authenticators/:id
**Update the editable attributes of a specific authenticator registration.**

Path params: `id`

```json
{
  "id": "",
  "owner": "",
  "creationTime": "",
  "clientId": "",
  "enabled": false,
  "state": "",
  "attributes": {
    "pushToken": "",
    "accountName": "",
    "applicationId": "",
    "applicationVersion": "",
    "verifySdkVersion": "",
    "deviceName": "",
    "deviceType": "",
    "platformType": "",
    "deviceId": "",
    "osVersion": "",
    "faceSupport": false,
    "fingerprintSupport": false,
    "frontCameraSupport": false,
    "mdmDeviceId": "",
    "deviceInsecure": false
  }
}
```

### `DELETE` /v1.0/authenticators/:id
**Delete a specific authenticator registration.**

Path params: `id`

## Authenticator Clients

### `GET` /v1.0/authenticators/clients
**Retrieve the list of authenticator clients.**

Query params: `pagination`, `search`, `filter`

### `GET` /v1.0/authenticators/clients/:id
**Retrieve a specific authenticator client.**

Path params: `id`

### `GET` /v1.0/authenticators/clients/:id/metadata
**Retrieve the metadata of a specific authenticator client.**

Path params: `id`

### `POST` /v1.0/authenticators/clients
**Create an authenticator client.**

```json
{
  "name": "",
  "enabled": false,
  "accessTokenLifetime": 0,
  "refreshTokenLifetime": 0,
  "authorizationCodeLifetime": 0
}
```

### `PUT` /v1.0/authenticators/clients/:id
**Update the editable attributes of a specific authenticator client.**

Path params: `id`

```json
{
  "id": "",
  "name": "",
  "enabled": false,
  "accessTokenLifetime": 0,
  "refreshTokenLifetime": 0,
  "authorizationCodeLifetime": 0
}
```

### `PUT` /v1.0/authenticators/clients/:id/metadata
**Update the metadata attributes of an authenticator client.**

Path params: `id`

```json
{
  "serviceName": "",
  "customAttributes": {}
}
```

### `DELETE` /v1.0/authenticators/clients/:id
**Delete a specific authenticator client.**

Path params: `id`

## Email One-time Password Configuration 2.0

### `GET` /config/v2.0/factors/emailotp
**Retrieve the email one-time password configuration.**

### `PUT` /config/v2.0/factors/emailotp
**Update the email one-time password configuration.**

```json
{
  "charset": "",
  "enabled": false,
  "expiry": 0,
  "length": 0,
  "retries": 0,
  "allowlist": [],
  "denylist": []
}
```

## Email One-time Password 2.0

### `GET` /v2.0/factors/emailotp
**Retrieve the list of email one-time password enrollments.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/emailotp/:id
**Retrieve a email one-time password enrollment.**

Path params: `id`

### `GET` /v2.0/factors/emailotp/:id/verifications/:trxnId
**Retrieve a email one-time password verification.**

Path params: `id`, `trxnId`

### `GET` /v2.0/factors/emailotp/transient/verifications/:trxnId
**Retrieve a transient email one-time password verification.**

Path params: `trxnId`

### `POST` /v2.0/factors/emailotp
**Create a email one-time password enrollment.**

```json
{
  "userId": "",
  "enabled": false,
  "emailAddress": ""
}
```

### `POST` /v2.0/factors/emailotp/:id/verifications
**Create a email one-time password verification.**

Path params: `id`

```json
{
  "correlation": ""
}
```

### `POST` /v2.0/factors/emailotp/:id/verifications/:trxnId
**Attempt a email one-time password verification.**

Path params: `id`, `trxnId`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `POST` /v2.0/factors/emailotp/transient/verifications
**Create a transient email one-time password verification.**

```json
{
  "correlation": "",
  "emailAddress": ""
}
```

### `POST` /v2.0/factors/emailotp/transient/verifications/:trxnId
**Attempt a transient email one-time password verification.**

Path params: `trxnId`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `PUT` /v2.0/factors/emailotp/:id
**Update a email one-time password enrollment.**

Path params: `id`

```json
{
  "id": "",
  "userId": "",
  "type": "",
  "created": "",
  "updated": "",
  "attempted": "",
  "enabled": false,
  "validated": false,
  "attributes": {
    "emailAddress": ""
  }
}
```

### `DELETE` /v2.0/factors/emailotp/:id
**Delete a email one-time password enrollment.**

Path params: `id`

### `DELETE` /v2.0/factors/emailotp/:id/verifications/:trxnId
**Cancel a email one-time password verification.**

Path params: `id`, `trxnId`

### `DELETE` /v2.0/factors/emailotp/transient/verifications/:trxnId
**Cancel a transient email one-time password verification.**

Path params: `trxnId`

## FIDO Configuration

### `GET` /config/v2.0/factors/fido2/metadata
**Retrieve the list of metadata entries.**

Query params: `pagination`, `search`, `filter`

### `GET` /config/v2.0/factors/fido2/metadata/:id
**Retrieve a metadata entry.**

Path params: `id`

### `GET` /config/v2.0/factors/fido2/relyingparties
**Retrieve the list of relying party configurations.**

Query params: `pagination`, `search`, `filter`

### `GET` /config/v2.0/factors/fido2/relyingparties/:id
**Retrieve a relying party configuration.**

Path params: `id`

### `POST` /config/v2.0/factors/fido2/metadata
**Create a metadata entry.**

```json
{
  "category": "",
  "name": "",
  "metadataStatement": "",
  "enabled": false,
  "type": ""
}
```

### `POST` /config/v2.0/factors/fido2/relyingparties
**Create a relying party configuration.**

```json
{
  "rpId": "",
  "origins": [],
  "name": "",
  "allowedAttestationFormats": [],
  "allowedAttestationTypes": [],
  "metadataConfig": {
    "enforcement": false,
    "includeAll": false,
    "includedMetadata": [],
    "includedMetadataServices": []
  },
  "pubKeyCredParams": [
    {
      "alg": 0,
      "type": ""
    }
  ],
  "enabled": false,
  "webAuthn": false,
  "attestationCredProtect": ""
}
```

### `PUT` /config/v2.0/factors/fido2/metadata/:id
**Update a metadata entry.**

Path params: `id`

```json
{
  "id": "",
  "category": "",
  "name": "",
  "metadataStatement": "",
  "type": "",
  "inUse": false,
  "enabled": false
}
```

### `PUT` /config/v2.0/factors/fido2/relyingparties/:id
**Update a relying party configuration.**

Path params: `id`

```json
{
  "id": "",
  "rpId": "",
  "origins": [],
  "name": "",
  "allowedAttestationFormats": [],
  "allowedAttestationTypes": [],
  "metadataConfig": {
    "enforcement": false,
    "includeAll": false,
    "includedMetadata": [],
    "includedMetadataServices": []
  },
  "attestationCredProtect": "",
  "pubKeyCredParams": [
    {
      "alg": 0,
      "type": ""
    }
  ],
  "enabled": false,
  "webAuthn": false
}
```

### `DELETE` /config/v2.0/factors/fido2/metadata/:id
**Delete a metadata entry.**

Path params: `id`

### `DELETE` /config/v2.0/factors/fido2/relyingparties/:id
**Delete a relying party configuration.**

Path params: `id`

## FIDO MDS Configuration

### `GET` /config/v2.0/factors/fido2/metadata/mds
**Retrieve the list of metadata service entries.**

### `GET` /config/v2.0/factors/fido2/metadata/mds/:id
**Retrieve a metadata service entry.**

Path params: `id`

### `POST` /config/v2.0/factors/fido2/metadata/mds
**Create a metadata service entry.**

```json
{
  "url": "",
  "enabled": false,
  "trustAnchorIds": []
}
```

### `PUT` /config/v2.0/factors/fido2/metadata/mds/:id
**Update a metadata service entry.**

Path params: `id`

```json
{
  "id": "",
  "url": "",
  "predefined": false,
  "enabled": false,
  "revision": 0,
  "nextUpdate": 0,
  "lastUpdate": 0,
  "status": "",
  "trustAnchorIds": []
}
```

### `DELETE` /config/v2.0/factors/fido2/metadata/mds/:id
**Delete a metadata service entry.**

Path params: `id`

## External MFA Providers

### `GET` /config/v1.0/mfaproviders
**Retrieve the list of external MFA provider configurations.**

### `GET` /config/v1.0/mfaproviders/:id
**Retrieve an external MFA provider configuration.**

Path params: `id`

### `GET` /v1.0/mfaproviders
**Retrieve the list of external MFA providers.**

### `GET` /v1.0/mfaproviders/:id/:userId
**Retrieve the list of enrollments for an external MFA provider.**

Path params: `id`, `userId`

### `GET` /v1.0/mfaproviders/:id/:userId/:trxnId
**Retrieve the status of an authentication attempt.**

Path params: `id`, `userId`, `trxnId`

### `GET` /v1.0/mfaproviders/:userId
**Retrieve the list of enrollments for all external MFA providers.**

Path params: `userId`

### `POST` /config/v1.0/mfaproviders
**Create an external MFA provider configuration.**

```json
{
  "capabilities": [],
  "capabilityCacheTtl": 0,
  "credentialPrefix": "",
  "description": "",
  "enabled": false,
  "name": "",
  "type": "",
  "uniqueNameAttribute": "",
  "webhookId": ""
}
```

### `POST` /v1.0/mfaproviders/:id/:userId
**Action an authentication attempt via an external MFA provider.**

Path params: `id`, `userId`
Query params: `returnJwt`

```json
{
  "attributes": {},
  "capability": "",
  "id": ""
}
```

### `POST` /v1.0/mfaproviders/:id/:userId/:trxnId
**Continue an authentication attempt via an external MFA provider.**

Path params: `id`, `userId`, `trxnId`
Query params: `returnJwt`

```json
{
  "attributes": {},
  "capability": "",
  "id": ""
}
```

### `PUT` /config/v1.0/mfaproviders/:id
**Update an external MFA provider configuration.**

Path params: `id`

```json
{
  "capabilities": [],
  "capabilityCacheTtl": 0,
  "credentialPrefix": "",
  "description": "",
  "enabled": false,
  "id": "",
  "name": "",
  "type": "",
  "uniqueNameAttribute": "",
  "webhookId": ""
}
```

### `DELETE` /config/v1.0/mfaproviders/:id
**Delete an external MFA provider configuration.**

Path params: `id`

### `DELETE` /v1.0/mfaproviders/:id/:userId
**Clears all cached enrollments of specific user for an external MFA provider**

Path params: `id`, `userId`

## FIDO

### `GET` /v2.0/factors/fido2/registrations
**Retrieve the list of FIDO registrations.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/fido2/registrations/:id
**Retrieve a FIDO registration.**

Path params: `id`

### `POST` /v2.0/factors/fido2/relyingparties
**Resolve an rpId.**

```json
{
  "origin": ""
}
```

### `POST` /v2.0/factors/fido2/relyingparties/:id/assertion/options
**Initiate a FIDO authentication.**

Path params: `id`

```json
{
  "userId": "",
  "userVerification": "",
  "extensions": {}
}
```

### `POST` /v2.0/factors/fido2/relyingparties/:id/assertion/result
**Complete a FIDO authentication.**

Path params: `id`
Query params: `returnJwt`

```json
{
  "response": {
    "clientDataJSON": "",
    "signature": "",
    "authenticatorData": "",
    "userHandle": ""
  },
  "id": "",
  "rawId": "",
  "type": "",
  "getClientExtensionResults": {},
  "authenticatorAttachment": ""
}
```

### `POST` /v2.0/factors/fido2/relyingparties/:id/attestation/options
**Initiate a FIDO registration.**

Path params: `id`

```json
{
  "userId": "",
  "displayName": "",
  "authenticatorSelection": {
    "authenticatorAttachment": "",
    "residentKey": "",
    "requireResidentKey": false,
    "userVerification": ""
  },
  "attestation": "",
  "extensions": {}
}
```

### `POST` /v2.0/factors/fido2/relyingparties/:id/attestation/result
**Complete a FIDO registration.**

Path params: `id`

```json
{
  "response": {
    "clientDataJSON": "",
    "attestationObject": ""
  },
  "id": "",
  "nickname": "",
  "rawId": "",
  "type": "",
  "enabled": false,
  "getTransports": [],
  "getClientExtensionResults": {},
  "authenticatorAttachment": ""
}
```

### `PUT` /v2.0/factors/fido2/registrations/:id
**Update a FIDO registration.**

Path params: `id`

### `DELETE` /v2.0/factors/fido2/registrations/:id
**Delete a FIDO registration.**

Path params: `id`

## Knowledge Questions

### `GET` /v2.0/factors/questions
**Retrieve the list of knowledge question enrollments.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/questions/:id
**Retrieve a knowledge question enrollment.**

Path params: `id`

### `GET` /v2.0/factors/questions/:id/verifications/:trxnId
**Retrieve a knowledge question verification.**

Path params: `id`, `trxnId`

### `POST` /v2.0/factors/questions
**Create a knowledge question enrollment.**

```json
{
  "userId": "",
  "enabled": false,
  "attributes": {
    "questions": [
      {
        "questionKey": "",
        "answer": ""
      }
    ]
  },
  "references": {
    "profileId": ""
  }
}
```

### `POST` /v2.0/factors/questions/:id/verifications
**Create a knowledge question verification.**

Path params: `id`

### `POST` /v2.0/factors/questions/:id/verifications/:trxnId
**Attempt a knowledge question verification.**

Path params: `id`, `trxnId`
Query params: `returnJwt`

```json
{
  "questions": [
    {
      "questionKey": "",
      "answer": ""
    }
  ]
}
```

### `PUT` /v2.0/factors/questions/:id
**Update a knowledge question enrollment.**

Path params: `id`

```json
{
  "id": "",
  "userId": "",
  "type": "",
  "created": "",
  "updated": "",
  "attempted": "",
  "enabled": false,
  "validated": false,
  "attributes": {
    "questions": [
      {
        "questionKey": "",
        "answer": ""
      }
    ]
  },
  "references": {
    "profileId": "",
    "questions": [
      {
        "questionKey": "",
        "question": ""
      }
    ]
  }
}
```

### `DELETE` /v2.0/factors/questions/:id
**Delete a knowledge question enrollment.**

Path params: `id`

### `DELETE` /v2.0/factors/questions/:id/verifications/:trxnId
**Delete a knowledge question verification.**

Path params: `id`, `trxnId`

## One-time Password

### `GET` /v2.0/factors/otp/:id
**Retrieve a one-time password verification.**

Path params: `id`

### `POST` /v2.0/factors/otp
**Create a one-time password verification.**

```json
{
  "correlation": "",
  "useEmailotpConfig": false,
  "useSmsotpConfig": false
}
```

### `POST` /v2.0/factors/otp/:id
**Attempt a one-time password verification.**

Path params: `id`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `DELETE` /v2.0/factors/otp/:id
**Cancel a one-time password verification.**

Path params: `id`

## Knowledge Questions Configuration

### `GET` /config/v2.0/factors/questions
**Retrieve the list of knowledge questions configuration profiles.**

Query params: `pagination`, `search`, `filter`

### `GET` /config/v2.0/factors/questions/:id
**Retrieve a knowledge questions configuration profile.**

Path params: `id`

### `PUT` /config/v2.0/factors/questions/:id
**Update a knowledge questions configuration profile.**

Path params: `id`

```json
{
  "id": "",
  "name": "",
  "enabled": false,
  "enrollments": {
    "minRequiredAnswers": 0,
    "requireUniqueAnswers": false,
    "minAnswerLength": 0,
    "maxAnswerLength": 0,
    "regexMatch": ""
  },
  "verifications": {
    "expiry": 0,
    "requiredAnswers": 0
  },
  "questions": [
    {
      "questionKey": "",
      "question": {
        "en": ""
      }
    }
  ]
}
```

## One-time Password Configuration 2.0

### `GET` /config/v2.0/factors/otp
**Retrieve the one-time password configuration.**

### `PUT` /config/v2.0/factors/otp
**Update the one-time password configuration.**

```json
{
  "charset": "",
  "enabled": false,
  "expiry": 0,
  "length": 0,
  "retries": 0
}
```

## Password Authentication

### `GET` /v1.0/authnmethods/password
**Retrieve the list of valid password based identity sources.**

Query params: `pagination`, `sort`, `search`, `filter`

### `POST` /v1.0/authnmethods/password/:id
**Attempt password authentication with an identity source.**

Path params: `id`
Query params: `returnJwt`

```json
{
  "username": "",
  "password": ""
}
```

### `POST` /v1.0/authnmethods/password/:id/reset
**Reset a user's password for an on-premise identity source.**

Path params: `id`
Query params: `themeId`

```json
{
  "username": "",
  "newPassword": ""
}
```

### `PUT` /v1.0/authnmethods/password/:id
**Change a user's password for an on-premise identity source.**

Path params: `id`
Query params: `themeId`

```json
{
  "username": "",
  "oldPassword": "",
  "newPassword": ""
}
```

## QR Code Login Configuration

### `GET` /config/v2.0/factors/qr
**Retrieve the QR code login configuration.**

### `PUT` /config/v2.0/factors/qr
**Update the QR code login configuration.**

```json
{
  "lsi": {
    "length": 0,
    "charset": ""
  },
  "dsi": {},
  "expiry": 0,
  "enabled": false
}
```

## Push Credentials Management

### `GET` /config/v1.0/push-notification/credentials
**Get all the sets of configured mobile push provider credentials.**

Query params: `metaOnly`

### `GET` /config/v1.0/push-notification/credentials/:id
**Get a specific set of configured mobile push provider credentials.**

Path params: `id`

### `POST` /config/v1.0/push-notification/credentials
**Create a set of mobile push provider credentials.**

```json
{
  "appId": "",
  "apnsPushConfig": {
    "developmentCreds": {
      "base64Cert": "",
      "certPassword": ""
    },
    "productionCreds": {}
  },
  "firebasePushConfig": {
    "developmentCreds": {
      "serviceAccountJSON": {}
    },
    "productionCreds": {}
  }
}
```

### `PUT` /config/v1.0/push-notification/credentials/:id
**Update a specific set of configured mobile push provider credentials.**

Path params: `id`

```json
{
  "appId": "",
  "apnsPushConfig": {
    "developmentCreds": {
      "base64Cert": "",
      "certPassword": ""
    },
    "productionCreds": {}
  },
  "firebasePushConfig": {
    "developmentCreds": {
      "serviceAccountJSON": {}
    },
    "productionCreds": {}
  }
}
```

### `DELETE` /config/v1.0/push-notification/credentials/:id
**Delete a specific set of configured mobile push provider credentials.**

Path params: `id`

## SMS One-time Password 2.0

### `GET` /v2.0/factors/smsotp
**Retrieve the list of SMS one-time password enrollments.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/smsotp/:id
**Retrieve a SMS one-time password enrollment.**

Path params: `id`

### `GET` /v2.0/factors/smsotp/:id/verifications/:trxnId
**Retrieve a SMS one-time password verification.**

Path params: `id`, `trxnId`

### `GET` /v2.0/factors/smsotp/transient/verifications/:trxnId
**Retrieve a transient SMS one-time password verification.**

Path params: `trxnId`

### `POST` /v2.0/factors/smsotp
**Create a SMS one-time password enrollment.**

```json
{
  "userId": "",
  "enabled": false,
  "phoneNumber": ""
}
```

### `POST` /v2.0/factors/smsotp/:id/verifications
**Create a SMS one-time password verification.**

Path params: `id`

```json
{
  "correlation": ""
}
```

### `POST` /v2.0/factors/smsotp/:id/verifications/:trxnId
**Attempt a SMS one-time password verification.**

Path params: `id`, `trxnId`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `POST` /v2.0/factors/smsotp/transient/verifications
**Create a transient SMS one-time password verification.**

```json
{
  "correlation": "",
  "phoneNumber": ""
}
```

### `POST` /v2.0/factors/smsotp/transient/verifications/:trxnId
**Attempt a transient SMS one-time password verification.**

Path params: `trxnId`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `PUT` /v2.0/factors/smsotp/:id
**Update a SMS one-time password enrollment.**

Path params: `id`

```json
{
  "id": "",
  "userId": "",
  "type": "",
  "created": "",
  "updated": "",
  "attempted": "",
  "enabled": false,
  "validated": false,
  "attributes": {
    "phoneNumber": ""
  }
}
```

### `DELETE` /v2.0/factors/smsotp/:id
**Delete a SMS one-time password enrollment.**

Path params: `id`

### `DELETE` /v2.0/factors/smsotp/:id/verifications/:trxnId
**Cancel a SMS one-time password verification.**

Path params: `id`, `trxnId`

### `DELETE` /v2.0/factors/smsotp/transient/verifications/:trxnId
**Cancel a transient SMS one-time password verification.**

Path params: `trxnId`

## SMS One-time Password Configuration 2.0

### `GET` /config/v2.0/factors/smsotp
**Retrieve the SMS one-time password configuration.**

### `PUT` /config/v2.0/factors/smsotp
**Update the SMS one-time password configuration.**

```json
{
  "charset": "",
  "enabled": false,
  "expiry": 0,
  "length": 0,
  "retries": 0
}
```

## QR Code Login

### `GET` /v2.0/factors/qr/authenticate
**Create a QR code login verification.**

Query params: `profileId`

### `GET` /v2.0/factors/qr/authenticate/:id
**Retrieve a QR code login verification.**

Path params: `id`
Query params: `dsi`, `returnJwt`

### `POST` /v2.0/factors/qr/:id
**Attempt a QR code login verification.**

Path params: `id`
Query params: `returnJwt`

```json
{
  "lsi": ""
}
```

### `DELETE` /v2.0/factors/qr/:id
**Cancel a QR code login verification.**

Path params: `id`

## Signature Authentication Configuration

### `GET` /v1.0/authnmethods/signature
**Retrieve the signature authentication methods configuration.**

### `PUT` /v1.0/authnmethods/signature
**Update the signature authentication method configuration.**

```json
{
  "enabled": false,
  "userPresence": {
    "enabled": false,
    "algorithm": "",
    "supportedAlgorithms": []
  },
  "fingerprint": {},
  "face": {}
}
```

### `PATCH` /v1.0/authnmethods/signature
**Update the signature authentication methods configuration.**

## Signature Authentication

### `GET` /v1.0/authnmethods/signatures
**Retrieve the list of signature enrollments.**

Query params: `pagination`, `search`, `filter`, `_embedded`

### `GET` /v1.0/authnmethods/signatures/:id
**Retrieve a specific signature enrollment.**

Path params: `id`
Query params: `_embedded`

### `POST` /v1.0/authnmethods/signatures
**Enroll a signature authentication method.**

Query params: `onlyMultiStatus`

Body: `[{'subType': '', 'enabled': False, 'attributes': {'algorithm': '', 'deviceSecurity': False, 'publicKey': '', 'signedData': '', 'additionalData': [{'name': '', 'value': ''}]}}]`

### `PUT` /v1.0/authnmethods/signatures/:id
**Update the editable attributes of a specific signature enrollment.**

Path params: `id`

```json
{
  "id": "",
  "owner": "",
  "creationTime": "",
  "enabled": false,
  "enrollmentUri": "",
  "methodType": "",
  "subType": "",
  "attributes": {
    "algorithm": "",
    "authenticatorId": "",
    "authenticatorUri": "",
    "additionalData": [
      {
        "name": "",
        "value": ""
      }
    ],
    "deviceSecurity": false
  },
  "validated": false
}
```

### `DELETE` /v1.0/authnmethods/signatures/:id
**Delete a specific signature enrollment.**

Path params: `id`

## Smartcard or certificate provider operations

### `DELETE` /config/v1.0/smartcard-providers/devices
**Remove smartcard/X.509 certificate provider certificates for a specified user id.**

Query params: `smartcardProviderId`, `userId`, `serialNumber`

## Smartcard and other X.509 certificate provider configuration

### `GET` /config/v1.0/smartcard-providers
**Lists smartcard and other X.509 certificate providers.**

Query params: `identitySourceId`, `idOnly`

### `GET` /config/v1.0/smartcard-providers/:smartcardProviderId
**Get a smartcard and other X.509 certificate providers**

Path params: `smartcardProviderId`

### `GET` /config/v1.0/smartcard-providers/attributes
**Lists attributes and uniqueUserIdentifiers for a X.509 compliant certificate.**

### `POST` /config/v1.0/smartcard-providers
**Create a smartcard and other X.509 certificate provider.**

```json
{
  "instanceName": "",
  "enabled": false,
  "identitySourceId": "",
  "jitpEnabled": false,
  "uniqueUserIdentifier": "",
  "attributeMappings": [
    {
      "idsAttrName": "",
      "attrId": "",
      "jitpOption": "",
      "postEval": {
        "id": "",
        "custom": ""
      }
    }
  ],
  "identitySourceEnabled": false,
  "smartcardProviderId": "",
  "uniqueUserIdentifierRequestRule": "",
  "subjectKeyIdentifier": ""
}
```

### `PUT` /config/v1.0/smartcard-providers/:smartcardProviderId
**Update a smartcard or X.509 certificate provider.**

Path params: `smartcardProviderId`

```json
{
  "instanceName": "",
  "enabled": false,
  "identitySourceId": "",
  "jitpEnabled": false,
  "uniqueUserIdentifier": "",
  "attributeMappings": [
    {
      "idsAttrName": "",
      "attrId": "",
      "jitpOption": "",
      "postEval": {
        "id": "",
        "custom": ""
      }
    }
  ],
  "identitySourceEnabled": false,
  "smartcardProviderId": "",
  "uniqueUserIdentifierRequestRule": "",
  "subjectKeyIdentifier": ""
}
```

### `PATCH` /config/v1.0/smartcard-providers/:smartcardProviderId
**Update a smartcard or X.509 certificate provider with PATCH**

Path params: `smartcardProviderId`

### `DELETE` /config/v1.0/smartcard-providers/:smartcardProviderId
**Delete a smartcard or X.509 certificate provider**

Path params: `smartcardProviderId`

## Time-based One-time Password 2.0

### `GET` /v2.0/factors/totp
**Retrieve the list of time-based one-time password enrollments.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/totp/:id
**Retrieve a time-based one-time password enrollment.**

Path params: `id`

### `POST` /v2.0/factors/totp
**Create a time-based one-time password enrollment.**

Query params: `qrCodeInResponse`

```json
{
  "userId": "",
  "accountName": "",
  "enabled": false
}
```

### `POST` /v2.0/factors/totp/:id
**Attempt a time-based one-time password verification.**

Path params: `id`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `PUT` /v2.0/factors/totp/:id
**Update a time-based one-time password enrollment.**

Path params: `id`

```json
{
  "id": "",
  "userId": "",
  "type": "",
  "created": "",
  "updated": "",
  "attempted": "",
  "enabled": false,
  "validated": false,
  "attributes": {
    "algorithm": "",
    "digits": 0,
    "period": 0,
    "accountName": ""
  }
}
```

### `DELETE` /v2.0/factors/totp/:id
**Delete a time-based one-time password enrollment.**

Path params: `id`

## Time-based One-time Password Configuration 2.0

### `GET` /config/v2.0/factors/totp
**Retrieve the time-based one-time password configuration.**

### `PUT` /config/v2.0/factors/totp
**Update the time-based one-time password configuration.**

```json
{
  "algorithm": "",
  "digits": 0,
  "enabled": false,
  "keyUri": "",
  "oneTimeUse": false,
  "period": 0,
  "periodSkew": 0,
  "enrollments": 0
}
```

## Voice One-time Password

### `GET` /v2.0/factors/voiceotp
**Retrieve the list of voice one-time password enrollments.**

Query params: `pagination`, `search`, `filter`

### `GET` /v2.0/factors/voiceotp/:id
**Retrieve a voice one-time password enrollment.**

Path params: `id`

### `GET` /v2.0/factors/voiceotp/:id/verifications/:trxnId
**Retrieve a voice one-time password verification.**

Path params: `id`, `trxnId`

### `GET` /v2.0/factors/voiceotp/transient/verifications/:trxnId
**Retrieve a transient voice one-time password verification.**

Path params: `trxnId`

### `POST` /v2.0/factors/voiceotp
**Create a voice one-time password enrollment.**

```json
{
  "userId": "",
  "enabled": false,
  "phoneNumber": ""
}
```

### `POST` /v2.0/factors/voiceotp/:id/verifications
**Create a voice one-time password verification.**

Path params: `id`

```json
{
  "correlation": ""
}
```

### `POST` /v2.0/factors/voiceotp/:id/verifications/:trxnId
**Attempt a voice one-time password verification.**

Path params: `id`, `trxnId`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `POST` /v2.0/factors/voiceotp/transient/verifications
**Create a transient voice one-time password verification.**

```json
{
  "correlation": "",
  "phoneNumber": ""
}
```

### `POST` /v2.0/factors/voiceotp/transient/verifications/:trxnId
**Attempt a transient voice one-time password verification.**

Path params: `trxnId`
Query params: `returnJwt`

```json
{
  "otp": ""
}
```

### `PUT` /v2.0/factors/voiceotp/:id
**Update a voice one-time password enrollment.**

Path params: `id`

```json
{
  "id": "",
  "userId": "",
  "type": "",
  "created": "",
  "updated": "",
  "attempted": "",
  "enabled": false,
  "validated": false,
  "attributes": {
    "phoneNumber": ""
  }
}
```

### `DELETE` /v2.0/factors/voiceotp/:id
**Delete a voice one-time password enrollment.**

Path params: `id`

### `DELETE` /v2.0/factors/voiceotp/:id/verifications/:trxnId
**Cancel a voice one-time password verification.**

Path params: `id`, `trxnId`

### `DELETE` /v2.0/factors/voiceotp/transient/verifications/:trxnId
**Cancel a transient voice one-time password verification.**

Path params: `trxnId`

## Voice One-time Password Configuration

### `GET` /config/v2.0/factors/voiceotp
**Retrieve the voice one-time password configuration.**

### `PUT` /config/v2.0/factors/voiceotp
**Update the voice one-time password configuration.**

```json
{
  "charset": "",
  "enabled": false,
  "expiry": 0,
  "length": 0,
  "retries": 0
}
```

## reCAPTCHA

### `GET` /config/v1.0/recaptcha
**Retrieve the list of reCAPTCHA configurations**

### `GET` /config/v1.0/recaptcha/:id
**Retrieve a reCAPTCHA configuration**

Path params: `id`

### `POST` /config/v1.0/recaptcha
**Create a reCAPTCHA configuration**

```json
{
  "name": "",
  "secretKey": "",
  "siteKey": "",
  "type": ""
}
```

### `PUT` /config/v1.0/recaptcha/:id
**Update a reCAPTCHA configuration**

Path params: `id`

```json
{
  "id": "",
  "name": "",
  "secretKey": "",
  "siteKey": "",
  "type": "",
  "references": [
    {
      "name": "",
      "location": "",
      "created": ""
    }
  ]
}
```

### `DELETE` /config/v1.0/recaptcha/:id
**Delete a reCAPTCHA configuration**

Path params: `id`
