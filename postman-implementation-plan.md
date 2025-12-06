# Plan de Implementación: Colección Postman SDR Agent API

## 📋 Objetivo

Crear una colección de Postman completa e importable que permita:
- Probar todos los endpoints organizados por casos de uso
- Ejecutar flujos completos de manera secuencial
- Utilizar variables de entorno para conectar requests
- Incluir pre-request scripts y tests automáticos

---

## 🏗️ Estructura de la Colección

La colección está organizada por **casos de uso completos** con sus flujos API secuenciales.

```
SDR Agent API
│
├── 📁 0. Setup & Authentication
│   └── Get API Key (Info/Documentation)
│
├── 📁 1. UC1: Crear Import con Contactos
│   ├── 1.1 Create Import
│   ├── 1.2 List Imports
│   ├── 1.3 Get Import by ID
│   ├── 1.4 Bulk Upload Contacts (JSON)
│   ├── 1.5 Bulk Upload Contacts (CSV)
│   ├── 1.6 Update Import (mark completed)
│   └── 1.7 List Contacts (verify)
│
├── 📁 2. UC2: Crear Campaña y Asociar Import
│   ├── 2.1 Create Campaign (basic)
│   ├── 2.2 Create Campaign (with Lead Magnet)
│   ├── 2.3 List Campaigns
│   ├── 2.4 Get Campaign by ID
│   ├── 2.5 Link Import to Campaign
│   ├── 2.6 List Campaign Leads
│   └── 2.7 Get Lead by ID
│
├── 📁 3. UC3: Gestión de Contactos Individuales
│   ├── 3.1 Create Single Contact
│   ├── 3.2 Get Contact by ID
│   ├── 3.3 Update Contact
│   ├── 3.4 Delete Contact
│   └── 3.5 List All Contacts
│
├── 📁 4. UC4: Sincronización CRM
│   ├── 4.1 Create Import (source: salesforce)
│   ├── 4.2 Bulk Upload from CRM
│   ├── 4.3 Update Import (completed)
│   ├── 4.4 Create Single Contact (incremental sync)
│   └── 4.5 Update Contact (CRM changes)
│
└── 📁 5. Cleanup & Deletion
    ├── 5.1 Delete Contact
    ├── 5.2 Delete Campaign
    └── 5.3 Delete Import
```

---

## 🌍 Variables de Entorno

### Environment: **SDR Agent - Development**

| Variable | Initial Value | Current Value | Description |
|----------|--------------|---------------|-------------|
| `baseUrl` | `https://api.sdragent.com` | - | Base URL de la API |
| `apiKey` | `sk_live_1234567890abcdef` | - | API Key para autenticación |
| `orgId` | `123e4567-e89b-12d3-a456-426614174000` | - | Organization ID (auto-inyectado) |
| `importId` | - | - | ID del último import creado |
| `contactId` | - | - | ID del último contacto creado |
| `campaignId` | - | - | ID de la última campaña creada |
| `leadId` | - | - | ID del último lead creado |
| `importId2` | - | - | Segundo import para pruebas |
| `leadMagnetId` | - | - | ID del lead magnet creado |

### Environment: **SDR Agent - Production**

| Variable | Initial Value | Description |
|----------|--------------|-------------|
| `baseUrl` | `https://your-api-domain.com` | Base URL producción |
| `apiKey` | `{{YOUR_PROD_API_KEY}}` | API Key de producción |

---

## 📝 Especificación Detallada de Casos de Uso

### 0. Folder: **Setup & Authentication**

#### 0.1 Get API Key (Documentation)
- **Tipo:** Request de información
- **Method:** `GET` (placeholder)
- **Descripción:**
```markdown
# Cómo obtener tu API Key

1. Accede al dashboard de SDR Agent
2. Ve a Settings > API Keys
3. Genera una nueva API Key
4. Copia el valor y configúralo en el environment de Postman

Variables necesarias:
- baseUrl: https://api.sdragent.com
- apiKey: sk_live_...
```

---

## 1. UC1: Crear Import con Contactos

**Flujo completo:** Crear un import, subir contactos en bulk y verificar la importación.

