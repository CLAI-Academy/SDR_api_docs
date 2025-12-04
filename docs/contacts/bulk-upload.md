---
sidebar_position: 2
---

# Bulk Upload Contacts

Import hundreds or thousands of contacts in a single API call using CSV or JSON format. Ideal for CRM synchronization and large-scale data imports.

:::warning Importante
**Siempre incluye el header `X-Import-ID`** al crear contactos en bulk. En el flujo normal de importación es **obligatorio** para asociar correctamente los contactos a su cohorte y evitar errores en el tracking.
:::

## HTTP Request

```
POST /contacts/bulk
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | `application/json` or `multipart/form-data` |
| `X-Import-ID` | Yes** | UUID of the import to link contacts to |

*Either `X-API-Key` or `Authorization` is required.
**Required for import workflows. Only omit if creating standalone contacts (not recommended).

## Request Formats

### JSON Array Format

Send an array of contact objects in the request body.

**Content-Type:** `application/json`

```json
[
  {
    "full_name": "Jane Smith",
    "email": "jane@techcorp.com",
    "linkedin_profile": "https://linkedin.com/in/janesmith",
    "company": "Tech Corp"
  },
  {
    "full_name": "Bob Johnson",
    "email": "bob@startup.io",
    "linkedin_profile": "https://linkedin.com/in/bobjohnson",
    "company": "Startup Inc"
  }
]
```

### CSV File Format

Upload a CSV file with contact data.

**Content-Type:** `multipart/form-data`

**CSV Structure:**
```csv
full_name,email,linkedin_profile,company,locale,timezone,metadata
John Doe,john@example.com,https://linkedin.com/in/johndoe,Tech Corp,en-US,America/New_York,"{""source"": ""csv""}"
Jane Smith,jane@example.com,https://linkedin.com/in/janesmith,Another Corp,en-US,America/New_York,"{""source"": ""csv""}"
```

## Response

Returns statistics about the bulk upload operation.

**Status Code:** `201 Created`

```json
{
  "inserted": 150,
  "details": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "jane@techcorp.com",
      "full_name": "Jane Smith"
    },
    ...
  ]
}
```

## Example Requests

### JSON Array Upload

```bash
curl -X POST "https://api.sdragent.com/contacts/bulk" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "X-Import-ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "full_name": "Jane Smith",
      "email": "jane@techcorp.com",
      "linkedin_profile": "https://linkedin.com/in/janesmith",
      "company": "Tech Corp"
    },
    {
      "full_name": "Bob Johnson",
      "email": "bob@startup.io",
      "linkedin_profile": "https://linkedin.com/in/bobjohnson",
      "company": "Startup Inc"
    }
  ]'
```

### CSV File Upload

```bash
curl -X POST "https://api.sdragent.com/contacts/bulk" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "X-Import-ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -F "file=@contacts.csv"
```

## Field Mapping

| CSV Column | JSON Field | Type | Required | Description |
|------------|------------|------|----------|-------------|
| `full_name` | `full_name` | string | Yes | Contact's full name |
| `email` | `email` | string | Yes | Email address (unique) |
| `linkedin_profile` | `linkedin_profile` | string | Yes | LinkedIn profile URL |
| `company` | `company` | string | No | Company name |
| `locale` | `locale` | string | No | Language preference |
| `timezone` | `timezone` | string | No | Timezone |
| `metadata` | `metadata` | object/string | No | JSON object (stringified in CSV) |

## Performance

- **Optimized for scale**: Uses PostgreSQL RPC for batch operations
- **Atomic transactions**: All contacts inserted or none (rollback on error)
- **Automatic linking**: Contacts are linked to import in a single database call
- **Deduplication**: Duplicate emails are handled via upsert logic

## Error Responses

### 400 Bad Request
Invalid file format or malformed JSON.

```json
{
  "detail": "Failed to parse CSV file"
}
```

### 500 Internal Server Error
Bulk operation failed.

```json
{
  "detail": "Bulk RPC failed: database error"
}
```

### 207 Multi-Status
Contacts inserted but linking to import failed.

```json
{
  "inserted": 150,
  "details": [...],
  "warning": "Contacts inserted/updated, but bulk attach to import failed: import not found"
}
```

## Best Practices

- **Use CSV for large imports** (1000+ contacts) for better performance
- **Include import_id** to keep contacts grouped by cohort
- **Validate data** before upload to minimize errors
- **Handle duplicates** by using upsert logic (email as unique key)
- **Monitor response** for warnings and partial successes

## Flujo de Importación Completo

En el flujo estándar de importación manual, **siempre debes seguir estos pasos en orden**:

1. **Crear el import**: `POST /imports/`
   - Response incluye `importId`
   - Status inicial: `processing`
   - Incluye `source` y `file_name`

2. **Insertar contactos en bulk**: `POST /contacts/bulk`
   - **Obligatorio**: Include header `X-Import-ID: {importId}`
   - Sube tus contactos (JSON array o CSV)

3. **Actualizar el import**: `PUT /imports/{importId}`
   - Marca status: `completed`
   - Actualiza `total_rows` con número de contactos insertados

4. **Opcional - Asociar a campaña**:
   - `POST /campaign-imports/{campaignId}/imports` con `import_ids: [importId]`
   - Luego `PUT /imports/{importId}` para guardar `campaign_id`

:::tip Importante
Si no incluyes el `X-Import-ID` en el paso 2, los contactos se crearán sin asociación al import, lo que puede causar problemas de tracking y métricas incorrectas.
:::

## Next Steps

- [Create an import](/docs/imports/create-import)
- [List contacts](/docs/contacts/list-contacts)
