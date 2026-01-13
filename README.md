## Docker (Build & Start)

Lokale Entwicklung: `docker compose up -d`

- Startet frontend, backend und die lokale postgres-db komplett lokal.
- Die Datenbankverbindung wird über die `DATABASE_URL` in der `.env`-Datei im Projekt-Root gesteuert.

```bash
# 1) Environment-Datei anlegen
cp .env.example .env

# 2) Anpassen der .env-Datei:
#    Für lokale Datenbank (Docker-Container):
#    DATABASE_URL="postgresql://max_power:super-secret@db:5432/tadaa_db"
#
#    Für externe Datenbank (z.B. Render):
#    DATABASE_URL="<Deine_externe_Datenbank_URL_von_Render>"

# 3) Container bauen & starten
docker compose up -d --build

# (optional) Logs ansehen
docker compose logs -f

# Stoppen (Container bleiben bestehen)
docker compose stop

# Stoppen + Container und zugehörige Netzwerke/Volumes entfernen (für einen sauberen Neustart)
docker compose down -v

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
# Tadaa

Weihnachten wird durch gesellschaftliche Konventionen oft zur Stressfalle statt zur besinnlichen Zeit. Das klassische Szenario, bei dem jeder jedem etwas schenken muss (One-to-Many), ist nicht nur ineffizient, sondern oft auch verschwenderisch. Hinzu kommt der Faktor Prokrastination: Viele Menschen (häufig männliche Individuen) erledigen Einkäufe erst in letzter Sekunde und verpassen so die entspannte Vorweihnachtszeit.

Tadaa löst genau diese Konflikte. Es reduziert die Komplexität des Schenkens, nimmt den Druck raus und verwandelt die lästige Pflichtübung wieder in ein echtes Erlebnis.