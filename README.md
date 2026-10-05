# Express Drizzle Boilerplate

Boilerplate backend **Express 5 + Drizzle ORM (MySQL) + TypeScript** untuk memulai project service baru dengan struktur yang konsisten, rapi, dan clean code.
Struktur folder mengikuti pola service Node.js yang sudah dipakai (base / config / controllers / dto / enums / exceptions / helpers / interfaces / middleware / models / repositories / routes / services / types / utils / validators) dengan path alias `@xxx`.

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Struktur Folder](#struktur-folder)
- [Fungsi Masing-masing Folder](#fungsi-masing-masing-folder)
- [Alur Request (Request Lifecycle)](#alur-request-request-lifecycle)
- [Migration (Drizzle Kit)](#migration-drizzle-kit)
- [Seeder](#seeder)
- [Menambahkan Modul / Fitur Baru](#menambahkan-modul--fitur-baru)
- [Format Response & Error Handling](#format-response--error-handling)
- [Path Alias](#path-alias)
- [Environment Variables](#environment-variables)
- [Konvensi Penamaan & Aturan Clean Code](#konvensi-penamaan--aturan-clean-code)
- [Memakai Boilerplate untuk Project Baru](#memakai-boilerplate-untuk-project-baru)

---

## Tech Stack

| Kategori       | Library                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| Runtime        | Node.js >= 20 (disarankan 22), TypeScript 5                             |
| HTTP framework | Express 5 (async error otomatis diteruskan ke error middleware)         |
| ORM & migrasi  | Drizzle ORM + Drizzle Kit, driver `mysql2`                              |
| Validasi       | express-validator                                                       |
| Keamanan       | helmet, cors, express-rate-limit                                        |
| Lainnya        | dotenv, module-alias, express-http-context, request-ip, compression     |
| Dev tools      | nodemon, ts-node, prettier, husky                                       |

---

## Quick Start

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment
cp .env.example .env          # lalu sesuaikan DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE

# 3. (Opsional) Jalankan MySQL via Docker jika belum punya MySQL lokal
docker compose up -d

# 4. Buat database (sekali saja, jika belum ada)
mysql -u root -p -e "CREATE DATABASE express_drizzle"

# 5. Jalankan migration & seeder
npm run db:migrate
npm run db:seed

# 6. Jalankan server development (auto reload)
npm run dev
```

Cek: `GET http://localhost:3000/health` dan `GET http://localhost:3000/api/v1/users`.

> Saat start, aplikasi melakukan ping ke database. Jika database tidak bisa diakses, aplikasi langsung berhenti (fail fast).

### Contoh endpoint bawaan (modul `users`)

| Method | Endpoint             | Keterangan                                    |
| ------ | -------------------- | --------------------------------------------- |
| GET    | `/health`            | Health check (tidak menyentuh database)       |
| GET    | `/api/v1/users`      | List user + pagination (`?page=1&limit=10&search=john`) |
| GET    | `/api/v1/users/:id`  | Detail user                                   |
| POST   | `/api/v1/users`      | Create user `{ name, email, phone? }`         |
| PUT    | `/api/v1/users/:id`  | Update user `{ name?, email?, phone?, isActive? }` |
| DELETE | `/api/v1/users/:id`  | Hapus user                                    |

---

## Scripts

| Script                       | Fungsi                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                | Jalankan server development dengan nodemon + ts-node                   |
| `npm run build`              | Compile TypeScript ke `build/` + copy folder migrations                |
| `npm start`                  | Jalankan hasil build (`node build/index.js`)                           |
| `npm run typecheck`          | Cek type TypeScript tanpa build                                        |
| `npm run format`             | Format kode dengan prettier                                            |
| `npm run db:generate`        | Generate file migration dari perubahan model                           |
| `npm run db:generate:custom` | Buat file migration SQL kosong (untuk SQL manual / data migration)     |
| `npm run db:migrate`         | Jalankan migration yang belum dijalankan (via drizzle-kit)             |
| `npm run db:migrate:prod`    | Jalankan migration dari hasil build (tanpa drizzle-kit, untuk server)  |
| `npm run db:push`            | Sinkronkan schema langsung ke DB **tanpa** file migration (prototyping) |
| `npm run db:studio`          | Buka Drizzle Studio (GUI untuk melihat/mengubah data)                  |
| `npm run db:check`           | Cek konsistensi file-file migration                                    |
| `npm run db:seed`            | Jalankan seeder                                                        |

---

## Struktur Folder

```
express-drizzle-boilerplate/
├── src/
│   ├── base/                     # Abstract class induk (Service, Repository, Helper)
│   │   ├── helper.base.ts
│   │   ├── repository.base.ts
│   │   └── service.base.ts
│   ├── config/                   # Konfigurasi aplikasi dari environment
│   │   ├── app.config.ts
│   │   ├── database.config.ts    # Pool mysql2 + instance drizzle `db`
│   │   ├── env.config.ts         # Loader .env + helper env(), envNumber(), envBoolean()
│   │   └── rate-limit.config.ts
│   ├── controllers/              # Handler HTTP (tipis, tanpa business logic)
│   │   └── user.controller.ts
│   ├── database/
│   │   ├── migrations/           # File migration hasil drizzle-kit (JANGAN diedit manual setelah dijalankan)
│   │   │   ├── 0000_create_users_table.sql
│   │   │   └── meta/             # Snapshot & journal milik drizzle-kit (wajib di-commit)
│   │   ├── seeders/              # Data awal / dummy per tabel
│   │   │   └── user.seeder.ts
│   │   ├── migrate.ts            # Runner migration programmatic (production)
│   │   ├── schema.ts             # Barrel seluruh model untuk instance `db`
│   │   └── seed.ts               # Runner seeder
│   ├── dto/                      # Bentuk data response (Data Transfer Object)
│   │   ├── response.dto.ts       # Envelope response standar
│   │   └── user/user.dto.ts
│   ├── enums/                    # Konstanta bernama (environment, response code, status, dll)
│   ├── exceptions/               # Custom error class (HttpException & turunannya)
│   ├── helpers/                  # Integrasi ke service / API pihak ketiga (HTTP client)
│   ├── interfaces/               # Kontrak (interface) — misal kontrak repository
│   │   └── repository/
│   ├── middleware/               # Express middleware (logging, validation, error, not found)
│   ├── models/                   # Definisi tabel Drizzle (sumber kebenaran schema DB)
│   │   ├── common/timestamps.column.ts
│   │   └── user.model.ts
│   ├── repositories/             # Akses database (query Drizzle) per tabel
│   ├── routes/                   # Definisi endpoint
│   │   ├── api.route.ts          # Root router (health + mount /api/v1)
│   │   └── v1/
│   │       ├── index.route.ts    # Kumpulan route versi 1
│   │       └── user.route.ts
│   ├── services/                 # Business logic
│   ├── types/                    # Type alias TypeScript (entity, payload, response)
│   ├── utils/                    # Fungsi murni / generik yang reusable
│   ├── validators/               # Rule express-validator per endpoint
│   │   ├── common/               # Rule yang dipakai bersama (id param, pagination)
│   │   └── user/
│   ├── app.ts                    # Membuat instance Express (middleware + routes), tanpa listen
│   ├── index.ts                  # Entry point: cek DB, listen port, graceful shutdown
│   └── paths.ts                  # Registrasi path alias runtime (module-alias)
├── .env.example                  # Template environment variable
├── docker-compose.yml            # MySQL untuk development lokal
├── drizzle.config.ts             # Konfigurasi drizzle-kit (schema, folder migration, kredensial DB)
├── nodemon.json
├── tsconfig.json                 # Konfigurasi TS (editor & typecheck)
└── tsconfig.build.json           # Konfigurasi TS khusus build production
```

---

## Fungsi Masing-masing Folder

| Folder | Fungsi | Boleh berisi | Tidak boleh berisi |
| --- | --- | --- | --- |
| **`base/`** | Abstract class induk yang di-extend oleh layer lain. `Service` menyediakan helper `success()` / `created()` untuk membentuk response. `Repository` menyimpan `executor` (db / transaction) dan method `transaction()`. `Helper` menyediakan HTTP client `request()` dengan timeout untuk memanggil API pihak ketiga. | Logic umum yang dipakai semua turunan | Logic spesifik satu modul |
| **`config/`** | Membaca environment variable dan membuat objek konfigurasi / koneksi (database, rate limiter). Satu-satunya tempat yang membaca `process.env`. | `*.config.ts` | Business logic |
| **`controllers/`** | Menerima request, mengambil input yang sudah tervalidasi (`matchedData`), memanggil service, mengirim response. | Mapping request → service → response | Query DB, business rule, `try/catch` (error otomatis ke error middleware) |
| **`database/migrations/`** | File SQL migration hasil `drizzle-kit generate` + folder `meta/` (snapshot & journal). | File hasil generate, migration custom | Mengubah migration yang **sudah** dijalankan di server lain |
| **`database/seeders/`** | Data awal / master / dummy per tabel. Setiap seeder export `{ name, run(executor) }`. | Insert / upsert data | Perubahan struktur tabel (itu tugas migration) |
| **`database/`** (file) | `schema.ts` = barrel semua model; `migrate.ts` = runner migration production; `seed.ts` = runner seeder (urutan & transaction). | | |
| **`dto/`** | Bentuk data yang keluar ke client. `ResponseDto` = envelope standar (`responseCode`, `responseMessage`, `data`, `additionalInfo`). DTO per modul (mis. `UserDto`) memetakan entity DB → response sehingga kolom sensitif/internal tidak bocor. | Class DTO + mapper `fromEntity()` / `collection()` | Query DB |
| **`enums/`** | Konstanta bernama: environment, response code, status, tipe transaksi, dsb. Hindari *magic string/number* di kode. | `enum` / objek konstanta | Logic |
| **`exceptions/`** | Custom error. Semua error yang "diketahui" extend `HttpException` (membawa HTTP status, responseCode, message, additionalInfo). Contoh: `NotFoundException`, `ConflictException`, `BadRequestException`, `ValidationException`. | Class error | Logic penanganan error (itu di middleware) |
| **`helpers/`** | Integrasi ke sistem luar: API vendor/pihak ketiga, service internal lain, notifikasi (Telegram, email), dsb. Biasanya extend `base/helper.base.ts`. | `*.helper.ts` | Akses DB langsung |
| **`interfaces/`** | Kontrak `interface` TypeScript, misalnya kontrak repository (`Search`, `Store`, `Update`, `Destroy`) agar setiap repository punya method yang seragam. | `*.interface.ts` | Implementasi |
| **`middleware/`** | Middleware Express: `logging` (log request/response + request id + masking data sensitif), `validation` (menjalankan validator), `not-found` (404), `errors` (error handler global). | `*.middleware.ts` | Business logic modul |
| **`models/`** | Definisi tabel Drizzle (`mysqlTable`). **Sumber kebenaran schema database** — migration di-generate dari sini. Kolom reusable (mis. `timestamps`) ada di `models/common/`. | `*.model.ts` | Import alias `@xxx` (pakai relative import, lihat catatan di bawah) |
| **`repositories/`** | Satu-satunya layer yang menulis query Drizzle. Satu repository per tabel/agregat, extend `base/repository.base.ts`, implement interface di `interfaces/repository`. | Query select/insert/update/delete | Business rule, throw HTTP error |
| **`routes/`** | Definisi URL → middleware/validator → controller. `api.route.ts` adalah root router, `v1/index.route.ts` mengumpulkan route versi 1 (prefix `/api/v1`). | `*.route.ts` | Logic |
| **`services/`** | **Business logic**. Mengorkestrasi repository & helper, menerapkan aturan bisnis, melempar exception, mengembalikan `ResponseType` (`{ status, data }`). Dependency di-inject lewat constructor agar tidak terikat ke satu implementasi. | `*.service.ts` | Akses `req`/`res` Express, query Drizzle langsung |
| **`types/`** | Type alias TypeScript: tipe entity (diturunkan dari model dengan `$inferSelect` / `$inferInsert`), payload create/update, filter, pagination, response. | `*.type.ts` | Runtime code |
| **`utils/`** | Fungsi murni & generik yang tidak terikat modul tertentu (pagination, masking, format tanggal, dsb). | `*.util.ts` | Akses DB / state |
| **`validators/`** | Array rule `express-validator` per endpoint. Rule yang dipakai bersama ada di `validators/common/`. | `*.validator.ts` | Logic yang butuh DB (cek unik dsb → taruh di service) |

> **Catatan model:** file di `src/models` dibaca langsung oleh `drizzle-kit` yang **tidak** mengenali path alias. Karena itu di dalam model gunakan *relative import* (`./common/timestamps.column`), bukan `@models/...`.

---

## Alur Request (Request Lifecycle)

```
Client
  │
  ▼
app.ts ── cors → helmet → body parser → httpContext → [compression] → [logging] → [rate limiter]
  │
  ▼
routes/api.route.ts → routes/v1/index.route.ts → routes/v1/user.route.ts
  │
  ▼
middleware/validation.middleware.ts   (validators/user/*.validator.ts)  ── gagal → ValidationException (422)
  │
  ▼
controllers/user.controller.ts        (ambil input → panggil service → kirim response)
  │
  ▼
services/user.service.ts              (business logic, throw NotFound/Conflict/...Exception)
  │
  ▼
repositories/user.repository.ts       (query Drizzle ke models/user.model.ts)
  │
  ▼
MySQL
```

Error apa pun yang di-throw di layer mana pun akan ditangkap `middleware/errors.middleware.ts` dan diubah menjadi response JSON standar.

---

## Migration (Drizzle Kit)

Konfigurasi ada di [`drizzle.config.ts`](drizzle.config.ts):

- **schema**: `./src/models/*.model.ts`
- **out** (folder migration): `./src/database/migrations`
- **tabel histori migration**: `__drizzle_migrations`
- kredensial DB diambil dari `.env` (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`)

### Menjalankan migration

```bash
npm run db:migrate
```

Drizzle mencatat migration yang sudah dijalankan di tabel `__drizzle_migrations`, jadi perintah ini aman dijalankan berulang kali — hanya migration baru yang dieksekusi.

### Menambahkan migration baru (perubahan struktur tabel)

Alurnya: **ubah model → generate → review SQL → migrate → commit**.

1. **Ubah / buat model** di `src/models`. Contoh menambah kolom `address` di `user.model.ts`:

   ```ts
   phone: varchar("phone", { length: 30 }),
   address: varchar("address", { length: 255 }), // kolom baru
   ```

   Untuk **tabel baru**, buat file `src/models/<nama>.model.ts` lalu daftarkan di `src/database/schema.ts`:

   ```ts
   export * from "../models/product.model";
   ```

2. **Generate file migration** (beri nama yang deskriptif, snake_case):

   ```bash
   npm run db:generate -- --name=add_address_to_users
   ```

   Hasilnya: `src/database/migrations/0001_add_address_to_users.sql` + update `meta/`.

   ```sql
   ALTER TABLE `users` ADD `address` varchar(255);
   ```

3. **Review isi SQL**-nya. Pastikan tidak ada `DROP` yang tidak disengaja (mis. rename kolom kadang terbaca sebagai drop + add — drizzle-kit akan menanyakan secara interaktif).

4. **Jalankan migration**:

   ```bash
   npm run db:migrate
   ```

5. **Commit** file `.sql` **dan** folder `meta/` bersama perubahan model.

### Migration custom (SQL manual / data migration)

Untuk hal yang tidak bisa di-generate dari model (backfill data, membuat view, trigger, stored procedure, dll):

```bash
npm run db:generate:custom -- --name=backfill_user_phone
```

Akan dibuat file SQL kosong `src/database/migrations/000X_backfill_user_phone.sql`. Isi SQL-nya, pisahkan beberapa statement dengan `--> statement-breakpoint`:

```sql
UPDATE `users` SET `phone` = '-' WHERE `phone` IS NULL;
--> statement-breakpoint
CREATE INDEX `users_phone_idx` ON `users` (`phone`);
```

Lalu jalankan `npm run db:migrate`.

### Perintah migration lainnya

| Perintah | Kapan dipakai |
| --- | --- |
| `npm run db:check` | Cek apakah file migration konsisten / tidak ada konflik (berguna setelah merge branch). |
| `npm run db:push` | Sinkronkan model langsung ke DB **tanpa** membuat file migration. Hanya untuk prototyping di DB lokal — **jangan** di staging/production. |
| `npm run db:studio` | GUI untuk melihat & mengedit data. |

### Migration di server production

`drizzle-kit` adalah devDependency, jadi di server production gunakan runner programmatic dari hasil build:

```bash
npm ci
npm run build              # compile + copy src/database/migrations → build/database/migrations
npm run db:migrate:prod    # node build/database/migrate.js
npm start
```

### Aturan penting migration

- **Jangan mengedit / menghapus file migration yang sudah dijalankan** di environment lain (staging/production). Buat migration baru untuk koreksi.
- Drizzle **tidak memiliki migration "down"/rollback otomatis**. Untuk rollback, buat migration baru yang membalik perubahan (mis. `drop_address_from_users`). Selalu backup DB sebelum migrate di production.
- Jika dua developer membuat migration bersamaan, setelah merge jalankan `npm run db:check`; bila konflik, hapus migration milik branch Anda yang **belum** dijalankan di mana pun, lalu `db:generate` ulang.
- Satu migration = satu perubahan logis, dengan nama deskriptif (`create_products_table`, `add_status_to_orders`).

---

## Seeder

Seeder ada di `src/database/seeders`, dijalankan oleh `src/database/seed.ts` dalam **satu transaction** (gagal satu → semua rollback).

```bash
npm run db:seed
```

Menambah seeder baru:

1. Buat `src/database/seeders/product.seeder.ts`:

   ```ts
   import { products } from "@models/product.model";
   import { DatabaseExecutorType } from "@@types/database.type";

   export default {
     name: "product.seeder",
     run: async (executor: DatabaseExecutorType): Promise<void> => {
       await executor.insert(products).values([{ name: "Product A" }]).onDuplicateKeyUpdate({ set: { name: "Product A" } });
     },
   };
   ```

2. Daftarkan di array `seeders` pada `src/database/seed.ts` (urutkan: tabel parent dulu baru child).

> Buat seeder yang **idempotent** (aman dijalankan berulang), misalnya dengan `onDuplicateKeyUpdate` berdasarkan kolom unik.

---

## Menambahkan Modul / Fitur Baru

Contoh menambah modul `product`. Ikuti urutan ini (lihat modul `user` sebagai referensi):

| # | File | Isi |
| - | ---- | --- |
| 1 | `src/models/product.model.ts` | Definisi tabel `mysqlTable("products", {...})` (+ `...timestamps`) |
| 2 | `src/database/schema.ts` | `export * from "../models/product.model";` |
| 3 | — | `npm run db:generate -- --name=create_products_table` lalu `npm run db:migrate` |
| 4 | `src/types/product.type.ts` | `ProductType` (`$inferSelect`), `NewProductType` (`$inferInsert`), `CreateProductType`, `UpdateProductType`, `ProductFilterType` |
| 5 | `src/repositories/product.repository.ts` | `extends Repository implements Search, Store, Update, Destroy` — semua query Drizzle |
| 6 | `src/dto/product/product.dto.ts` | Mapper entity → response (`fromEntity`, `collection`) |
| 7 | `src/services/product.service.ts` | `extends Service`, inject `ProductRepository` lewat constructor, business logic + throw exception |
| 8 | `src/validators/product/*.validator.ts` | `create-product.validator.ts`, `update-product.validator.ts`, `list-product.validator.ts` |
| 9 | `src/controllers/product.controller.ts` | `index`, `show`, `store`, `update`, `destroy` |
| 10 | `src/routes/v1/product.route.ts` | `router.post("/", validate(CreateProductValidator), store)` dst. |
| 11 | `src/routes/v1/index.route.ts` | `router.use("/products", productRoute);` |
| 12 | `src/database/seeders/product.seeder.ts` | (opsional) data awal |

### Menggunakan transaction lintas repository

```ts
await this.orderRepository.transaction(async (tx) => {
  const order = await this.orderRepository.withTransaction(tx).store(payload);
  await this.stockRepository.withTransaction(tx).decrease(order.productId, order.qty);
});
```

Jika salah satu query gagal / ada error yang di-throw, seluruh perubahan di-rollback.

### Memanggil API pihak ketiga

```ts
// src/helpers/payment-gateway.helper.ts
import Helper from "@base/helper.base";
import { env } from "@config/env.config";

export default class PaymentGatewayHelper extends Helper {
  constructor() {
    super(env("PAYMENT_GATEWAY_BASE_URL"));
  }

  async createInvoice(payload: CreateInvoiceType) {
    return await this.request<InvoiceResponseType>("/invoices", { method: "POST", body: payload, timeoutMs: 15000 });
  }
}
```

---

## Format Response & Error Handling

Semua response memakai envelope yang sama (`ResponseDto`):

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [{ "id": 1, "name": "John Doe", "email": "john@example.com" }],
  "additionalInfo": { "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 } }
}
```

Contoh error validasi (HTTP 422):

```json
{
  "responseCode": "42",
  "responseMessage": "Validation error",
  "data": null,
  "additionalInfo": [{ "field": "email", "message": "email is not valid" }]
}
```

| Exception             | HTTP | responseCode |
| --------------------- | ---- | ------------ |
| (sukses)              | 200/201 | `00`      |
| `BadRequestException` | 400  | `40`         |
| `ValidationException` | 422  | `42`         |
| `NotFoundException`   | 404  | `44`         |
| `ConflictException`   | 409  | `49`         |
| Rate limit            | 429  | `29`         |
| Error tak terduga     | 500  | `99`         |

Daftar kode ada di `src/enums/response-code.enum.ts`. Untuk error baru, buat class di `src/exceptions` yang extend `HttpException`. Error tak terduga (bukan `HttpException`) akan di-log, dan pesan aslinya **disembunyikan** saat `NODE_ENV=production`.

Cukup `throw` di service — **tidak perlu `try/catch` di controller** karena Express 5 otomatis meneruskan error dari async handler ke error middleware.

---

## Path Alias

| Alias            | Folder              |
| ---------------- | ------------------- |
| `@base/*`        | `src/base/*`        |
| `@config/*`      | `src/config/*`      |
| `@controllers/*` | `src/controllers/*` |
| `@database/*`    | `src/database/*`    |
| `@dto/*`         | `src/dto/*`         |
| `@enums/*`       | `src/enums/*`       |
| `@exceptions/*`  | `src/exceptions/*`  |
| `@helpers/*`     | `src/helpers/*`     |
| `@interfaces/*`  | `src/interfaces/*`  |
| `@middleware/*`  | `src/middleware/*`  |
| `@models/*`      | `src/models/*`      |
| `@repositories/*`| `src/repositories/*`|
| `@routes/*`      | `src/routes/*`      |
| `@services/*`    | `src/services/*`    |
| `@@types/*`      | `src/types/*`       |
| `@utils/*`       | `src/utils/*`       |
| `@validators/*`  | `src/validators/*`  |

Jika menambah alias baru, update di **2 tempat**: `tsconfig.json` (`paths`) dan `src/paths.ts` (runtime).

---

## Environment Variables

| Variable | Default | Keterangan |
| --- | --- | --- |
| `APP_NAME` | `Express Drizzle Service` | Nama service (muncul di log) |
| `NODE_ENV` | `local` | `local` / `development` / `staging` / `sandbox` / `production` |
| `PORT` | `3000` | Port HTTP |
| `SECRET_KEY` | | Secret aplikasi (JWT / enkripsi) |
| `USE_LOGGER` | `true` | Aktifkan logging request/response |
| `USE_COMPRESSION` | `false` | Aktifkan gzip compression |
| `USE_LIMITER` | `false` | Aktifkan rate limiter global |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Window rate limit (ms) |
| `RATE_LIMIT_MAX` | `6000` | Maksimal request per IP per window |
| `DB_HOST` | `127.0.0.1` | Host MySQL |
| `DB_PORT` | `3306` | Port MySQL |
| `DB_USERNAME` | `root` | User MySQL |
| `DB_PASSWORD` | | Password MySQL |
| `DB_DATABASE` | `express_drizzle` | Nama database |
| `DB_POOL_MAX` | `10` | Maksimal koneksi di pool |
| `DB_LOGGING` | `false` | Log semua query SQL ke console |

Selalu baca env lewat `src/config/*` (helper `env()`, `envNumber()`, `envBoolean()`), jangan `process.env` langsung di service/controller. Tambahkan juga variable baru ke `.env.example`.

---

## Konvensi Penamaan & Aturan Clean Code

**Penamaan file**: `kebab-case.<layer>.ts`

| Layer | Contoh file | Export |
| --- | --- | --- |
| Model | `user.model.ts` | `export const users = mysqlTable(...)` (nama tabel jamak) |
| Repository | `user.repository.ts` | `export default class UserRepository` |
| Service | `user.service.ts` | `export default class UserService` |
| Controller | `user.controller.ts` | `export { index, show, store, update, destroy }` |
| Route | `user.route.ts` | `export default router` |
| Validator | `create-user.validator.ts` | `export default [ ...rules ]` |
| DTO | `user.dto.ts` | `export default class UserDto` |
| Type | `user.type.ts` | `UserType`, `CreateUserType`, ... |
| Enum | `response-code.enum.ts` | `export default ResponseCodeEnum` |
| Exception | `not-found.exception.ts` | `export default class NotFoundException` |

**Penamaan database**: tabel & kolom `snake_case` (tabel jamak: `users`, `order_items`); properti di TypeScript `camelCase` (`isActive: boolean("is_active")`).

**Aturan clean code**:

1. **Satu layer, satu tanggung jawab** — controller tidak query DB, repository tidak berisi business rule, service tidak menyentuh `req`/`res`.
2. **Dependency mengalir satu arah**: `route → controller → service → repository → model`. Layer bawah tidak boleh import layer atas.
3. **Gunakan exception, bukan return code**, untuk kondisi gagal di service (`throw new NotFoundException(...)`).
4. **Jangan expose entity DB langsung** — selalu lewat DTO.
5. **Tidak ada magic string/number** — pakai `enums/` atau konstanta.
6. **Tipe entity diturunkan dari model** (`$inferSelect` / `$inferInsert`), jangan didefinisikan ulang manual.
7. **Validasi format di validator, validasi bisnis di service** (mis. cek email unik butuh DB → service).
8. **Inject dependency lewat constructor** (dengan default value) agar service tidak terikat ke satu implementasi.
9. Fungsi kecil, nama deskriptif, early return; hindari nested `if` yang dalam.
10. Gunakan `import` dengan path alias (kecuali di `src/models`).

Husky `pre-commit` menjalankan `prettier --check` dan `typecheck`. Jika format gagal, jalankan `npm run format`.

---

## Memakai Boilerplate untuk Project Baru

```bash
# 1. Copy boilerplate (tanpa history git)
npx degit <url-repo-boilerplate> my-new-service
#    atau: copy folder secara manual lalu hapus folder .git

cd my-new-service
git init

# 2. Sesuaikan identitas
#    - package.json      → "name", "description"
#    - .env / .env.example → APP_NAME, DB_DATABASE

# 3. Hapus / ganti contoh modul user jika tidak dipakai:
#    src/models/user.model.ts, src/types/user.type.ts, src/repositories/user.repository.ts,
#    src/dto/user, src/services/user.service.ts, src/validators/user, src/controllers/user.controller.ts,
#    src/routes/v1/user.route.ts, src/database/seeders/user.seeder.ts,
#    serta referensinya di schema.ts, routes/v1/index.route.ts dan seed.ts.
#    Jika model user dihapus, hapus juga isi src/database/migrations lalu generate ulang migration awal.

# 4. Install & jalankan
npm install
npm run db:generate -- --name=init
npm run db:migrate
npm run dev
```
