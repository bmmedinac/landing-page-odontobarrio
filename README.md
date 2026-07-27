
  # Landing Page OdontoBarrio (Community)

  This is a code bundle for Landing Page OdontoBarrio (Community). The original project is available at https://www.figma.com/design/qF91p3vBbMPer2MoyvWurm/Landing-Page-OdontoBarrio--Community-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deployment

  This project is deployed to GitHub Pages automatically via GitHub Actions on every push to `main`. The live site is available at https://bmmedinac.github.io/landing-page-odontobarrio/.

  ## Chat widget: webhooks por grupo

  El widget de chat (`src/app/components/ChatWidget.tsx`) llama a un webhook de Make.com
  por mensaje. Si tienes varios grupos de alumnos, cada uno con su propio webhook, el
  widget muestra un dropdown para elegir el grupo antes de chatear.

  Para configurarlo, crea un secreto de repositorio llamado `GROUP_WEBHOOKS` (Settings →
  Secrets and variables → Actions) con un JSON plano `{ "Nombre del grupo": "https://webhook..." }`,
  por ejemplo:

  ```json
  { "Grupo A": "https://hook.us1.make.com/xxxx", "Grupo B": "https://hook.us1.make.com/yyyy" }
  ```

  El workflow de deploy (`.github/workflows/deploy.yml`) lo inyecta como `VITE_GROUP_WEBHOOKS`
  al hacer el build. Si el secreto no existe, el widget usa un único webhook por defecto
  (constante `DEFAULT_WEBHOOK_URL` en el componente) y no muestra el dropdown.

  **Nota de seguridad:** como el sitio es estático (GitHub Pages), estas URLs de webhook
  quedan visibles en el JavaScript público del build — cualquiera con las herramientas de
  desarrollador del navegador puede verlas. No son tan sensibles como una API key (no dan
  acceso a datos sin pasar por el escenario de Make), pero si prefieres ocultarlas del todo
  necesitarías un backend/proxy intermedio.
  