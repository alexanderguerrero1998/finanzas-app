# Guía de despliegue en Vercel

## Checklist antes de subir

1. **Base de datos PostgreSQL**
   - Crea una en [Neon](https://neon.tech) (gratis)
   - Copia la connection string (formato: `postgresql://user:pass@host/db?sslmode=require`)

2. **Variables de entorno en Vercel**
   - `DATABASE_URL` = tu connection string de PostgreSQL

3. **Repositorio en GitHub**
   - Sube el código a un repo
   - Conecta el repo en vercel.com/new

## Pasos

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. En **Configure Project** > **Environment Variables**:
   - Name: `DATABASE_URL`
   - Value: `postgresql://...` (tu URL de Neon/Vercel Postgres/Supabase)
4. Click **Deploy**

## Después del primer deploy

El build ejecuta `prisma migrate deploy` automáticamente. Para crear las categorías por defecto, ejecuta una vez:

```bash
# Con DATABASE_URL en .env.local
npm run db:seed
```

O conecta a tu base de datos y ejecuta el seed manualmente.
