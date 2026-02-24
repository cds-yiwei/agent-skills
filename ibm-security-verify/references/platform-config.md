# Platform Configuration & Operations

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Adapter Management](#adapter-management) (11 endpoints)
- [Agent Bridge Support Service](#agent-bridge-support-service) (8 endpoints)
- [Customization - Themes](#customization---themes) (9 endpoints)
- [Deprecated - Attribute Evaluation. Replaced by -v2.0-attributequery](#deprecated---attribute-evaluation-replaced-by--v20-attributequery) (deprecated) (1 endpoints)
- [Device manager configuration](#device-manager-configuration) (13 endpoints)
- [Events](#events) (1 endpoints)
- [Provisioning Management](#provisioning-management) (4 endpoints)
- [Query Logs](#query-logs) (1 endpoints)
- [Reports](#reports) (4 endpoints)
- [Tenant Properties API 2.0](#tenant-properties-api-20) (2 endpoints)
- [Threat Insights Configurations API](#threat-insights-configurations-api) (6 endpoints)
- [Webhook-Configuration](#webhook-configuration) (19 endpoints)

## Adapter Management

### `GET` /config/v1.0/attribute/profiles
**List all profiles using the attribute.**

Query params: `attributeid`, `state`

### `GET` /config/v1.0/profiles
**Get all custom profiles in system.**

Query params: `state`, `search`, `sortBy`, `sortOrder`, `page`, `limit`

### `GET` /config/v1.0/profiles/:profileId
**Get details of the specified profile**

Path params: `profileId`

### `GET` /config/v1.0/templates/:templateId/profiles
**Get all profiles in system for a tenant with a given template id.**

Path params: `templateId`

### `GET` /config/v1.0/templates/:templateId/profiles/:profileId
**Get webui template in the system for a given profile id and template id.**

Path params: `templateId`, `profileId`

### `POST` /config/v1.0/profiles
**Create draft in system.**

### `POST` /config/v1.0/profiles/:profileId/publish
**Publish the profile**

Path params: `profileId`

### `POST` /config/v1.0/profiles/upload
**Upload the identity adapter profile JAR file.**

### `PUT` /config/v1.0/profiles/:profileId
**Update draft in system.**

Path params: `profileId`

### `PUT` /config/v1.0/profiles/upload/:profileId
**Update the identity adapter profile.**

Path params: `profileId`

### `DELETE` /config/v1.0/profiles/:profileId
**Delete specified profile**

Path params: `profileId`

## Agent Bridge Support Service

### `GET` /config/v1.0/onpremagents
**Retrieve agent configurations.**

Query params: `pagination`, `search`, `filter`

### `GET` /config/v1.0/onpremagents/:id
**Retrieve a specific agent's configuration.**

Path params: `id`
Query params: `filter`

### `GET` /config/v1.0/onpremagents/:id/apicreds
**Retrieve the API Client credentials.**

Path params: `id`

### `GET` /config/v1.0/onpremagents/corruptedconfigs
**Retrieve corrupted agent configuration(s) which can't be decrypted due to missing certificate**

### `POST` /config/v1.0/onpremagents
**Create an agent configuration.**

```json
{
  "name": "",
  "description": "",
  "heartbeat": 0,
  "authnCacheTimeout": 0,
  "certLabel": "",
  "references": [
    {
      "id": "",
      "type": "",
      "ref": ""
    }
  ],
  "purpose": "",
  "modules": [
    {}
  ],
  "apiClients": [
    {
      "clientId": "",
      "clientSecret": "",
      "ipFilterOp": "",
      "ipFilters": []
    }
  ],
  "identitySources": [
    {
      "attributeMappings": [
        {
          "attrId": "",
          "idsAttrName": "",
          "jitpOption": ""
        }
      ],
      "instanceName": "",
      "id": "",
      "enabled": false,
      "predefined": false,
      "properties": [
        {
          "key": "",
          "value": "",
          "sensitive": false
        }
      ],
      "sourceTypeId": "",
      "status": "",
      "realmName": "",
      "agentId": "",
      "enabledForAdmin": false,
      "enabledForEndUser": false,
      "passwordResetEnabled": false,
      "sendPasswordEmailToEmployee": false,
      "sendPasswordEmailToManager": false,
      "identityLinkingEnabled": false,
      "identityLinkingJitEnabled": false,
      "identityLinkingJitPwdEnabled": false,
      "identityLinkingPrincipalAttribute": "",
      "passwordPolicyId": ""
    }
  ]
}
```

### `PUT` /config/v1.0/onpremagents/:id
**Update a specific agent configuration.**

Path params: `id`

```json
{
  "id": "",
  "name": "",
  "description": "",
  "apiClients": [],
  "heartbeat": 0,
  "authnCacheTimeout": 0,
  "certLabel": "",
  "references": [
    {
      "id": "",
      "type": "",
      "ref": ""
    }
  ],
  "purpose": "",
  "modules": [
    {}
  ]
}
```

### `PUT` /config/v1.0/onpremagents/:id/apicreds/:clientid
**Modify the API Client credential and configuration.**

Path params: `id`, `clientid`

```json
{
  "clientId": "",
  "clientSecret": "",
  "ipFilterOp": "",
  "ipFilters": []
}
```

### `DELETE` /config/v1.0/onpremagents/:id
**Delete an agent configuration.**

Path params: `id`

## Customization - Themes

### `GET` /v1.0/branding/themes
**List all the themes**

Query params: `pagination`

### `GET` /v1.0/branding/themes/:themeId
**Download theme-based templates**

Path params: `themeId`
Query params: `customized_only`

### `GET` /v1.0/branding/themes/:themeId/:templatePath
**Download a specific template file from a theme**

Path params: `themeId`, `templatePath`

### `POST` /v1.0/branding/themes
**Register a new theme**

### `PUT` /v1.0/branding/themes/:themeId
**Update a theme registration**

Path params: `themeId`

### `PUT` /v1.0/branding/themes/:themeId/:templatePath
**Update a specific template file for a theme**

Path params: `themeId`, `templatePath`

### `DELETE` /v1.0/branding/reset
**Reset customizations**

### `DELETE` /v1.0/branding/themes/:themeId
**Delete a theme registration**

Path params: `themeId`

### `DELETE` /v1.0/branding/themes/:themeId/:templatePath
**Deletes a customization for a specific template file in a theme**

Path params: `themeId`, `templatePath`

## Deprecated - Attribute Evaluation. Replaced by -v2.0-attributequery ⚠️ DEPRECATED

### `POST` /v1.0/attributequery/preview ⚠️ DEPRECATED
**Deprecated - Preview the value that would be computed for this attribute.**

```json
{
  "uid": "",
  "user": {},
  "idsuser": {},
  "attribute": {
    "id": "",
    "name": "",
    "description": "",
    "scope": "",
    "sourceType": "",
    "datatype": "",
    "tags": [],
    "value": "",
    "credName": "",
    "credNameOverrides": {},
    "schemaAttribute": {
      "name": "",
      "attributeName": "",
      "scimName": "",
      "customAttribute": false
    },
    "profileAttribute": {
      "name": ""
    },
    "constraints": {
      "readAccessForEndUser": false,
      "writeAccessForEndUser": false,
      "mandatory": false,
      "unique": false,
      "valueConstraint": {
        "type": "",
        "value": {},
        "format": ""
      },
      "valueConstraintFormat": "",
      "valueConstraintType": ""
    },
    "function": {
      "name": "",
      "custom": ""
    },
    "customProperties": {}
  }
}
```

## Device manager configuration

### `GET` /config/v1.0/mdm/device-managers
**Lists device managers**

Query params: `identitySourceId`, `idOnly`

### `GET` /config/v1.0/mdm/device-managers/:deviceManagerId
**Get a device-manager**

Path params: `deviceManagerId`

### `GET` /config/v1.0/mdm/device-managers/trusted-certificates
**Get trusted certificates as a zip file.**

### `GET` /config/v1.0/mdm/devices
**Lists device information**

Query params: `userId`, `deviceManagerId`, `deviceId`, `refresh`

### `GET` /config/v1.0/mdm/mydevices
**Lists your own device information**

Query params: `deviceManagerId`, `deviceId`, `refresh`

### `GET` /config/v1.0/mdm/uniqueuseridentifiers
**Lists uniqueuseridentifiers**

Query params: `mdmType`

### `POST` /config/v1.0/mdm/device-managers
**Create a device manager configuration.**

```json
{
  "status": "",
  "instanceName": "",
  "enabled": false,
  "identitySourceId": "",
  "jitpEnabled": false,
  "syncUserDeviceInfo": false,
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
  "mdmProps": {
    "tenantName": "",
    "type": "",
    "authenticationType": "",
    "maxClientCertsPerDevice": 0,
    "userDeviceStatusCacheTimeout": 0,
    "scepChallengePassword": "",
    "scepChallengeType": "",
    "authentication": {
      "clientId": "",
      "clientSecret": "",
      "username": "",
      "password": "",
      "serviceAccount": {
        "serviceAccountEmail": "",
        "accountEmail": "",
        "serviceAccountPrivateKey": ""
      }
    },
    "scepChallengeWebhookConfigured": false,
    "webhooks": {
      "scepChallenge": {
        "username": "",
        "password": ""
      }
    }
  },
  "deviceManagerId": "",
  "fetchAttributes": [],
  "csrUidLocation": "",
  "uniqueUserIdentifierRequestRule": ""
}
```

### `POST` /config/v1.0/mdm/device-managers/testconnection
**Test a device manager connection**

Query params: `mdmType`

```json
{
  "mdmProps": {
    "tenantName": "",
    "authentication": {
      "clientId": "",
      "clientSecret": "",
      "username": "",
      "password": "",
      "serviceAccount": {
        "serviceAccountEmail": "",
        "accountEmail": "",
        "serviceAccountPrivateKey": ""
      }
    }
  },
  "identitySourceId": "",
  "syncUserDeviceInfo": false,
  "uniqueUserIdentifier": "",
  "realm": ""
}
```

### `PUT` /config/v1.0/mdm/device-managers/:deviceManagerId
**Update a device manager configuration**

Path params: `deviceManagerId`

```json
{
  "status": "",
  "instanceName": "",
  "enabled": false,
  "identitySourceId": "",
  "jitpEnabled": false,
  "syncUserDeviceInfo": false,
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
  "mdmProps": {
    "tenantName": "",
    "type": "",
    "authenticationType": "",
    "maxClientCertsPerDevice": 0,
    "userDeviceStatusCacheTimeout": 0,
    "scepChallengePassword": "",
    "scepChallengeType": "",
    "authentication": {
      "clientId": "",
      "clientSecret": "",
      "username": "",
      "password": "",
      "serviceAccount": {
        "serviceAccountEmail": "",
        "accountEmail": "",
        "serviceAccountPrivateKey": ""
      }
    },
    "scepChallengeWebhookConfigured": false,
    "webhooks": {
      "scepChallenge": {
        "username": "",
        "password": ""
      }
    }
  },
  "deviceManagerId": "",
  "fetchAttributes": [],
  "csrUidLocation": "",
  "uniqueUserIdentifierRequestRule": ""
}
```

### `PATCH` /config/v1.0/mdm/device-managers/:deviceManagerId
**PATCH a device manager configuration.**

Path params: `deviceManagerId`

### `DELETE` /config/v1.0/mdm/device-managers/:deviceManagerId
**Delete a device manager configuration.**

Path params: `deviceManagerId`

### `DELETE` /config/v1.0/mdm/devices
**Delete user device**

Query params: `userId`, `deviceManagerId`, `deviceId`

### `DELETE` /config/v1.0/mdm/mydevices
**Deletes your own device**

Query params: `deviceManagerId`, `deviceId`

## Events

### `GET` /v1.0/events
**Get all events for a tenant.**

Query params: `all_events`, `event_type`, `resource`, `filter_key`, `filter_value`, `from`, `to`, `after_id`, `after_time`, `range_type`, `size`, `sort_order`

## Provisioning Management

### `GET` /v1.0/prov/policy/:application
**Get provisioning policy for an application.**

Path params: `application`

### `POST` /v1.0/prov/policy/:application
**Create a provisioning policy for an applicatication. Provisioning policy enables or disables publishing of provisioning events for the application.**

Path params: `application`

### `PUT` /v1.0/prov/policy/:application
**Update provisioning policy for an application. In addition resends all events for the application.**

Path params: `application`
Query params: `resendAll`

### `DELETE` /v1.0/prov/policy/:application
**Delete provisioning policy for an application.**

Path params: `application`

## Query Logs

### `POST` /v1.0/logs/query
**Retrieves the trace logs**

```json
{
  "filter": {
    "op": "",
    "match": [
      {
        "key": "",
        "value": "",
        "values": [],
        "op": "",
        "filter": {}
      }
    ]
  },
  "start": 0,
  "end": 0,
  "limit": 0,
  "sort": ""
}
```

## Reports

### `GET` /v1.0/reports/jobs/:id
**Gets the details of a download job or gets a CSV report.**

Path params: `id`

### `POST` /v1.0/reports/:name
**Run a report.**

Path params: `name`

### `POST` /v1.0/reports/export/:name
**Export reports for a specified tenant into CSV file.**

Path params: `name`

### `POST` /v1.0/reports/export/jobs
**Generates a report asynchronously for a specified tenant into a CSV file.**

Query params: `type`, `name`, `generated_by`, `description`, `email_list`

```json
{
  "filter": "",
  "columns": [
    {
      "attributeCategory": "",
      "attributeName": "",
      "attributeKey": ""
    }
  ]
}
```

## Tenant Properties API 2.0

### `GET` /v2.0/tenant/properties
**Retrieves a list of tenant properties for the specified tenant.**

### `PUT` /v2.0/tenant/properties
**Replaces the tenant properties for the specified tenant.**

```json
{
  "accessControlAllowOrigin": [
    {
      "origin": "",
      "regex": false
    }
  ],
  "targetUrlAllowedHostV2": [
    {
      "targetUrl": "",
      "regex": false
    }
  ],
  "securityHeaderContentSecurityPolicy": ""
}
```

## Threat Insights Configurations API

### `GET` /v1.0/itdr/configurations/:config_id
**Fetch threat configuration for specified tenant and configuration id**

Path params: `config_id`

### `GET` /v1.0/itdr/configurations/default
**Fetch threat default configuration for specified tenant**

### `POST` /v1.0/itdr/configurations
**Create the threat configuration for specified tenant**

```json
{
  "created_by": "",
  "notification_list": [],
  "config_name": "",
  "config_desc": "",
  "ip_filter": {
    "allow_ip_list": [],
    "deny_ip_list": []
  },
  "rules": [
    {
      "id": "",
      "name": "",
      "description": "",
      "config": {
        "warning": {
          "action": "",
          "notification_alert": false,
          "notification_type": ""
        },
        "critical": {
          "action": "",
          "notification_alert": false,
          "notification_type": ""
        }
      }
    }
  ]
}
```

### `PUT` /v1.0/itdr/configurations/:config_id
**Update the threat configuration for specified tenant for given configuration id**

Path params: `config_id`

```json
{
  "modified_by": "",
  "notification_list": [],
  "config_name": "",
  "config_desc": "",
  "ip_filter": {
    "allow_ip_list": [],
    "deny_ip_list": []
  },
  "rules": [
    {
      "id": "",
      "name": "",
      "description": "",
      "config": {
        "warning": {
          "action": "",
          "notification_alert": false,
          "notification_type": ""
        },
        "critical": {
          "action": "",
          "notification_alert": false,
          "notification_type": ""
        }
      }
    }
  ]
}
```

### `PUT` /v1.0/itdr/configurations/:config_id/status
**Update the threat configuration Status for specified tenant and configuration id**

Path params: `config_id`

```json
{
  "status": ""
}
```

### `DELETE` /v1.0/itdr/configurations/:config_id/status
**Delete the threat configuration for specified tenant for given configuration id**

Path params: `config_id`

## Webhook-Configuration

### `GET` /config/v1.0/webhooks/
**List Webhooks**

Query params: `pagination`, `search`

### `GET` /config/v1.0/webhooks/:id
**Fetch a Webhook**

Path params: `id`

### `GET` /config/v1.0/webhooks/:id/deadletters
**Fetch webhook dead letters**

Path params: `id`
Query params: `pagination`

### `GET` /config/v1.0/webhooks/:id/deadletters/:eventId
**Retrieve a dead letter**

Path params: `id`, `eventId`

### `GET` /config/v1.0/webhooks/:id/deadletters/count
**View the total number of deadletters a webhook**

Path params: `id`

### `GET` /config/v1.0/webhooks/:id/deadletters/flush
**View the state of a deadletter reconciliation**

Path params: `id`

### `GET` /config/v1.0/webhooks/:id/health
**Get webhook health**

Path params: `id`

### `GET` /config/v1.0/webhooks/:id/stats
**Current webhook status**

Path params: `id`
Query params: `time`

### `GET` /config/v1.0/webhooks/:id/test
**Test a configured webhook**

Path params: `id`

### `GET` /config/v1.0/webhooks/:id/test/:resource
**Tests a resource of a configured webhook**

Path params: `id`, `resource`

### `GET` /config/v1.0/webhooks/purposes
**List Webhook Purposes**

### `POST` /config/v1.0/webhooks/
**Create a Webhook**

```json
{
  "authentication": {
    "basic": {
      "password": "",
      "username": ""
    },
    "header": {
      "values": [
        {
          "key": "",
          "sensitive": false,
          "value": ""
        }
      ]
    },
    "jwt": {
      "additionalClaims": {},
      "alg": "",
      "header": {},
      "httpHeaderName": "",
      "httpHeaderPrefix": "",
      "lifetime": 0,
      "personalCertificateLabel": "",
      "secretKey": "",
      "sub": ""
    },
    "mtls": {
      "personalCertificateLabel": ""
    },
    "oauth": {
      "client_id": "",
      "client_secret": "",
      "expires_in": 0,
      "personalCertificateLabel": "",
      "scope": "",
      "token_endpoint": "",
      "token_endpoint_auth_method": "",
      "window": 0
    },
    "type": ""
  },
  "expectedStatus": [],
  "headers": [
    {
      "key": "",
      "value": ""
    }
  ],
  "metadata": {
    "connector": "",
    "contactEmail": "",
    "contactName": "",
    "createdBy": "",
    "createdByType": "",
    "dateCreated": "",
    "dateModified": "",
    "modifiedBy": "",
    "modifiedByType": "",
    "properties": {}
  },
  "name": "",
  "notification": {
    "deadletters": {
      "autoFlushEnabled": false,
      "flushIntervalMins": 0
    },
    "enabled": false,
    "interests": [
      {
        "clauses": [
          {
            "key": "",
            "operation": "",
            "value": ""
          }
        ],
        "description": "",
        "name": ""
      }
    ],
    "recordDeadletters": false
  },
  "purpose": [],
  "references": [
    {
      "created": "",
      "location": "",
      "metadata": {},
      "name": ""
    }
  ],
  "resources": {},
  "transform": {
    "incoming": "",
    "outgoing": ""
  },
  "type": "",
  "urls": []
}
```

### `POST` /config/v1.0/webhooks/:id/deadletters/flush
**Initiate a reconciliation of deadletters**

Path params: `id`

```json
{
  "from": "",
  "limit": 0,
  "to": ""
}
```

### `POST` /config/v1.0/webhooks/pretest/:resource
**Preflight a webhook configuration**

Path params: `resource`

```json
{
  "authentication": {
    "basic": {
      "password": "",
      "username": ""
    },
    "header": {
      "values": [
        {
          "key": "",
          "sensitive": false,
          "value": ""
        }
      ]
    },
    "jwt": {
      "additionalClaims": {},
      "alg": "",
      "header": {},
      "httpHeaderName": "",
      "httpHeaderPrefix": "",
      "lifetime": 0,
      "personalCertificateLabel": "",
      "secretKey": "",
      "sub": ""
    },
    "mtls": {
      "personalCertificateLabel": ""
    },
    "oauth": {
      "client_id": "",
      "client_secret": "",
      "expires_in": 0,
      "personalCertificateLabel": "",
      "scope": "",
      "token_endpoint": "",
      "token_endpoint_auth_method": "",
      "window": 0
    },
    "type": ""
  },
  "expectedStatus": [],
  "headers": [
    {
      "key": "",
      "value": ""
    }
  ],
  "metadata": {
    "connector": "",
    "contactEmail": "",
    "contactName": "",
    "createdBy": "",
    "createdByType": "",
    "dateCreated": "",
    "dateModified": "",
    "modifiedBy": "",
    "modifiedByType": "",
    "properties": {}
  },
  "name": "",
  "notification": {
    "deadletters": {
      "autoFlushEnabled": false,
      "flushIntervalMins": 0
    },
    "enabled": false,
    "interests": [
      {
        "clauses": [
          {
            "key": "",
            "operation": "",
            "value": ""
          }
        ],
        "description": "",
        "name": ""
      }
    ],
    "recordDeadletters": false
  },
  "purpose": [],
  "references": [
    {
      "created": "",
      "location": "",
      "metadata": {},
      "name": ""
    }
  ],
  "resources": {},
  "transform": {
    "incoming": "",
    "outgoing": ""
  },
  "type": "",
  "urls": []
}
```

### `POST` /config/v1.0/webhooks/transform
**Develop an transform**

```json
{
  "input": {
    "authentication_header": {},
    "body": {
      "JSON": {},
      "Raw": []
    },
    "header": {
      "key": "",
      "value": ""
    },
    "host": "",
    "method": "",
    "path": "",
    "request": "",
    "statusCode": 0
  },
  "mode": "",
  "transform": ""
}
```

### `PUT` /config/v1.0/webhooks/:id
**Update a Webhook**

Path params: `id`

```json
{
  "authentication": {
    "basic": {
      "password": "",
      "username": ""
    },
    "header": {
      "values": [
        {
          "key": "",
          "sensitive": false,
          "value": ""
        }
      ]
    },
    "jwt": {
      "additionalClaims": {},
      "alg": "",
      "header": {},
      "httpHeaderName": "",
      "httpHeaderPrefix": "",
      "lifetime": 0,
      "personalCertificateLabel": "",
      "secretKey": "",
      "sub": ""
    },
    "mtls": {
      "personalCertificateLabel": ""
    },
    "oauth": {
      "client_id": "",
      "client_secret": "",
      "expires_in": 0,
      "personalCertificateLabel": "",
      "scope": "",
      "token_endpoint": "",
      "token_endpoint_auth_method": "",
      "window": 0
    },
    "type": ""
  },
  "expectedStatus": [],
  "headers": [
    {
      "key": "",
      "value": ""
    }
  ],
  "metadata": {
    "connector": "",
    "contactEmail": "",
    "contactName": "",
    "createdBy": "",
    "createdByType": "",
    "dateCreated": "",
    "dateModified": "",
    "modifiedBy": "",
    "modifiedByType": "",
    "properties": {}
  },
  "name": "",
  "notification": {
    "deadletters": {
      "autoFlushEnabled": false,
      "flushIntervalMins": 0
    },
    "enabled": false,
    "interests": [
      {
        "clauses": [
          {
            "key": "",
            "operation": "",
            "value": ""
          }
        ],
        "description": "",
        "name": ""
      }
    ],
    "recordDeadletters": false
  },
  "purpose": [],
  "references": [
    {
      "created": "",
      "location": "",
      "metadata": {},
      "name": ""
    }
  ],
  "resources": {},
  "transform": {
    "incoming": "",
    "outgoing": ""
  },
  "type": "",
  "urls": []
}
```

### `DELETE` /config/v1.0/webhooks/:id
**Delete a webhhook**

Path params: `id`

### `DELETE` /config/v1.0/webhooks/:id/deadletters
**Remove webhook dead letters**

Path params: `id`
Query params: `beforeMs`

### `DELETE` /config/v1.0/webhooks/:id/deadletters/:eventId
**Remove a dead letter**

Path params: `id`, `eventId`
