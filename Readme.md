# 📤 Sender File

Aplicación web para compartir archivos de forma segura utilizando **Cloudflare R2** como almacenamiento. Permite subir archivos y generar enlaces de descarga únicos.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

---

## 📋 Descripción

**Sender File** es una solución full-stack para compartir archivos que utiliza URLs pre-firmadas de Cloudflare R2, permitiendo subidas directas desde el navegador sin pasar por el servidor, optimizando el rendimiento y reduciendo costos de ancho de banda.

### ✨ Características

- 🚀 **Subida directa a R2** - Los archivos se suben directamente a Cloudflare R2 usando URLs pre-firmadas
- 📊 **Progreso en tiempo real** - Barra de progreso con velocidad y tiempo estimado
- 🔗 **Enlaces compartibles** - Genera enlaces únicos para compartir archivos
- 📱 **Diseño responsive** - Interfaz adaptable a cualquier dispositivo
- 🛡️ **Validación de archivos** - Control de tipos y tamaño máximo permitido
- ⚡ **Lazy loading** - Carga diferida de componentes para mejor rendimiento

---

## 🏗️ Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│ Cloudflare  │
│   (React)   │     │  (Express)  │     │     R2      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       ▲
       └───────────────────────────────────────┘
              Subida directa con URL pre-firmada
```

---

## 🛠️ Tech Stack

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 19.x | Biblioteca UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 7.x | Build tool |
| Tailwind CSS | 4.x | Framework CSS |
| React Router | 7.x | Enrutamiento |
| Axios | 1.x | Cliente HTTP |
| Lucide React | - | Iconos |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 20.x+ | Runtime |
| Express | 4.x | Framework web |
| TypeScript | 5.x | Tipado estático |
| AWS SDK S3 | 3.x | Cliente S3/R2 |
| Multer | 1.x | Manejo de archivos |

---

## 📁 Estructura del Proyecto

```
sender-file/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── download/     # Componentes de descarga
│   │   │   ├── upload/       # Componentes de subida
│   │   │   └── ui/           # Componentes UI generales
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Páginas principales
│   │   └── routes/           # Configuración de rutas
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── config/           # Configuración (R2)
│   │   ├── controllers/      # Controladores
│   │   ├── routes/           # Rutas API
│   │   ├── services/         # Servicios (R2)
│   │   └── types/            # Tipos TypeScript
│   └── package.json
│
└── README.md
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 20.x o superior
- Cuenta de Cloudflare con R2 habilitado
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sender-file.git
cd sender-file
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend/`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Cloudflare R2
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key
R2_SECRET_ACCESS_KEY=tu_secret_key
R2_BUCKET_NAME=tu_bucket
R2_ENDPOINT=https://tu_account_id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://tu-dominio-publico.com

# Configuración de archivos
MAX_FILE_SIZE=104857600
ALLOWED_TYPES=mp3,wav,docx,pdf,xlsx,sql,zip,rar
URL_EXPIRY_SECONDS=300
R2_OBJECTS_PUBLIC=false

# CORS
ALLOWED_ORIGINS=https://tu-frontend.com
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api/v1/files
```

---

## ▶️ Ejecución

### Desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Producción

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## 📡 API Endpoints

### Obtener URL de subida

```http
POST /api/v1/files/upload-url
Content-Type: application/json

{
  "fileName": "documento.pdf",
  "contentType": "application/pdf",
  "expectedSize": 1024000
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "uploadUrl": "https://...",
  "key": "1702915200000-documento.pdf",
  "publicUrl": "https://...",
  "expiresIn": 300
}
```

### Obtener URL de descarga

```http
GET /api/v1/files/download-url/:fileName
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "downloadUrl": "https://...",
  "key": "1702915200000-documento.pdf",
  "expiresIn": 300
}
```

---

## 🔧 Configuración de Cloudflare R2

1. Accede al [Dashboard de Cloudflare](https://dash.cloudflare.com/)
2. Ve a **R2 Object Storage** > **Create bucket**
3. Crea las credenciales API en **R2** > **Manage R2 API Tokens**
4. Configura CORS en el bucket si es necesario:

```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "https://tu-dominio.com"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 📝 Scripts Disponibles

### Backend

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecutar en modo desarrollo |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar versión compilada |
| `npm run type-check` | Verificar tipos |

### Frontend

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecutar ESLint |

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

<p align="center">
  Desarrollado con ❤️ usando React + Node.js + Cloudflare R2
</p>