### 1.1 Create Import
- **Method:** `POST`
- **URL:** `{{baseUrl}}/imports/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "source": "postman_test",
  "file_name": "test_contacts_q4_2024.csv",
  "status": "processing",
  "total_rows": 0,
  "mapping_json": {
    "FirstName": "full_name",
    "Email": "email",
    "Company": "company"
  }
}
```
- **Tests:**
```javascript
// Guardar importId para usar en siguientes requests
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("importId", response.id);
    console.log("✅ Import ID saved:", response.id);
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has import ID", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.status).to.eql('processing');
});
```

### 1.2 List Imports
- **Method:** `GET`
- **URL:** `{{baseUrl}}/imports/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns array of imports", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');

    // Verificar que existe nuestro import recién creado
    const importId = pm.environment.get("importId");
    const found = jsonData.find(imp => imp.id === importId);
    pm.expect(found).to.not.be.undefined;
});
```

### 1.3 Get Import by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/imports/{{importId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns correct import", function () {
    const jsonData = pm.response.json();
    const importId = pm.environment.get("importId");
    pm.expect(jsonData.id).to.eql(importId);
});
```

### 1.4 Bulk Upload Contacts (JSON)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/contacts/bulk`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `X-Import-ID: {{importId}}`
  - `Content-Type: application/json`
- **Body:**
```json
[
  {
    "full_name": "Jane Smith",
    "email": "jane.smith@techcorp.com",
    "linkedin_profile": "https://linkedin.com/in/janesmith",
    "company": "Tech Corp",
    "locale": "en-US",
    "timezone": "America/New_York"
  },
  {
    "full_name": "Bob Johnson",
    "email": "bob.johnson@startup.io",
    "linkedin_profile": "https://linkedin.com/in/bobjohnson",
    "company": "Startup Inc",
    "locale": "en-US",
    "timezone": "America/Los_Angeles"
  },
  {
    "full_name": "Alice Brown",
    "email": "alice.brown@example.com",
    "linkedin_profile": "https://linkedin.com/in/alicebrown",
    "company": "Example Corp",
    "locale": "en-US",
    "timezone": "America/Chicago"
  }
]
```
- **Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Contacts inserted successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.inserted).to.be.above(0);
    console.log(`✅ ${jsonData.inserted} contacts inserted`);

    // Guardar el total para actualizar el import
    pm.environment.set("totalContactsInserted", jsonData.inserted);

    // Guardar primer contactId si hay details
    if (jsonData.details && jsonData.details.length > 0) {
        pm.environment.set("contactId", jsonData.details[0].id);
    }
});
```

### 1.5 Bulk Upload Contacts (CSV)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/contacts/bulk`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `X-Import-ID: {{importId}}`
- **Body (form-data):**
  - Key: `file`
  - Value: [Select File] `contacts.csv`
- **CSV File Example Content:**
```csv
full_name,email,linkedin_profile,company,locale,timezone
Charlie Davis,charlie.davis@fintech.com,https://linkedin.com/in/charliedavis,FinTech Solutions,en-US,America/New_York
Diana Martinez,diana.martinez@saas.io,https://linkedin.com/in/dianamartinez,SaaS Company,en-US,America/Los_Angeles
```
- **Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("CSV contacts uploaded", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.inserted).to.be.above(0);

    // Sumar al total de contactos
    const previousTotal = pm.environment.get("totalContactsInserted") || 0;
    const newTotal = parseInt(previousTotal) + jsonData.inserted;
    pm.environment.set("totalContactsInserted", newTotal);
    console.log(`✅ Total contacts imported: ${newTotal}`);
});
```

### 1.6 Update Import (mark completed)
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/imports/{{importId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Pre-request Script:**
```javascript
// Obtener el total de contactos insertados
const totalContacts = pm.environment.get("totalContactsInserted") || 0;
console.log(`Marking import as completed with ${totalContacts} contacts`);
```
- **Body:**
```json
{
  "status": "completed",
  "total_rows": {{totalContactsInserted}}
}
```
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Import marked as completed", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql('completed');
    console.log("✅ Import completed successfully");
});
```

