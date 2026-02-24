# Data Privacy & Consent

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Data Privacy and Consent Management](#data-privacy-and-consent-management) (41 endpoints)
- [Data Privacy and Consent](#data-privacy-and-consent) (4 endpoints)

## Data Privacy and Consent Management

### `GET` /config/v1.0/privacy/access-types
**Retrieve all access types**

Query params: `pagination`, `search`

### `GET` /config/v1.0/privacy/access-types/:id
**Retrieve a specific access type**

Path params: `id`

### `GET` /config/v1.0/privacy/consent-providers
**Retrieve all consent providers**

### `GET` /config/v1.0/privacy/consent-providers/:id
**Retrieve a specific consent provider**

Path params: `id`

### `GET` /config/v1.0/privacy/consents
**Retrieve a list of consent records.**

Query params: `sort`, `pagination`, `search`

### `GET` /config/v1.0/privacy/consents/:id
**Retrieve a specific consent record.**

Path params: `id`

### `GET` /config/v1.0/privacy/geo
**Search a geography record by a search term.**

Query params: `pagination`, `search`

### `GET` /config/v1.0/privacy/policies/:id
**Retrieve the policy record.**

Path params: `id`

### `GET` /config/v1.0/privacy/profiles
**Retrieve a list of Privacy Profiles.**

Query params: `sort`, `pagination`, `search`

### `GET` /config/v1.0/privacy/profiles/:id
**Retrieve a Privacy Profile by Id.**

Path params: `id`

### `GET` /config/v1.0/privacy/purposes
**Retrieve all purposes**

Query params: `pagination`, `search`

### `GET` /config/v1.0/privacy/purposes/:id
**Retrieve a specific purpose**

Path params: `id`

### `GET` /config/v1.0/privacy/purposes/:id/:version
**Retrieve a specific purpose with version**

Path params: `id`, `version`

### `GET` /config/v1.0/privacy/purposes/:id/:version/termsOfUse/documents
**Retrieve all locale documents attached to the specified EULA version**

Path params: `id`, `version`

### `GET` /config/v1.0/privacy/purposes/:id/:version/termsOfUse/documents/:locale
**Retrieve the EULA document for the specified locale**

Path params: `id`, `version`, `locale`

### `GET` /config/v1.0/privacy/rules
**Retrieve all the privacy rules in a tenant.**

Query params: `filter`, `sort`, `pagination`, `search`

### `GET` /config/v1.0/privacy/rules/:id
**Retrieve a specific privacy rule in a tenant.**

Path params: `id`

### `POST` /config/v1.0/privacy/access-types
**Create a new access type**

```json
{
  "id": "",
  "name": ""
}
```

### `POST` /config/v1.0/privacy/consent-providers
**Create a new consent provider**

```json
{
  "id": "",
  "name": "",
  "description": "",
  "type": "",
  "integrationId": "",
  "referenceId": "",
  "profile": {
    "restrictScopes": false,
    "scopes": [],
    "restrictPurposes": false,
    "purposes": [],
    "subjectMapping": {
      "attributeId": "",
      "transform": "",
      "rule": ""
    }
  },
  "batchSize": {
    "dua": 0,
    "dsp": 0,
    "consents": 0
  },
  "meta": {
    "createdTime": "",
    "lastModifiedTime": ""
  }
}
```

### `POST` /config/v1.0/privacy/profiles
**Create a Privacy Profile.**

```json
{
  "id": "",
  "name": "",
  "description": "",
  "purposes": [
    {
      "id": "",
      "accessTypes": [
        {
          "id": "",
          "approvalRequired": false
        }
      ],
      "attributes": [
        {
          "id": "",
          "accessTypes": [
            {
              "id": "",
              "approvalRequired": false
            }
          ]
        }
      ]
    }
  ]
}
```

### `POST` /config/v1.0/privacy/purposes
**Create a new purpose**

```json
{
  "id": "",
  "name": "",
  "tags": [],
  "defaultConsentDuration": 0,
  "description": "",
  "previousConsentApply": false,
  "accessTypes": [
    {
      "id": ""
    }
  ],
  "category": "",
  "customAttributes": [
    {
      "name": "",
      "value": ""
    }
  ],
  "termsOfUse": {
    "ref": "",
    "external": false
  },
  "attributes": [
    {
      "id": "",
      "accessTypes": [
        {
          "id": ""
        }
      ],
      "mandatory": false,
      "retentionPeriod": 0
    }
  ]
}
```

### `POST` /config/v1.0/privacy/purposes/:id/0/termsOfUse/documents
**Attach a document to a EULA**

Path params: `id`

### `POST` /config/v1.0/privacy/rules
**Create a privacy rule in a tenant.**

```json
{
  "name": "",
  "description": "",
  "startTime": 0,
  "endTime": 0,
  "discloseable": false,
  "assentUIDefault": false,
  "legalCategory": 0,
  "tags": [],
  "decision": {
    "result": "",
    "reason": "",
    "script": ""
  },
  "conditions": [
    {
      "accessTypeId": "",
      "purposeId": "",
      "attributeId": "",
      "geography": {
        "continentCode": "",
        "countryCode": "",
        "subdivisionOneCode": "",
        "subdivisionTwoCode": ""
      },
      "purposeTag": "",
      "isExternalSubject": false,
      "subjectGroup": ""
    }
  ]
}
```

### `PUT` /config/v1.0/privacy/access-types/:id
**Update a specific access type**

Path params: `id`

```json
{
  "name": ""
}
```

### `PUT` /config/v1.0/privacy/consent-providers/:id
**Update a specific consent provider**

Path params: `id`

```json
{
  "id": "",
  "name": "",
  "description": "",
  "type": "",
  "integrationId": "",
  "referenceId": "",
  "profile": {
    "restrictScopes": false,
    "scopes": [],
    "restrictPurposes": false,
    "purposes": [],
    "subjectMapping": {
      "attributeId": "",
      "transform": "",
      "rule": ""
    }
  },
  "batchSize": {
    "dua": 0,
    "dsp": 0,
    "consents": 0
  },
  "meta": {
    "createdTime": "",
    "lastModifiedTime": ""
  }
}
```

### `PUT` /config/v1.0/privacy/policies/:id
**Update the policy record.**

Path params: `id`

```json
{
  "ruleList": []
}
```

### `PUT` /config/v1.0/privacy/profiles/:id
**Update a Privacy Profile.**

Path params: `id`

```json
{
  "name": "",
  "description": "",
  "purposes": [
    {
      "id": "",
      "accessTypes": [
        {
          "id": "",
          "approvalRequired": false
        }
      ],
      "attributes": [
        {
          "id": "",
          "accessTypes": [
            {
              "id": "",
              "approvalRequired": false
            }
          ]
        }
      ]
    }
  ]
}
```

### `PUT` /config/v1.0/privacy/purposes/:id
**Create a new version of an existing purpose**

Path params: `id`
Query params: `restoreFromVersion`

```json
{
  "name": "",
  "tags": [],
  "defaultConsentDuration": 0,
  "description": "",
  "previousConsentApply": false,
  "accessTypes": [
    {
      "id": ""
    }
  ],
  "category": "",
  "customAttributes": [
    {
      "name": "",
      "value": ""
    }
  ],
  "termsOfUse": {
    "ref": "",
    "external": false
  },
  "attributes": [
    {
      "id": "",
      "accessTypes": [
        {
          "id": ""
        }
      ],
      "mandatory": false,
      "retentionPeriod": 0
    }
  ]
}
```

### `PUT` /config/v1.0/privacy/purposes/:id/:version
**Update an existing purpose and it's version**

Path params: `id`, `version`

```json
{
  "name": "",
  "tags": [],
  "defaultConsentDuration": 0,
  "description": "",
  "previousConsentApply": false,
  "accessTypes": [
    {
      "id": ""
    }
  ],
  "category": "",
  "customAttributes": [
    {
      "name": "",
      "value": ""
    }
  ],
  "termsOfUse": {
    "ref": "",
    "external": false
  },
  "attributes": [
    {
      "id": "",
      "accessTypes": [
        {
          "id": ""
        }
      ],
      "mandatory": false,
      "retentionPeriod": 0
    }
  ]
}
```

### `PUT` /config/v1.0/privacy/rules/:id
**Update a privacy rule in a tenant.**

Path params: `id`

```json
{
  "name": "",
  "description": "",
  "startTime": 0,
  "endTime": 0,
  "discloseable": false,
  "assentUIDefault": false,
  "legalCategory": 0,
  "tags": [],
  "decision": {
    "result": "",
    "reason": "",
    "script": ""
  },
  "conditions": [
    {
      "id": "",
      "accessTypeId": "",
      "purposeId": "",
      "attributeId": "",
      "geography": {
        "continentCode": "",
        "countryCode": "",
        "subdivisionOneCode": "",
        "subdivisionTwoCode": ""
      },
      "purposeTag": "",
      "isExternalSubject": false,
      "subjectGroup": ""
    }
  ]
}
```

### `PATCH` /config/v1.0/privacy/consents
**Bulk delete consent records.**

Body: `[{'op': '', 'path': ''}]`

### `PATCH` /config/v1.0/privacy/purpose-relationships
**Patch a purpose relationship**

Body: `[{'op': '', 'value': {'extCategory': '', 'extId': '', 'purposeId': ''}}]`

### `PATCH` /config/v1.0/privacy/purposes/:id/:version
**Update the state of an existing purpose**

Path params: `id`, `version`

```json
{
  "op": "",
  "path": "",
  "value": 0
}
```

### `DELETE` /config/v1.0/privacy/access-types/:id
**Delete a specific access type**

Path params: `id`

### `DELETE` /config/v1.0/privacy/consent-providers/:id
**Delete an existing consent provider**

Path params: `id`

### `DELETE` /config/v1.0/privacy/consents/:id
**Delete a specific consent record from a tenant.**

Path params: `id`

### `DELETE` /config/v1.0/privacy/profiles/:id
**Delete a Privacy Profile by Id.**

Path params: `id`

### `DELETE` /config/v1.0/privacy/purposes/:id
**Delete a specific purpose**

Path params: `id`

### `DELETE` /config/v1.0/privacy/purposes/:id/:version
**Delete a specific purpose with version**

Path params: `id`, `version`

### `DELETE` /config/v1.0/privacy/purposes/:id/:version/termsOfUse/documents/:locale
**Delete the EULA document for the specified locale**

Path params: `id`, `version`, `locale`

### `DELETE` /config/v1.0/privacy/rules/:id
**Delete a privacy rule in a tenant.**

Path params: `id`

## Data Privacy and Consent

### `POST` /v1.0/privacy/consents
**Create or update a consent record.**

```json
{
  "subjectId": "",
  "purposeId": "",
  "isExternalSubject": false,
  "isGlobal": false,
  "attributeId": "",
  "attributeValue": "",
  "accessTypeId": "",
  "geoIP": "",
  "state": 0,
  "startTime": 0,
  "endTime": 0,
  "customAttributes": [
    {
      "name": "",
      "value": ""
    }
  ]
}
```

### `POST` /v1.0/privacy/data-subject-presentation
**Presents the data subject information to the user.**

```json
{
  "purposeId": [],
  "subjectId": "",
  "geoIP": "",
  "isExternalSubject": false
}
```

### `POST` /v1.0/privacy/data-usage-approval
**Provides the data usage approval.**

```json
{
  "items": [
    {
      "purposeId": "",
      "profileId": "",
      "accessTypeId": "",
      "attributeId": "",
      "attributeValue": ""
    }
  ],
  "subjectId": "",
  "isExternalSubject": false,
  "geoIP": "",
  "trace": false
}
```

### `PATCH` /v1.0/privacy/consents
**Bulk create or patch consent records.**

Body: `[{'op': '', 'path': '', 'value': {'subjectId': '', 'purposeId': '', 'isExternalSubject': False, 'isGlobal': False, 'attributeId': '', 'attributeValue': '', 'accessTypeId': '', 'geoIP': '', 'state': 0, 'startTime': 0, 'endTime': 0, 'customAttributes': [{'name': '', 'value': ''}]}}]`
