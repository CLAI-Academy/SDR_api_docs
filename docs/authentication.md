---
sidebar_position: 2
---

# Authentication

The SDR Agent API supports **dual authentication** to accommodate both backend services and frontend applications.

## Authentication Methods

### API Key Authentication
Used for server-to-server integrations and backend services.

**Header:**
```
X-API-Key: your-api-key-here
```

**How it works:**
1. The API key is validated against the `apikeys` table in the database
2. The associated `org_id` is automatically extracted
3. All subsequent operations are scoped to that organization

### JWT Token Authentication
Used for frontend applications (React, Vue, Angular, etc.).

**Header:**
```
Authorization: Bearer your-jwt-token-here
```

**How it works:**
1. The JWT token is decoded and verified
2. The `org_id` is extracted from the token payload
3. All subsequent operations are scoped to that organization

## Organization Isolation

Both authentication methods automatically enforce **organization-level data isolation**:
- You can only access data belonging to your organization
- All database queries are automatically filtered by `org_id`
- Cross-organization data access is prevented at the database level

## Example Requests

### Using API Key

```bash
curl -X GET "https://api.sdragent.com/contacts/" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Using JWT Token

```bash
curl -X GET "https://api.sdragent.com/contacts/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Obtaining Credentials

### API Key
Contact your SDR Agent administrator to generate an API key for your organization.

### JWT Token
JWT tokens are issued by the SDR Agent authentication service when users log in to the frontend application.

## Security Best Practices

- **Never expose API keys** in client-side code
- **Use API keys** for backend/server integrations only
- **Use JWT tokens** for frontend applications
- **Rotate API keys** periodically
- **Store credentials securely** using environment variables or secret managers

## Error Responses

### 401 Unauthorized
Missing or invalid authentication credentials.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

### 403 Forbidden
Valid credentials but insufficient permissions.

```json
{
  "detail": "You do not have permission to access this resource"
}
```

## Next Steps

- [Create a contact](/docs/contacts/create-contact)
- [Bulk upload contacts](/docs/contacts/bulk-upload)
- [Store CRM credentials](/docs/integration-credentials/store-credentials)
