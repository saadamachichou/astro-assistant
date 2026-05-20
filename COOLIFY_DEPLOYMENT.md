# Astro Assistant Coolify Deployment

This deploys the Astro Assistant backend as a separate app from the main ASTROQODELABS website.

## Target Architecture

```txt
https://astroqodelabs.com
  Main Next.js website + chat widget

https://assistant.astroqodelabs.com
  Astro Assistant backend
  Runs Node server on port 3001
  Talks to Ollama
  Saves leads to PostgreSQL

Ollama service
  Runs qwen2.5:7b

PostgreSQL
  Stores astro_leads
```

## 1. Push This Project To GitHub

This project is the assistant backend:

```txt
C:\Users\3PL7VEN REALM\Documents\New project 3
```

Create a GitHub repository, for example:

```txt
astro-assistant
```

Push this folder to that repository.

## 2. Create A New Coolify Application

In Coolify:

1. Open the ASTROQODELABS project/environment.
2. Click **New Resource**.
3. Choose **Application**.
4. Select the GitHub repository for this assistant project.
5. Use branch `main`.

Recommended build mode:

```txt
Build Pack: Dockerfile
Port: 3001
```

If using Nixpacks instead:

```txt
Install Command: npm ci
Build Command: npm run build
Start Command: npm start
Port: 3001
```

## 3. Add Assistant Environment Variables

Set these on the new assistant backend app:

```env
NODE_ENV=production
PORT=3001
OLLAMA_MODEL=qwen2.5:7b
FAST_REPLY_TOKENS=56
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
ADMIN_TOKEN=choose-a-long-secret-token
```

Set `OLLAMA_BASE_URL` to the Ollama API URL reachable from this backend.

Preferred, if Coolify gives the Ollama service an internal host:

```env
OLLAMA_BASE_URL=http://OLLAMA_INTERNAL_SERVICE_NAME:11434
```

If the Ollama API is only exposed through a Coolify domain, use that domain:

```env
OLLAMA_BASE_URL=https://YOUR_OLLAMA_API_DOMAIN
```

Do not use your personal computer's localhost in production.

## 4. Add Assistant Domain

On the assistant backend app in Coolify:

```txt
assistant.astroqodelabs.com
```

Make sure DNS has a record for it:

```txt
Type: A
Name: assistant
Value: your VPS IP
```

Or use a CNAME if your DNS/Coolify setup requires it.

After DNS and SSL are ready, test:

```txt
https://assistant.astroqodelabs.com/api/health
```

Expected result:

```json
{
  "ok": true,
  "ollama": true,
  "model": "qwen2.5:7b",
  "models": ["qwen2.5:7b"]
}
```

## 5. Update The Main Website App

In the main `astroqodelabs.com` application environment variables, add:

```env
ASTRO_ASSISTANT_API_URL=https://assistant.astroqodelabs.com/api
```

Then redeploy/restart the main website.

Test:

```txt
https://astroqodelabs.com/api/astro-assistant/health
```

Expected:

```json
{
  "ok": true,
  "ollama": true,
  "model": "qwen2.5:7b"
}
```

## 6. Common Failure Cases

### Website still says offline

Check:

- `ASTRO_ASSISTANT_API_URL` exists on the main website app.
- Main website was redeployed after adding the variable.
- `https://assistant.astroqodelabs.com/api/health` works.
- DNS for `assistant.astroqodelabs.com` resolves.

### Assistant health says `ollama: false`

Check:

- Ollama service is running.
- `qwen2.5:7b` is pulled on the VPS/service.
- `OLLAMA_BASE_URL` points to the Ollama API, not Open WebUI.
- The assistant backend can reach the Ollama service.

### Leads do not save

Check:

- `DATABASE_URL` is set on the assistant backend app.
- PostgreSQL allows connections from the assistant backend.
- The backend logs do not show database errors.

