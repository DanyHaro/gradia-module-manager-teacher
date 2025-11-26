# Deploy en Render - GradIA Teacher API

## 📋 Pre-requisitos

Antes de deployar, asegúrate de tener:

1. ✅ Cuenta en [Render.com](https://render.com)
2. ✅ Credenciales de AWS S3 (bucket creado)
3. ✅ URL del servicio de autenticación (auth_gradia)
4. ✅ Credenciales de PostgreSQL en Render
5. ✅ JWT_SECRET (el mismo que usa auth_gradia)

## 🚀 Pasos para deployar

### 1. Crear nuevo Web Service en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio

### 2. Configuración del servicio

```
Name: gradia-teacher-api
Environment: Node
Region: Oregon (US West) - Misma región que tu PostgreSQL
Branch: main
Root Directory: gradia-module-manager-teacher
Build Command: npm install
Start Command: npm start
```

### 3. Plan

Selecciona **"Free"** (para empezar)

### 4. Variables de entorno (Environment Variables)

En el dashboard de Render, añade estas variables:

#### Básicas
```
NODE_ENV=production
PORT=10000
JWT_SECRET=elgradia2025$
```

#### URLs de servicios
```
AUTH_SERVICE_URL=https://auth-gradia-XXXX.onrender.com
FRONTEND_URL=https://gradia-crm-zsj5.vercel.app
```

#### Base de datos PostgreSQL
```
DB_HOST=dpg-d3r732u3jp1c7393ltdg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=grad_ia_bd
DB_USER=gradia_user
DB_PASSWORD=wA1ULtUE7BzIQBD8vL3OL9j1lxXcs0er
```

#### AWS S3 (pide a tu colega estas credenciales)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY=AKIAXXXXXXXXXX
AWS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
AWS_BUCKET_NAME=gradia-files
```

#### Elasticsearch (si aplica)
```
ELASTICSEARCH_URL=tu_url_elasticsearch
```

### 5. Deploy

Click en **"Create Web Service"**

Render automáticamente:
1. Clonará tu repositorio
2. Ejecutará `npm install`
3. Ejecutará `npm start`
4. Asignará una URL pública

### 6. Verificar deployment

Una vez deployado, verifica:

```bash
# Health check
curl https://gradia-teacher-api.onrender.com/health

# O visita en el navegador
https://gradia-teacher-api.onrender.com/api/cursos
```

## 🔧 Actualizar el Frontend

Después de deployar, actualiza las URLs en tu frontend Vercel:

En `gradia-crm/.env.local`:
```
NEXT_PUBLIC_TEACHER_API_URL=https://gradia-teacher-api.onrender.com
NEXT_PUBLIC_STUDENT_API_URL=https://gradia-student-api.onrender.com
NEXT_PUBLIC_AUTH_API_URL=https://auth-gradia-XXXX.onrender.com
```

Y vuelve a deployar el frontend:
```bash
git add .
git commit -m "Update API URLs for production"
git push
```

## ⚠️ Troubleshooting

### Error: "Application failed to respond"
- Verifica que el puerto sea `process.env.PORT`
- Revisa los logs en Render Dashboard

### Error: "CORS blocked"
- Asegúrate que `FRONTEND_URL` sea correcta
- Verifica que CORS esté configurado en `app.js`

### Error: "Database connection failed"
- Verifica credenciales de PostgreSQL
- Asegúrate que SSL esté habilitado (ya lo está)

### Error: "S3 Access Denied"
- Verifica credenciales AWS
- Asegúrate que el bucket existe
- Verifica permisos IAM del usuario

## 📊 Monitoreo

En Render Dashboard puedes ver:
- Logs en tiempo real
- Métricas de uso
- Estado del servicio
- Historial de deploys

## 🔄 Re-deploy automático

Render automáticamente re-deploya cuando:
- Haces push a la rama `main`
- Actualizas variables de entorno
- Haces un deploy manual

## 💰 Límites del plan Free

- Sleep después de 15 minutos de inactividad
- Primera request después de sleep tarda ~30 segundos
- 750 horas/mes de uso
- Bandwidth limitado

Para producción, considera upgradar a plan **Starter ($7/mes)**.
