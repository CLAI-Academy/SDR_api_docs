---
sidebar_position: 2
---

# Autenticación

La API de SDR Agent usa autenticación por API Key. Cada petición debe incluir la llave asignada a tu organización en la cabecera `X-API-Key`.

## Cabeceras requeridas

- `X-API-Key`: tu llave privada, gestionada desde el panel de SDR Agent. Solicita una nueva al equipo si aún no la tienes.
- `Content-Type`: `application/json` para peticiones con cuerpo JSON.

## Ejemplo de petición

```bash
curl -X GET "https://your-api-domain.com/contacts/" \
  -H "X-API-Key: $SDR_AGENT_API_KEY" \
  -H "Content-Type: application/json"
```

Respuesta esperada en caso de falta de autenticación:

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

