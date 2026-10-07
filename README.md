# OTEC - El poder para crear

Plataforma integral de capacitación y formación profesional en Chile. Sistema completo que incluye sitio web público, LMS (LUMEN), CRM, gestión de eventos y e-commerce.

## Características Principales

### 🎓 Sistema de Gestión de Aprendizaje (LMS - LUMEN)
- Cursos con módulos y lecciones
- Soporte para videos, contenido H5P, quizzes y texto
- Seguimiento de progreso en tiempo real
- Generación automática de certificados en PDF
- Inscripciones individuales y corporativas

### 💼 CRM Integrado
- Pipeline de ventas con estados (negociación, contrato, ejecución, facturado, cerrado)
- Gestión de empresas y contactos
- Sistema de tareas asignables
- Notas tipo Notion con editor TipTap
- Historial completo de interacciones
- Control de acceso por roles (admin, ejecutivo, vendedor, contable, ejecutor)

### 🎫 Gestión de Eventos
- Eventos con capacidad y asientos configurables
- Sistema de ticketing con códigos QR
- Mapas de asientos interactivos
- Integración con carrito de compras

### 🛒 E-commerce
- Carrito de compras con persistencia
- Integración con Webpay (preparada para transbank-sdk-js)
- Gestión de órdenes y estados
- Compra de cursos y tickets

### 🏆 Certificación SENCE
- Cursos certificados con código SENCE
- Filtrado y búsqueda por SENCE
- Información sobre bonificaciones

## Tecnologías

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Estado**: Zustand
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Backend**: Supabase Edge Functions (Deno)
- **Editor**: TipTap
- **Calendario**: react-big-calendar
- **PDFs**: jsPDF + html2canvas
- **Fechas**: date-fns

## Estructura del Proyecto

```
.
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Página de inicio
│   ├── cursos/                  # Catálogo y detalles de cursos
│   ├── eventos/                 # Listado y detalles de eventos
│   ├── empresas/                # Soluciones empresariales
│   ├── educacion-continua/      # Educación continua
│   ├── sence/                   # Información SENCE
│   ├── nosotros/                # Sobre nosotros
│   ├── contacto/                # Formulario de contacto
│   ├── checkout/                # Proceso de pago
│   ├── auth/                    # Login y registro
│   ├── lumen/                   # LMS para estudiantes
│   └── crm/                     # CRM para vendedores
├── components/
│   ├── ui/                      # Componentes shadcn/ui
│   └── corporate/               # Header, Footer, Layout
├── lib/
│   ├── supabase/               # Cliente Supabase
│   └── stores/                  # Zustand stores
├── types/                       # TypeScript types
├── supabase/
│   ├── migrations/             # Migraciones SQL
│   └── functions/              # Edge Functions
└── public/                      # Archivos estáticos
```

## Configuración

### Prerequisitos

- Node.js 18+
- Cuenta de Supabase

### Variables de Entorno

Las variables de entorno ya están configuradas en `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu_key]
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## 🔑 Credenciales de Acceso

Ver **[CREDENTIALS.md](./CREDENTIALS.md)** para información detallada sobre usuarios de prueba.

### Acceso Rápido

#### Para LUMEN (Estudiantes):
1. Registrarse en `/auth/register`
2. Usar cualquier email (ej: `estudiante@test.com`)
3. El rol por defecto es `student`
4. Acceder a `/lumen`

#### Para CRM (Vendedores):
1. Registrarse en `/auth/register`
2. Actualizar rol en Supabase Dashboard:
   ```sql
   UPDATE profiles SET role = 'vendedor' WHERE email = 'tu-email@test.com';
   ```
3. Acceder a `/crm`

#### Para Admin (Acceso Total):
1. Registrarse en `/auth/register`
2. Actualizar rol a admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@test.com';
   ```
3. Acceso completo a toda la plataforma

### Datos de Prueba
- ✅ 5 cursos de ejemplo
- ✅ 2 empresas demo
- ✅ 2 eventos próximos

## Base de Datos

### Esquema

La base de datos incluye:

- **Usuarios y Empresas**: profiles, companies
- **Cursos**: courses, modules, lessons, quiz_questions, quiz_answers
- **Inscripciones**: enrollments, company_enrollments, lesson_progress, certificates
- **CRM**: deals, tasks, notes
- **Eventos**: events, ticket_sections, tickets
- **E-commerce**: orders, order_items

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas basadas en:
- Autenticación (usuarios autenticados vs anónimos)
- Roles (admin, ejecutivo, vendedor, student)
- Ownership (los usuarios solo pueden ver/editar sus propios datos)

