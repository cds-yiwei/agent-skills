# Certification Campaigns

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Certification Campaign assignments v1.0 - Deprecated](#certification-campaign-assignments-v10---deprecated) (deprecated) (8 endpoints)
- [Certification Campaign assignments v2.0](#certification-campaign-assignments-v20) (5 endpoints)
- [Certification Campaign configurations v1.0 - Deprecated](#certification-campaign-configurations-v10---deprecated) (deprecated) (8 endpoints)
- [Certification Campaign configurations v2.0](#certification-campaign-configurations-v20) (6 endpoints)
- [Certification Campaign instances v1.0 - Deprecated](#certification-campaign-instances-v10---deprecated) (deprecated) (7 endpoints)
- [Certification Campaign statistics v1.0 - Deprecated](#certification-campaign-statistics-v10---deprecated) (deprecated) (4 endpoints)
- [Certification Campaign instances v2.0](#certification-campaign-instances-v20) (6 endpoints)
- [Certification Campaign statistics v2.0](#certification-campaign-statistics-v20) (4 endpoints)

## Certification Campaign assignments v1.0 - Deprecated ⚠️ DEPRECATED

### `GET` /v1.0/admin/instances/:id/assignments ⚠️ DEPRECATED
**Deprecated - Retrieve all assignments in a given campaign instance**

Path params: `id`
Query params: `assigneesId`, `actions`, `reviewersId`, `appsId`, `assignmentType`, `assignmentName`, `assignmentStatus`, `groupsId`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/self/assignments/:id ⚠️ DEPRECATED
**Deprecated - Retrieve a specific assignment.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

### `GET` /v1.0/self/instances/:id/assignments ⚠️ DEPRECATED
**Deprecated - Retrieve all assignments, in a given campaign instance.**

Path params: `id`
Query params: `assigneesId`, `reviewersId`, `actions`, `appsId`, `assignmentType`, `assignmentName`, `assignmentStatus`, `groupsId`, `asSupervisor`, `assignmentSource`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `POST` /v1.0/admin/campaign/:id/assignments ⚠️ DEPRECATED
**Deprecated - Add new assignments to a continuous campaign.**

Path params: `id`

Body: `[{'id': '', 'applicationId': ''}]`

### `POST` /v1.0/admin/instance/:id/assignments ⚠️ DEPRECATED
**Deprecated - Add new assignments to a continuous campaign instance.**

Path params: `id`

Body: `[{'id': '', 'applicationId': ''}]`

### `POST` /v1.0/admin/instance/:id/assignments/refresh ⚠️ DEPRECATED
**Deprecated - Refresh assignments in a continuous campaign.**

Path params: `id`

### `PUT` /v1.0/self/assignments/:id ⚠️ DEPRECATED
**Deprecated - Modify a given assignment.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

```json
{
  "id": "",
  "applicationId": "",
  "reviewer": {
    "id": "",
    "name": "",
    "email": "",
    "formatted": "",
    "givenName": "",
    "familyName": "",
    "realm": "",
    "userType": "",
    "description": ""
  },
  "operation": "",
  "justification": "",
  "doImmediateFulfillment": false
}
```

### `PATCH` /v1.0/self/instance/:id/assignments ⚠️ DEPRECATED
**Deprecated - Modify a given set of assignments.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

```json
{
  "id": "",
  "applicationId": "",
  "reviewer": {
    "id": "",
    "name": "",
    "email": "",
    "formatted": "",
    "givenName": "",
    "familyName": "",
    "realm": "",
    "userType": "",
    "description": ""
  },
  "operation": "",
  "justification": "",
  "doImmediateFulfillment": false
}
```

## Certification Campaign assignments v2.0

### `GET` /v2.0/assignments/:id
**Retrieves the details of the assignment from the specific tenant.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

### `GET` /v2.0/instances/:id/assignments
**Retrieves the list of all assignments associated with the specified campaign instance from the specific tenant.**

Path params: `id`
Query params: `assigneesId`, `actions`, `reviewersId`, `appsId`, `assignmentType`, `assignmentName`, `assignmentStatus`, `groupsId`, `asSupervisor`, `assignmentSource`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `POST` /v2.0/instances/:id/assignments
**Retrieves the list of a assignments associated with the specified campaign instance from the specific tenant.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`, `sort`, `sortDesc`, `limit`, `page`

```json
{
  "lastActions": [],
  "assigneesId": [],
  "reviewersId": [],
  "appsId": [],
  "assignmentTypes": [],
  "assignmentNames": [],
  "assignmentStatus": [],
  "groupsId": [],
  "filter": ""
}
```

### `PUT` /v2.0/assignments/:id
**Updates a specified assignment from the specific tenant.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

Body: `[{'reviewer': {'id': '', 'name': '', 'email': '', 'formatted': '', 'givenName': '', 'familyName': '', 'realm': '', 'userType': '', 'description': ''}, 'operation': '', 'justification': '', 'doImmediateFulfillment': False}]`

### `PATCH` /v2.0/instance/:id/assignments
**Updates the list of assignments on a specified campaign instance that belong to a specified tenant.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

Body: `[{'id': '', 'reviewer': {'id': '', 'name': '', 'email': '', 'formatted': '', 'givenName': '', 'familyName': '', 'realm': '', 'userType': '', 'description': ''}, 'operation': '', 'justification': '', 'doImmediateFulfillment': False}]`

## Certification Campaign configurations v1.0 - Deprecated ⚠️ DEPRECATED

### `PUT` /v1.0/clean/staleinstances
**Update the certification manager schema.**

Query params: `singleTenant`, `dryRunMode`

```json
{
  "userName": "",
  "password": ""
}
```

### `GET` /v1.0/admin/campaigns ⚠️ DEPRECATED
**Deprecated - Retrieve the campaign configurations.**

Query params: `type`, `priority`, `preview`, `continuous`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/admin/campaigns/:id ⚠️ DEPRECATED
**Deprecated - Retrieve a specific campaign configuration.**

Path params: `id`

### `POST` /v1.0/admin/campaigns ⚠️ DEPRECATED
**Deprecated - Create a campaign configuration.**

```json
{
  "owner": {
    "id": "",
    "name": "",
    "email": "",
    "formatted": "",
    "givenName": "",
    "familyName": "",
    "realm": "",
    "userType": "",
    "description": ""
  },
  "type": "",
  "priority": "",
  "name": "",
  "description": "",
  "reviewer": {},
  "applications": [
    {
      "id": "",
      "name": "",
      "icon": "",
      "url": "",
      "description": ""
    }
  ],
  "allowlist": [
    {
      "id": "",
      "name": "",
      "email": "",
      "formatted": "",
      "givenName": "",
      "familyName": "",
      "realm": "",
      "userType": "",
      "description": "",
      "aGroup": false,
      "accountStatus": "",
      "accountOwnershipType": ""
    }
  ],
  "blocklist": [
    {}
  ],
  "entitlementFilter": {
    "entitlementInclusionList": [
      {
        "entitlementId": ""
      }
    ],
    "entitlementExclusionList": [
      {}
    ]
  },
  "launchDate": "",
  "creationDate": "",
  "duration": 0,
  "frequency": "",
  "runEvery": {
    "rate": 0,
    "unit": "",
    "cronString": ""
  },
  "runNow": false,
  "nextRunDate": "",
  "overdueAction": "",
  "mitigationAction": {
    "type": "",
    "reminderInterval": 0
  },
  "defaultReviewer": {},
  "preview": false,
  "continuous": false,
  "automaticRefreshContinuousCampaign": false,
  "signOff": "",
  "supervisors": [
    {}
  ],
  "allowSupervisorEscalation": false,
  "id": "",
  "rev": "",
  "reviewerOverwritten": false,
  "whitelist": [
    {}
  ],
  "blacklist": [
    {}
  ]
}
```

### `PUT` /v1.0/admin/campaigns/:id ⚠️ DEPRECATED
**Deprecated - Edit specific campaign configuration.**

Path params: `id`

```json
{
  "owner": {
    "id": "",
    "name": "",
    "email": "",
    "formatted": "",
    "givenName": "",
    "familyName": "",
    "realm": "",
    "userType": "",
    "description": ""
  },
  "type": "",
  "priority": "",
  "name": "",
  "description": "",
  "reviewer": {},
  "applications": [
    {
      "id": "",
      "name": "",
      "icon": "",
      "url": "",
      "description": ""
    }
  ],
  "allowlist": [
    {
      "id": "",
      "name": "",
      "email": "",
      "formatted": "",
      "givenName": "",
      "familyName": "",
      "realm": "",
      "userType": "",
      "description": "",
      "aGroup": false,
      "accountStatus": "",
      "accountOwnershipType": ""
    }
  ],
  "blocklist": [
    {}
  ],
  "entitlementFilter": {
    "entitlementInclusionList": [
      {
        "entitlementId": ""
      }
    ],
    "entitlementExclusionList": [
      {}
    ]
  },
  "launchDate": "",
  "creationDate": "",
  "duration": 0,
  "frequency": "",
  "runEvery": {
    "rate": 0,
    "unit": "",
    "cronString": ""
  },
  "runNow": false,
  "nextRunDate": "",
  "overdueAction": "",
  "mitigationAction": {
    "type": "",
    "reminderInterval": 0
  },
  "defaultReviewer": {},
  "preview": false,
  "continuous": false,
  "automaticRefreshContinuousCampaign": false,
  "signOff": "",
  "supervisors": [
    {}
  ],
  "allowSupervisorEscalation": false,
  "id": "",
  "rev": "",
  "reviewerOverwritten": false,
  "whitelist": [
    {}
  ],
  "blacklist": [
    {}
  ]
}
```

### `PUT` /v1.0/update/schema ⚠️ DEPRECATED
**Deprecated - Update the certification manager schema.**

Query params: `singleTenant`, `dryRunMode`

```json
{
  "userName": "",
  "password": ""
}
```

### `PATCH` /v1.0/admin/campaigns ⚠️ DEPRECATED
**Deprecated - Edit campaign configurations.**

Body: `[{'op': '', 'path': '', 'value': {'owner': {'id': '', 'name': '', 'email': '', 'formatted': '', 'givenName': '', 'familyName': '', 'realm': '', 'userType': '', 'description': ''}, 'type': '', 'priority': '', 'name': '', 'description': '', 'reviewer': {}, 'applications': [{'id': '', 'name': '', 'icon': '', 'url': '', 'description': ''}], 'userFilter': {'userInclusionList': [{'id': '', 'name': '', 'email': '', 'formatted': '', 'givenName': '', 'familyName': '', 'realm': '', 'userType': '', 'description': '', 'aGroup': False, 'accountStatus': '', 'accountOwnershipType': ''}], 'userExclusionList': [{}], 'userConditionSet': [{}]}, 'entitlementFilter': {'entitlementInclusionList': [{'entitlementId': ''}], 'entitlementExclusionList': [{}]}, 'launchDate': '', 'creationDate': '', 'duration': 0, 'frequency': {'cronString': ''}, 'runNow': False, 'nextRunDate': '', 'overdueAction': '', 'mitigationAction': {'type': '', 'reminderInterval': 0}, 'defaultReviewer': {}, 'preview': False, 'signOff': '', 'supervisors': [{}], 'allowSupervisorEscalation': False, 'reviewerType': '', 'reviewerOverwritten': False}}]`

### `DELETE` /v1.0/admin/campaigns/:id ⚠️ DEPRECATED
**Deprecated - Delete specific campaign configuration.**

Path params: `id`

## Certification Campaign configurations v2.0

### `GET` /v2.0/campaigns
**Retrieves a list of campaign configurations from the specific tenant.**

Query params: `type`, `types`, `priority`, `preview`, `draft`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v2.0/campaigns/:id
**Retrieves the details of the campaign configuration from the specific tenant.**

Path params: `id`

### `GET` /v2.0/reviewer/types/:campaigntype
**Retrieves the details of the Reviewer Types available for the specific Campaign Type.**

Path params: `campaigntype`

### `POST` /v2.0/campaigns
**Creates a campaign configuration for the specific tenant.**

```json
{
  "owner": {
    "id": "",
    "name": "",
    "email": "",
    "formatted": "",
    "givenName": "",
    "familyName": "",
    "realm": "",
    "userType": "",
    "description": ""
  },
  "type": "",
  "priority": "",
  "name": "",
  "description": "",
  "reviewer": {},
  "applications": [
    {
      "id": "",
      "name": "",
      "icon": "",
      "url": "",
      "description": ""
    }
  ],
  "userFilter": {
    "userInclusionList": [
      {
        "id": "",
        "name": "",
        "email": "",
        "formatted": "",
        "givenName": "",
        "familyName": "",
        "realm": "",
        "userType": "",
        "description": "",
        "aGroup": false,
        "accountStatus": "",
        "accountOwnershipType": ""
      }
    ],
    "userExclusionList": [
      {}
    ],
    "userConditionSet": [
      {}
    ]
  },
  "entitlementFilter": {
    "entitlementInclusionList": [
      {
        "entitlementId": ""
      }
    ],
    "entitlementExclusionList": [
      {}
    ]
  },
  "launchDate": "",
  "creationDate": "",
  "duration": 0,
  "frequency": {
    "cronString": ""
  },
  "runNow": false,
  "nextRunDate": "",
  "overdueAction": "",
  "mitigationAction": {
    "type": "",
    "reminderInterval": 0
  },
  "defaultReviewer": {},
  "preview": false,
  "signOff": "",
  "supervisors": [
    {}
  ],
  "allowSupervisorEscalation": false,
  "reviewerType": "",
  "reviewerOverwritten": false
}
```

### `PUT` /v2.0/campaigns/:id
**Updates the campaign configuration for a specified campaign configuration from the specific tenant.**

Path params: `id`

```json
{
  "owner": {
    "id": "",
    "name": "",
    "email": "",
    "formatted": "",
    "givenName": "",
    "familyName": "",
    "realm": "",
    "userType": "",
    "description": ""
  },
  "type": "",
  "priority": "",
  "name": "",
  "description": "",
  "reviewer": {},
  "applications": [
    {
      "id": "",
      "name": "",
      "icon": "",
      "url": "",
      "description": ""
    }
  ],
  "userFilter": {
    "userInclusionList": [
      {
        "id": "",
        "name": "",
        "email": "",
        "formatted": "",
        "givenName": "",
        "familyName": "",
        "realm": "",
        "userType": "",
        "description": "",
        "aGroup": false,
        "accountStatus": "",
        "accountOwnershipType": ""
      }
    ],
    "userExclusionList": [
      {}
    ],
    "userConditionSet": [
      {}
    ]
  },
  "entitlementFilter": {
    "entitlementInclusionList": [
      {
        "entitlementId": ""
      }
    ],
    "entitlementExclusionList": [
      {}
    ]
  },
  "launchDate": "",
  "creationDate": "",
  "duration": 0,
  "frequency": {
    "cronString": ""
  },
  "runNow": false,
  "nextRunDate": "",
  "overdueAction": "",
  "mitigationAction": {
    "type": "",
    "reminderInterval": 0
  },
  "defaultReviewer": {},
  "preview": false,
  "signOff": "",
  "supervisors": [
    {}
  ],
  "allowSupervisorEscalation": false,
  "reviewerType": "",
  "reviewerOverwritten": false
}
```

### `PATCH` /v2.0/campaigns
**Perform operations on a list of campaign configurations that belong to a specified tenant.**

Body: `[{'op': '', 'path': '', 'value': {'owner': {'id': '', 'name': '', 'email': '', 'formatted': '', 'givenName': '', 'familyName': '', 'realm': '', 'userType': '', 'description': ''}, 'type': '', 'priority': '', 'name': '', 'description': '', 'reviewer': {}, 'applications': [{'id': '', 'name': '', 'icon': '', 'url': '', 'description': ''}], 'userFilter': {'userInclusionList': [{'id': '', 'name': '', 'email': '', 'formatted': '', 'givenName': '', 'familyName': '', 'realm': '', 'userType': '', 'description': '', 'aGroup': False, 'accountStatus': '', 'accountOwnershipType': ''}], 'userExclusionList': [{}], 'userConditionSet': [{}]}, 'entitlementFilter': {'entitlementInclusionList': [{'entitlementId': ''}], 'entitlementExclusionList': [{}]}, 'launchDate': '', 'creationDate': '', 'duration': 0, 'frequency': {'cronString': ''}, 'runNow': False, 'nextRunDate': '', 'overdueAction': '', 'mitigationAction': {'type': '', 'reminderInterval': 0}, 'defaultReviewer': {}, 'preview': False, 'signOff': '', 'supervisors': [{}], 'allowSupervisorEscalation': False, 'reviewerType': '', 'reviewerOverwritten': False}}]`

## Certification Campaign instances v1.0 - Deprecated ⚠️ DEPRECATED

### `GET` /v1.0/admin/instances/:id ⚠️ DEPRECATED
**Deprecated - Retrieve a specific campaign instance.**

Path params: `id`

### `GET` /v1.0/self/campaigns/:id/instances ⚠️ DEPRECATED
**Deprecated - Retrieve instances corresponding to a specific campaign configuration.**

Path params: `id`
Query params: `state`, `asSupervisor`, `assignmentSource`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/self/instances ⚠️ DEPRECATED
**Deprecated - Retrieve campaign instances.**

Query params: `type`, `state`, `priority`, `preview`, `continuous`, `ownersId`, `appsId`, `overallState`, `asSupervisor`, `assignmentSource`, `skipStatistics`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/self/instances/:id ⚠️ DEPRECATED
**Deprecated - Retrieve specific campaign instance.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

### `POST` /v1.0/admin/instances/:id/preview ⚠️ DEPRECATED
**Deprecated - Create a preview campaign.**

Path params: `id`

### `PUT` /v1.0/admin/instances/:id ⚠️ DEPRECATED
**Deprecated - Modify specific campaign instance.**

Path params: `id`

```json
{
  "id": "",
  "eventType": ""
}
```

### `PATCH` /v1.0/admin/instances ⚠️ DEPRECATED
**Deprecated - Modify campaign instances.**

Body: `[{'id': '', 'eventType': ''}]`

## Certification Campaign statistics v1.0 - Deprecated ⚠️ DEPRECATED

### `GET` /v1.0/admin/campaigns/stats ⚠️ DEPRECATED
**Deprecated - Retrieve campaign statistics.**

Query params: `filterType`

### `GET` /v1.0/self/assignments/stats ⚠️ DEPRECATED
**Deprecated - Retrieve statistics of specific assignments.**

Query params: `instanceId`, `filterType`, `asSupervisor`, `assignmentSource`

### `GET` /v1.0/self/instances/:instanceId/assignments/resources ⚠️ DEPRECATED
**Deprecated - Retrieve statistics of specific assignments within a given instance.**

Path params: `instanceId`
Query params: `resourceType`, `reviewerId`, `actions`, `asSupervisor`, `assignmentSource`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v1.0/self/instances/stats ⚠️ DEPRECATED
**Deprecated - Retrieve statistics of specific campaign instances.**

Query params: `filterType`, `state`, `overallState`, `asSupervisor`, `assignmentSource`, `filter`

## Certification Campaign instances v2.0

### `GET` /v2.0/campaigns/:id/instances
**Retrieves the list of a campaign instances associated with the specified campaign configuration from the specific tenant.**

Path params: `id`
Query params: `state`, `asSupervisor`, `assignmentSource`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v2.0/instances
**Retrieves the list of a campaign instances from the specific tenant.**

Query params: `type`, `types`, `state`, `priority`, `preview`, `continuous`, `reviewersId`, `supervisorsId`, `ownersId`, `appsId`, `overallState`, `asSupervisor`, `assignmentSource`, `skipStatistics`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v2.0/instances/:id
**Retrieves the details of the campaign instance from the specific tenant.**

Path params: `id`
Query params: `asSupervisor`, `assignmentSource`

### `POST` /v2.0/instances/:id/preview
**Creates a preview campaign configuration for the specified tenant.**

Path params: `id`

### `PUT` /v2.0/instances/:id
**Perform an operation on a specified campaign instance that belong to a specified tenant.**

Path params: `id`

```json
{
  "eventType": ""
}
```

### `PATCH` /v2.0/instances
**Perform operations on a collection of campaign instances that belong to a specific tenant.**

Body: `[{'id': '', 'eventType': ''}]`

## Certification Campaign statistics v2.0

### `GET` /v2.0/assignments/stats
**Retrieves the assignment statistics of the campaign instance from the specific tenant.**

Query params: `instanceId`, `filterType`, `asSupervisor`, `assignmentSource`

### `GET` /v2.0/campaigns/stats
**Retrieves the campaign configuration statistics from the specific tenant.**

Query params: `filterType`, `types`

### `GET` /v2.0/instances/:instanceId/assignments/resources
**Retrieves statistics of specific assignments within a given instance from the specific tenant.**

Path params: `instanceId`
Query params: `resourceType`, `reviewerId`, `actions`, `asSupervisor`, `assignmentSource`, `filter`, `sort`, `sortDesc`, `limit`, `page`

### `GET` /v2.0/instances/stats
**Retrieves the campaign instance statistics from the specific tenant.**

Query params: `filterType`, `types`, `state`, `overallState`, `asSupervisor`, `assignmentSource`, `filter`
