## Docker (Build & Start)

Lokale Entwicklung: `docker compose up -d`

- Startet frontend, backend und postgres-db komplett lokal.
- Sollte man eine gehostete DB verwenden, dann `compose.override.yml` lokal löschen/umbenennen und in `.gitignore` eintragen.

```bash
# 1) Environment-Datei anlegen
cp .env.example .env

# 2) Container bauen & starten
docker compose up -d --build

# (optional) Logs ansehen
docker compose logs -f

# Stoppen (Container bleiben bestehen)
docker compose stop

# Stoppen + Container entfernen
docker compose down

# Komplett neu bauen (ohne Cache)
docker compose build --no-cache
docker compose up -d
```

Standard-Ports:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:3001>

## Development Auth Bypass

For development purposes, you can bypass the regular JWT authentication to test protected routes easily. This allows frontend and backend teams to work in parallel without waiting for the full authentication flow to be implemented.

**Usage:**

1. Enable the dev mode in your `.env` file:
   `JWT_DEV_MODE=true`
2. Restart the backend container to apply the environment variable change:
   `docker compose restart backend`
3. Access protected routes directly. A default development user will be automatically injected:
   `curl http://localhost:3001/events`

   _Optional:_ To specify a custom user ID, you can still use the `X-Dev-User-Id` header:
   `curl -H "X-Dev-User-Id: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" http://localhost:3001/events`

## Dev-Notes

(später löschen)

Neue Dependencies hinzufügen:

```bash
# Runtime Dependency ins Backend ("backend" bezieht sich auf den ServiceNamen siehe compose.yml)
docker compose exec backend npm i <paket>
# danach im backend-nestjs npm install ausführen

# Dev Dependency ins Backend ("backend" bezieht sich auf den ServiceNamen siehe compose.yml)
docker compose exec backend npm i -D <paket>
# danach im backend-nestjs npm install ausführen

# Runtime Dependency ins Frontend ("frontend" bezieht sich auf den ServiceNamen siehe compose.yml)
docker compose exec frontend npm i <paket>
# danach im frontend-nextjs npm install ausführen

# Dev Dependency ins Frontend ("frontend" bezieht sich auf den ServiceNamen siehe compose.yml)
docker compose exec frontend npm i <paket>
# danach im frontend-nextjs npm install ausführen
```

Hinweis: Danach `{backend-nestjs,frontend-nextjs}/package.json` und `package-lock.json` committen.

## DONE

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/passport passport-jwt passport -w backend-nestjs
npm install @nestjs/swagger swagger-ui-express class-validator class-transformer -w backend-nestjs
npm install bcrypt -w backend-nestjs
npm install @types/bcrypt --save-dev -w backend-nestjs
npm install @nestjs/jwt @nestjs/passport passport-jwt passport -w backend-nestjs
npm install @types/passport-jwt --save-dev -w backend-nestjs
```

# Tadaa

Weihnachten wird durch gesellschaftliche Konventionen oft zur Stressfalle statt zur besinnlichen Zeit. Das klassische Szenario, bei dem jeder jedem etwas schenken muss (One-to-Many), ist nicht nur ineffizient, sondern oft auch verschwenderisch. Hinzu kommt der Faktor Prokrastination: Viele Menschen (häufig männliche Individuen) erledigen Einkäufe erst in letzter Sekunde und verpassen so die entspannte Vorweihnachtszeit.

Tadaa löst genau diese Konflikte. Es reduziert die Komplexität des Schenkens, nimmt den Druck raus und verwandelt die lästige Pflichtübung wieder in ein echtes Erlebnis.
