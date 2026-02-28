# Finanzas - Seguimiento Financiero Mensual

Aplicación web para dar seguimiento a tus finanzas mensualmente. Lista para desplegar en Vercel.

## Stack

- **Next.js 16** (App Router)
- **Prisma 7** + PostgreSQL
- **Tailwind CSS**
- **Recharts** (gráficos)
- **Lucide React** (iconos)

## Despliegue en Vercel

### 1. Crear base de datos PostgreSQL (gratis)

Elige una opción:

- **[Neon](https://neon.tech)** – Crea cuenta, crea proyecto, copia la connection string
- **[Vercel Postgres](https://vercel.com/storage/postgres)** – Integración directa con Vercel
- **[Supabase](https://supabase.com)** – Crea proyecto, ve a Settings > Database > Connection string (URI)

### 2. Subir a Vercel

**Opción A: Desde la web**

1. Haz push del código a GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa el repositorio
4. En **Environment Variables**, añade:
   - `DATABASE_URL` = tu connection string de PostgreSQL (ej: `postgresql://user:pass@host/db?sslmode=require`)
5. Deploy

**Opción B: Con Vercel CLI**

```bash
npm i -g vercel
vercel
# Añade DATABASE_URL cuando te lo pida o en el dashboard
```

### 3. Ejecutar migraciones y seed (primera vez)

Tras el primer deploy, ejecuta localmente (con tu `DATABASE_URL` en `.env.local`):

```bash
# Aplicar migraciones
npx prisma migrate deploy

# Poblar categorías por defecto
npm run db:seed
```

O usa la misma `DATABASE_URL` en Vercel y el build ya ejecutará `prisma migrate deploy` automáticamente.

---

## Desarrollo local

### Requisitos

- Node.js 20+
- Base de datos PostgreSQL (Neon gratis o local)

### Instalación

```bash
# Instalar dependencias
npm install

# Crear .env.local con tu DATABASE_URL
echo 'DATABASE_URL="postgresql://..."' > .env.local

# Aplicar migraciones
npx prisma migrate deploy

# Poblar categorías
npm run db:seed

# Iniciar
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Script       | Descripción                    |
| ------------ | ------------------------------ |
| `npm run dev` | Servidor de desarrollo         |
| `npm run build` | Build + migraciones (para Vercel) |
| `npm run start` | Servidor de producción         |
| `npm run db:seed` | Crear categorías por defecto   |

---

## Funcionalidades

- **Dashboard**: Resumen mensual, ingresos vs gastos, gráfico por categoría
- **Transacciones**: Lista, añadir, eliminar
- **Presupuestos**: Límites por categoría con barras de progreso
- **Categorías**: Predefinidas (Salario, Comida, Transporte, etc.)
