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

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Dev-Notes

(später löschen)

Neue Dependencies hinzufügen:

```bash
# Runtime Dependency ins Backend
docker compose exec backend npm i -w backend-nestjs <paket>

# Dev Dependency ins Backend (z.B. testing/types)
docker compose exec backend npm i -D -w backend-nestjs <paket>

# Runtime Dependency ins Frontend
docker compose exec frontend npm i -w frontend-nextjs <paket>

# Dev Dependency ins Frontend
docker compose exec frontend npm i -D -w frontend-nextjs <paket>

# Tests im Backend ausführen
docker compose exec backend npm test -w backend-nestjs

# Tests im Frontend ausführen
docker compose exec frontend npm test -w frontend-nextjs
```

Hinweis: Danach `apps/*/package.json` und `package-lock.json` committen.

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
