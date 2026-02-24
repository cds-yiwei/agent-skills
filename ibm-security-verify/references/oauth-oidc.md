# OAuth 2.0 / OpenID Connect

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Authentication Token Exchange](#authentication-token-exchange) (1 endpoints)
- [OpenID Connect API v2](#openid-connect-api-v2) (16 endpoints)
- [OpenID Connect Consent Management (deprecated)](#openid-connect-consent-management-deprecated) (deprecated) (6 endpoints)
- [OpenID Connect Dynamic Client Profile](#openid-connect-dynamic-client-profile) (2 endpoints)
- [OpenID Connect Token Types](#openid-connect-token-types) (5 endpoints)
- [OpenID Connect Grant Management](#openid-connect-grant-management) (12 endpoints)
- [OpenID Connect](#openid-connect) (11 endpoints)
- [OpenID Connect Federation](#openid-connect-federation) (2 endpoints)
- [Session Exchange Configuration](#session-exchange-configuration) (2 endpoints)
- [Social JWT Exchange](#social-jwt-exchange) (1 endpoints)
- [Well-Known Uniform Resource Identifiers](#well-known-uniform-resource-identifiers) (4 endpoints)

## Authentication Token Exchange

### `GET` /v1.0/auth/session
**Exchange a valid bearer token for an authenticated browser session**

Query params: `scoped`, `access_token`, `redirect_url`

## OpenID Connect API v2

### `GET` /oauth2/.well-known/openid-configuration
**Get provider's metadata**

### `GET` /oauth2/authorize
**Authorize the user to use OIDC.**

Query params: `client_id`, `response_type`, `response_mode`, `redirect_uri`, `state`, `nonce`, `prompt`, `max_age`, `code_challenge`, `code_challenge_method`, `scope`, `claims`, `login_hint`, `request`, `request_uri`

### `GET` /oauth2/jwks
**Get the provider's personal certificates JSON Web Key Set (JWKS).**

### `GET` /oauth2/public-jwks
**Get the provider's signer certificates JSON Web Key Set (JWKS).**

### `GET` /oauth2/register/:id
**Read a dynamic client.**

Path params: `id`

### `GET` /oauth2/rplogout
**Terminate user session at authorization server.**

Query params: `client_id`, `id_token_hint`, `post_logout_redirect_uri`, `state`

### `GET` /oauth2/userinfo
**Retrieve user information**

### `POST` /oauth2/device_authorization
**Authorize device to use OIDC.**

### `POST` /oauth2/introspect
**Introspect the token**

### `POST` /oauth2/par
**Pushed Authorization Requests (PAR).**

### `POST` /oauth2/register
**Create a dynamic client.**

### `POST` /oauth2/revoke
**Revoke the token.**

### `POST` /oauth2/rplogout
**Terminate user session at authorization server. POST**

### `POST` /oauth2/token
**Get the access token.**

### `PUT` /oauth2/register/:id
**Update a dynamic client.**

Path params: `id`

### `DELETE` /oauth2/register/:id
**Delete a dynamic client.**

Path params: `id`

## OpenID Connect Consent Management (deprecated) ⚠️ DEPRECATED

### `GET` /v1.0/userconsents ⚠️ DEPRECATED
**Deprecated - Retrieves the list of OIDC consents.**

Query params: `pagination`, `sort`, `search`, `base`, `filter`

### `GET` /v1.0/userconsents/:id ⚠️ DEPRECATED
**Deprecated - Retrieves a specific OIDC consent.**

Path params: `id`

### `PATCH` /v1.0/consents ⚠️ DEPRECATED
**Deprecated - Bulk delete OIDC consents.**

### `PATCH` /v1.0/userconsents ⚠️ DEPRECATED
**Deprecated - Bulk delete, or scope and entitlement removal of OIDC consents.**

### `PATCH` /v1.0/userconsents/:id ⚠️ DEPRECATED
**Deprecated - Bulk scope/entitlement removal of OIDC consents.**

Path params: `id`

### `DELETE` /v1.0/userconsents/:id ⚠️ DEPRECATED
**Deprecated - Deletes a specific OIDC consent.**

Path params: `id`

## OpenID Connect Dynamic Client Profile

### `GET` /v1.0/dynamic-client-profile
**Read dynamic client profile.**

### `PUT` /v1.0/dynamic-client-profile
**Update dynamic client profile.**

```json
{
  "grant_types": [],
  "id_token_claims": [],
  "token_claims": [],
  "access_token_type": "",
  "id_token_signed_response_alg": "",
  "consent_action": "",
  "access_token_lifetime": {},
  "refresh_token_lifetime": {},
  "enforce_pkce": false,
  "all_users_entitled": false,
  "allow_custom_client_creds": false,
  "req_allowed_signing_algs": [],
  "request_object_require_exp": false,
  "request_object_max_exp_from_nbf": {},
  "legacy_post_response_code": false
}
```

## OpenID Connect Token Types

### `GET` /v1.0/sts/tokentypes
**Retrieves the list of custom OIDC token types.**

Query params: `pagination`, `sort`, `search`, `filter`

### `GET` /v1.0/sts/tokentypes/:id
**Read a custom OIDC token type**

Path params: `id`

### `POST` /v1.0/sts/tokentypes
**Create a custom OIDC token type**

```json
{
  "id": "",
  "name": "",
  "type": "",
  "description": "",
  "issuer": "",
  "jwksUri": "",
  "identityMapping": {
    "attributeMappings": [
      {
        "name": "",
        "attributeId": "",
        "function": {
          "name": "",
          "custom": "",
          "predefined": ""
        },
        "jitpOption": ""
      }
    ],
    "jitp": false,
    "realm": "",
    "subjectId": "",
    "searchBy": ""
  },
  "validate": {}
}
```

### `PUT` /v1.0/sts/tokentypes/:id
**Update a custom OIDC Token Type**

Path params: `id`

```json
{
  "id": "",
  "name": "",
  "type": "",
  "description": "",
  "issuer": "",
  "jwksUri": "",
  "identityMapping": {
    "attributeMappings": [
      {
        "name": "",
        "attributeId": "",
        "function": {
          "name": "",
          "custom": "",
          "predefined": ""
        },
        "jitpOption": ""
      }
    ],
    "jitp": false,
    "realm": "",
    "subjectId": "",
    "searchBy": ""
  },
  "validate": {}
}
```

### `DELETE` /v1.0/sts/tokentypes/:id
**Delete a custom OIDC token type**

Path params: `id`

## OpenID Connect Grant Management

### `GET` /v1.0/usergrants
**Retrieves the list of OIDC grants.**

Query params: `pagination`, `sort`, `search`, `base`, `filter`

### `GET` /v1.0/usergrants/:gid
**Retrieves a specific OIDC grant.**

Path params: `gid`

### `GET` /v2.0/appgrants/app/:appId
**Retrieves the list of OIDC application grants.**

Path params: `appId`
Query params: `pagination`, `sort`, `search`, `base`, `filter`

### `GET` /v2.0/appgrants/app/:appId/grant/:gid
**Retrieves a specific OIDC application grant.**

Path params: `appId`, `gid`

### `PATCH` /v1.0/usergrants
**Bulk delete, disable, or enable OIDC grants.**

### `PATCH` /v2.0/appgrants/app/:appId
**Bulk delete, disable, or enable OIDC application grants.**

Path params: `appId`

### `DELETE` /v1.0/usergrants/:gid
**Deletes a specific OIDC grant.**

Path params: `gid`

### `DELETE` /v2.0/appgrants/app/:appId/grant/:gid
**Deletes a specific OIDC application grant.**

Path params: `appId`, `gid`

### `GET` /v1.0/appgrants ⚠️ DEPRECATED
**Deprecated - Retrieves the list of OIDC grants.**

Query params: `pagination`, `sort`, `search`, `base`, `filter`

### `GET` /v1.0/appgrants/:gid ⚠️ DEPRECATED
**Deprecated - Retrieves a specific OIDC grant.**

Path params: `gid`

### `PATCH` /v1.0/appgrants ⚠️ DEPRECATED
**Deprecated - Bulk delete, disable, or enable OIDC grants.**

### `DELETE` /v1.0/appgrants/:gid ⚠️ DEPRECATED
**Deprecated - Deletes a specific OIDC grant.**

Path params: `gid`

## OpenID Connect

### `GET` /v1.0/endpoint/:opName/.well-known/openid-configuration
**Get provider's metadata.**

Path params: `opName`

### `GET` /v1.0/endpoint/:opName/authorize
**Authorize the user to use OIDC.**

Path params: `opName`
Query params: `client_id`, `response_type`, `redirect_uri`, `scope`, `response_mode`, `state`, `nonce`, `prompt`, `max_age`, `code_challenge`, `code_challenge_method`, `claims`, `login_hint`

### `GET` /v1.0/endpoint/:opName/client_registration/:id
**Read a dynamic client.**

Path params: `opName`, `id`

### `GET` /v1.0/endpoint/:opName/jwks
**Get the provider's JSON Web Key Set (JWKS).**

Path params: `opName`

### `GET` /v1.0/endpoint/:opName/userinfo
**Retrieve user information**

Path params: `opName`

### `POST` /v1.0/endpoint/:opName/client_registration
**Create a dynamic client.**

Path params: `opName`

```json
{
  "client_name": "",
  "client_id": "",
  "client_secret": "",
  "redirect_uris": [],
  "request_uris": [],
  "response_types": [],
  "grant_types": [],
  "jwks_uri": "",
  "id_token_signed_response_alg": "",
  "userinfo_signed_response_alg": "",
  "userinfo_encrypted_response_alg": "",
  "userinfo_encrypted_response_enc": "",
  "request_object_signing_alg": "",
  "request_object_encryption_alg": "",
  "request_object_encryption_enc": "",
  "token_endpoint_auth_method": "",
  "token_endpoint_auth_signing_alg": "",
  "initiate_login_uri": "",
  "all_users_entitled": false,
  "consent_action": false,
  "enforce_pkce": false,
  "tls_client_certificate_bound_access_tokens": false,
  "tls_client_auth_subject_dn": "",
  "tls_client_auth_san_dns": "",
  "tls_client_auth_san_uri": "",
  "tls_client_auth_san_ip": "",
  "tls_client_auth_san_email": ""
}
```

### `POST` /v1.0/endpoint/:opName/device_authorization
**Authorize device to use OIDC.**

Path params: `opName`

### `POST` /v1.0/endpoint/:opName/introspect
**Introspect the token.**

Path params: `opName`

### `POST` /v1.0/endpoint/:opName/revoke
**Revoke the token.**

Path params: `opName`

### `POST` /v1.0/endpoint/:opName/token
**Get the access token.**

Path params: `opName`

### `DELETE` /v1.0/endpoint/:opName/client_registration/:id
**Delete a dynamic client.**

Path params: `opName`, `id`

## OpenID Connect Federation

### `GET` /v1.0/oidc/federation
**Retrieves the OpenID Connect federation configuration.**

### `PUT` /v1.0/oidc/federation
**Updates the OpenID Connect federation configuration.**

```json
{
  "issuerHostname": "",
  "idTokenLifetime": {},
  "sendExtendedAttributes": false,
  "jwtValidationTimeSkewInSeconds": 0,
  "deviceFlowPollingInterval": {},
  "deviceFlowCodeLifetime": {},
  "extraMetadataAttributes": {},
  "excludeJWKSCertificateChain": false,
  "excludeJWKSCertificateThumbprint": false,
  "mtlsEndpointBaseURI": "",
  "defaultSigningKey": "",
  "defaultEncryptionKey": "",
  "refreshTokenFaultToleranceLifetime": {},
  "refreshTokenFaultToleranceOption": "",
  "tokenExchangeIdTokenToleranceWindow": {},
  "exchangeForSSOSessionOption": ""
}
```

## Session Exchange Configuration

### `GET` /v1.0/config/sessionexchange
**Retrieve the configuration for session exchange.**

### `PUT` /v1.0/config/sessionexchange
**Set the session exchange config.**

```json
{
  "redirectUrls": []
}
```

## Social JWT Exchange

### `POST` /v1.0/socialjwt/exchange
**Exchange a valid social JWT for an IBM Security Verify access token.**

## Well-Known Uniform Resource Identifiers

### `GET` /v1.0/verify/.well-known/history/apple-app-site-association
**Fetch the service's history of the apple-app-site-association file for iOS.**

Query params: `count`, `order`

### `GET` /v1.0/verify/.well-known/history/assetlinks.json
**Fetch the service's history of the assetlinks.json file for Android.**

Query params: `count`, `order`

### `PUT` /v1.0/verify/.well-known/apple-app-site-association
**Update the apple app site association file for iOS verifiable links.**

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": [],
        "components": [
          {
            "/": "",
            "?": {},
            "#": "",
            "exclude": false,
            "comment": "",
            "caseSensitive": false,
            "percentEncoded": false
          }
        ],
        "appID": "",
        "paths": []
      }
    ],
    "defaults": {},
    "substitutionVariables": {}
  },
  "webcredentials": {
    "apps": []
  },
  "appclips": {}
}
```

### `PUT` /v1.0/verify/.well-known/assetlinks.json
**Update digital asset link file for Android verifiable links.**

```json
{
  "items": [
    {
      "relation": [],
      "target": {
        "namespace": "",
        "site": "",
        "package_name": "",
        "sha256_cert_fingerprints": []
      }
    }
  ]
}
```
