---
name: ibm-security-verify
description: "IBM Security Verify (ISV/IV) API reference and integration guide. IBM's SaaS CIAM product providing OAuth 2.0, OIDC, SAML, SCIM, MFA, and identity governance. Use when: (1) designing or architecting systems that integrate with IBM Security Verify / IBM Verify / ISV / IV, (2) implementing OAuth/OIDC/SAML flows against an ISV tenant, (3) coding REST API calls to ISV endpoints (user management, MFA, applications, access policies, etc.), (4) debugging ISV integration issues, (5) reviewing or designing ISV-related product features. Trigger on mentions of: 'IBM Security Verify', 'IBM Verify', 'ISV', 'IV tenant', 'verify.ibm.com', or any ISV API endpoint pattern like /v1.0/apiclients, /oauth2/token, /v2.0/Users, etc."
---

# IBM Security Verify (ISV) API Reference

## Key Concepts

- **Tenant URL**: `https://{tenant-id}.verify.ibm.com` — all API calls use this as base URL
- **Authentication**: API calls require a bearer token obtained via API client credentials (`POST /v1.0/endpoint/default/token`)
- **API Clients**: ISV's equivalent of OAuth clients — created via admin console or API, each with `clientId`, `clientSecret`, and scoped entitlements
- **Versioned APIs**: Endpoints are versioned (v1.0, v2.0, v3.0, v5.0). Use latest non-deprecated version

## Authentication Flow Quick Reference

### Get an API access token (client_credentials)
```
POST https://{tenant}.verify.ibm.com/v1.0/endpoint/default/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={id}&client_secret={secret}&scope={scopes}
```

### OIDC Authorization Code Flow
```
GET /oauth2/authorize?client_id={id}&response_type=code&redirect_uri={uri}&scope=openid&state={state}
POST /oauth2/token  (exchange code for tokens)
GET /oauth2/userinfo (get user claims)
```

### OIDC Discovery
```
GET /.well-known/openid-configuration
GET /oauth2/.well-known/openid-configuration
GET /oauth2/jwks        (personal certs JWKS)
GET /oauth2/public-jwks (signer certs JWKS)
```

## API Domains & Reference Files

Load the relevant reference file based on the integration domain. Each file contains endpoint paths, methods, parameters, and request body schemas.

| Domain | File | Endpoints | Key Use Cases |
|--------|------|-----------|---------------|
| OAuth/OIDC | [oauth-oidc.md](references/oauth-oidc.md) | 62 | Token exchange, authorize, JWKS, consent, dynamic clients, grant management |
| SAML/WS-Fed | [saml-federation.md](references/saml-federation.md) | 22 | SAML federation, SP aliases, WS-Fed management |
| MFA | [mfa-authentication.md](references/mfa-authentication.md) | 168 | Email/SMS/Voice OTP, TOTP, FIDO, push, QR login, signature auth, reCAPTCHA |
| Passwords | [password-management.md](references/password-management.md) | 34 | Password policies, dictionaries, password vault |
| Users & Groups | [user-group-management.md](references/user-group-management.md) | 77 | SCIM v2 users/groups, self-care, identity sources, attributes |
| Applications | [application-management.md](references/application-management.md) | 55 | API clients, application access (SSO apps), certificates |
| Access Policies | [access-policy-entitlements.md](references/access-policy-entitlements.md) | 89 | Access policies (v5.0), entitlements, access requests, workflows |
| Certifications | [certification-campaigns.md](references/certification-campaigns.md) | 48 | Certification campaigns (v2.0), assignments, statistics |
| Privacy/Consent | [privacy-consent.md](references/privacy-consent.md) | 45 | DPCM purposes, consents, data subjects, privacy assessments |
| Platform Config | [platform-config.md](references/platform-config.md) | 79 | Themes, webhooks, adapters, device config, provisioning, reports, logs |

**Total: 679 endpoints across 93 API groups**

## Important Caveats

- **Endpoints may be outdated**: Reference data was extracted from a Bruno collection export. Always verify against the [official ISV API docs](https://docs.verify.ibm.com/verify/reference)
- **Deprecated APIs**: Files flag deprecated endpoints with ⚠️. Prefer v5.0 access policies over v3.0, v2.0 certification campaigns over v1.0
- **Body schemas are templates**: JSON bodies show field structure with empty values — they represent the shape, not valid payloads
- **Entitlements ≠ OAuth scopes**: API clients need entitlements assigned in admin UI (e.g. `readUsers`, `manageUsers`, `manageAuthenticators`, `manageApplications`). Just creating the client is not enough
- **SCIM filtering**: Uses SCIM 2.0 filter syntax (`emails.value eq "user@example.com"`). Not all attributes support all operators. Use `POST /v2.0/Users/.search` for complex filters
- **Pagination**: List endpoints use `count`/`startIndex` (SCIM-style) or `limit`/`offset`. Max page size typically 100–500
- **Async provisioning**: Account provisioning/reconciliation returns an operation ID. Poll status until `completed`/`failed`
- **Error format**: Standard OAuth errors plus IBM message IDs useful for support:
  ```json
  {"error": "invalid_grant", "error_description": "CSIAQ0062E ...", "messageId": "CSIAQ0062E"}
  ```
- **Rate limiting**: Enforce exponential backoff on `429` responses. Limits are tenant-specific and not publicly documented
- **FIDO2 requires RP config**: Must create FIDO2 Relying Party configuration before using WebAuthn APIs. Each RP's `rpId` must match the domain

## Common Integration Patterns

### SCIM User Management
ISV implements SCIM v2 at `/v2.0/Users` and `/v2.0/Groups`. Supports bulk operations via `POST /v2.0/Bulk`. See [user-group-management.md](references/user-group-management.md).

### Custom SSO Applications
Register OIDC/SAML apps via the Application Access APIs. See [application-management.md](references/application-management.md) — specifically the `Application Access` section.

### Adaptive Access (Risk-Based Auth)
Create risk-based authentication rules via Access Policy v5.0 endpoints. When policy evaluates high risk, ISV returns `mfa_required` with a transaction ID — client then initiates MFA verification flow. See [access-policy-entitlements.md](references/access-policy-entitlements.md).

### MFA Enrollment & Verification
ISV supports email OTP, SMS OTP, voice OTP, TOTP, FIDO2/WebAuthn, push notifications, and QR code login. Each factor has enrollment + verification endpoints. Transient (no-enrollment) OTP also available. See [mfa-authentication.md](references/mfa-authentication.md).

## Official Documentation Links

| Resource | URL |
|----------|-----|
| API Documentation Hub | https://docs.verify.ibm.com/verify/page/api-documentation |
| Interactive API Reference | https://docs.verify.ibm.com/verify/reference |
| Getting Started Guide | https://docs.verify.ibm.com/verify/docs/getting-started |
| Create API Client | https://docs.verify.ibm.com/verify/docs/support-developers-create-api-client |
| Acquire Access Token | https://docs.verify.ibm.com/verify/docs/acquire-an-access-token-client-credentials |
