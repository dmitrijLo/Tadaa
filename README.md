## Setup & Installation

### Lokale Entwicklung

Das Projekt nutzt Docker Compose für eine einfache, konsistente Entwicklungsumgebung.

```bash
# 1) Repository klonen
git clone <repo-url>
cd Tadaa

# 2) Environment-Datei erstellen
cp .env.example .env

# 3) Alle Services starten (Frontend, Backend, Datenbank)
docker compose up
```

Das war's! Die Anwendung ist jetzt unter folgenden URLs erreichbar:

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **Datenbank**: localhost:5432

### Nützliche Docker-Befehle

```bash
# Im Hintergrund starten
docker compose up -d

# Logs ansehen
docker compose logs -f

# Nur bestimmten Service neu starten
docker compose restart backend

# Services stoppen (Container bleiben bestehen)
docker compose stop

# Services stoppen und Container entfernen
docker compose down

# Alles zurücksetzen (inkl. Datenbank-Volumes)
docker compose down -v

# Komplett neu bauen (ohne Cache)
docker compose build --no-cache
docker compose up
```

### Production Deployment

Für die Produktion (z.B. Render.com):

```bash
# 1) Production Environment-Datei erstellen
cp .env.production.example .env.production

# 2) .env.production mit echten Credentials bearbeiten
# - DATABASE_URL mit der echten Datenbank-URL
# - JWT_SECRET mit einem sicheren, zufälligen String
# - NEXT_PUBLIC_API_URL mit der Production-API-URL

# 3) Nach Deployment-Anleitung des Hosting-Providers vorgehen
```

## Development Auth Bypass

For development purposes, you can bypass the regular JWT authentication to test protected routes easily. This allows frontend and backend teams to work in parallel without waiting for the full authentication flow to be implemented.

**Usage:**

1. Enable the dev mode in your `.env` file: `JWT_DEV_MODE=true`
2. Restart the backend container to apply the environment variable change: `docker compose restart backend`
3. Access protected routes directly. A default development user will be automatically injected: `curl http://localhost:3001/events`

_Optional:_ To specify a custom user ID, you can still use the `X-Dev-User-Id` header:

```bash
curl -H "X-Dev-User-Id: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" http://localhost:3001/events
```

## Dev-Notes

### Dependencies hinzufügen

```bash
# Backend Dependencies
docker compose exec backend npm install <paket>

# Backend Dev Dependencies
docker compose exec backend npm install -D <paket>

# Frontend Dependencies
docker compose exec frontend npm install <paket>

# Frontend Dev Dependencies
docker compose exec frontend npm install -D <paket>
```

**Wichtig:** Nach dem Hinzufügen von Dependencies die `package.json` und `package-lock.json` committen.

### Direkter Zugriff auf Services

```bash
# Backend Container Shell
docker compose exec backend sh

# Frontend Container Shell
docker compose exec frontend sh

# Datenbank Shell (PostgreSQL)
docker compose exec db psql -U tadaa_user -d tadaa_db
```

### Database Management

For easy database management during development, an **Adminer** service is included. It provides a simple web interface to view and edit your PostgreSQL database.

- **URL**: <http://localhost:8080>
- **System**: `PostgreSQL`
- **Server**: `db`
- **Username**: `tadaa_user`
- **Password**: `tadaa_password`
- **Database**: `tadaa_db`

_Note: This service is only available in the development environment and should not be deployed to production._

## Projekt-Struktur

```
Tadaa/
├── backend-nestjs/       # NestJS Backend API
├── frontend-nextjs/      # Next.js Frontend
├── compose.yml           # Docker Compose Konfiguration
├── .env.example          # Environment Template für lokale Entwicklung
├── .env.production.example  # Environment Template für Production
└── README.md
```

## Environment Variablen

Das Projekt verwendet eine zentrale `.env`-Datei im Root-Verzeichnis. Wichtige Variablen:

| Variable              | Beschreibung                       | Beispiel                              |
| --------------------- | ---------------------------------- | ------------------------------------- |
| `NODE_ENV`            | Umgebung (development/production)  | `development`                         |
| `DATABASE_URL`        | PostgreSQL Verbindungs-URL         | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`          | Secret für JWT-Token-Signierung    | `your-secret-key`                     |
| `JWT_DEV_MODE`        | Development Auth Bypass aktivieren | `true`                                |
| `FRONTEND_URLS`       | Erlaubte CORS Origins (komma-separiert) | `http://localhost:3000`          |
| `NEXT_PUBLIC_API_URL` | Backend API URL für Frontend       | `http://localhost:3001`               |
| `OPENAI_API_KEY`      | OpenAI API Key (optional)          | `sk-...`                              |

**Für lokale Entwicklung:** `.env.example` kopieren und anpassen
**Für Production:** `.env.production.example` kopieren und mit echten Credentials füllen

---

# Tadaa

Weihnachten wird durch gesellschaftliche Konventionen oft zur Stressfalle statt zur besinnlichen Zeit. Das klassische Szenario, bei dem jeder jedem etwas schenken muss (One-to-Many), ist nicht nur ineffizient, sondern oft auch verschwenderisch. Hinzu kommt der Faktor Prokrastination: Viele Menschen (häufig männliche Individuen) erledigen Einkäufe erst in letzter Sekunde und verpassen so die entspannte Vorweihnachtszeit.

Tadaa löst genau diese Konflikte. Es reduziert die Komplexität des Schenkens, nimmt den Druck raus und verwandelt die lästige Pflichtübung wieder in ein echtes Erlebnis.
