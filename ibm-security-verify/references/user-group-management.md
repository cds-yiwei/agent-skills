# User & Group Management

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Account expiration configuration](#account-expiration-configuration) (2 endpoints)
- [Attributes](#attributes) (10 endpoints)
- [Groups Management Version 2.0](#groups-management-version-20) (8 endpoints)
- [Identity Source Types](#identity-source-types) (3 endpoints)
- [Identity Sources V1 - Deprecated](#identity-sources-v1---deprecated) (deprecated) (7 endpoints)
- [Identity Provider Attribute Mappings](#identity-provider-attribute-mappings) (2 endpoints)
- [Identity Sources V2](#identity-sources-v2) (7 endpoints)
- [User Self Care API](#user-self-care-api) (12 endpoints)
- [Users Management Version 2.0](#users-management-version-20) (26 endpoints)

## Account expiration configuration

### `GET` /v1.0/config/accountexpiration
**Retrieve the global configuration for attribute mapping that can be overridden in individual identity providers.**

### `PUT` /v1.0/config/accountexpiration
**Set the account expiration config.**

## Attributes

### `GET` /v1.0/attributefunctions
**Retrieves the list of attribute functions that are configured for the specified tenant**

### `GET` /v1.0/attributes
**Lists all attributes**

Query params: `search`, `sort`, `pagination`

### `GET` /v1.0/attributes/:attrId
**Gets an attribute**

Path params: `attrId`

### `GET` /v1.0/attributes/tags
**Gets the list of existing attribute tags**

### `POST` /v1.0/attributes
**Creates an attribute**

### `PUT` /v1.0/attributes/:attrId
**Modifies an attribute**

Path params: `attrId`

### `PUT` /v1.0/attributes/:attrId/revert
**Reverts a global attribute to the default configuration**

Path params: `attrId`

### `PATCH` /v1.0/attributes
**Bulk management operations of attributes**

### `PATCH` /v1.0/attributes/:attrId
**Modifies selected properties of an attribute**

Path params: `attrId`

### `DELETE` /v1.0/attributes/:attrId
**Deletes an attribute**

Path params: `attrId`

## Groups Management Version 2.0

### `GET` /v2.0/Groups
**Retrieves a list of groups that belong to the specified tenant and match the search criteria.**

Query params: `filter`, `attributes`, `count`, `startIndex`, `sortBy`, `sortOrder`, `fullText`

### `GET` /v2.0/Groups/:id
**Retrieves the details of a group for a specified tenant.**

Path params: `id`
Query params: `attributes`, `membershipType`, `memberAttributes`, `memberCount`, `memberStartIndex`, `nextPage`

### `GET` /v2.0/Groups/cardinality
**Retrieves the total number of groups under a tenant in the Cloud Directory.**

### `POST` /v2.0/CSV/importGroups
**Import groups for the specified tenant from a comma separated value (CSV) file.**

Query params: `themeId`, `notifyType`, `failOnError`, `ignoreOnError`, `multiValueDelimiter`

### `POST` /v2.0/Groups
**Creates a group for a specified tenant.**

Query params: `themeId`

### `PUT` /v2.0/Groups/:id
**Updates the group's attributes for a specified tenant.**

Path params: `id`
Query params: `themeId`

### `PATCH` /v2.0/Groups/:id
**This API is used to modify a group's attributes. It can be used to update one or more attributes.**

Path params: `id`
Query params: `themeId`

### `DELETE` /v2.0/Groups/:id
**Delete a group from a specified tenant.**

Path params: `id`
Query params: `notifyType`, `themeId`

## Identity Source Types

### `GET` /v1.0/identitysourcetypes
**Retrieve the details of all the identity source types.**

Query params: `minimal`, `excludemetadata`

### `GET` /v1.0/identitysourcetypes/:sourceTypeId
**Retrieve the details of a particular identity source types.**

Path params: `sourceTypeId`
Query params: `excludemetadata`

### `GET` /v1.0/identitysourcetypes/:sourceTypeId/metadata
**Retrieve the metadata of a particular SAML Enterprise.**

Path params: `sourceTypeId`

## Identity Sources V1 - Deprecated ⚠️ DEPRECATED

### `GET` /v1.0/identitysources ⚠️ DEPRECATED
**Deprecated - Retrieve all the identity source instances of the tenant.**

Query params: `filter`, `search`, `pagination`, `sort`

### `GET` /v1.0/identitysources/:instanceId ⚠️ DEPRECATED
**Deprecated - Retrieve the details of a particular identity source instance of the tenant with the specified instance ID.**

Path params: `instanceId`

### `GET` /v1.0/identitysources/passwordPolicies ⚠️ DEPRECATED
**Deprecated - Retrieve all the identity source instances of the tenant that use the passord policy ID's specified in the 'search' query parameter.**

Query params: `search`

### `GET` /v1.0/identitysources/property/:propertyName/:propertyValue ⚠️ DEPRECATED
**Deprecated - Retrieve all the identity source instances of the tenant that have this property name and value.**

Path params: `propertyName`, `propertyValue`

### `POST` /v1.0/identitysources ⚠️ DEPRECATED
**Deprecated - API to create an identity source instance for a tenant.**

```json
{
  "sourceTypeId": 0,
  "instanceName": "",
  "enabled": false,
  "status": "",
  "predefined": false,
  "properties": [
    {
      "sensitive": false,
      "key": "",
      "value": ""
    }
  ],
  "attributeMappings": [
    {
      "attrId": "",
      "jitpOption": "",
      "idsAttrName": "",
      "postEval": {
        "id": "",
        "custom": ""
      }
    }
  ]
}
```

### `PUT` /v1.0/identitysources/:instanceId ⚠️ DEPRECATED
**Deprecated - Update an identity source instance of the tenant with the specified instance ID.**

Path params: `instanceId`

```json
{
  "sourceTypeId": 0,
  "instanceName": "",
  "enabled": false,
  "status": "",
  "predefined": false,
  "properties": [
    {
      "sensitive": false,
      "key": "",
      "value": ""
    }
  ],
  "attributeMappings": [
    {
      "attrId": "",
      "jitpOption": "",
      "idsAttrName": "",
      "postEval": {
        "id": "",
        "custom": ""
      }
    }
  ]
}
```

### `DELETE` /v1.0/identitysources/:instanceId ⚠️ DEPRECATED
**Deprecated - Delete an identity source instance of the tenant with the specified instance ID.**

Path params: `instanceId`

## Identity Provider Attribute Mappings

### `GET` /v1.0/config/identitysources/attributemappings
**Retrieve the global configuration for attribute mapping that can be overridden in individual identity providers.**

### `PUT` /v1.0/config/identitysources/attributemappings
**Set the global attribute mappings for identity sources.**

## Identity Sources V2

### `GET` /v2.0/identitysources
**V2 Retrieve all the identity source instances of the tenant.**

Query params: `filter`, `search`, `pagination`, `sort`

### `GET` /v2.0/identitysources/:instanceId
**V2 Retrieve the details of a particular identity source instance of the tenant with the specified instance ID.**

Path params: `instanceId`

### `GET` /v2.0/identitysources/passwordPolicies
**V2 Retrieve all the identity source instances of the tenant that use the passord policy ID's specified in the 'search' query parameter.**

Query params: `search`

### `GET` /v2.0/identitysources/property/:propertyName/:propertyValue
**V2 Retrieve all the identity source instances of the tenant that have this property name and value.**

Path params: `propertyName`, `propertyValue`

### `POST` /v2.0/identitysources
**V2 API to create an identity source instance for a tenant.**

```json
{
  "sourceTypeId": 0,
  "instanceName": "",
  "enabled": false,
  "status": "",
  "predefined": false,
  "properties": [
    {
      "sensitive": false,
      "key": "",
      "value": ""
    }
  ],
  "attributeMappings": [
    {
      "attrId": "",
      "jitpOption": "",
      "idsAttrName": "",
      "postEval": {
        "id": "",
        "custom": ""
      }
    }
  ]
}
```

### `PUT` /v2.0/identitysources/:instanceId
**V2 Update an identity source instance of the tenant with the specified instance ID.**

Path params: `instanceId`

```json
{
  "sourceTypeId": 0,
  "instanceName": "",
  "enabled": false,
  "status": "",
  "predefined": false,
  "properties": [
    {
      "sensitive": false,
      "key": "",
      "value": ""
    }
  ],
  "attributeMappings": [
    {
      "attrId": "",
      "jitpOption": "",
      "idsAttrName": "",
      "postEval": {
        "id": "",
        "custom": ""
      }
    }
  ]
}
```

### `DELETE` /v2.0/identitysources/:instanceId
**V2 Delete an identity source instance of the tenant with the specified instance ID.**

Path params: `instanceId`

## User Self Care API

### `GET` /v1.0/usc/user/invitation
**List all invitations.**

Query params: `search`, `sort`, `pagination`

### `GET` /v1.0/usc/user/invitation/:trxId
**Retrieve an invitation.**

Path params: `trxId`

### `POST` /v1.0/usc/password/resetter
**Initiate a reset password request by using an authentication mechanism.**

Query params: `themeId`

```json
{
  "userName": "",
  "steps": [
    {
      "method": "",
      "data": {
        "correlation": "",
        "baseVerificationUrl": "",
        "targetUrl": "",
        "enrollmentId": "",
        "transientValue": ""
      }
    }
  ],
  "stateId": ""
}
```

### `POST` /v1.0/usc/password/resetter/:trxId/validator
**Validates the authentication attempt that is associated with the current step in the reset password flow.**

Path params: `trxId`
Query params: `themeId`

```json
{
  "otp": ""
}
```

### `POST` /v1.0/usc/user/invitation
**Send users an invitation.**

Query params: `themeId`

```json
{
  "invitations": [
    {
      "email": "",
      "name": "",
      "stateId": ""
    }
  ],
  "realm": "",
  "expirationInDays": 0,
  "groups": [],
  "steps": [
    {
      "method": "",
      "data": {
        "correlation": "",
        "baseVerificationUrl": "",
        "targetUrl": "",
        "enrollmentId": "",
        "transientValue": ""
      }
    }
  ],
  "adopterId": ""
}
```

### `POST` /v1.0/usc/user/invitation/:trxId/validator
**Validate a user invitation.**

Path params: `trxId`

```json
{
  "otp": ""
}
```

### `POST` /v1.0/usc/username/recovery
**Initiate a forgot username request by using an authentication mechanism.**

Query params: `themeId`

```json
{
  "attributes": [
    {
      "name": "",
      "value": ""
    }
  ],
  "steps": [
    {
      "method": "",
      "data": {
        "correlation": "",
        "baseVerificationUrl": "",
        "targetUrl": "",
        "enrollmentId": "",
        "transientValue": ""
      }
    }
  ],
  "stateId": ""
}
```

### `POST` /v1.0/usc/username/recovery/:trxId/validator
**Validates the authentication attempt that is associated with the current step in the username recovery flow.**

Path params: `trxId`
Query params: `themeId`

```json
{
  "otp": ""
}
```

### `PUT` /v1.0/usc/password/resetter/:trxId
**Reset the user's forgotten password.**

Path params: `trxId`
Query params: `themeId`

```json
{
  "otp": "",
  "password": ""
}
```

### `PUT` /v1.0/usc/user/invitation/:trxId
**Complete a user invitation.**

Path params: `trxId`
Query params: `themeId`

```json
{
  "otp": "",
  "notifyComplete": false,
  "user": ""
}
```

### `PUT` /v1.0/usc/username/recovery/:trxId
**Recover the user's forgotten user name.**

Path params: `trxId`
Query params: `themeId`

```json
{
  "otp": ""
}
```

### `DELETE` /v1.0/usc/user/invitation/:trxId
**Cancel an invitation.**

Path params: `trxId`

## Users Management Version 2.0

### `GET` /v2.0/CSV/headerNames
**Get the list of supported header names.**

Query params: `filter`

### `GET` /v2.0/CSV/jobs
**Retrieves a list of CSV import requests that belong to the specified tenant.**

Query params: `filter`, `jobType`

### `GET` /v2.0/CSV/jobs/:id
**Retrieves the details of a CSV import request that belong to the specified tenant.**

Path params: `id`

### `GET` /v2.0/Me
**Retrieves the account details of the authenticated user in Cloud Directory.**

### `GET` /v2.0/Me/effectivePasswordPolicy
**Retrieves the authenticated user's effective password policy.**

### `GET` /v2.0/Me/labels
**Retrieves the authenticated user's translated labels for their effective password policy.**

### `GET` /v2.0/Me/reportees
**Retrieves a list of a manager's reportees that belong to a specified tenant and match the search filter criteria.**

Query params: `filter`, `attributes`, `count`, `startIndex`, `sortBy`, `sortOrder`, `useBookmark`, `nextPage`

### `GET` /v2.0/SCIM/capabilities
**Retrieves the SCIM capabilities enabled for the tenant.**

### `GET` /v2.0/Users
**Retrieves a list of users that belong to a specified tenant and match the search filter criteria.**

Query params: `filter`, `attributes`, `count`, `startIndex`, `sortBy`, `sortOrder`, `hashed`, `fullText`, `includeGroups`

### `GET` /v2.0/Users/:id
**Retrieves the details of a user in Cloud Directory for a tenant.**

Path params: `id`
Query params: `attributes`, `memberAttributes`, `memberCount`, `memberStartIndex`

### `GET` /v2.0/Users/cardinality
**Retrieves the total number of users under a tenant in the Cloud Directory.**

Query params: `attributes`

### `POST` /v2.0/Bulk
**The bulk request that clients use to send a potentially large collection of resource operations in a single request.  For a PUT, PATCH, or POST, the data in the operation is the resource data as for a single SCIM request.**

Query params: `notifyType`, `themeId`

### `POST` /v2.0/CSV/deleteUsers
**Delete users for the specified tenant from a (CSV) file.**

Query params: `themeId`, `ignoreOnError`, `notifyType`

### `POST` /v2.0/CSV/importUsers
**Import users for the specified tenant from a comma separated value (CSV) file.**

Query params: `themeId`, `notifyType`, `failOnError`, `ignoreOnError`, `multiValueDelimiter`

### `POST` /v2.0/Me/password
**Change the authenticated user's password.**

Query params: `themeId`

### `POST` /v2.0/Users
**Creates a user in Cloud Directory.**

Query params: `hashed`, `themeId`

### `POST` /v2.0/Users/:id/compare
**Compare a clear text value to a custom hashed attribute value for a user.**

Path params: `id`

### `POST` /v2.0/Users/authentication
**Authenticate a user name and password.**

Query params: `method`, `returnUserRecord`, `themeId`

### `PUT` /v2.0/CSV/jobs/:id
**Cancels a CSV import request for the specified tenant.**

Path params: `id`

### `PUT` /v2.0/Me
**Replaces the authenticated user's attributes in Cloud Directory.**

Query params: `hashed`, `themeId`

### `PUT` /v2.0/Users/:id
**Replaces the user's attributes in Cloud Directory.**

Path params: `id`
Query params: `hashed`, `themeId`

### `PATCH` /v2.0/Users/:id
**Modify a user's attributes in Cloud Directory.  It can be used to update one or more attributes.**

Path params: `id`
Query params: `themeId`

### `PATCH` /v2.0/Users/:id/passwordResetter
**Reset a user's password.**

Path params: `id`
Query params: `themeId`

### `DELETE` /v2.0/CSV/jobs/:id
**Deletes a CSV import request from the specified tenant.**

Path params: `id`

### `DELETE` /v2.0/Me
**Delete the authenticated user's Cloud Directory account.**

Query params: `notifyType`, `themeId`

### `DELETE` /v2.0/Users/:id
**Deletes a user from a specified tenant in Cloud Directory.**

Path params: `id`
Query params: `notifyType`, `themeId`
