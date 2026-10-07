# OTEC Platform — Documentación Completa del Proyecto

---

## INDICE

1. [Resumen General](#1-resumen-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Arquitectura del Sistema](#4-arquitectura-del-sistema)
5. [Base de Datos — Esquema Completo](#5-base-de-datos--esquema-completo)
6. [Tipos y Enumeraciones](#6-tipos-y-enumeraciones)
7. [Row Level Security (RLS)](#7-row-level-security-rls)
8. [Índices de Rendimiento](#8-índices-de-rendimiento)
9. [Sistema de Roles](#9-sistema-de-roles)
10. [Rutas y Páginas](#10-rutas-y-páginas)
11. [Componentes](#11-componentes)
12. [State Management (Zustand)](#12-state-management-zustand)
13. [Edge Functions](#13-edge-functions)
14. [API Routes](#14-api-routes)
15. [Sistema de Diseño](#15-sistema-de-diseño)
16. [Naming Conventions](#16-naming-conventions)
17. [Variables de Entorno](#17-variables-de-entorno)
18. [Flujos de Usuario](#18-flujos-de-usuario)
19. [Credenciales y Accesos](#19-credenciales-y-accesos)
20. [Build y Despliegue](#20-build-y-despliegue)

---

## 1. Resumen General

**OTEC** (Organismo Técnico de Capacitación) es una plataforma full-stack para organizaciones de capacitación en Chile. Integra múltiples módulos en una sola aplicación:

| Módulo | Descripción |
|--------|-------------|
| **Portal Público** | Sitio corporativo con catálogo de cursos y eventos |
| **LUMEN** | Sistema de Gestión de Aprendizaje (LMS) para estudiantes |
| **CRM** | Portal de ventas y gestión de clientes para el equipo comercial |
| **E-commerce** | Carrito de compras, checkout y pago con Webpay/Transbank |
| **Eventos** | Gestión de eventos con venta de tickets y asignación de asientos |
| **SENCE** | Soporte para franquicia tributaria SENCE |

---

## 2. Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 13.5.1 | Framework principal (App Router) |
| React | 18.2.0 | Biblioteca de UI |
| TypeScript | 5.2.2 | Tipado estático |
| Tailwind CSS | 3.3.3 | Estilos utility-first |
| shadcn/ui | — | Componentes UI (Radix UI) |
| Lucide React | ^0.446.0 | Iconografía |
| Zustand | ^5.0.12 | State management global |
| React Hook Form | ^7.53.0 | Formularios |
| Zod | ^3.23.8 | Validación de esquemas |
| Recharts | ^2.12.7 | Gráficos y visualizaciones |
| React Big Calendar | ^1.19.4 | Calendario de eventos |
| TipTap | ^3.20.4 | Editor de texto rico (CRM notas) |
| date-fns | ^3.6.0 | Manipulación de fechas |
| jsPDF | ^4.2.1 | Generación de certificados PDF |
| html2canvas | ^1.4.1 | Captura de pantalla para PDFs |
| embla-carousel-react | ^8.3.0 | Carruseles |
| sonner | ^1.5.0 | Notificaciones toast |
| next-themes | ^0.3.0 | Modo oscuro |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Supabase | ^2.58.0 | BaaS: PostgreSQL + Auth + Edge Functions |
| @supabase/ssr | ^0.9.0 | Server-side rendering con Supabase |
| PostgreSQL | — | Base de datos relacional |

### Despliegue
| Servicio | Uso |
|---------|-----|
| Netlify | Hosting del frontend |
| Supabase | Backend, DB, Auth, Edge Functions |

---

## 3. Estructura de Directorios

```
project/
├── app/                              # Next.js App Router (rutas y páginas)
│   ├── api/
│   │   └── checkout/
│   │       └── create-order/
│   │           └── route.ts          # API: crear orden de compra
│   ├── auth/
│   │   ├── login/page.tsx            # Página de login
│   │   └── register/page.tsx         # Página de registro
│   ├── checkout/page.tsx             # Carrito y checkout
│   ├── contacto/page.tsx             # Formulario de contacto
│   ├── crm/page.tsx                  # Dashboard CRM (roles: admin, ejecutivo, vendedor)
│   ├── cursos/
│   │   ├── [slug]/page.tsx           # Detalle de curso
│   │   └── page.tsx                  # Catálogo de cursos
│   ├── educacion-continua/page.tsx   # Oferta de educación continua
│   ├── empresas/page.tsx             # Soluciones corporativas B2B
│   ├── eventos/page.tsx              # Catálogo de eventos
│   ├── lumen/
│   │   ├── cursos/
│   │   │   └── [courseId]/page.tsx   # Reproductor de curso (LMS)
│   │   └── page.tsx                  # Dashboard LMS del estudiante
│   ├── nosotros/page.tsx             # Página institucional
│   ├── sence/page.tsx                # Información SENCE
│   ├── globals.css                   # Estilos globales y variables CSS
│   └── layout.tsx                    # Layout raíz de la aplicación
│
├── components/
│   ├── corporate/
│   │   ├── footer.tsx                # Pie de página corporativo
│   │   ├── header.tsx                # Cabecera con navegación principal
│   │   └── layout-wrapper.tsx        # Wrapper con inicialización de auth
│   └── ui/                           # 45+ componentes shadcn/ui
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       ├── tooltip.tsx
│       └── ... (30+ más)
│
├── hooks/
│   └── use-toast.ts                  # Hook para notificaciones toast
│
├── lib/
│   ├── stores/
│   │   ├── auth-store.ts             # Store Zustand: estado de autenticación
│   │   └── cart-store.ts             # Store Zustand: carrito de compras
│   ├── supabase/
│   │   ├── client.ts                 # Cliente Supabase (client-side)
│   │   └── server.ts                 # Cliente Supabase (server-side SSR)
│   └── utils.ts                      # Utilidades: cn() para clases Tailwind
│
├── supabase/
│   ├── functions/
│   │   ├── confirm-transaction/index.ts   # Edge Function: confirmar pago Webpay
│   │   ├── create-transaction/index.ts    # Edge Function: iniciar pago Webpay
│   │   └── send-notification/index.ts     # Edge Function: enviar notificaciones
│   └── migrations/
│       ├── 20260320212322_create_otec_schema_fixed.sql    # Esquema completo
│       ├── 20260320215031_fix_security_and_performance_issues.sql  # Seguridad
│       └── 20260320221437_seed_test_users.sql             # Datos de prueba
│
├── types/
│   ├── database.ts                   # Tipos TypeScript generados del schema DB
│   └── index.ts                      # Tipos exportados y shortcuts
│
├── .env                              # Variables de entorno locales
├── .eslintrc.json                    # Configuración ESLint
├── .gitignore                        # Archivos ignorados por git
├── CREDENTIALS.md                    # Guía de credenciales y accesos
├── PROYECTO_DOCUMENTACION.md         # Este archivo
├── README.md                         # Guía rápida del proyecto
├── components.json                   # Configuración shadcn/ui
├── netlify.toml                      # Configuración de despliegue Netlify
├── next.config.js                    # Configuración Next.js
├── package.json                      # Dependencias del proyecto
├── postcss.config.js                 # Configuración PostCSS
├── tailwind.config.ts                # Configuración Tailwind CSS
└── tsconfig.json                     # Configuración TypeScript
```

---

## 4. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                   │
│  Next.js App Router + React 18 + TypeScript              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │   Zustand  │  │  React HF  │  │   shadcn/ui +      │ │
│  │ auth-store │  │    + Zod   │  │   Tailwind CSS     │ │
│  │ cart-store │  │            │  │                    │ │
│  └────────────┘  └────────────┘  └────────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│                    SUPABASE (Backend)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ PostgreSQL  │  │  Supabase    │  │  Edge Functions │  │
│  │ (20+ tablas)│  │    Auth      │  │  (Deno/TypeSc) │  │
│  │ + RLS       │  │  (JWT/email) │  │  - create-tx    │  │
│  │ + Indexes   │  │              │  │  - confirm-tx   │  │
│  └─────────────┘  └──────────────┘  │  - send-notif  │  │
│                                      └────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│               SERVICIOS EXTERNOS                         │
│  Transbank/Webpay (pagos)  │  Email/SMTP (notificaciones)│
└──────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Server Components** (rutas marcadas como `λ`): obtienen datos directamente desde Supabase usando el cliente server-side con cookies de sesión
2. **Client Components** (marcados con `'use client'`): usan el cliente Supabase browser-side y stores Zustand
3. **Edge Functions**: procesan pagos y envían notificaciones en el servidor de Deno de Supabase
4. **RLS**: todas las consultas son filtradas automáticamente por políticas de seguridad a nivel de base de datos

---

## 5. Base de Datos — Esquema Completo

### Diagrama de Relaciones

```
auth.users (Supabase built-in)
    │
    ├──► profiles (1:1)
    │       └──► companies (N:1)
    │
    ├──► enrollments (N:M con courses)
    │
    ├──► lesson_progress (N:M con lessons)
    │
    ├──► certificates (N:M con courses)
    │
    ├──► quiz_attempts (N:M con lessons)
    │
    ├──► orders (1:N)
    │       └──► order_items (1:N)
    │
    ├──► tickets (1:N)
    │
    ├──► deals (assigned_to, created_by)
    │
    ├──► tasks (assigned_to, created_by)
    │
    └──► notes (created_by, user_id)

courses (1:N)
    ├──► modules (1:N)
    │       └──► lessons (1:N)
    │               ├──► quiz_questions (1:N)
    │               │       └──► quiz_answers (1:N)
    │               └──► lesson_progress
    │
    └──► company_enrollments (N:M con companies)

events (1:N)
    ├──► ticket_sections (1:N)
    └──► tickets

companies (1:N)
    ├──► profiles
    ├──► deals
    ├──► tasks
    ├──► notes
    └──► company_enrollments
```

---

### Tabla: `profiles`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | FK → auth.users(id) ON DELETE CASCADE |
| `email` | text UNIQUE NOT NULL | Email del usuario |
| `full_name` | text NOT NULL | Nombre completo |
| `role` | user_role DEFAULT 'student' | Rol del sistema |
| `avatar_url` | text | URL de avatar |
| `phone` | text | Teléfono de contacto |
| `company_id` | uuid FK | Empresa asociada |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `companies`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `name` | text NOT NULL | Razón social |
| `rut` | text UNIQUE NOT NULL | RUT empresa (Chile) |
| `email` | text | Email corporativo |
| `phone` | text | Teléfono |
| `address` | text | Dirección |
| `city` | text | Ciudad |
| `region` | text | Región |
| `contact_name` | text | Nombre del contacto |
| `contact_email` | text | Email del contacto |
| `contact_phone` | text | Teléfono del contacto |
| `notes` | text | Notas internas |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `courses`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `title` | text NOT NULL | Título del curso |
| `slug` | text UNIQUE NOT NULL | URL amigable |
| `description` | text | Descripción completa |
| `short_description` | text | Descripción corta |
| `image_url` | text | Imagen de portada |
| `price` | decimal(10,2) DEFAULT 0 | Precio en CLP |
| `duration_hours` | int DEFAULT 0 | Duración en horas |
| `modality` | course_modality | presencial/online/hibrido |
| `area` | text | Área temática |
| `sence_code` | text | Código SENCE |
| `is_sence` | boolean DEFAULT false | Tiene franquicia SENCE |
| `is_published` | boolean DEFAULT false | Visible públicamente |
| `instructor_name` | text | Nombre del relator |
| `instructor_bio` | text | Biografía del relator |
| `instructor_avatar` | text | Foto del relator |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `modules`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `course_id` | uuid FK NOT NULL | Curso al que pertenece |
| `title` | text NOT NULL | Título del módulo |
| `description` | text | Descripción |
| `order_index` | int NOT NULL | Orden de presentación |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `lessons`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `module_id` | uuid FK NOT NULL | Módulo al que pertenece |
| `title` | text NOT NULL | Título de la lección |
| `description` | text | Descripción |
| `type` | lesson_type NOT NULL | video/h5p/quiz/text |
| `order_index` | int NOT NULL | Orden de presentación |
| `video_url` | text | URL del video |
| `duration_seconds` | int DEFAULT 0 | Duración en segundos |
| `h5p_content_url` | text | URL contenido H5P |
| `text_content` | text | Contenido texto (HTML) |
| `is_free` | boolean DEFAULT false | Acceso libre (preview) |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `enrollments`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `user_id` | uuid FK NOT NULL | Usuario inscrito |
| `course_id` | uuid FK NOT NULL | Curso inscrito |
| `enrolled_at` | timestamptz | Fecha de inscripción |
| `completed_at` | timestamptz | Fecha de completado |
| `progress` | decimal(5,2) DEFAULT 0 | Porcentaje de avance |

> Restricción UNIQUE(user_id, course_id) — un usuario no puede inscribirse dos veces al mismo curso.

---

### Tabla: `lesson_progress`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `user_id` | uuid FK NOT NULL | Usuario |
| `lesson_id` | uuid FK NOT NULL | Lección |
| `completed` | boolean DEFAULT false | Si completó la lección |
| `last_position_seconds` | int DEFAULT 0 | Última posición en video |
| `completed_at` | timestamptz | Fecha de completado |
| `updated_at` | timestamptz | Última actualización |

> Restricción UNIQUE(user_id, lesson_id)

---

### Tabla: `certificates`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `user_id` | uuid FK NOT NULL | Usuario |
| `course_id` | uuid FK NOT NULL | Curso completado |
| `certificate_url` | text NOT NULL | URL del PDF generado |
| `issued_at` | timestamptz | Fecha de emisión |

> Restricción UNIQUE(user_id, course_id)

---

### Tabla: `quiz_questions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `lesson_id` | uuid FK NOT NULL | Lección a la que pertenece |
| `question_text` | text NOT NULL | Enunciado de la pregunta |
| `points` | int DEFAULT 1 | Puntos por respuesta correcta |
| `order_index` | int NOT NULL | Orden de presentación |
| `created_at` | timestamptz | Fecha de creación |

---

### Tabla: `quiz_answers`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `question_id` | uuid FK NOT NULL | Pregunta a la que pertenece |
| `answer_text` | text NOT NULL | Texto de la opción |
| `is_correct` | boolean DEFAULT false | Si es la respuesta correcta |
| `order_index` | int NOT NULL | Orden de presentación |
| `created_at` | timestamptz | Fecha de creación |

---

### Tabla: `quiz_attempts`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `user_id` | uuid FK NOT NULL | Usuario |
| `lesson_id` | uuid FK NOT NULL | Lección del quiz |
| `score` | int DEFAULT 0 | Puntaje obtenido |
| `max_score` | int DEFAULT 0 | Puntaje máximo posible |
| `answers` | jsonb | Respuestas seleccionadas |
| `created_at` | timestamptz | Fecha del intento |

---

### Tabla: `company_enrollments`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `company_id` | uuid FK NOT NULL | Empresa |
| `course_id` | uuid FK NOT NULL | Curso contratado |
| `seats_purchased` | int NOT NULL | Cupos comprados |
| `seats_used` | int DEFAULT 0 | Cupos utilizados |
| `price_per_seat` | decimal(10,2) DEFAULT 0 | Precio por cupo |
| `enrolled_at` | timestamptz | Fecha de contratación |
| `expires_at` | timestamptz | Fecha de expiración |

---

### Tabla: `deals` (CRM)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `title` | text NOT NULL | Título del negocio |
| `description` | text | Descripción |
| `company_id` | uuid FK | Empresa relacionada |
| `value` | decimal(10,2) DEFAULT 0 | Valor del contrato |
| `status` | deal_status | Estado del pipeline |
| `assigned_to` | uuid FK | Vendedor asignado |
| `expected_close_date` | date | Fecha estimada cierre |
| `closed_at` | timestamptz | Fecha real de cierre |
| `created_by` | uuid FK | Quien creó el deal |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `tasks`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `title` | text NOT NULL | Título de la tarea |
| `description` | text | Descripción |
| `assigned_to` | uuid FK | Usuario asignado |
| `created_by` | uuid FK | Quien creó la tarea |
| `deal_id` | uuid FK | Deal relacionado (opcional) |
| `company_id` | uuid FK | Empresa relacionada (opcional) |
| `due_date` | date | Fecha límite |
| `completed` | boolean DEFAULT false | Estado de completado |
| `completed_at` | timestamptz | Fecha de completado |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `notes` (Polimórfica)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `content` | text NOT NULL | Contenido de la nota (HTML) |
| `created_by` | uuid FK | Autor |
| `company_id` | uuid FK | Empresa relacionada (opcional) |
| `deal_id` | uuid FK | Deal relacionado (opcional) |
| `user_id` | uuid FK | Usuario relacionado (opcional) |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

> Nota polimórfica: puede estar asociada a company, deal, o user.

---

### Tabla: `events`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `title` | text NOT NULL | Nombre del evento |
| `description` | text | Descripción completa |
| `event_date` | timestamptz NOT NULL | Fecha de inicio |
| `end_date` | timestamptz | Fecha de término |
| `location` | text | Nombre del lugar |
| `address` | text | Dirección |
| `capacity` | int DEFAULT 0 | Capacidad total |
| `ticket_price` | decimal(10,2) DEFAULT 0 | Precio base del ticket |
| `has_seating` | boolean DEFAULT false | Tiene asignación de asientos |
| `image_url` | text | Imagen del evento |
| `is_published` | boolean DEFAULT false | Visible públicamente |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `ticket_sections`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `event_id` | uuid FK NOT NULL | Evento al que pertenece |
| `name` | text NOT NULL | Nombre de la sección |
| `price` | decimal(10,2) DEFAULT 0 | Precio de la sección |
| `capacity` | int DEFAULT 0 | Capacidad de la sección |
| `seats_available` | int DEFAULT 0 | Asientos disponibles |
| `created_at` | timestamptz | Fecha de creación |

---

### Tabla: `orders`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `user_id` | uuid FK NOT NULL | Comprador |
| `total` | decimal(10,2) DEFAULT 0 | Total de la orden |
| `status` | order_status | Estado del pago |
| `payment_method` | text | Método de pago |
| `webpay_token` | text | Token Webpay |
| `webpay_transaction_id` | text | ID de transacción |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### Tabla: `order_items`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `order_id` | uuid FK NOT NULL | Orden padre |
| `item_type` | text NOT NULL | 'course' o 'ticket' |
| `course_id` | uuid FK | Curso (si aplica) |
| `event_id` | uuid FK | Evento (si aplica) |
| `section_id` | uuid FK | Sección del evento |
| `seat_number` | text | Número de asiento |
| `quantity` | int DEFAULT 1 | Cantidad |
| `price` | decimal(10,2) DEFAULT 0 | Precio unitario |
| `created_at` | timestamptz | Fecha de creación |

---

### Tabla: `tickets`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | Identificador único |
| `event_id` | uuid FK NOT NULL | Evento |
| `section_id` | uuid FK | Sección |
| `user_id` | uuid FK NOT NULL | Dueño del ticket |
| `order_id` | uuid FK | Orden de compra |
| `seat_number` | text | Número de asiento asignado |
| `qr_code` | text | Código QR de validación |
| `created_at` | timestamptz | Fecha de creación |

---

## 6. Tipos y Enumeraciones

### Enum: `user_role`

| Valor | Descripción | Acceso |
|-------|-------------|--------|
| `admin` | Administrador total | Acceso a todo |
| `ejecutivo` | Ejecutivo comercial | CRM completo |
| `contable` | Área contable | Órdenes y facturación |
| `ejecutor` | Ejecutor de capacitación | Gestión de cursos |
| `vendedor` | Vendedor | CRM (lectura/escritura básica) |
| `student` | Estudiante | LUMEN, compras |

### Enum: `course_modality`

| Valor | Descripción |
|-------|-------------|
| `presencial` | Clases en sala física |
| `online` | Completamente en línea |
| `hibrido` | Combinación presencial + online |

### Enum: `lesson_type`

| Valor | Descripción |
|-------|-------------|
| `video` | Lección con video embebido |
| `h5p` | Contenido interactivo H5P |
| `quiz` | Evaluación con preguntas |
| `text` | Contenido textual/HTML |

### Enum: `deal_status`

| Valor | Descripción |
|-------|-------------|
| `negociacion` | En negociación inicial |
| `contrato` | Contrato firmado |
| `ejecucion` | Capacitación en ejecución |
| `facturado` | Facturado al cliente |
| `cerrado` | Deal cerrado (ganado) |

### Enum: `order_status`

| Valor | Descripción |
|-------|-------------|
| `pending` | Pendiente de pago |
| `processing` | Procesando pago |
| `completed` | Pago completado |
| `cancelled` | Cancelado |
| `refunded` | Reembolsado |

---

## 7. Row Level Security (RLS)

Todas las tablas tienen RLS activado. Las políticas siguen este patrón:

```sql
-- Optimizado: (SELECT auth.uid()) en lugar de auth.uid()
-- Esto evita que PostgreSQL re-evalúe la función por cada fila
USING ((SELECT auth.uid()) = user_id)
```

### Resumen de Políticas por Tabla

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | propio o admin | — | propio | — |
| companies | todos autenticados | CRM roles | CRM roles | CRM roles |
| courses | publicados (anon+auth) | admin | admin | admin |
| modules | cursos publicados | admin | admin | admin |
| lessons | cursos publicados | admin | admin | admin |
| enrollments | propio o admin | propio o admin | — | — |
| lesson_progress | propio | propio | propio | — |
| certificates | propio | propio o admin | — | — |
| quiz_questions | inscrito en curso | admin | admin | — |
| quiz_answers | inscrito en curso | admin | admin | — |
| quiz_attempts | propio | propio | — | — |
| company_enrollments | empresa propia o admin | admin | admin | — |
| deals | CRM roles | CRM roles | CRM roles | CRM roles |
| tasks | asignado/creado/admin | CRM roles | asignado/creado/admin | — |
| notes | creado/CRM roles | propio | propio | — |
| events | publicados (anon+auth) | admin | admin | admin |
| ticket_sections | todos | admin | admin | admin |
| orders | propio o admin | propio | propio o admin | — |
| order_items | propio (via orders) | propio o admin | — | — |
| tickets | propio | propio o admin | — | — |

---

## 8. Índices de Rendimiento

### Índices en la migración inicial

```sql
idx_profiles_role           ON profiles(role)
idx_profiles_company        ON profiles(company_id)
idx_courses_published       ON courses(is_published)
idx_courses_slug            ON courses(slug)
idx_modules_course          ON modules(course_id)
idx_lessons_module          ON lessons(module_id)
idx_enrollments_user        ON enrollments(user_id)
idx_enrollments_course      ON enrollments(course_id)
idx_lesson_progress_user    ON lesson_progress(user_id)
idx_lesson_progress_lesson  ON lesson_progress(lesson_id)
idx_deals_status            ON deals(status)
idx_tasks_assigned          ON tasks(assigned_to)
idx_orders_user             ON orders(user_id)
idx_tickets_user            ON tickets(user_id)
```

### Índices de la migración de seguridad

```sql
-- Certificates
idx_certificates_course     ON certificates(course_id)
idx_certificates_user       ON certificates(user_id)

-- Company enrollments
idx_company_enrollments_company  ON company_enrollments(company_id)
idx_company_enrollments_course   ON company_enrollments(course_id)

-- Deals
idx_deals_assigned_to       ON deals(assigned_to)
idx_deals_company           ON deals(company_id)
idx_deals_created_by        ON deals(created_by)

-- Notes
idx_notes_company           ON notes(company_id)
idx_notes_created_by        ON notes(created_by)
idx_notes_deal              ON notes(deal_id)
idx_notes_user              ON notes(user_id)

-- Order items
idx_order_items_order       ON order_items(order_id)
idx_order_items_course      ON order_items(course_id)
idx_order_items_event       ON order_items(event_id)
idx_order_items_section     ON order_items(section_id)

-- Quiz
idx_quiz_answers_question   ON quiz_answers(question_id)
idx_quiz_attempts_lesson    ON quiz_attempts(lesson_id)
idx_quiz_attempts_user      ON quiz_attempts(user_id)
idx_quiz_questions_lesson   ON quiz_questions(lesson_id)

-- Tasks
idx_tasks_company           ON tasks(company_id)
idx_tasks_created_by        ON tasks(created_by)
idx_tasks_deal              ON tasks(deal_id)

-- Tickets
idx_ticket_sections_event   ON ticket_sections(event_id)
idx_tickets_event           ON tickets(event_id)
idx_tickets_order           ON tickets(order_id)
idx_tickets_section         ON tickets(section_id)
```

Total: **38 índices** para optimización de consultas.

---

## 9. Sistema de Roles

### Jerarquía de Acceso

```
admin
  └── Acceso total a todas las secciones
      - Gestión de cursos, eventos, usuarios
      - Panel CRM completo
      - Ver todos los pedidos
      - Crear inscripciones y certificados para cualquier usuario

ejecutivo
  └── Acceso CRM completo
      - Ver/crear/editar deals, tasks, notes
      - Ver y gestionar empresas
      - No puede gestionar cursos o eventos

vendedor
  └── Acceso CRM limitado
      - Ver/crear deals y tasks
      - Ver empresas (no editar)
      - No puede ver a otros usuarios

contable
  └── Acceso financiero
      - Ver órdenes y pagos
      - Sin acceso a CRM editorial

ejecutor
  └── Acceso operativo
      - Ver cursos y enrollment
      - Sin acceso a CRM

student (default)
  └── Acceso LMS
      - Inscribirse a cursos
      - Ver su progreso y certificados
      - Comprar cursos y tickets
```

### Cómo Cambiar el Rol de un Usuario

```sql
-- En Supabase SQL Editor:
UPDATE profiles
SET role = 'vendedor'  -- admin | ejecutivo | contable | ejecutor | vendedor | student
WHERE email = 'usuario@ejemplo.com';
```

---

## 10. Rutas y Páginas

### Rutas Públicas (sin autenticación requerida)

| Ruta | Componente | Tipo | Descripción |
|------|------------|------|-------------|
| `/` | `app/page.tsx` | Static | Home con hero, estadísticas, beneficios SENCE |
| `/cursos` | `app/cursos/page.tsx` | Server | Catálogo de cursos publicados |
| `/cursos/[slug]` | `app/cursos/[slug]/page.tsx` | Client | Detalle del curso (precio, temario, instructor) |
| `/eventos` | `app/eventos/page.tsx` | Server | Catálogo de eventos |
| `/empresas` | `app/empresas/page.tsx` | Static | Página B2B / soluciones corporativas |
| `/educacion-continua` | `app/educacion-continua/page.tsx` | Static | Programas de educación continua |
| `/nosotros` | `app/nosotros/page.tsx` | Static | Página institucional |
| `/sence` | `app/sence/page.tsx` | Static | Información sobre SENCE |
| `/contacto` | `app/contacto/page.tsx` | Client | Formulario de contacto |
| `/auth/login` | `app/auth/login/page.tsx` | Client | Inicio de sesión |
| `/auth/register` | `app/auth/register/page.tsx` | Client | Registro de usuario |

### Rutas Protegidas (requieren autenticación)

| Ruta | Roles Permitidos | Tipo | Descripción |
|------|-----------------|------|-------------|
| `/checkout` | Todos (auth) | Client | Carrito de compras y pago |
| `/lumen` | Todos (auth) | Server | Dashboard LMS del estudiante |
| `/lumen/cursos/[courseId]` | Enrolled | Client | Reproductor de lecciones |
| `/crm` | admin, ejecutivo, vendedor | Server | Dashboard CRM |

### API Routes

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/checkout/create-order` | POST | Crea una orden de compra en BD |

---

## 11. Componentes

### Componentes Corporativos

#### `components/corporate/header.tsx`
Cabecera principal de la aplicación.
- Logo y nombre "OTEC"
- Navegación principal: Inicio, Empresas, Educación Continua, Cursos, Eventos, SENCE, Nosotros, Contacto
- Badge con contador de items en el carrito
- Dropdown de usuario autenticado (perfil, cursos, cerrar sesión)
- Botones de Login / Registro para usuarios no autenticados
- Link a CRM para roles admin/ejecutivo/vendedor
- Menú móvil responsive (hamburger)
- Sticky con efecto de sombra en scroll

#### `components/corporate/footer.tsx`
Pie de página corporativo en 4 columnas:
- Columna 1: Logo, descripción de la empresa
- Columna 2: Links "Sobre Nosotros" (Nosotros, SENCE, Empresas, Contacto)
- Columna 3: Links "Servicios" (Cursos, Educación Continua, Eventos, LUMEN)
- Columna 4: Información de contacto (dirección, teléfono, email)
- Íconos de redes sociales (Facebook, Instagram, LinkedIn)
- Copyright con año dinámico

#### `components/corporate/layout-wrapper.tsx`
Componente client-side que envuelve toda la aplicación:
- Inicializa la sesión de Supabase al montar
- Suscribe a cambios en el estado de autenticación
- Hidrata los stores Zustand con datos del usuario
- Renderiza: Header → children → Footer

### Componentes UI (shadcn/ui — 45 componentes)

Todos los componentes son de Radix UI con estilos Tailwind:

| Categoría | Componentes |
|-----------|-------------|
| Formularios | form, input, label, textarea, checkbox, radio-group, select, slider, input-otp |
| Diálogos | dialog, alert-dialog, sheet, drawer, popover |
| Menús | dropdown-menu, context-menu, menubar, navigation-menu |
| Visualización | card, badge, avatar, tabs, accordion, separator, scroll-area |
| Feedback | toast, toaster, sonner, alert |
| Datos | table, chart, carousel, progress |
| Navegación | breadcrumb, pagination |
| Utilidad | button, skeleton, tooltip, hover-card, aspect-ratio, collapsible, toggle, toggle-group, resizable |

---

## 12. State Management (Zustand)

### `lib/stores/auth-store.ts`

```typescript
interface AuthStore {
  user: User | null
  profile: Profile | null
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  isAdmin: () => boolean          // role === 'admin'
  isCRMUser: () => boolean        // role in ['admin', 'ejecutivo', 'vendedor']
}
```

### `lib/stores/cart-store.ts`

```typescript
interface CartStore {
  items: CartItem[]
  addCourse: (item: CartCourseItem) => void       // Previene duplicados
  addTicket: (item: CartTicketItem) => void        // Permite múltiples
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

// Persistencia en localStorage como 'otec-cart-storage'
```

### Tipos del Carrito

```typescript
interface CartCourseItem {
  type: 'course'
  id: string
  title: string
  price: number
  quantity: number
  image_url?: string
}

interface CartTicketItem {
  type: 'ticket'
  id: string
  eventId: string
  eventTitle: string
  sectionId?: string
  sectionName?: string
  seatNumber?: string
  price: number
  quantity: number
}

type CartItem = CartCourseItem | CartTicketItem
```

---

## 13. Edge Functions

Ubicadas en `supabase/functions/` y desplegadas en Deno (Supabase Edge Runtime).

### `create-transaction/index.ts`
- **Trigger**: POST request desde checkout
- **Función**: Inicia una transacción Webpay con Transbank
- **Retorna**: Token de pago y URL de redirección

### `confirm-transaction/index.ts`
- **Trigger**: GET request después del pago (callback Webpay)
- **Función**: Confirma la transacción con Transbank, actualiza la orden en BD, crea enrollments/tickets
- **Retorna**: Estado de la transacción

### `send-notification/index.ts`
- **Trigger**: Llamada interna (post-compra, post-enrollment)
- **Función**: Envía notificaciones por email a usuarios
- **Retorna**: Estado del envío

Todas las Edge Functions implementan CORS headers:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}
```

---

## 14. API Routes

### `app/api/checkout/create-order/route.ts`

**Método**: POST
**Auth**: Bearer token requerido
**Body**:
```json
{
  "items": [
    { "type": "course", "id": "uuid", "price": 50000, "quantity": 1 },
    { "type": "ticket", "eventId": "uuid", "sectionId": "uuid", "price": 25000, "quantity": 2 }
  ]
}
```
**Respuesta**:
```json
{
  "orderId": "uuid",
  "total": 100000,
  "status": "pending"
}
```

---

## 15. Sistema de Diseño

### Fuente
- **Familia**: Montserrat (Google Fonts)
- **Pesos**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Paleta de Colores

| Variable CSS | Valor | Uso |
|-------------|-------|-----|
| `--primary` | #4A90E2 (blue) | Color principal, CTAs |
| `--secondary` | #50C878 (green) | Éxito, SENCE, confirmaciones |
| `--accent` | #FF7F50 (coral) | Alertas, destacados |
| `--background` | #F7F9FC | Fondo de página |
| `--foreground` | #2D3748 | Texto principal |
| `--card` | #FFFFFF | Fondo de tarjetas |
| `--muted` | #EDF2F7 | Fondos secundarios |
| `--muted-foreground` | #718096 | Texto secundario |
| `--border` | #E2E8F0 | Bordes |
| `--destructive` | #E53E3E (red) | Errores, eliminaciones |

### Efectos y Utilidades

```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-primary { background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%) }
.gradient-secondary { background: linear-gradient(135deg, #50C878 0%, #38A060 100%) }
.text-gradient { background: linear-gradient(135deg, #4A90E2, #50C878); -webkit-background-clip: text }
```

### Sistema de Espaciado
- Basado en múltiplos de 8px (Tailwind estándar)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

---

## 16. Naming Conventions

### Archivos y Carpetas

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Páginas Next.js | kebab-case | `educacion-continua/page.tsx` |
| Componentes React | PascalCase en archivo | `header.tsx` → export `CorporateHeader` |
| Stores Zustand | kebab-case con sufijo | `auth-store.ts` |
| Tipos TypeScript | PascalCase | `Course`, `EnrollmentWithCourse` |
| Utilidades | camelCase | `utils.ts` → `cn()` |
| Migraciones SQL | timestamp + descripción | `20260320212322_create_otec_schema_fixed.sql` |
| Edge Functions | kebab-case en carpeta | `create-transaction/index.ts` |

### Base de Datos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Tablas | snake_case plural | `quiz_attempts`, `order_items` |
| Columnas | snake_case | `created_at`, `is_published` |
| Índices | `idx_tabla_columna` | `idx_enrollments_user` |
| Políticas RLS | Frase descriptiva entre comillas | `"Users can view own profile"` |
| Enums | snake_case | `user_role`, `course_modality` |
| PKs | siempre `id` uuid | `id uuid PRIMARY KEY` |
| FKs | `tabla_singular_id` | `course_id`, `user_id` |
| Timestamps | `_at` suffix | `created_at`, `completed_at` |
| Booleans | `is_` o `has_` prefix | `is_published`, `has_seating` |

### Componentes React

```
- Componentes UI reutilizables: components/ui/
- Componentes de negocio: components/corporate/
- Componentes de páginas específicas: dentro de app/[ruta]/
- Hooks personalizados: hooks/
```

### Variables de Entorno

```
NEXT_PUBLIC_*    → Accesibles en cliente y servidor
Sin prefijo      → Solo en servidor (SSR / API routes)
```

---

## 17. Variables de Entorno

Archivo `.env` (y `.env.local` para desarrollo):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key-jwt]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]  # Solo servidor

# Transbank (opcional - para pagos reales)
TRANSBANK_API_KEY=[api-key]
TRANSBANK_COMMERCE_CODE=[commerce-code]
```

---

## 18. Flujos de Usuario

### Flujo: Compra de Curso (Estudiante)

```
1. /cursos → Browse catálogo
2. /cursos/[slug] → Ver detalle del curso
3. Click "Agregar al carrito" → cart-store.addCourse()
4. /checkout → Revisar carrito
5. Click "Pagar" → POST /api/checkout/create-order
6. Redirección a Webpay → Edge Function create-transaction
7. Pago en Transbank
8. Callback → Edge Function confirm-transaction
9. Enrollment creado en BD
10. /lumen → Ver curso en dashboard
```

### Flujo: Aprendizaje (LMS)

```
1. /lumen → Dashboard con cursos inscritos
2. Click curso → /lumen/cursos/[courseId]
3. Ver lista de módulos y lecciones
4. Click lección → Reproduce video / muestra contenido
5. lesson_progress actualizado en BD (completado + posición)
6. Barra de progreso del enrollment actualizada
7. Al completar todas las lecciones → Certificado disponible
```

### Flujo: Gestión CRM (Vendedor)

```
1. /auth/login → Iniciar sesión con role vendedor/ejecutivo
2. /crm → Dashboard con KPIs del pipeline
3. Ver deals en columnas Kanban por status
4. Click deal → Ver detalle (empresa, valor, historial)
5. Crear nota con editor TipTap
6. Crear tarea con fecha límite
7. Mover deal a siguiente status
```

---

## 19. Credenciales y Accesos

### Crear Usuario Estudiante
1. Ir a `/auth/register`
2. Completar formulario (nombre, email, contraseña)
3. El rol por defecto es `student`
4. Acceder a `/lumen`

### Crear Usuario CRM (Vendedor / Ejecutivo / Admin)
1. Registrar en `/auth/register`
2. Ejecutar en Supabase SQL Editor:
```sql
UPDATE profiles
SET role = 'vendedor'  -- o 'ejecutivo' o 'admin'
WHERE email = 'tu@email.com';
```
3. Acceder a `/crm`

### Usuarios de Prueba (Seed)
La migración `seed_test_users.sql` crea datos de ejemplo:
- 5 cursos publicados
- 2 empresas de ejemplo
- 2 eventos publicados

Los usuarios deben crearse manualmente a través de Supabase Auth o el registro en la app.

---

## 20. Build y Despliegue

### Comandos Disponibles

```bash
npm run dev        # Servidor de desarrollo en http://localhost:3000
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # Verificar ESLint
npm run typecheck  # Verificar TypeScript
```

### Configuración Next.js (`next.config.js`)

```javascript
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}
```

### Configuración Netlify (`netlify.toml`)

Desplegado con `@netlify/plugin-nextjs` para soporte completo de App Router.

### Rutas Generadas en Build

```
17 rutas totales
- 9 rutas estáticas (Static)
- 7 rutas Server-Side (lambda)
- 1 API route
```

### Dependencia Crítica — Compatibilidad

> **IMPORTANTE**: `date-fns` debe mantenerse en `^3.6.0`.
> NO actualizar a v4.x.x ya que `react-day-picker@8.10.1` requiere `^2.28.0 || ^3.0.0`.

---

*Documentación generada el 10 de Abril de 2026*
*Versión del proyecto: 0.1.0*
