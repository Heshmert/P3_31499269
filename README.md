
---

# 📦 P3_31499269

**Proyecto universitario de la unidad curricular programacion 3**: pruebas automatizadas, documentación con Swagger, integración continua con GitHub Actions y despliegue en Render.com.

---

## Objetivo

Desarrollar y desplegar una API RESTful que incluya:

- Endpoints funcionales y bien definidos
- Pruebas automatizadas con Jest y Supertest
- Documentación interactiva con Swagger
- Flujo de integración continua (CI) con GitHub Actions
- Despliegue automático en Render.com

---

## Comienzo

Desarrollar y desplegar una API RESTful que incluya:

- Clone el repositorio

```bash
git clone https://github.com/Heshmert/P3_31499269.git
```

- Instale las dependencias

```bash
npm install
```
- Inicie el proyecto

```bash
npm start
```
- Inicie el proyecto en modo desarrollo

```bash
npm dev
```

---

## Tecnologías Utilizadas

- Node.js
- Express
- Jest + Supertest
- Swagger (swagger-jsdoc + swagger-ui-express)
- GitHub Actions
- Render.com

---

## Estructura del Proyecto

```bash
P3_31499269/
├── app.js
├── package.json
├── routes/
├── tests/
│   └── api.test.js
├── swagger/
│   └── swaggerConfig.js
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Endpoints

### `GET /about`

Retorna información personal en formato JSend.

**Respuesta exitosa:**

```json
{
  "status": "success",
  "data": {
    "nombreCompleto": "Tu Nombre",
    "cedula": "Tu Cédula",
    "seccion": "Tu Sección"
  }
}
```

### `GET /ping`

Retorna un código `200 OK` sin cuerpo.

---

## Pruebas Automatizadas

- Las pruebas están implementadas con **Jest** y **Supertest**.
- Ejecute las pruebas con:

```bash
npm test
```

---

## Documentación de la API

- Integrada con **Swagger**.
- Accesible en: [`/api-docs`](http://localhost:3000/api-docs)
- Los endpoints están documentados con comentarios JSDoc.

---

## Integración Continua (CI)

Configurada con **GitHub Actions**:

- Se ejecuta en cada `push` y `pull_request` a la rama `main`.
- Pasos del workflow:
  - Configuración de Node.js (versión LTS recomendada: 18.x)
  - Instalación de dependencias (`npm install`)
  - Ejecución de pruebas (`npm test`)

Archivo del workflow: `.github/workflows/ci.yml`