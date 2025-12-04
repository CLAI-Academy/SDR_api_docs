---
sidebar_position: 1
---

# Store Integration Credentials

Store credentials for external CRM systems (Salesforce, HubSpot, Pipedrive, etc.) to enable seamless data synchronization.

## HTTP Request

```
POST /integration-credentials/
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | Must be `application/json` |

*Either `X-API-Key` or `Authorization` is required.

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | Yes | CRM provider name (e.g., "salesforce", "hubspot", "pipedrive") |
| `dsn` | string | Yes | Data Source Name or connection string |
| `access_token` | string | Yes | Access token or API key for the CRM |
| `metadata` | object | No | Additional configuration data as JSON object |

## Response

Returns the created credentials object with generated `id`.

**Status Code:** `201 Created`

## Provider Examples

### Salesforce

```bash
curl -X POST "https://api.sdragent.com/integration-credentials/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "salesforce",
    "dsn": "https://mycompany.salesforce.com",
    "access_token": "00D5g000001234567!AQYAQ...",
    "metadata": {
      "instance_url": "https://mycompany.salesforce.com",
      "api_version": "v58.0",
      "refresh_token": "5Aep861...",
      "token_type": "Bearer"
    }
  }'
```

### HubSpot

```bash
curl -X POST "https://api.sdragent.com/integration-credentials/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "hubspot",
    "dsn": "https://api.hubapi.com",
    "access_token": "pat-na1-1234567890abcdef",
    "metadata": {
      "portal_id": "12345678",
      "scopes": ["contacts", "companies", "deals"]
    }
  }'
```

### Pipedrive

```bash
curl -X POST "https://api.sdragent.com/integration-credentials/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "pipedrive",
    "dsn": "https://mycompany.pipedrive.com",
    "access_token": "1a2b3c4d5e6f7g8h9i0j",
    "metadata": {
      "company_domain": "mycompany",
      "api_token": "1a2b3c4d5e6f7g8h9i0j"
    }
  }'
```

## Example Response

```json
{
  "id": "8e1f9722-9637-62fg-d059-g29he3h12cg9",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "provider": "salesforce",
  "dsn": "https://mycompany.salesforce.com",
  "access_token": "00D5g000001234567!AQYAQ...",
  "metadata": {
    "instance_url": "https://mycompany.salesforce.com",
    "api_version": "v58.0",
    "refresh_token": "5Aep861...",
    "token_type": "Bearer"
  },
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T12:00:00Z"
}
```

## Unique Constraint

Each organization can only have **one set of credentials per provider**. The combination of `org_id + provider` must be unique.

If you try to create duplicate credentials, you'll receive a `409 Conflict` error.

## Error Responses

### 409 Conflict
Credentials for this provider already exist.

```json
{
  "detail": "Integration credentials for provider 'salesforce' already exist"
}
```

### 400 Bad Request
Invalid request body or missing required fields.

```json
{
  "detail": "Validation error: provider field is required"
}
```

### 401 Unauthorized
Missing or invalid authentication.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

## Security Best Practices

- **Encrypt tokens**: Access tokens are stored securely in the database
- **Use refresh tokens**: Store refresh tokens in metadata for token renewal
- **Rotate credentials**: Update credentials periodically using the [update endpoint](#update-credentials)
- **Minimal scopes**: Request only necessary API scopes/permissions
- **Monitor access**: Track credential usage via audit logs

## Metadata Field

The `metadata` field is a flexible JSON object for storing provider-specific configuration:

- **API versions**: Store API version numbers
- **Refresh tokens**: Keep refresh tokens for OAuth flows
- **Instance URLs**: Save instance-specific URLs
- **Portal/Org IDs**: Store organization identifiers
- **Custom fields**: Any provider-specific data needed for integration

## Supported Providers

Common provider identifiers:
- `salesforce` - Salesforce CRM
- `hubspot` - HubSpot CRM
- `pipedrive` - Pipedrive CRM
- `zoho` - Zoho CRM
- `dynamics` - Microsoft Dynamics 365
- `custom` - Custom CRM integration

## Next Steps

- [Retrieve credentials by provider](/docs/integration-credentials/retrieve-credentials)
- [Update credentials](#update-credentials)
- [Use credentials for CRM sync](#crm-sync-workflow)

---

## Update Credentials

Update existing integration credentials for a provider.

### HTTP Request

```
PUT /integration-credentials/{credentials_id}
```

### Example Request

```bash
curl -X PUT "https://api.sdragent.com/integration-credentials/8e1f9722-9637-62fg-d059-g29he3h12cg9" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "NEW_ACCESS_TOKEN_HERE",
    "metadata": {
      "refresh_token": "NEW_REFRESH_TOKEN"
    }
  }'
```

### Notes
- Only include fields to update (partial updates supported)
- Provider name cannot be changed (unique constraint)
- Use this endpoint for token rotation and configuration updates