### Migraciones

Las migraciones ya están aplicadas en tu instancia de Supabase. Para aplicar en otra instancia, usa:

```bash
supabase db push
```

## Edge Functions

### create-transaction
Crea una orden de compra y prepara la transacción de Webpay.

**Endpoint**: `/functions/v1/create-transaction`
**Método**: POST
**Auth**: Requiere JWT

```typescript
{
  items: CartItem[]
}
```

### confirm-transaction
Confirma el pago, crea inscripciones/tickets y envía notificaciones.

**Endpoint**: `/functions/v1/confirm-transaction`
**Método**: POST

```typescript
{
  orderId: string,
  status: 'success' | 'failed',
  transactionId: string
}
```

### send-notification
Envía notificaciones por email (preparada para integración con Resend).

**Endpoint**: `/functions/v1/send-notification`
**Método**: POST

```typescript
{
  type: 'order_confirmation' | 'task_assigned' | 'certificate_issued',
  orderId?: string,
  userId: string
}
```

## Roles y Permisos

### student
- Ver cursos públicos
- Inscribirse en cursos
- Acceder a LUMEN
- Comprar cursos y tickets
- Ver sus certificados

### vendedor
- Todo lo de student
- Acceso al CRM
- Crear y gestionar deals
- Crear tareas
- Ver empresas

### ejecutivo
- Todo lo de vendedor
- Gestionar empresas
- Ver todas las tareas
- Asignar tareas

### contable
- Ver órdenes y pagos
- Generar reportes financieros

### ejecutor
- Gestionar cursos y contenido
- Subir lecciones
- Ver inscripciones

### admin
- Acceso completo a toda la plataforma
- Gestionar usuarios y roles
- Configurar eventos
- Administrar todo el contenido

## Flujos Principales

### Compra de Curso

1. Usuario navega catálogo
2. Agrega curso al carrito
3. Va a checkout
4. Si no está logueado, se redirige a login
5. Se crea orden en estado "pending"
6. Se redirige a Webpay
7. Webpay procesa pago
8. Edge function confirma transacción
9. Se crea enrollment automáticamente
10. Usuario recibe confirmación

### Progreso de Curso

1. Usuario accede a LUMEN
2. Ve sus cursos inscritos
3. Selecciona curso
4. Ve módulos y lecciones
5. Abre lección
6. Para videos: se guarda posición cada 5 segundos
7. Al completar todas las lecciones
8. Se genera certificado PDF
9. Se guarda en Supabase Storage
10. Usuario puede descargar

### Gestión de Deal (CRM)

1. Vendedor crea nuevo deal
2. Asigna a empresa
3. Mueve por pipeline (kanban)
4. Crea tareas asociadas
5. Agrega notas
6. Al cerrar deal:
   - Cambia estado a "cerrado"
   - Se registra en métricas
   - Se calcula comisión (si aplica)

## Personalización

### Diseño

El sistema de diseño está basado en:
- Font: Montserrat
- Colores (en `globals.css`):
  - Primary: #4A90E2 (azul)
  - Secondary: #50C878 (verde)
  - Accent: #FF7F50 (coral)

Para cambiar colores, edita las variables CSS en `app/globals.css`.

### Agregar Nuevo Tipo de Lección

1. Agrega tipo en enum `lesson_type` (migration)
2. Actualiza TypeScript type en `types/database.ts`
3. Crea componente en `components/lms/`
4. Integra en lesson viewer

### Agregar Nuevo Estado de Deal

1. Agrega estado en enum `deal_status` (migration)
2. Actualiza type en `types/database.ts`
3. Actualiza componente Kanban
4. Ajusta lógica de transiciones

## Despliegue

### Netlify

El proyecto está configurado para Netlify con `netlify.toml`.

```bash
npm run build
# Deploy automático con Netlify
```

### Vercel

```bash
vercel --prod
```

### Variables requeridas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Próximas Mejoras

- [ ] Integración completa con Webpay (transbank-sdk-js)
- [ ] Sistema de notificaciones por email (Resend)
- [ ] Reportes y analytics avanzados
- [ ] Exportación de datos a Excel
- [ ] Sistema de mensajería interna
- [ ] Videoconferencias integradas (Zoom/Meet)
- [ ] Gamificación (badges, puntos)
- [ ] Modo oscuro completo
- [ ] PWA para mobile

## Soporte

Para preguntas o problemas:
- Email: contacto@otec.cl
- Teléfono: +56 9 1234 5678

## Licencia

© 2024 OTEC. Todos los derechos reservados.
