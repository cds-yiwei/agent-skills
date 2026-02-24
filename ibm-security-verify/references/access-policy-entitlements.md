# Access Policy & Entitlements

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Access Policy Management V5.0](#access-policy-management-v50) (10 endpoints)
- [Access Policy Management v3.0 (deprecated)](#access-policy-management-v30-deprecated) (deprecated) (5 endpoints)
- [Access Request Management V1.0](#access-request-management-v10) (29 endpoints)
- [Admin Entitlement Management](#admin-entitlement-management) (16 endpoints)
- [Access Management](#access-management) (5 endpoints)
- [Entitlement Management](#entitlement-management) (22 endpoints)
- [Tenant policy configuration](#tenant-policy-configuration) (2 endpoints)

## Access Policy Management V5.0

### `GET` /v5.0/policyvault/accesspolicy
**retrieve access policies**

Query params: `pagination`, `search`, `filter`

### `GET` /v5.0/policyvault/accesspolicy/:policyId
**retrieve a access policy**

Path params: `policyId`

### `GET` /v5.0/policyvault/accesspolicy/:policyId/revision
**retrieve the revisions for an access policy**

Path params: `policyId`

### `GET` /v5.0/policyvault/accesspolicy/:policyId/revision/:revisionId
**retrieve a revision for an access policy**

Path params: `policyId`, `revisionId`

### `POST` /v5.0/policyvault/accesspolicy
**create an access policy**

```json
{
  "name": "",
  "description": "",
  "containsFirstFactor": false,
  "rules": [
    {
      "id": "",
      "name": "",
      "description": "",
      "alwaysRun": false,
      "firstFactor": false,
      "conditions": [
        {
          "type": ""
        }
      ],
      "result": {
        "action": "",
        "serverSideActions": [
          {
            "actionId": "",
            "version": ""
          }
        ],
        "authnMethods": []
      }
    }
  ],
  "meta": {
    "state": "",
    "schema": "",
    "label": "",
    "scope": [],
    "enforcementType": "",
    "evaluationContext": {},
    "tenantDefaultPolicy": false
  },
  "validations": {
    "subscriptionsNeeded": []
  }
}
```

### `POST` /v5.0/policyvault/accesspolicy/:policyId
**create an access policy revision**

Path params: `policyId`

```json
{
  "name": "",
  "description": "",
  "containsFirstFactor": false,
  "rules": [
    {
      "id": "",
      "name": "",
      "description": "",
      "alwaysRun": false,
      "firstFactor": false,
      "conditions": [
        {
          "type": ""
        }
      ],
      "result": {
        "action": "",
        "serverSideActions": [
          {
            "actionId": "",
            "version": ""
          }
        ],
        "authnMethods": []
      }
    }
  ],
  "meta": {
    "state": "",
    "schema": "",
    "label": "",
    "scope": [],
    "enforcementType": "",
    "evaluationContext": {},
    "tenantDefaultPolicy": false
  },
  "validations": {
    "subscriptionsNeeded": []
  }
}
```

### `PUT` /v5.0/policyvault/accesspolicy/:policyId
**update a access policy**

Path params: `policyId`

```json
{
  "name": "",
  "description": "",
  "containsFirstFactor": false,
  "rules": [
    {
      "id": "",
      "name": "",
      "description": "",
      "alwaysRun": false,
      "firstFactor": false,
      "conditions": [
        {
          "type": ""
        }
      ],
      "result": {
        "action": "",
        "serverSideActions": [
          {
            "actionId": "",
            "version": ""
          }
        ],
        "authnMethods": []
      }
    }
  ],
  "meta": {
    "state": "",
    "schema": "",
    "label": "",
    "scope": [],
    "enforcementType": "",
    "evaluationContext": {},
    "tenantDefaultPolicy": false
  },
  "validations": {
    "subscriptionsNeeded": []
  }
}
```

### `PUT` /v5.0/policyvault/accesspolicy/:policyId/revision/:revisionId
**update a access policy revision**

Path params: `policyId`, `revisionId`

```json
{
  "name": "",
  "description": "",
  "containsFirstFactor": false,
  "rules": [
    {
      "id": "",
      "name": "",
      "description": "",
      "alwaysRun": false,
      "firstFactor": false,
      "conditions": [
        {
          "type": ""
        }
      ],
      "result": {
        "action": "",
        "serverSideActions": [
          {
            "actionId": "",
            "version": ""
          }
        ],
        "authnMethods": []
      }
    }
  ],
  "meta": {
    "state": "",
    "schema": "",
    "label": "",
    "scope": [],
    "enforcementType": "",
    "evaluationContext": {},
    "tenantDefaultPolicy": false
  },
  "validations": {
    "subscriptionsNeeded": []
  }
}
```

### `DELETE` /v5.0/policyvault/accesspolicy/:policyId
**delete an access policy**

Path params: `policyId`

### `DELETE` /v5.0/policyvault/accesspolicy/:policyId/revision/:revisionId
**delete an access policy revision**

Path params: `policyId`, `revisionId`

## Access Policy Management v3.0 (deprecated) ⚠️ DEPRECATED

### `GET` /v3.0/policyvault/accesspolicy ⚠️ DEPRECATED
**Deprecated - Retrieve list of tenant policies.**

Query params: `search`, `pagination`, `sort`

### `GET` /v3.0/policyvault/accesspolicy/:id ⚠️ DEPRECATED
**Deprecated - Retrieve the details of a particular policy specified with id.**

Path params: `id`

### `POST` /v3.0/policyvault/accesspolicy ⚠️ DEPRECATED
**Deprecated - Create a custom policy for tenant.**

```json
{
  "name": "",
  "description": "",
  "schemaVersion": "",
  "rules": [
    {
      "name": "",
      "id": "",
      "conditions": {
        "subjectAttributes": {
          "attributes": [
            {
              "name": "",
              "opCode": "",
              "values": []
            }
          ]
        },
        "ipAddress": {
          "opCode": "",
          "values": []
        },
        "geoLocation": {
          "enabled": false,
          "opCode": ""
        }
      },
      "result": {
        "extendedAction": {
          "action": ""
        },
        "authnMethods": []
      },
      "alwaysRun": false,
      "firstFactor": false,
      "valid": false
    }
  ],
  "containsFirstFactor": false,
  "enforcementType": ""
}
```

### `PUT` /v3.0/policyvault/accesspolicy/:id ⚠️ DEPRECATED
**Deprecated - Update the policy instance of tenant with specified id.**

Path params: `id`

```json
{
  "name": "",
  "description": "",
  "schemaVersion": "",
  "rules": [
    {
      "name": "",
      "id": "",
      "conditions": {
        "subjectAttributes": {
          "attributes": [
            {
              "name": "",
              "opCode": "",
              "values": []
            }
          ]
        },
        "ipAddress": {
          "opCode": "",
          "values": []
        },
        "geoLocation": {
          "enabled": false,
          "opCode": ""
        }
      },
      "result": {
        "extendedAction": {
          "action": ""
        },
        "authnMethods": []
      },
      "alwaysRun": false,
      "firstFactor": false,
      "valid": false
    }
  ],
  "containsFirstFactor": false,
  "enforcementType": ""
}
```

### `DELETE` /v3.0/policyvault/accesspolicy/:id ⚠️ DEPRECATED
**Deprecated - Delete custom policy of tenant with specified id.**

Path params: `id`

## Access Request Management V1.0

### `GET` /v1.0/access/entitlements/:entitlement
**Get details of specified requestable access.**

Path params: `entitlement`
Query params: `details`

### `GET` /v1.0/approver/request
**Search requests of an approver**

Query params: `countOnly`, `status`, `accessType`, `applicationId`, `beneficiaryId`, `filter`, `sort`, `requestOperation`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/approver/request/resources
**Get statistical view of requests for approval**

Query params: `resourceType`, `applicationName`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/approver/request/stats
**Get statistical summary of requests for approval**

### `GET` /v1.0/request
**Search the requests**

Query params: `status`, `accessType`, `applicationId`, `approverRole`, `beneficiaryId`, `filter`, `sort`, `asRequestor`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/request/:id
**Get request details**

Path params: `id`

### `GET` /v1.0/request/resources
**Get statistical view of requests**

Query params: `resourceType`, `applicationName`, `asRequestor`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/request/stats
**Get the summary of request statistics**

Query params: `asRequestor`

### `GET` /v1.0/users/applications/catalog
**Find all requestable applications in the catalog.**

Query params: `sortDesc`, `limit`, `page`

### `GET` /v1.0/workflows
**Find a workflow configuration.**

Query params: `applicationId`, `limit`, `page`

### `GET` /v1.0/workflows/:id
**Find a workflow configuration by ID.**

Path params: `id`

### `POST` /v1.0/access/requestable
**Get the requestable access list for self.**

Query params: `details`, `limit`, `page`

```json
{
  "accessInfo": {
    "name": "",
    "description": ""
  },
  "accessType": [],
  "application": [],
  "sort": {
    "attribute": "",
    "asc": false
  }
}
```

### `POST` /v1.0/approver/requests
**Execute actions for a list of requests**

```json
{
  "justification": "",
  "requests": [
    {
      "requestId": "",
      "justification": "",
      "action": ""
    }
  ]
}
```

### `POST` /v1.0/request
**Create a request**

```json
{
  "requestType": "",
  "applicationId": "",
  "justification": ""
}
```

### `POST` /v1.0/request/:id/justification
**Add a justification**

Path params: `id`

### `POST` /v1.0/request/:id/reminder/approvers
**Send a reminder to all approvers of a request**

Path params: `id`

### `POST` /v1.0/requests
**Create a fine grained access requests**

```json
{
  "justification": "",
  "accessesToAdd": [
    {
      "requestType": "",
      "applicationId": "",
      "entitlement": ""
    }
  ]
}
```

### `POST` /v1.0/requests/cancel
**Cancel a list of requests**

```json
{
  "justification": "",
  "requests": [
    {
      "requestId": "",
      "justification": ""
    }
  ]
}
```

### `POST` /v1.0/self/request
**Create a self request**

```json
{
  "requestType": "",
  "applicationId": "",
  "justification": ""
}
```

### `POST` /v1.0/workflows
**Create a workflow configuration.**

```json
{
  "applicationId": "",
  "isAMrequired": false,
  "isUMrequired": false
}
```

### `PUT` /v1.0/workflows/:id
**Replace an existing workflow configuration.**

Path params: `id`
Query params: `force`

```json
{
  "applicationId": "",
  "isAMrequired": false,
  "isUMrequired": false
}
```

### `DELETE` /v1.0/admin/request/:id
**Delete a request by id**

Path params: `id`

### `DELETE` /v1.0/admin/requests
**Delete all the requests that are filtered by one or more query parameters.**

Query params: `applicationId`, `beforeDate`, `forceDelete`

### `DELETE` /v1.0/workflows/:id
**Delete a workflow configuration.**

Path params: `id`

### `GET` /v1.0/self/request ⚠️ DEPRECATED
**Deprecated - Search the self requests**

Query params: `status`, `accessType`, `applicationId`, `approverRole`, `beneficiaryId`, `filter`, `sort`, `asRequestor`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/self/request/resources ⚠️ DEPRECATED
**Deprecated - Get statistical view of self requests**

Query params: `resourceType`, `applicationName`, `asRequestor`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/self/request/stats ⚠️ DEPRECATED
**Deprecated - Get the summary of self request statistics**

Query params: `asRequestor`

### `POST` /v1.0/self/requests ⚠️ DEPRECATED
**Deprecated - Create a fine grained access request for self**

```json
{
  "justification": "",
  "accessesToAdd": [
    {
      "requestType": "",
      "applicationId": "",
      "entitlement": ""
    }
  ]
}
```

### `POST` /v1.0/self/requests/cancel ⚠️ DEPRECATED
**Deprecated - Cancel a list of requests**

```json
{
  "justification": "",
  "requests": [
    {
      "requestId": "",
      "justification": ""
    }
  ]
}
```

## Admin Entitlement Management

### `GET` /v1.0/admin/entitlements/:entitlement
**Get an admin entitlement.**

Path params: `entitlement`
Query params: `details`

### `GET` /v1.0/admin/entitlements/:entitlement/children
**Get the children of an admin entitlement.**

Path params: `entitlement`
Query params: `search`, `lvl`, `details`, `limit`, `page`

### `GET` /v1.0/groups/:group/admin/entitlements
**Find the admin entitlements that are granted to a group.**

Path params: `group`
Query params: `sublevels`, `type`, `brt`, `limit`, `page`

### `GET` /v1.0/self/admin/entitlements
**Find the admin entitlements that are granted to the user that is logged in.**

Query params: `sublevels`, `type`, `enable`, `limit`, `page`

### `GET` /v1.0/users/:user/admin/entitlements
**Find the admin entitlements that are granted to a user.**

Path params: `user`
Query params: `groups`, `sublevels`, `type`, `enable`, `limit`, `page`, `count`

### `POST` /v1.0/admin/entitlements
**Create an admin entitlement.**

Query params: `resourceType`

```json
{
  "name": "",
  "description": "",
  "type": "",
  "subType": "",
  "hasScope": 0,
  "properties": {
    "resourceType": ""
  },
  "conditionSet": [
    {}
  ],
  "children": []
}
```

### `POST` /v1.0/admin/entitlements/:entitlement
**Grant or revoke an admin entitlement to one or more users and groups.**

Path params: `entitlement`

```json
{
  "grant": {
    "users": [
      {
        "user": "",
        "group": ""
      }
    ],
    "groups": [
      {
        "group": "",
        "brt": false
      }
    ]
  },
  "revoke": {
    "users": [
      {
        "user": "",
        "group": ""
      }
    ],
    "groups": [
      {
        "group": "",
        "delete_visibility_violation": false
      }
    ]
  }
}
```

### `POST` /v1.0/admin/entitlements/:entitlement/children
**Add or remove one or more children for an admin entitlement.**

Path params: `entitlement`

```json
{
  "add": [
    {
      "name": "",
      "description": "",
      "type": "",
      "subType": "",
      "properties": {
        "resourceType": ""
      }
    }
  ],
  "remove": []
}
```

### `POST` /v1.0/admin/entitlements/assignments/search
**Get the list of admin assignments.**

Query params: `details`, `user`, `group`, `enable`, `assignmentType`, `isDelegated`, `limit`, `page`

```json
{
  "code": "",
  "name": "",
  "description": "",
  "type": "",
  "subType": "",
  "properties": {
    "resourceType": ""
  },
  "hasScope": 0
}
```

### `POST` /v1.0/admin/entitlements/group/:group
**Grant or revoke one or more admin entitlements to a group.**

Path params: `group`

```json
{
  "grant": [
    {
      "entitlement": "",
      "brt": false
    }
  ],
  "revoke": [
    {
      "entitlement": "",
      "delete_visibility_violation": false
    }
  ]
}
```

### `POST` /v1.0/admin/entitlements/review/search
**Get the list of user added to or removed from dynamic admin entitlement.**

Query params: `user`, `details`, `operationType`, `limit`, `page`

```json
{
  "code": "",
  "name": "",
  "description": "",
  "type": "",
  "subType": "",
  "properties": {
    "resourceType": ""
  },
  "hasScope": 0
}
```

### `POST` /v1.0/admin/entitlements/search
**Get the list of admin entitlements.**

Query params: `search`, `sort`, `details`, `properties`, `limit`, `page`

### `POST` /v1.0/admin/entitlements/user/:user
**Grant or revoke one or more admin entitlements to a user.**

Path params: `user`

```json
{
  "grant": [
    {
      "entitlement": "",
      "group": ""
    }
  ],
  "revoke": [
    {}
  ]
}
```

### `PATCH` /v1.0/admin/entitlements/:entitlement
**Update an admin entitlement.**

Path params: `entitlement`

```json
{
  "name": "",
  "description": "",
  "hasScope": false,
  "conditionSet": [
    {}
  ]
}
```

### `PATCH` /v1.0/admin/entitlements/:entitlement/:operation
**Publish or discard an admin entitlement.**

Path params: `entitlement`, `operation`

### `DELETE` /v1.0/admin/entitlements/:entitlement
**Delete an admin entitlement.**

Path params: `entitlement`

## Access Management

### `GET` /v1.0/access/entitlements/:entitlement/children
**Find the children of an entitlement either requestable or requested or granted to self.**

Path params: `entitlement`
Query params: `lvl`, `includeRights`, `limit`, `page`

### `GET` /v1.0/access/self/resources/:resourceType
**Get user access assignments statistics.**

Path params: `resourceType`
Query params: `limit`, `page`

### `GET` /v1.0/access/users/:user/entitlements/:entitlement/children
**Find the children of an application entitlement either requestable or requested or granted to a specific user.**

Path params: `user`, `entitlement`
Query params: `lvl`, `includeRights`, `limit`, `page`

### `POST` /v1.0/access/self
**Get user access assignments in active and fulfillment failed state.**

Query params: `details`, `limit`, `page`

```json
{
  "accessInfo": {
    "name": "",
    "description": ""
  },
  "accessType": [],
  "application": [],
  "sort": {
    "attribute": "",
    "asc": false
  },
  "status": [],
  "assignmentSource": []
}
```

### `POST` /v1.0/access/users/:user
**Fetch the access assignments of specific user.**

Path params: `user`
Query params: `details`, `limit`, `page`

```json
{
  "accessInfo": {
    "name": "",
    "description": ""
  },
  "status": [],
  "sort": {
    "attribute": "",
    "asc": false
  }
}
```

## Entitlement Management

### `GET` /v1.0/assignments/:assignment/rights
**Get the rights values associated to an assignment.**

Path params: `assignment`
Query params: `limit`, `page`

### `GET` /v1.0/entitlements/:entitlement
**Get the entitlement details.**

Path params: `entitlement`

### `GET` /v1.0/entitlements/:entitlement/children
**Find the children of an entitlement.**

Path params: `entitlement`
Query params: `lvl`, `includeRights`, `limit`, `page`

### `GET` /v1.0/groups/:group/entitlements
**Get the entitlements granted to a group.**

Path params: `group`
Query params: `sublevels`, `type`, `brt`, `limit`, `page`

### `GET` /v1.0/self/entitlements
**Get the entitlements granted to the logged user.**

Query params: `sublevels`, `type`, `limit`, `page`

### `GET` /v1.0/users/:user/applications
**Get all the applications that are granted to a user.**

Path params: `user`
Query params: `limit`, `page`

### `GET` /v1.0/users/:user/entitlements
**Get the entitlements that are granted to a user.**

Path params: `user`
Query params: `sublevels`, `type`, `entitlement`, `application`, `limit`, `page`

### `GET` /v1.0/users/:user/permissions/:permission/rights
**Get the right values of a permission assigned to a user.**

Path params: `user`, `permission`
Query params: `limit`, `page`

### `POST` /v1.0/entitlements
**Creates a new entitlement.**

```json
{
  "name": "",
  "description": "",
  "type": "",
  "subType": "",
  "application": "",
  "category": "",
  "extRef": "",
  "conditionSet": [
    {}
  ],
  "rightsValues": [
    {
      "entitlement": "",
      "values": []
    }
  ]
}
```

### `POST` /v1.0/entitlements/:entitlement
**Grant or revoke an entitlement to one or more users and groups.**

Path params: `entitlement`

```json
{
  "grant": {
    "users": [
      {
        "user": "",
        "group": "",
        "rights": []
      }
    ],
    "groups": [
      {
        "group": "",
        "brt": false,
        "rights": []
      }
    ]
  },
  "revoke": {
    "users": [
      {
        "user": "",
        "group": ""
      }
    ],
    "groups": [
      {
        "group": "",
        "delete_visibility_violation": false
      }
    ]
  }
}
```

### `POST` /v1.0/entitlements/:entitlement/children
**Add or remove one or more children for an entitlement.**

Path params: `entitlement`

```json
{
  "add": [
    {
      "name": "",
      "description": "",
      "type": "",
      "subType": "",
      "application": "",
      "category": "",
      "extRef": ""
    }
  ],
  "remove": [],
  "rights": [
    {
      "entitlement": "",
      "values": []
    }
  ]
}
```

### `POST` /v1.0/entitlements/assignments/search
**Search the assignments.**

Query params: `user`, `group`, `type`, `includeRights`, `limit`, `page`

```json
{
  "code": "",
  "name": "",
  "description": "",
  "type": "",
  "subType": "",
  "application": "",
  "category": "",
  "extRef": ""
}
```

### `POST` /v1.0/entitlements/group/:group
**Grant or revoke one or more entitlements to a group.**

Path params: `group`

```json
{
  "grant": [
    {
      "entitlement": "",
      "brt": false,
      "rightValues": []
    }
  ],
  "revoke": [
    {
      "entitlement": "",
      "delete_visibility_violation": false
    }
  ]
}
```

### `POST` /v1.0/entitlements/review/search
**Get the list of user added to or removed from dynamic entitlement.**

Query params: `user`, `operationType`, `details`, `limit`, `page`

```json
{
  "code": "",
  "name": "",
  "description": "",
  "type": "",
  "subType": "",
  "application": "",
  "category": "",
  "extRef": ""
}
```

### `POST` /v1.0/entitlements/search
**Search the entitlements.**

Query params: `search`, `sort`, `limit`, `page`

### `POST` /v1.0/entitlements/user/:user
**Grant or revoke one or more entitlements to a user.**

Path params: `user`

```json
{
  "grant": [
    {
      "entitlement": "",
      "group": "",
      "rightValues": []
    }
  ],
  "revoke": [
    {
      "entitlement": "",
      "group": ""
    }
  ]
}
```

### `POST` /v1.0/users/:user/application/:application/check
**Check if a user is granted to an application.**

Path params: `user`, `application`

### `PATCH` /v1.0/assignments/:assignment/rights
**Update the rights values of an assignment.**

Path params: `assignment`

### `PATCH` /v1.0/entitlements/:entitlement
**Update an entitlement.**

Path params: `entitlement`

```json
{
  "name": "",
  "description": "",
  "owner": "",
  "conditionSet": [
    {}
  ]
}
```

### `PATCH` /v1.0/entitlements/:entitlement/:operation
**Publish or discard an entitlement.**

Path params: `entitlement`, `operation`

### `PATCH` /v1.0/entitlements/:entitlement/children/:permission/rights
**Update the rights values of a role.**

Path params: `entitlement`, `permission`

### `DELETE` /v1.0/entitlements/:entitlement
**Delete an entitlement.**

Path params: `entitlement`

## Tenant policy configuration

### `GET` /v1.0/config/firstfactorpolicy
**Retrieve the configuration for first factor policy. This is a list of policy Id, but only one policy is currently supported**

### `PUT` /v1.0/config/firstfactorpolicy
**Set the configuration for first factor policy. This is a list of policy Id, but only one policy is currently supported**
