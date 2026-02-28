# Subir a GitHub

El repositorio Git ya está inicializado y el commit está hecho. Sigue estos pasos para subirlo a GitHub:

## 1. Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `finanzas-app` (o el que prefieras)
3. Elige **Público**
4. **No** marques "Add a README" (ya tienes uno)
5. Click **Create repository**

## 2. Conectar y subir

En la terminal, dentro de la carpeta `finanzas-app`:

```bash
git remote add origin https://github.com/TU_USUARIO/finanzas-app.git
git branch -M main
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

## 3. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa el repositorio `finanzas-app`
3. Añade la variable `DATABASE_URL` (tu URL de PostgreSQL de Neon/Vercel Postgres)
4. Deploy