### 1.7 List Contacts (verify)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/contacts/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Contacts were imported", function () {
    const jsonData = pm.response.json();
    const expectedTotal = pm.environment.get("totalContactsInserted");
    pm.expect(jsonData.length).to.be.at.least(parseInt(expectedTotal));
    console.log(`✅ Verified: ${jsonData.length} total contacts in database`);
});
```

---

## 2. UC2: Crear Campaña y Asociar Import

**Flujo completo:** Crear una campaña y vincular el import previamente creado para generar leads.

**Pre-requisito:** Ejecutar UC1 primero para tener un `importId` con contactos.

### 2.1 Create Campaign (basic)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/campaigns/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Postman Test Campaign - Basic",
  "description": "Campaign created via Postman for testing basic flow",
  "status": "draft",
  "availability_data": {
    "start_working": "09:00",
    "end_working": "17:00",
    "weekend_work": false,
    "calendar_id": "primary"
  },
  "publish_posts": true
}
```
- **Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("campaignId", response.id);
    console.log("✅ Campaign ID saved:", response.id);
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Campaign created with correct data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.status).to.eql('draft');
    pm.expect(jsonData.availability_data).to.not.be.undefined;
});
```

### 2.2 Create Campaign (with Lead Magnet)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/campaigns/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Postman Test Campaign - With Lead Magnet",
  "description": "Testing inline lead magnet creation",
  "status": "draft",
  "availability_data": {
    "start_working": "09:00",
    "end_working": "18:00",
    "weekend_work": false,
    "calendar_id": "primary"
  },
  "lead_magnet": {
    "name": "2024 Industry Benchmark Report",
    "description": "Complete benchmark report for Q4 2024",
    "url": "https://cdn.example.com/benchmarks-2024.pdf",
    "content_type": "pdf"
  },
  "publish_posts": true
}
```
- **Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("campaignId", response.id);

    if (response.lead_magnet_id) {
        pm.environment.set("leadMagnetId", response.lead_magnet_id);
        console.log("✅ Lead Magnet ID saved:", response.lead_magnet_id);
    }
    console.log("✅ Campaign ID saved:", response.id);
}

pm.test("Campaign created with lead magnet", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.lead_magnet_id).to.not.be.null;
});
```

### 2.3 List Campaigns
- **Method:** `GET`
- **URL:** `{{baseUrl}}/campaigns/?status=draft`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns campaigns list", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');

    // Verificar que existe nuestra campaña
    const campaignId = pm.environment.get("campaignId");
    const found = jsonData.find(camp => camp.id === campaignId);
    pm.expect(found).to.not.be.undefined;
});
```

### 2.4 Get Campaign by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/campaigns/{{campaignId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns correct campaign", function () {
    const jsonData = pm.response.json();
    const campaignId = pm.environment.get("campaignId");
    pm.expect(jsonData.id).to.eql(campaignId);
});
```

### 2.5 Link Import to Campaign
- **Method:** `POST`
- **URL:** `{{baseUrl}}/campaign-imports/{{campaignId}}/imports`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Pre-request Script:**
```javascript
const importId = pm.environment.get("importId");
const campaignId = pm.environment.get("campaignId");

if (!importId || !campaignId) {
    throw new Error("importId or campaignId not set. Run UC1 and UC2.1 first.");
}

console.log(`Linking import ${importId} to campaign ${campaignId}`);
```
- **Body:**
```json
{
  "import_ids": [
    "{{importId}}"
  ]
}
```
- **Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Leads created successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.inserted_leads).to.be.above(0);
    pm.expect(jsonData.linked_imports).to.eql(1);

    console.log(`✅ ${jsonData.inserted_leads} leads created`);
    console.log(`   Considered: ${jsonData.considered_contacts}`);
    console.log(`   Excluded: ${jsonData.excluded_contacts}`);
});
```

### 2.6 List Campaign Leads
- **Method:** `GET`
- **URL:** `{{baseUrl}}/campaign-leads/?campaign_id={{campaignId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns campaign leads", function () {
    const response = pm.response.json();
    pm.expect(response).to.be.an('array');
    pm.expect(response.length).to.be.above(0);

    // Guardar primer leadId
    if (response.length > 0) {
        pm.environment.set("leadId", response[0].id);
        console.log(`✅ Found ${response.length} leads`);
        console.log(`   First lead ID saved: ${response[0].id}`);
    }
});
```

