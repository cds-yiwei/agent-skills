# Password Management

> ⚠️ Endpoints and parameters sourced from a Bruno collection export and may not be fully up-to-date.
> Always verify against the latest IBM Security Verify documentation.

## Contents

- [Dictionary Policy Management 3.0](#dictionary-policy-management-30) (7 endpoints)
- [Password Dictionary Management 3.0](#password-dictionary-management-30) (9 endpoints)
- [Password Vault](#password-vault) (6 endpoints)
- [Password Policy Management 3.0](#password-policy-management-30) (8 endpoints)
- [Password Policy Management 2.0](#password-policy-management-20) (2 endpoints)
- [Password Vault Configuration](#password-vault-configuration) (2 endpoints)

## Dictionary Policy Management 3.0

### `GET` /v3.0/DictionaryPolicy
**Fetches the password dictionary policy in Cloud Directory.**

### `GET` /v3.0/DictionaryPolicy/multi
**Fetches a list of password dictionary policies in Cloud Directory.**

### `GET` /v3.0/DictionaryPolicy/multi/:id
**Fetches the specified password dictionary policy in Cloud Directory.**

Path params: `id`

### `POST` /v3.0/DictionaryPolicy/multi
**Create a password dictionary policy on the given tenant**

### `PATCH` /v3.0/DictionaryPolicy
**Modifies the password dictionary policy in Cloud Directory.**

### `PATCH` /v3.0/DictionaryPolicy/multi/:id
**Modifies the specified password dictionary policy in Cloud Directory.**

Path params: `id`

### `DELETE` /v3.0/DictionaryPolicy/multi/:id
**Deletes a password dictionary policy from a specified tenant in Cloud Directory.  Can only delete a password dictionary policy that is not predefined.**

Path params: `id`

## Password Dictionary Management 3.0

### `GET` /v3.0/PasswordDictionary/CSV/export
**Export the password dictionary from the specified tenant as a comma separated value (CSV) file.**

Query params: `format`

### `GET` /v3.0/PasswordDictionary/CSV/headerNames
**Get the list of supported header names.**

### `GET` /v3.0/PasswordDictionary/CSV/jobs
**Retrieves a list of CSV import requests that belong to the specified tenant.**

Query params: `filter`

### `GET` /v3.0/PasswordDictionary/CSV/jobs/:id
**Retrieves the details of a CSV import request that belong to the specified tenant.**

Path params: `id`

### `POST` /v3.0/PasswordDictionary/CSV/import
**Import password dictionary for the specified tenant from a comma separated value (CSV) file.**

Query params: `format`

### `PUT` /v3.0/PasswordDictionary/CSV/jobs/:id
**Cancels a CSV import request for the specified tenant.**

Path params: `id`

### `PATCH` /v3.0/PasswordDictionary
**Add or remove passwords from the tenant password dictionary in Cloud Directory.**

### `DELETE` /v3.0/PasswordDictionary
**Deletes all passwords from a specified tenant dictionary.**

### `DELETE` /v3.0/PasswordDictionary/CSV/jobs/:id
**Deletes a CSV import request from the specified tenant.**

Path params: `id`

## Password Vault

### `GET` /v1.0/pwdvault/:userId
**Retrieve a password vault enrollment.**

Path params: `userId`

### `GET` /v1.0/pwdvault/:userId/resources/:resourceName
**Retrieve a password vault resource.**

Path params: `userId`, `resourceName`

### `PUT` /v1.0/pwdvault/:userId
**Update a password vault enrollment.**

Path params: `userId`

```json
{
  "resources": [
    {
      "name": "",
      "resource": {
        "username": "",
        "password": "",
        "created": "",
        "updated": ""
      }
    }
  ]
}
```

### `PUT` /v1.0/pwdvault/:userId/resources/:resourceName
**Update a password vault resource.**

Path params: `userId`, `resourceName`

```json
{
  "username": "",
  "password": "",
  "created": "",
  "updated": ""
}
```

### `DELETE` /v1.0/pwdvault/:userId
**Delete a password vault enrollment.**

Path params: `userId`

### `DELETE` /v1.0/pwdvault/:userId/resources/:resourceName
**Delete a password vault resource.**

Path params: `userId`, `resourceName`

## Password Policy Management 3.0

### `GET` /v3.0/PasswordPolicies
**Get all password policies for a specified tenant.**

### `GET` /v3.0/PasswordPolicies/:id
**Get a password policy with a given id for a specified tenant.**

Path params: `id`

### `GET` /v3.0/PasswordPolicies/:id/labels
**This API is used to get the password policy labels for a specified password policy on a given tenant using the specified locale.**

Path params: `id`

### `GET` /v3.0/PasswordPolicies/:id/password
**Generate a password that satisfies the passwordStrength attributes in the given password policy.**

Path params: `id`
Query params: `pwdintel`

### `POST` /v3.0/PasswordPolicies
**Create a password policy on the given tenant**

### `POST` /v3.0/PasswordPolicies/:id/validate
**Validate a password against a specific policy ID on a specific tenant.**

Path params: `id`
Query params: `usedictauth`, `pwdintel`

### `PATCH` /v3.0/PasswordPolicies/:id
**Modify a password policy's attributes in Cloud Directory.  It can be used to update one or more attributes.**

Path params: `id`

### `DELETE` /v3.0/PasswordPolicies/:id
**Deletes a password policy from a specified tenant in Cloud Directory.  Can only delete a password policy that is not predefined.**

Path params: `id`

## Password Policy Management 2.0

### `GET` /v2.0/PasswordPolicies
**Get the password policy for a specified tenant.**

### `PUT` /v2.0/PasswordPolicies
**Update the password policy for a specified tenant.**

## Password Vault Configuration

### `GET` /config/v1.0/pwdvault
**Retrieve the password vault configuration.**

### `PUT` /config/v1.0/pwdvault
**Update the password vault configuration.**

```json
{
  "enabled": false,
  "publicKey": {
    "id": "",
    "key": ""
  },
  "resources": []
}
```
