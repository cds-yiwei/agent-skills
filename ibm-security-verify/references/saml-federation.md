# SAML 2.0 / WS-Federation

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Partner Reseller Identity Providers Management](#partner-reseller-identity-providers-management) (3 endpoints)
- [SAML 2.0 Alias Management](#saml-20-alias-management) (6 endpoints)
- [SAML 2.0 Federations Management](#saml-20-federations-management) (4 endpoints)
- [SAML 2.0 SP Alias Management](#saml-20-sp-alias-management) (7 endpoints)
- [WS Federation Management](#ws-federation-management) (2 endpoints)

## Partner Reseller Identity Providers Management

### `GET` /v1.0/identitysources/subtenants
**Retrieve all the available identity source provider types.**

### `GET` /v1.0/identitysources/subtenants/:subtenantUuid
**Retrieve the specified sub-tenants identity source provider configuration.**

Path params: `subtenantUuid`

### `PUT` /v1.0/identitysources/subtenants/:subtenantUuid
**Set the list of allowed identity provider sources.**

Path params: `subtenantUuid`

```json
{
  "identitySourceTypes": [
    {
      "displayName": "",
      "id": "",
      "providerType": ""
    }
  ]
}
```

## SAML 2.0 Alias Management

### `GET` /v1.0/saml/alias
**Retrieves the list of aliases**

Query params: `search`, `pagination`

### `GET` /v1.0/saml/alias/:aliasUuid
**Retrieves a specific alias**

Path params: `aliasUuid`

### `GET` /v1.0/saml/useralias
**Retrieves the list of aliases belonging to user**

Query params: `search`, `pagination`

### `GET` /v1.0/saml/useralias/:aliasUuid
**Retrieves a specific alias belonging to user**

Path params: `aliasUuid`

### `DELETE` /v1.0/saml/alias/:aliasUuid
**Deletes a specific alias**

Path params: `aliasUuid`

### `DELETE` /v1.0/saml/useralias/:aliasUuid
**Deletes a specific alias belonging to user**

Path params: `aliasUuid`

## SAML 2.0 Federations Management

### `GET` /v1.0/saml/federations
**Get all Federations**

### `GET` /v1.0/saml/federations/:federationName
**Get a Federation**

Path params: `federationName`

### `GET` /v1.0/saml/federations/:federationName/metadata
**Exports a federation metadata**

Path params: `federationName`
Query params: `virtualId`, `keyLabel`

### `PUT` /v1.0/saml/federations/:federationName
**Update a Federation**

Path params: `federationName`

```json
{
  "role": "",
  "messageValidTime": 0,
  "keySelectionCriteria": "",
  "crlEnabled": false,
  "defaultNameIDFormat": "",
  "organizationName": "",
  "organizationDisplayName": "",
  "organizationURL": ""
}
```

## SAML 2.0 SP Alias Management

### `GET` /v1.0/saml/spalias
**Retrieves the list of SP aliases**

Query params: `search`, `pagination`

### `GET` /v1.0/saml/spalias/:aliasUuid
**Retrieves a specific SP alias**

Path params: `aliasUuid`

### `GET` /v1.0/saml/spuseralias
**Retrieves the list of sp aliases belonging to user**

Query params: `search`, `pagination`

### `GET` /v1.0/saml/spuseralias/:aliasUuid
**Retrieves a specific sp alias belonging to user**

Path params: `aliasUuid`

### `POST` /v1.0/saml/spalias
**Creates an alias**

```json
{
  "uuid": "",
  "alias": "",
  "spProvidedId": "",
  "userId": "",
  "tenantUuid": "",
  "partnerUuid": "",
  "idsId": "",
  "idsName": "",
  "nameQualifier": "",
  "spNameQualifier": ""
}
```

### `DELETE` /v1.0/saml/spalias/:aliasUuid
**Deletes a specific SP alias**

Path params: `aliasUuid`

### `DELETE` /v1.0/saml/spuseralias/:aliasUuid
**Deletes a specific sp alias belonging to user**

Path params: `aliasUuid`

## WS Federation Management

### `POST` /v1.0/wsf/federations/:federationName/trace
**Enable WS-Federation audit trace**

Path params: `federationName`

Body: `[{'enabled': False, 'allUsers': False, 'users': [], 'expiry': '', 'providerId': ''}]`

### `POST` /v1.0/wsf/federations/trace
**Enable WS-Federation audit trace for the tenant**

```json
{
  "enabled": false,
  "allUsers": false,
  "users": [],
  "expiry": ""
}
```