### 2.7 Get Lead by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/campaign-leads/{{leadId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns correct lead", function () {
    const jsonData = pm.response.json();
    const leadId = pm.environment.get("leadId");
    pm.expect(jsonData.id).to.eql(leadId);
    pm.expect(jsonData.campaign_id).to.eql(pm.environment.get("campaignId"));
});
```

---

## 3. UC3: Gestión de Contactos Individuales

**Flujo completo:** CRUD completo de un contacto individual.

### 3.1 Create Single Contact
- **Method:** `POST`
- **URL:** `{{baseUrl}}/contacts/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `X-Import-ID: {{importId}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "full_name": "Emily Rodriguez",
  "email": "emily.rodriguez@enterprise.com",
  "linkedin_profile": "https://linkedin.com/in/emilyrodriguez",
  "company": "Enterprise Solutions",
  "locale": "es-ES",
  "timezone": "Europe/Madrid",
  "metadata": {
    "source": "manual_postman",
    "department": "Sales",
    "seniority": "Director"
  }
}
```
- **Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("contactId", response.id);
    console.log("✅ Contact ID saved:", response.id);
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Contact created correctly", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.email).to.eql('emily.rodriguez@enterprise.com');
    pm.expect(jsonData.locale).to.eql('es-ES');
});
```

### 3.2 Get Contact by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/contacts/{{contactId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns correct contact", function () {
    const jsonData = pm.response.json();
    const contactId = pm.environment.get("contactId");
    pm.expect(jsonData.id).to.eql(contactId);
});
```

### 3.3 Update Contact
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/contacts/{{contactId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "locale": "en-US",
  "timezone": "America/New_York",
  "metadata": {
    "source": "manual_postman",
    "department": "Sales",
    "seniority": "VP",
    "updated_at_postman": "2024-10-06"
  }
}
```
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Contact updated successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.locale).to.eql('en-US');
    pm.expect(jsonData.timezone).to.eql('America/New_York');
    pm.expect(jsonData.enrichment.seniority).to.eql('VP');
    console.log("✅ Contact updated successfully");
});
```

### 3.4 Delete Contact
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/contacts/{{contactId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Contact deleted successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include('eliminado');
    console.log("✅ Contact deleted");
});
```

### 3.5 List All Contacts
- **Method:** `GET`
- **URL:** `{{baseUrl}}/contacts/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns contacts array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
    console.log(`✅ Total contacts: ${jsonData.length}`);
});
```

---

## 4. UC4: Sincronización CRM

**Flujo completo:** Simular sincronización bidireccional con un CRM externo (Salesforce).

### 4.1 Create Import (source: salesforce)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/imports/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "source": "salesforce",
  "file_name": "salesforce_sync_2024_q4.csv",
  "status": "processing",
  "total_rows": 0,
  "mapping_json": {
    "FirstName": "full_name",
    "LastName": "full_name",
    "Email": "email",
    "Company": "company",
    "LinkedIn__c": "linkedin_profile"
  }
}
```
- **Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("importIdCRM", response.id);
    console.log("✅ CRM Import ID saved:", response.id);
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Import source is salesforce", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.source).to.eql('salesforce');
});
```

### 4.2 Bulk Upload from CRM
- **Method:** `POST`
- **URL:** `{{baseUrl}}/contacts/bulk`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `X-Import-ID: {{importIdCRM}}`
  - `Content-Type: application/json`
- **Body:**
```json
[
  {
    "full_name": "Michael Chen",
    "email": "michael.chen@salesforce-account.com",
    "linkedin_profile": "https://linkedin.com/in/michaelchen",
    "company": "Salesforce Account Co",
    "locale": "en-US",
    "timezone": "America/Los_Angeles",
    "metadata": {
      "source": "salesforce",
      "sf_lead_id": "00Q5e00000XyZ1234",
      "sf_account_id": "0015e00000ABC123"
    }
  },
  {
    "full_name": "Sarah Williams",
    "email": "sarah.williams@sf-enterprise.com",
    "linkedin_profile": "https://linkedin.com/in/sarahwilliams",
    "company": "SF Enterprise",
    "locale": "en-US",
    "timezone": "America/New_York",
    "metadata": {
      "source": "salesforce",
      "sf_lead_id": "00Q5e00000XyZ5678",
      "sf_account_id": "0015e00000ABC456"
    }
  }
]
```
- **Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("CRM contacts imported", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.inserted).to.be.above(0);
    pm.environment.set("totalCRMContacts", jsonData.inserted);

    // Guardar primer contacto para updates
    if (jsonData.details && jsonData.details.length > 0) {
        pm.environment.set("crmContactId", jsonData.details[0].id);
    }
    console.log(`✅ ${jsonData.inserted} contacts synced from CRM`);
});
```

