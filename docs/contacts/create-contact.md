---
sidebar_position: 1
---

# Create Contact

Create a single contact in the SDR Agent platform. Contacts are automatically associated with your organization and can be linked to an import cohort.

:::warning Importante
**Siempre incluye el header `X-Import-ID`** al crear contactos. Aunque técnicamente sea opcional, en el flujo normal de importación es **obligatorio** para asociar correctamente los contactos a su cohorte y evitar errores en el tracking.
:::

## HTTP Request

```
POST /contacts/
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | Must be `application/json` |
| `X-Import-ID` | Yes** | UUID of the import to link this contact to |

*Either `X-API-Key` or `Authorization` is required.
**Required for import workflows. Only omit if creating standalone contacts (not recommended).

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | string | Yes | Full name of the contact |
| `email` | string | Yes | Email address (must be unique) |
| `linkedin_profile` | string | Yes | LinkedIn profile URL (automatically normalized) |
| `company` | string | No | Company name (auto-creates company if not exists) |
| `locale` | string | No | Language/locale preference (e.g., `en-US`, `es-ES`) |
| `timezone` | string | No | Timezone (e.g., `America/New_York`, `Europe/Madrid`) |
| `metadata` | object | No | Additional enrichment data as JSON object |

## Response

Returns the created contact object with generated `id` and timestamps.

**Status Code:** `201 Created`

## Example Request

```bash
curl -X POST "https://api.sdragent.com/contacts/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "X-Import-ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "linkedin_profile": "https://linkedin.com/in/johndoe",
    "company": "Tech Corp",
    "locale": "en-US",
    "timezone": "America/New_York",
    "metadata": {
      "source": "website",
      "campaign": "Q1-2024"
    }
  }'
```

## Example Response

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

## Flujo de Importación Completo

En el flujo estándar de importación manual, **siempre debes incluir el `X-Import-ID`** siguiendo estos pasos:

1. **Crear el import**: `POST /imports/` (status: `processing`)
2. **Insertar contactos**: `POST /contacts/` con header `X-Import-ID`
3. **Actualizar import**: `PUT /imports/{importId}` (status: `completed`, total_rows)
4. **Opcional - Asociar campaña**: `POST /campaign-imports/{campaignId}/imports`

### Ejemplo con Import ID

```bash
curl -X POST "https://api.sdragent.com/contacts/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "X-Import-ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "email": "jane.smith@example.com",
    "linkedin_profile": "https://linkedin.com/in/janesmith"
  }'
```

## Error Responses

### 400 Bad Request
Invalid request body or missing required fields.

```json
{
  "detail": "Validation error: email field is required"
}
```

### 409 Conflict
Contact with the same email already exists.

```json
{
  "detail": "Contact with email 'john.doe@example.com' already exists"
}
```

### 401 Unauthorized
Missing or invalid authentication.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

## Notes

- **Automatic company creation**: If the `company` field is provided and doesn't exist, it will be automatically created
- **LinkedIn normalization**: LinkedIn URLs are automatically normalized to standard format
- **Email uniqueness**: Email addresses must be unique within your organization
- **Import linking**: Contacts can be linked to imports for batch enrichment and campaign management

## Next Steps

- [Bulk upload contacts](/docs/contacts/bulk-upload)
- [List contacts](/docs/contacts/list-contacts)
- [Create an import](/docs/imports/create-import)
