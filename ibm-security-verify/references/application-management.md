# Application & API Client Management

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [API Clients](#api-clients) (7 endpoints)
- [Application Access](#application-access) (36 endpoints)
- [Certificates](#certificates) (9 endpoints)
- [Template File Registration](#template-file-registration) (3 endpoints)

## API Clients

### `GET` /v1.0/apiclients
**Lists the API Clients**

Query params: `pagination`, `sort`, `search`, `filter`

### `GET` /v1.0/apiclients/:clientId
**Gets a specific API client**

Path params: `clientId`

### `GET` /v1.0/apiclients/:clientId/credentials
**Gets a YAML response that contains the credentials for a specific client.**

Path params: `clientId`

### `POST` /v1.0/apiclients
**Create an API Client**

```json
{
  "clientId": "",
  "clientName": "",
  "clientSecret": "",
  "entitlements": [],
  "enabled": false,
  "overrideSettings": {
    "restrictScopes": false,
    "scopes": [
      {
        "name": "",
        "description": ""
      }
    ],
    "signKeyLabel": "",
    "accessTokenLifetime": {}
  },
  "description": "",
  "additionalProperties": {},
  "ipFilterOp": "",
  "ipFilters": [],
  "jwkUri": "",
  "additionalConfig": {
    "clientAuthMethod": "",
    "validateClientAssertionJti": false,
    "allowedClientAssertionVerificationKeys": []
  },
  "idTokenSigningAlg": "",
  "accessTokenType": ""
}
```

### `PUT` /v1.0/apiclients/:clientId
**Updates a specific API client**

Path params: `clientId`

```json
{
  "id": "",
  "clientName": "",
  "entitlements": [],
  "clientId": "",
  "clientSecret": "",
  "enabled": false,
  "overrideSettings": {
    "restrictScopes": false,
    "scopes": [
      {
        "name": "",
        "description": ""
      }
    ],
    "signKeyLabel": "",
    "accessTokenLifetime": {}
  },
  "description": "",
  "additionalProperties": {},
  "ipFilterOp": "",
  "ipFilters": [],
  "jwkUri": "",
  "additionalConfig": {
    "clientAuthMethod": "",
    "validateClientAssertionJti": false,
    "allowedClientAssertionVerificationKeys": []
  },
  "idTokenSigningAlg": "",
  "accessTokenType": ""
}
```

### `PATCH` /v1.0/apiclients
**Bulk deletes the API clients**

Body: `[{'op': '', 'path': ''}]`

### `DELETE` /v1.0/apiclients/:clientId
**Deletes an API client**

Path params: `clientId`

## Application Access

### `GET` /v1.0/accounts/operations
**Gets the list of all the operations that are performed on accounts of this tenant.**

Query params: `search`, `sort`

### `GET` /v1.0/accounts/operations/:operationId
**Gets details of the specified operation**

Path params: `operationId`

### `GET` /v1.0/applications
**Gets the list of all applications that were onboarded  by tenant administrator. A maximum of 500 applications are returned. Use pagination to fetch the next set of applications.**

Query params: `page`, `limit`, `search`, `sort`

### `GET` /v1.0/applications/2698731891250239736
**Gets the details of an application.**

### `GET` /v1.0/applications/:applicationId/accounts
**Gets the list of accounts for the specified application.**

Path params: `applicationId`
Query params: `accountStats`, `page`, `limit`, `search`, `sort`

### `GET` /v1.0/applications/:applicationId/accounts/:accountId
**Get the account attributes of given account associated with an application.**

Path params: `accountId`, `applicationId`

### `GET` /v1.0/applications/:applicationId/accounts/:accountId/delta
**Get attribute values delta for an account for the application.**

Path params: `applicationId`, `accountId`

### `GET` /v1.0/applications/:applicationId/reconciliation/:reconciliationId
**Gets adoption stats details of account synchronization for an application.**

Path params: `applicationId`, `reconciliationId`

### `GET` /v1.0/applications/:applicationId/reconciliation/:reconciliationId/accounts
**Gets the Application account list details for specified account synchronization id.**

Path params: `applicationId`, `reconciliationId`
Query params: `page`, `limit`, `search`, `sort`

### `GET` /v1.0/applications/:applicationId/reconciliation/status
**Get Last run reconciliation status for an application.**

Path params: `applicationId`

### `GET` /v1.0/applications/:applicationId/supportingdata
**Retrieves all supporting data for a given application.**

Path params: `applicationId`
Query params: `referenceType`

### `GET` /v1.0/applications/identitySources/:identitySourceId/applications
**Checks if the identity source is configured with an application.**

Path params: `identitySourceId`

### `GET` /v1.0/applications/rules/:ruleId
**Get  rule definition.**

Path params: `ruleId`

### `GET` /v1.0/applications/stats
**Gets the summary stats of all applications for a given tenant.**

### `GET` /v1.0/authpolicy/:authpolicyid/applications
**Retrieves a list of application ids that have the specified auth policy id attached.**

Path params: `authpolicyid`

### `GET` /v1.0/owner/applications
**Searches for the applications of an owner.**

Query params: `page`, `limit`, `count`, `search`, `sort`

### `GET` /v1.0/owner/applications/:applicationId
**Fetches the details of an application accessible to owner.**

Path params: `applicationId`

### `GET` /v1.0/owner/applications/:applicationId/entitlements
**Fetches the entitlements of an application.**

Path params: `applicationId`

### `GET` /v1.0/reconciliation
**Get All account synchronization status for all applications of given tenant.**

### `GET` /v1.0/reconciliation/operations
**Gets all operations performed in an Account Sync operation**

Query params: `search`

### `GET` /v1.0/user/applications
**Fetches the applications that are entitled to a user.**

Query params: `page`, `limit`, `count`, `search`, `sort`, `requestid`, `requestorid`

### `POST` /v1.0/accounts/operations/:operationId/retry
**Retry a failed operation**

Path params: `operationId`

### `POST` /v1.0/accounts/operations/retry
**Retry a list of failed operations.**

### `POST` /v1.0/applications
**Creates an instance of an application for a tenant.**

```json
{
  "name": "",
  "properties": {},
  "templateId": "",
  "providers": {
    "saml": {
      "justInTimeProvisioning": "",
      "properties": {
        "generateUniqueID": "",
        "signAuthnResponse": "",
        "signatureAlgorithm": "",
        "validateAuthnRequest": "",
        "encryptAssertion": "",
        "ici_reserved_subjectNameID": "",
        "includeAllAttributes": "",
        "defaultNameIdFormat": "",
        "companyName": "",
        "providerId": "",
        "assertionConsumerServiceUrl": "",
        "signatureValidationKeyIdentifier": "",
        "blockEncryptionAlgorithm": "",
        "encryptionKeyIdentifier": "",
        "uniqueID": "",
        "sessionNotOnOrAfter": "",
        "signingKeyIdentifier": ""
      },
      "assertionConsumerService": [
        {
          "index": 0,
          "url": "",
          "default": false
        }
      ],
      "manageNameIDService": {
        "url": ""
      },
      "singleLogoutService": [
        {
          "binding": "",
          "url": ""
        }
      ],
      "additionalProperties": [
        {
          "name": "",
          "value": ""
        }
      ]
    },
    "sso": {
      "domainName": "",
      "spssoUrl": "",
      "targetUrl": "",
      "idpInitiatedSSOSupport": "",
      "userOptions": ""
    },
    "bookmark": {
      "bookmarkUrl": ""
    },
    "oidc": {
      "applicationUrl": "",
      "properties": {
        "grantTypes": {
          "authorizationCode": "",
          "implicit": "",
          "deviceFlow": "",
          "ropc": "",
          "jwtBearer": "",
          "policyAuth": "",
          "clientCredentials": "",
          "tokenExchange": ""
        },
        "redirectUris": [],
        "idTokenSigningAlg": "",
        "accessTokenExpiry": 0,
        "refreshTokenExpiry": 0,
        "doNotGenerateClientSecret": "",
        "generateRefreshToken": "",
        "renewRefreshTokenExpiry": 0,
        "signIdToken": "",
        "signingCertificate": "",
        "clientId": "",
        "clientSecret": "",
        "sendAllKnownUserAttributes": "",
        "jwksUri": "",
        "consentType": "",
        "renewRefreshToken": "",
        "additionalConfig": {},
        "idTokenEncryptAlg": "",
        "idTokenEncryptEnc": "",
        "idTokenEncryptKey": ""
      },
      "restrictScopes": "",
      "scopes": [
        {
          "name": "",
          "description": ""
        }
      ],
      "entitlements": [],
      "restrictEntitlements": false,
      "grantProperties": {
        "generateDeviceFlowQRCode": ""
      },
      "token": {
        "accessTokenType": "",
        "audiences": [],
        "attributeMappings": [
          {
            "targetName": "",
            "sourceId": ""
          }
        ]
      },
      "consentAction": "",
      "requirePkceVerification": "",
      "jwtBearerProperties": {
        "userIdentifier": "",
        "identitySource": ""
      }
    },
    "wsfed": {
      "properties": {
        "callbackURL": "",
        "providerId": "",
        "multipleDomainsEnabled": "",
        "activeProfile": {
          "defaultRealm": ""
        },
        "signingSettings": {
          "signSamlAssertion": "",
          "keyLabel": "",
          "signatureAlgorithm": ""
        },
        "ici_reserved_subjectNameID": "",
        "additionalProperties": [
          {
            "name": "",
            "value": {}
          }
        ]
      }
    }
  },
  "attributeMappings": [
    {
      "name": "",
      "targetName": "",
      "targetAttrFormat": "",
      "sourceId": ""
    }
  ],
  "applicationState": false,
  "description": "",
  "authPolicy": {
    "id": "",
    "name": "",
    "grantTypes": [
      {}
    ],
    "errorCode": "",
    "errorDescription": ""
  },
  "provisioningMode": "",
  "identitySources": [],
  "visibleOnLaunchpad": false,
  "provisioning": {
    "authentication": {
      "properties": {}
    },
    "attributeMappings": [
      {
        "targetName": "",
        "sourceId": "",
        "outboundTracking": false,
        "inboundTracking": false,
        "applyTransformation": "",
        "ruleType": ""
      }
    ],
    "reverseAttributeMappings": [
      {}
    ],
    "policies": {
      "provPolicy": "",
      "deProvPolicy": "",
      "deProvAction": "",
      "passwordSync": "",
      "adoptionPolicy": {
        "matchingAttributes": [
          {
            "targetName": "",
            "sourceId": ""
          }
        ],
        "remediationPolicy": {
          "policy": "",
          "autoRemediateOnUpdate": false
        }
      },
      "gracePeriod": 0
    },
    "extension": {
      "properties": {}
    },
    "provisioningState": ""
  },
  "customization": {
    "themeId": ""
  },
  "devportalSettings": {
    "grantTypes": {},
    "identitySources": [],
    "authPolicy": {},
    "sendAllKnownUserAttributes": "",
    "attributeMappings": [
      {}
    ],
    "extendedProperties": {}
  },
  "apiAccessClients": [
    {
      "clientName": "",
      "clientId": "",
      "clientSecret": "",
      "enabled": false,
      "defaultEntitlements": [],
      "accessTokenType": "",
      "jwtSigningAlg": "",
      "signKeyLabel": "",
      "accessTokenLifetime": 0,
      "restrictScopes": false,
      "ipFilterOp": "",
      "ipFilters": [],
      "scopes": [
        {}
      ],
      "jwkUri": "",
      "additionalConfig": {}
    }
  ],
  "adaptiveAuthentication": {
    "platform": "",
    "licenseData": "",
    "storageLink": ""
  },
  "owners": [],
  "target": {},
  "customIcon": "",
  "defaultIcon": ""
}
```

### `POST` /v1.0/applications/:applicationId/accounts/:accountId/:action
**Suspend/Restore/Unmanage/deprovision an Account identified by this applicationId, userId.**

Path params: `applicationId`, `accountId`, `action`

### `POST` /v1.0/applications/:applicationId/accounts/remediate
**Remediate Non-Compliant accounts for an application.**

Path params: `applicationId`

```json
{
  "remediationPolicy": "",
  "accounts": [
    {
      "accountId": "",
      "reconciliationId": ""
    }
  ]
}
```

### `POST` /v1.0/applications/:applicationId/reconciliation
**Start / Stop Account Synchronization.**

Path params: `applicationId`

### `POST` /v1.0/applications/:applicationId/reconciliation/:reconciliationId
**Stop given account synchronization of an application.**

Path params: `applicationId`, `reconciliationId`

### `POST` /v1.0/applications/:applicationId/users/:userId/adopt
**Provides mechanism to adopt an Orphan account**

Path params: `userId`, `applicationId`

### `POST` /v1.0/applications/rules
**Create custom rule.**

### `POST` /v1.0/owner/applications/:applicationId/entitlements
**Updates entitlements to an application.**

Path params: `applicationId`

```json
{
  "birthRightAccess": false,
  "requestAccess": false,
  "additions": [
    {
      "assignee": {
        "subjectId": "",
        "subjectType": ""
      },
      "grantType": ""
    }
  ],
  "deletions": []
}
```

### `POST` /v1.0/user/applications/:applicationId/entitlement
**API to determine if a user is entitled to an application.**

Path params: `applicationId`

### `PUT` /v1.0/applications/:applicationId
**Updates an application.**

Path params: `applicationId`

### `PUT` /v1.0/applications/rules/:ruleId
**Update custom rule.**

Path params: `ruleId`

### `PUT` /v1.0/owner/applications/:applicationId
**Updates the attributes of an application accessible to the owner.**

Path params: `applicationId`

```json
{
  "name": "",
  "provisioning": {
    "policies": {
      "provPolicy": "",
      "deProvPolicy": "",
      "deProvAction": "",
      "gracePeriod": 0,
      "passwordSync": "",
      "adoptionPolicy": {
        "matchingAttributes": [
          {
            "targetName": "",
            "sourceId": ""
          }
        ],
        "remediationPolicy": {
          "policy": "",
          "autoRemediateOnUpdate": false
        }
      }
    },
    "provisioningState": ""
  }
}
```

### `DELETE` /v1.0/applications/:applicationId
**Deletes the application that is specified by the application ID.**

Path params: `applicationId`

## Certificates

### `GET` /v1.0/personalcert
**Gets the list of personal certificates.**

### `GET` /v1.0/personalcert/:label
**Get a single personal certificate with the specified label.**

Path params: `label`

### `GET` /v1.0/signercert
**Gets the list of signer certificates.**

### `GET` /v1.0/signercert/:label
**Gets the signer certificate with the given label.**

Path params: `label`

### `POST` /v1.0/personalcert
**Import or generate a personal certificate.**

```json
{
  "label": "",
  "subject": "",
  "expire": 0,
  "keysize": 0,
  "algorithm": "",
  "isDefault": false,
  "cert": "",
  "password": ""
}
```

### `POST` /v1.0/signercert
**Imports a signer certificate.**

```json
{
  "cert": "",
  "label": ""
}
```

### `PUT` /v1.0/personalcert/:label
**Update a personal certificate.**

Path params: `label`

```json
{
  "isDefault": false
}
```

### `DELETE` /v1.0/personalcert/:label
**Delete a personal certificate.**

Path params: `label`

### `DELETE` /v1.0/signercert/:label
**Delete a signer certificate.**

Path params: `label`

## Template File Registration

### `GET` /v1.0/branding/registration/:type
**Get template registrations.**

Path params: `type`

### `POST` /v1.0/branding/registration/:type
**Register a template.**

Path params: `type`

### `DELETE` /v1.0/branding/registration/:type/:fileName
**Delete a registered template file.**

Path params: `type`, `fileName`