### 4.3 Update Import (completed)
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/imports/{{importIdCRM}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "status": "completed",
  "total_rows": {{totalCRMContacts}}
}
```
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("CRM import completed", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql('completed');
    console.log("✅ CRM import marked as completed");
});
```

### 4.4 Create Single Contact (incremental sync)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/contacts/`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `X-Import-ID: {{importIdCRM}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "full_name": "David Thompson",
  "email": "david.thompson@new-sf-lead.com",
  "linkedin_profile": "https://linkedin.com/in/davidthompson",
  "company": "New SF Lead Company",
  "locale": "en-US",
  "timezone": "America/Chicago",
  "metadata": {
    "source": "salesforce_webhook",
    "sf_lead_id": "00Q5e00000XyZ9999",
    "sync_type": "incremental"
  }
}
```
- **Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("incrementalContactId", response.id);
    console.log("✅ Incremental contact synced:", response.id);
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});
```

### 4.5 Update Contact (CRM changes)
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/contacts/{{crmContactId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "company": "Salesforce Account Co (Updated)",
  "metadata": {
    "source": "salesforce",
    "sf_lead_id": "00Q5e00000XyZ1234",
    "sf_account_id": "0015e00000ABC123",
    "last_modified_sf": "2024-10-06T15:30:00Z",
    "status": "Qualified"
  }
}
```
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("CRM contact updated", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.company).to.include('Updated');
    pm.expect(jsonData.enrichment.status).to.eql('Qualified');
    console.log("✅ Contact synced with CRM changes");
});
```

---

## 5. Cleanup & Deletion

**Flujo completo:** Limpiar recursos creados durante las pruebas.

### 5.1 Delete Contact
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/contacts/{{contactId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

console.log("✅ Contact deleted");
```

### 5.2 Delete Campaign
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/campaigns/{{campaignId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

console.log("✅ Campaign deleted");
```

### 5.3 Delete Import
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/imports/{{importId}}`
- **Headers:**
  - `X-API-Key: {{apiKey}}`
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

console.log("✅ Import deleted");
```

---

## 🧪 Tests Globales (Collection Level)

### Pre-request Script (Collection)
```javascript
// Logging utilities
const timestamp = new Date().toISOString();
const requestName = pm.info.requestName;
console.log(`\n[${ timestamp}] 🚀 Request: ${requestName}`);

// Validar que existe API Key
if (!pm.environment.get("apiKey")) {
    throw new Error("⚠️ API Key no configurada en el environment");
}

// Validar que existe baseUrl
if (!pm.environment.get("baseUrl")) {
    throw new Error("⚠️ Base URL no configurada en el environment");
}
```

### Tests (Collection)
```javascript
// Logging de respuesta
const timestamp = new Date().toISOString();
const statusCode = pm.response.code;
const responseTime = pm.response.responseTime;

console.log(`[${timestamp}] ✓ Response: ${statusCode} (${responseTime}ms)`);

// Test global: Validar que no hay errores 500
pm.test("No server errors (5xx)", function () {
    pm.expect(pm.response.code).to.be.below(500);
});

// Test global: Response time
pm.test("Response time is less than 5000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});

// Test global: Content-Type para JSON
if (pm.response.headers.get("Content-Type")?.includes("application/json")) {
    pm.test("Response is valid JSON", function () {
        pm.response.to.be.json;
    });
}
```

---

## 📦 Archivos a Generar

### 1. SDR_Agent_API.postman_collection.json
Colección completa con todos los casos de uso

### 2. SDR_Agent_Development.postman_environment.json
```json
{
  "name": "SDR Agent - Development",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://api.sdragent.com",
      "enabled": true
    },
    {
      "key": "apiKey",
      "value": "sk_live_1234567890abcdef",
      "enabled": true
    },
    {
      "key": "importId",
      "value": "",
      "enabled": true
    },
    {
      "key": "contactId",
      "value": "",
      "enabled": true
    },
    {
      "key": "campaignId",
      "value": "",
      "enabled": true
    },
    {
      "key": "leadId",
      "value": "",
      "enabled": true
    },
    {
      "key": "importId2",
      "value": "",
      "enabled": true
    },
    {
      "key": "leadMagnetId",
      "value": "",
      "enabled": true
    },
    {
      "key": "totalContactsInserted",
      "value": "0",
      "enabled": true
    },
    {
      "key": "importIdCRM",
      "value": "",
      "enabled": true
    },
    {
      "key": "crmContactId",
      "value": "",
      "enabled": true
    },
    {
      "key": "incrementalContactId",
      "value": "",
      "enabled": true
    },
    {
      "key": "totalCRMContacts",
      "value": "0",
      "enabled": true
    }
  ]
}
```

### 3. SDR_Agent_Production.postman_environment.json
```json
{
  "name": "SDR Agent - Production",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://your-api-domain.com",
      "enabled": true
    },
    {
      "key": "apiKey",
      "value": "YOUR_PROD_API_KEY",
      "enabled": true
    }
  ]
}
```

### 4. contacts_sample.csv
```csv
full_name,email,linkedin_profile,company,locale,timezone
Charlie Davis,charlie.davis@fintech.com,https://linkedin.com/in/charliedavis,FinTech Solutions,en-US,America/New_York
Diana Martinez,diana.martinez@saas.io,https://linkedin.com/in/dianamartinez,SaaS Company,en-US,America/Los_Angeles
```

### 5. README_POSTMAN.md
Instrucciones detalladas de importación y uso

---

## 🚀 Orden de Ejecución Recomendado

### Para probar el flujo completo:

1. **UC1: Crear Import con Contactos** (requests 1.1 → 1.7)
2. **UC2: Crear Campaña y Asociar Import** (requests 2.1 → 2.8)
3. **UC3: Gestión de Contactos Individuales** (requests 3.1 → 3.5)
4. **UC4: Sincronización CRM** (requests 4.1 → 4.5)
5. **Cleanup & Deletion** (requests 5.1 → 5.3)

### Usar Postman Runner:
- Seleccionar el folder completo (ej: "1. UC1: Crear Import con Contactos")
- Click en "Run"
- Los tests automáticos guardarán las variables necesarias
- Verificar que todos los tests pasen ✓

---

## ✅ Checklist de Completitud

- [ ] Colección estructurada por casos de uso
- [ ] 30+ requests organizados en 5 casos de uso
- [ ] Tests automáticos en cada request
- [ ] Variables dinámicas que se conectan entre requests
- [ ] Pre-request scripts para validaciones
- [ ] Scripts globales a nivel de colección
- [ ] 2 environments (Development + Production)
- [ ] Archivo CSV de ejemplo
- [ ] Documentación en cada request
- [ ] README con instrucciones
- [ ] Validación de errores comunes
- [ ] Collection exportada como JSON v2.1

---

## 🎯 Resultado Esperado

Al finalizar, el usuario podrá:

1. ✅ **Importar la colección** en Postman
2. ✅ **Configurar API Key** en el environment
3. ✅ **Ejecutar UC1** para crear import con contactos
4. ✅ **Ejecutar UC2** para crear campaña y generar leads
5. ✅ **Ver todas las variables** conectándose automáticamente
6. ✅ **Ejecutar cualquier flujo** con Collection Runner
7. ✅ **Ver tests pasando** con ✓ verde en cada request
8. ✅ **Probar en Development y Production**
