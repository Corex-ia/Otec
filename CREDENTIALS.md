# Credenciales de Acceso - OTEC Platform

## 🔑 Usuarios de Prueba

Para acceder a las diferentes secciones de la plataforma, debes crear usuarios con los siguientes roles:

### 1. LUMEN (Sistema de Aprendizaje) 👨‍🎓

**Para acceder a LUMEN, necesitas una cuenta de estudiante:**

1. Ve a: `/auth/register`
2. Crea una cuenta con cualquier email
3. El rol por defecto es `student`
4. Una vez creada, ve a `/lumen` para acceder a tus cursos

**Credenciales Sugeridas:**
- Email: `estudiante@test.com`
- Nombre: `Juan Estudiante`
- Password: `test123456`

---

### 2. CRM / Portal de Vendedores 💼

**Para acceder al CRM, necesitas un usuario con rol de vendedor, ejecutivo o admin:**

**Opción 1: Crear cuenta y actualizar rol manualmente**
1. Crea una cuenta en `/auth/register`
2. Ve al Dashboard de Supabase > Authentication > Users
3. Copia el UUID del usuario
4. Ve a Table Editor > profiles
5. Encuentra el perfil con ese UUID
6. Cambia el campo `role` de `student` a `vendedor`, `ejecutivo` o `admin`

**Opción 2: Usar SQL directo**
```sql
-- Después de crear un usuario en /auth/register, actualiza su rol:
UPDATE profiles
SET role = 'vendedor'
WHERE email = 'vendedor@test.com';
```

**Credenciales Sugeridas:**
- Email: `vendedor@test.com`
- Nombre: `María Vendedora`
- Password: `test123456`
- Rol: `vendedor`

---

### 3. Admin (Acceso Total) 🔐

**Para acceso administrativo completo:**

```sql
-- Después de crear un usuario en /auth/register:
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@test.com';
```

**Credenciales Sugeridas:**
- Email: `admin@test.com`
- Nombre: `Admin OTEC`
- Password: `test123456`
- Rol: `admin`

---

## 📋 Roles y Permisos

### Student (Estudiante)
- ✅ Acceso a `/lumen` (LMS)
- ✅ Ver cursos inscritos
- ✅ Ver progreso de lecciones
- ✅ Descargar certificados
- ✅ Comprar cursos y tickets
- ❌ Acceso CRM

### Vendedor
- ✅ Todo lo de Student
- ✅ Acceso a `/crm`
- ✅ Ver y crear deals (oportunidades)
- ✅ Gestionar tareas
- ✅ Ver empresas
- ✅ Crear notas
- ❌ Gestionar usuarios

### Ejecutivo
- ✅ Todo lo de Vendedor
- ✅ Ver todos los deals
- ✅ Asignar tareas a otros
- ✅ Crear y editar empresas
- ✅ Ver reportes avanzados

### Contable
- ✅ Ver órdenes y pagos
- ✅ Generar reportes financieros
- ❌ Acceso a deals

### Ejecutor
- ✅ Gestionar cursos y contenido
- ✅ Subir lecciones
- ✅ Ver inscripciones
- ❌ Gestión financiera

### Admin
- ✅ **Acceso total a toda la plataforma**
- ✅ Gestionar usuarios y roles
- ✅ Configurar eventos
- ✅ Administrar todo el contenido
- ✅ Ver todos los reportes

---

## 🚀 Inicio Rápido

### 1. Crear Usuario Student (para LUMEN)

```bash
# 1. Ve a la aplicación
http://localhost:3000/auth/register

# 2. Completa el formulario
Email: estudiante@test.com
Nombre: Juan Estudiante
Password: test123456

# 3. Accede a LUMEN
http://localhost:3000/lumen
```

### 2. Crear Usuario CRM (Vendedor)

```bash
# 1. Crea la cuenta
http://localhost:3000/auth/register

Email: vendedor@test.com
Nombre: María Vendedora
Password: test123456

# 2. Actualiza el rol en Supabase Dashboard
# O ejecuta este SQL:
```

```sql
UPDATE profiles
SET role = 'vendedor'
WHERE email = 'vendedor@test.com';
```

```bash
# 3. Accede al CRM
http://localhost:3000/crm
```

---

## 📊 Datos de Prueba

La base de datos incluye:
- ✅ 5 cursos de ejemplo
- ✅ 2 empresas de prueba
- ✅ 2 eventos próximos

Para inscribirte en un curso:
1. Inicia sesión como student
2. Ve a `/cursos`
3. Selecciona un curso
4. Haz clic en "Agregar al carrito"
5. Ve a `/checkout` (o implementa inscripción gratuita directa)

---

## 🔒 Seguridad

**IMPORTANTE:**
- Estas son credenciales de PRUEBA
- NUNCA uses estas contraseñas en producción
- Cambia todos los passwords antes de desplegar
- Los usuarios de prueba deben eliminarse en producción

---

## 🛠️ Troubleshooting

### No puedo acceder a /lumen
- Verifica que iniciaste sesión
- Verifica que tu usuario tiene rol `student` (por defecto al registrarse)

### No puedo acceder a /crm
- Verifica que tu usuario tiene rol `vendedor`, `ejecutivo` o `admin`
- Actualiza el rol en la tabla `profiles` de Supabase

### Olvidé actualizar el rol del usuario
```sql
-- Ver todos los perfiles
SELECT id, email, role FROM profiles;

-- Actualizar rol de un usuario
UPDATE profiles
SET role = 'admin'
WHERE email = 'tu-email@test.com';
```

---

## 📞 Soporte

Si tienes problemas con las credenciales:
1. Verifica que el usuario exista en Supabase Auth
2. Verifica que el perfil exista en la tabla `profiles`
3. Verifica que el rol sea el correcto
4. Intenta cerrar sesión y volver a iniciar sesión
