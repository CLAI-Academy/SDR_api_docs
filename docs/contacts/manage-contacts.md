---
sidebar_position: 4
---

# Manage Contacts

Get, update, and delete individual contacts by ID.

## Get Contact by ID

Retrieve a specific contact by its unique identifier.

### HTTP Request

```
GET /contacts/{contact_id}
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |

*Either `X-API-Key` or `Authorization` is required.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `contact_id` | UUID | Unique identifier of the contact |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "linkedin_profile": "https://www.linkedin.com/in/johndoe",
  "company": "Tech Corp",
  "locale": "en-US",
  "timezone": "America/New_York",
  "enrichment": {
    "source": "website",
    "campaign": "Q1-2024"
  },
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T12:00:00Z"
}
```

### Error Responses

#### 404 Not Found
Contact does not exist or does not belong to your organization.

```json
{
  "detail": "Contact not found"
}
```

---

## Update Contact

Update specific fields of an existing contact. Only provided fields will be updated.

### HTTP Request

```
PUT /contacts/{contact_id}
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | Must be `application/json` |

*Either `X-API-Key` or `Authorization` is required.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `contact_id` | UUID | Unique identifier of the contact |

### Request Body

Partial contact object with fields to update. All fields are optional.

```json
{
  "locale": "es-ES",
  "timezone": "Europe/Madrid",
  "metadata": {
    "updated_source": "crm_sync"
  }
}
```

### Example Request

```bash
curl -X PUT "https://api.sdragent.com/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "locale": "es-ES",
    "timezone": "Europe/Madrid"
  }'
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "linkedin_profile": "https://www.linkedin.com/in/johndoe",
  "company": "Tech Corp",
  "locale": "es-ES",
  "timezone": "Europe/Madrid",
  "enrichment": {
    "source": "website",
    "campaign": "Q1-2024",
    "updated_source": "crm_sync"
  },
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T14:30:00Z"
}
```

### Updatable Fields

- `full_name` - Contact's full name
- `email` - Email address (must remain unique)
- `company` - Company name
- `locale` - Language preference
- `timezone` - Timezone
- `linkedin_profile` - LinkedIn URL
- `metadata` - Enrichment data (merged with existing data)

### Notes

- **Partial updates**: Only include fields you want to change
- **Automatic normalization**: Email, LinkedIn URLs are automatically sanitized
- **Metadata merging**: New metadata is merged with existing enrichment data

---

## Delete Contact

Permanently delete a contact from your organization.

### HTTP Request

```
DELETE /contacts/{contact_id}
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |

*Either `X-API-Key` or `Authorization` is required.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `contact_id` | UUID | Unique identifier of the contact |

### Example Request

```bash
curl -X DELETE "https://api.sdragent.com/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "message": "Contacto 550e8400-e29b-41d4-a716-446655440000 eliminado"
}
```

### Error Responses

#### 404 Not Found
Contact does not exist or does not belong to your organization.

```json
{
  "detail": "Contact not found"
}
```

### Notes

- **Hard delete**: Contact is permanently removed from the database
- **Cascade behavior**: Related records may be affected (check campaign_leads)
- **Irreversible**: Cannot undo deletion

---

## Common Error Responses

### 401 Unauthorized
Missing or invalid authentication.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

### 403 Forbidden
Contact belongs to a different organization.

```json
{
  "detail": "You do not have permission to access this resource"
}
```

## Next Steps

- [Create a contact](/docs/contacts/create-contact)
- [Bulk upload contacts](/docs/contacts/bulk-upload)
- [List all contacts](/docs/contacts/list-contacts)
