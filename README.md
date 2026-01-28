# E-Commerce App – Server (Node.js + Express + MongoDB)

Dieses Projekt ist das **Backend/API** der E‑Commerce‑App.  
Es stellt REST‑Endpoints für **Auth**, **Shop** (Produkte, Warenkorb, Adressen, Orders, Reviews, Suche) sowie **Admin** (Produkte, Orders, Users) bereit.

> **Hinweis:** In deinem ZIP ist ein `node_modules/` Ordner enthalten. In Git-Repos sollte `node_modules/` **nicht** committed werden (steht i. d. R. in `.gitignore`).  
> Für Deployments/Builds wird `npm install` verwendet.

---

## Inhalt

- [Features](#features)
- [Tech‑Stack](#tech-stack)
- [Projektstruktur](#projektstruktur)
- [Skripte](#skripte)
- [Environment Variablen](#environment-variablen)
- [Start & Installation](#start--installation)
- [CORS & Cookies](#cors--cookies)
- [API Routen](#api-routen)
- [Datei‑Upload (Cloudinary)](#datei-upload-cloudinary)
- [PayPal Payments](#paypal-payments)
- [Datenbankmodelle](#datenbankmodelle)
- [Troubleshooting](#troubleshooting)

---

## Features

### Auth
- Registrierung, Login, Logout
- JWT‑Token wird als **HTTP‑Only Cookie** (`token`) gesetzt
- `GET /api/auth/profile` liefert den eingeloggten User (via Middleware)

### Shop
- Produkte:
    - Produktliste mit Filter/Sort (Server‑Seite)
    - Produktdetails
- Warenkorb:
    - Add to cart
    - Get cart by user
    - Update quantity
    - Delete item
- Adressen:
    - Add / Update / Delete / List
- Orders:
    - Bestellung erstellen
    - PayPal Approval URL zurückgeben
    - Payment Capture → Order finalisieren
    - Nach erfolgreichem Capture wird der Cart gelöscht (siehe Orders Controller)
- Suche:
    - Suche per Keyword
- Reviews:
    - Review hinzufügen
    - Reviews pro Produkt laden

### Admin
- Produkte:
    - CRUD (add/edit/delete/fetch)
    - Bild‑Upload (Cloudinary)
- Orders:
    - Alle Orders abrufen
    - Order‑Details
    - Order‑Status aktualisieren
- Users:
    - User‑Liste abrufen

### Common
- Feature Images:
    - Feature‑Bild hinzufügen
    - Feature‑Bilder abrufen

---

## Tech‑Stack

Aus `package.json`:

- Node.js + **Express 5**
- MongoDB + **Mongoose**
- Auth: **jsonwebtoken**, **bcryptjs**
- CORS + Cookies: **cors**, **cookie-parser**
- Upload: **multer**, **cloudinary**
- Payments: **paypal-rest-sdk**
- Dev: **nodemon**, dotenv

---

## Projektstruktur

```
E-Commerce-Server/
  server.js
  package.json
  routes/
    auth/
    admin/
    shop/
    common/
  controllers/
    auth/
    admin/
    shop/
    common/
  models/
    User.js
    Product.js
    Cart.js
    Address.js
    Order.js
    Review.js
    Feature.js
  helper/
    cloudinary.js
    paypal.js
```

---

## Skripte

```bash
npm run dev    # nodemon server.js
npm start      # node server.js
```

---

## Environment Variablen

Lege eine `.env` Datei im Projektroot an (neben `server.js`).

**Empfohlenes Template:**

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret
JWT_EXPIRATION=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# PayPal
PAYPAL_ID=xxxx
PAYPAL_SECRET=xxxx
```

> **Sicherheit:** Bitte keine echten Secrets/DB‑Credentials in Git committen.

---

## Start & Installation

### Voraussetzungen
- Node.js **18+** (empfohlen 20+)
- Zugriff auf MongoDB (Atlas oder lokal)

### Setup
```bash
npm install
```

### Start (Development)
```bash
npm run dev
```

Server läuft standardmäßig auf:
- `http://localhost:4000`

---

## CORS & Cookies

In `server.js` ist CORS so konfiguriert:
- `credentials: true` (Cookies werden erlaubt)
- `origin` ist **whitelist‑basiert** (`allowedOrigins` Array)

Wenn du Frontend‑URL oder Port änderst, passe `allowedOrigins` an.

### Cookie Settings (Auth)
Der Token wird als Cookie gesetzt:
- `httpOnly: true`
- `secure: process.env.NODE_ENV === "production"`
- `sameSite: "none"`

**Wichtig:** `sameSite: "none"` + `secure: true` funktioniert nur über **HTTPS** (z. B. Render/Prod).  
Für lokale Tests kann man ggf. `sameSite: "lax"` nutzen – aber dann Client/Server‑Setup entsprechend anpassen.

---

## API Routen

Base‑Prefix ist in `server.js` definiert.

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `POST /logout`
- `GET  /profile` *(geschützt via authMiddleware)*

### Admin – Products (`/api/admin/products`)
- `POST   /upload-image` *(multipart/form-data, field: `my_file`)*
- `POST   /add`
- `PUT    /edit/:id`
- `GET    /fetch`
- `DELETE /delete/:id`

### Admin – Orders (`/api/admin/orders`)
- `GET /get`
- `GET /details/:id`
- `PUT /update/:id`

### Admin – Users (`/api/admin/users`)
- `GET /get`

### Shop – Products (`/api/shop/products`)
- `GET /get`
- `GET /get/:id`

### Shop – Cart (`/api/shop/cart`)
- `POST   /add`
- `GET    /get/:userId`
- `PUT    /update-cart`
- `DELETE /:userId/:productId`

### Shop – Address (`/api/shop/address`)
- `POST   /add`
- `GET    /get/:userId`
- `PUT    /update/:userId/:addressId`
- `DELETE /delete/:userId/:addressId`

### Shop – Orders (`/api/shop/order`)
- `POST /create` *(liefert `approvalURL` + `orderId`)*
- `POST /capture`
- `GET  /list/:userId`
- `GET  /details/:id`

### Shop – Search (`/api/shop/search`)
- `GET /:keyword`

### Shop – Reviews (`/api/shop/review`)
- `POST /add`
- `GET  /:productId`

### Common – Feature Images (`/api/common/feature`)
- `POST /add`
- `GET  /get`

---

## Datei‑Upload (Cloudinary)

Upload läuft über:
- `helper/cloudinary.js` (Cloudinary Config + Multer Memory Storage)
- Route: `POST /api/admin/products/upload-image`

**Request:**
- `Content-Type: multipart/form-data`
- Field Name: `my_file`

**Response (typisch):**
- `{ success: true, url: "<cloudinary-url>" }`

---

## PayPal Payments

PayPal ist in `helper/paypal.js` konfiguriert (aktuell `mode: "sandbox"`).

Flow:
1) `POST /api/shop/order/create`
    - erstellt PayPal Payment
    - speichert Order in DB
    - gibt `approvalURL` an den Client zurück
2) Client leitet auf `approvalURL` weiter
3) `POST /api/shop/order/capture`
    - finalisiert Zahlung
    - setzt Order Status/Payment Status
    - **löscht** den Cart (`Cart.findByIdAndDelete(cartId)`)

> Für Production solltest du PayPal Mode/Keys passend setzen und Webhook‑Handling erwägen.

---

## Datenbankmodelle

In `models/`:

- `User` (Auth)
- `Product` (Shop & Admin)
- `Cart` (items: productId, quantity, name, imageUrl, …)
- `Address` (User Address Book)
- `Order` (Bestellungen + Payment Status)
- `Review` (Produktbewertungen)
- `Feature` (Feature Images / Banner)

---