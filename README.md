# AmautApp — Código Tawantin

Manual del Pururauca. Sistema práctico del Código Tawantin de Vidal Herly Llerena García.

## Estructura del proyecto

```
amautapp/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        ← toda la aplicación
│   └── index.js       ← punto de entrada
├── package.json
└── .env.example
```

## Despliegue en Vercel (recomendado)

### 1. Sube el proyecto a GitHub
- Crea un repositorio en github.com
- Sube todos estos archivos

### 2. Conecta con Vercel
- Ve a vercel.com → New Project
- Importa el repositorio de GitHub
- En "Environment Variables" añade:
  - Key: `REACT_APP_ANTHROPIC_KEY`
  - Value: tu API key de Anthropic (console.anthropic.com)
- Clic en Deploy

### 3. URL lista
En 2 minutos tienes tu AmautApp en una URL del tipo:
`https://amautapp-tuusuario.vercel.app`

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Edita .env.local con tu API key
npm start
```

## Secciones incluidas

- **Diagnóstico de Entrada** — 25 preguntas Likert, perfil de las 5 Formas de Kawsay
- **Registro del Amanecer** — Las 3 preguntas exactas del libro
- **El Mantra** — Ayni · Yanantin · Masintin · Tawantin con práctica guiada
- **Registro del Atardecer** — Las 4 preguntas del Quipu
- **Glosario Andino** — 8 términos con definiciones
- **Amautu IA** — Asistente con Claude entrenado en el Código Tawantin

## Próximos pasos

Para añadir persistencia de datos (guardar registros entre sesiones):
- Crea una cuenta en supabase.com
- Añade autenticación de usuarios
- Guarda los registros en la base de datos

---

*Ayni · Yanantin · Masintin · Tawantin*
