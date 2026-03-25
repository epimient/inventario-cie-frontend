# Manual de Usuario - Inventario CIE API

**Versión:** 1.0.0  
**Fecha:** Marzo 2026

---

## Índice

1. [Introducción](#introducción)
2. [Iniciar Sesión](#iniciar-sesión)
3. [Navegación](#navegación)
   - [Sidebar](#sidebar-barra-lateral)
   - [Encabezado](#encabezado-header)
   - [Colapsar Sidebar](#colapsar-sidebar)
4. [Dashboard](#dashboard)
5. [Inventario](#inventario)
   - [Equipos](#equipos)
   - [Electrónica](#electrónica)
   - [Robótica](#robótica)
   - [Materiales](#materiales)
6. [Préstamos](#préstamos)
   - [Crear Préstamo](#crear-préstamo)
   - [Devolver Préstamo](#devolver-préstamo)
7. [Prestatarios](#prestatarios)
8. [Movimientos](#movimientos)
9. [Dañados](#dañados)
10. [Reportes](#reportes)
11. [Configuración](#configuración)
12. [Notificaciones](#notificaciones)
13. [Modo Oscuro](#modo-oscuro)
14. [Glosario](#glosario)
15. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

**Inventario CIE API** es un sistema de gestión de activos tecnológicos para el Centro de Innovación Educativa. Permite administrar equipos, componentes electrónicos, robots, materiales de impresión 3D, y gestionar préstamos de items a usuarios autorizados.

### Características principales:
- ✅ Gestión completa de inventario (equipos, electrónica, robótica, materiales)
- ✅ Sistema de préstamos con seguimiento de estados
- ✅ Alertas configurables para stock bajo y préstamos por vencer
- ✅ Reportes y exportación de datos
- ✅ Modo oscuro/claro

---

## Iniciar Sesión

### Pasos:
1. Abre la aplicación en tu navegador
2. Ingresa tu **correo electrónico** y **contraseña**
3. Haz clic en **"Iniciar Sesión"**
4. Serás redirigido al Dashboard

### Credenciales:
- Las credenciales son proporcionadas por el administrador del sistema

### ¿Olvidaste tu contraseña?
- Haz clic en el enlace **"¿Olvidaste tu contraseña?"** en la página de inicio de sesión
- Contacta al administrador del sistema

---

## Navegación

### Sidebar (Barra lateral izquierda)

El sidebar contiene el menú principal de navegación:

| Icono | Nombre | Descripción |
|-------|--------|-------------|
| 📊 | **Dashboard** | Vista general del sistema |
| 📦 | **Inventario** | Submenú con: |
| | - Equipos | Computadoras y accesorios |
| | - Electrónica | Componentes electrónicos |
| | - Robótica | Robots y componentes |
| | - Materiales | Filamentos y resinas |
| 📋 | **Préstamos** | Gestión de préstamos |
| 👥 | **Prestatarios** | Registro de usuarios |
| 📜 | **Movimientos** | Historial del sistema |
| ⚠️ | **Dañados** | Equipos con problemas |
| 📈 | **Reportes** | Exportar datos |
| ⚙️ | **Configuración** | Ajustes del sistema |

#### Colapsar Sidebar

Para obtener más espacio de visualización, puedes colapsar el sidebar:

1. Haz clic en el **botón de flecha** ubicado en la parte superior del sidebar ( junto al logo)
2. El sidebar se colapsará mostrando solo los iconos
3. Para expandirlo, haz clic nuevamente en el mismo botón

**Atajo:** También puedes usar el botón de menú (☰) en el header en dispositivos móviles.

### Encabezado (Header)

En la parte superior derecha encontrarás:

| Elemento | Función |
|----------|---------|
| 🔔 | **Notificaciones** - Ver alertas y avisos |
| 🌙/☀️ | **Modo oscuro** - Alternar tema |
| 👤 | **Usuario** - Perfil y cerrar sesión |

---

## Dashboard

El Dashboard es la página principal que muestra una visión general del sistema.

### Alertas superiores (3 columnas):

1. **Préstamos Vencidos** (rojo)
   - Muestra préstamos que ya pasaron su fecha límite
   - Haz clic en "Ver Detalles" para ir a la lista

2. **Stock Bajo** (amarillo)
   - Muestra materiales críticos con poco stock
   - Haz clic en "Reabastecer" para ir a materiales

3. **Mantenimiento** (azul)
   - Equipos programados para revisión
   - Haz clic en "Ver Calendario" para más detalles

### Tarjetas de estadísticas:

- **Total Equipos** - Cantidad total de equipos registrados
- **Electrónica** - Componentes electrónicos en inventario
- **Robots Activos** - Robots disponibles
- **Tipos Material** - Variedades de materiales
- **Préstamos Hoy** - Préstamos realizados hoy

### Estado de Equipos:

Muestra una barra visual con:
- **Disponibles** - Equipos listos para préstamo
- **En Uso** - Equipos actualmente en uso interno
- **Prestados** - Equipos prestados a usuarios
- **Dañados** - Equipos que necesitan reparación

### Estado de Préstamos:

Muestra tarjetas con:
- **Activos** - Préstamos vigentes
- **Devueltos** - Total histórico de devoluciones
- **Vencidos** - Préstamos fuera de fecha
- **Por Vencer** - Préstamos que vencen en 7 días

### Botón flotante (escanear QR):

En la esquina inferior derecha hay un botón flotante para escanear códigos QR de equipos (función futura).

---

## Inventario

El inventario se divide en 4 secciones accesibles desde el menú desplegable "Inventario":

### Equipos

Página para gestionar equipos de cómputo y accesorios.

#### Características:
- **Lista de equipos** con código, nombre, marca y estado
- **Filtros por estado:**
  - Todos
  - Disponibles
  - En Uso
  - Prestados
  - Mantenimiento
  - Dañados
- **Búsqueda** por nombre, código o marca
- **Paginación** - 20 elementos por página

#### Acciones:
- **Nuevo Equipo** - Crear nuevo equipo
- **Editar** - Modificar equipo existente
- **Eliminar** - Borrar equipo (solo admins)
- **Exportar** - Descargar lista (botón en toolbar)

#### Estados de equipo:
| Estado | Color | Descripción |
|--------|-------|-------------|
| Disponible | Verde | Listo para préstamo |
| En Uso | Amarillo | Usando internamente |
| Prestado | Gris | Prestado a usuario |
| Mantenimiento | Amarillo | En reparación |
| Dañado | Rojo | Necesita reparación |

---

### Electrónica

Gestión de componentes electrónicos.

#### Filtros por estado:
- Todos
- Disponibles (tienen stock y no están en uso)
- En Uso
- Agotados (sin stock)

#### Información mostrada:
- Nombre del componente
- Descripción
- Stock disponible
- Cantidad en uso
- Total

---

### Robótica

Gestión de robots y componentes de robótica.

#### Filtros por estado:
- Todos
- Disponibles
- En Uso
- Fuera de Servicio

#### Información mostrada:
- Nombre del robot
- Cantidad disponibles
- Cantidad en uso
- Cantidad fuera de servicio
- Total

---

### Materiales

Gestión de materiales de impresión 3D (filamentos, resinas).

#### Filtros por categoría:
- Todos
- Filamento
- Resina
- Otros

#### Información mostrada:
- Color/Tipo
- Categoría
- Stock
- En Uso
- Total
- Estado (badge)

#### Estados de stock:
| Estado | Color | Descripción |
|--------|-------|-------------|
| Disponible | Verde | Stock normal |
| Stock bajo | Amarillo | Stock ≤ 5 unidades |
| Agotado | Rojo | Sin stock |

---

## Préstamos

### Crear Préstamo

#### Pasos:
1. Navega a **Préstamos**
2. Haz clic en **"Nuevo Préstamo"**
3. Selecciona el **Prestatario** (usuario que recibe)
4. Selecciona el **Tipo de Item** (equipo, electrónica, robótica o material)
5. Selecciona el **Item** específico a prestar
6. Configura la **Fecha Límite** (máximo 30 días)
7. Agrega **Observaciones** si es necesario
8. Haz clic en **"Crear Préstamo"**

#### Validaciones:
- El prestatario debe estar activo en el sistema
- Solo se muestran items con estado "Disponible"
- La fecha límite no puede exceder 30 días desde hoy

### Devolver Préstamo

#### Pasos:
1. Navega a **Préstamos**
2. Busca el préstamo en la lista (puede usar filtros)
3. Haz clic en el botón **"Devolver"** (icono de deshacer)
4. El item vuelve a estar disponible automáticamente

### Historial de Préstamos

La página de préstamos muestra:

#### Filtros por estado:
- **Todos** - Todos los préstamos
- **Activos** - Préstamos vigentes
- **Vencidos** - Préstamos fuera de fecha
- **Devueltos** - Préstamos completados

#### Información de cada préstamo:
- ID del préstamo
- Nombre del prestatario
- Item prestado
- Fecha del préstamo
- Fecha límite
- Estado actual

#### Estados de préstamo:
| Estado | Color | Descripción |
|--------|-------|-------------|
| Activo | Amarillo | Préstamo vigente |
| Devuelto | Verde | Préstamo completado |
| Vencido | Rojo | Pasó fecha límite |

---

## Prestatarios

Página para gestionar los usuarios que pueden recibir préstamos.

### ¿Para qué sirve?
Los prestatarios son las personas autorizadas para recibir items en préstamo. Cada prestatario debe estar registrado en el sistema para poder realizar un préstamo.

### Características:
- **Lista de prestatarios** con nombre, cédula, teléfono, correo y dependencia
- **Búsqueda** por nombre, cédula o dependencia
- **Filtros** por estado (Activo/Inactivo)
- **Paginación** - 20 prestatarios por página

### Acciones:
- **Nuevo Prestatario** - Crear nuevo registro
- **Editar** - Modificar datos del prestatario
- **Eliminar** - Inhabilitar prestatario (solo admins)

### Estados:
| Estado | Color | Descripción |
|--------|-------|-------------|
| Activo | Verde | Puede recibir préstamos |
| Inactivo | Rojo | No puede recibir préstamos |

### Información de cada prestatario:
- **Nombre** - Nombre completo
- **Cédula** - Identificación
- **Teléfono** - Contacto
- **Email** - Correo electrónico
- **Dependencia** - Área o departamento al que pertenece

---

## Movimientos

Página para visualizar el historial de todos los movimientos del sistema.

### ¿Qué muestra?
- Todos los cambios de estado de items (disponible → prestado, prestado → devuelto)
- Historial de préstamos y devoluciones
- Movimientos de stock

### Filtros disponibles:
- **Todos** - Todos los movimientos
- **Préstamos** - Solo salidas de items
- **Devoluciones** - Solo retornos de items

### Información de cada movimiento:
- Tipo de movimiento (préstamo/devolución)
- Item afectado
- Usuario que realizó la acción
- Fecha y hora

### Uso típico:
1. Investigar qué usuario tiene un item específico
2. Revisar el historial de un equipo
3. Auditar movimientos del sistema

---

## Dañados

Página para visualizar equipos que requieren atención.

### Tarjetas de resumen:
- **Dañados** - Equipos con estado "dañado"
- **En Mantenimiento** - Equipos en reparación
- **Fuera de Servicio** - Robots no disponibles

### Lista de items dañados:
Muestra todos los equipos con problemas, incluyendo:
- Tipo (equipo/robot)
- Código
- Nombre
- Descripción
- Estado

---

## Reportes

Página para exportar datos del sistema.

### Opciones de exportación:

1. **Backup Completo (JSON)**
   - Descarga todos los datos del sistema
   - Incluye: equipos, electrónica, robótica, materiales, préstamos
   - Formato: JSON

2. **Resumen Ejecutivo**
   - Descarga estadísticas generales
   - Ideal para presentaciones

3. **Imprimir**
   - Genera vista imprimible del estado actual

### Uso:
1. Haz clic en el botón de la opción deseada
2. El archivo se descargará automáticamente
3. Se muestra confirmación al completar

---

## Configuración

Página para administrar las alertas y configuración del sistema (solo administradores).

### Acceso:
Al navegar a **Configuración**, se abre automáticamente un modal con todas las opciones.

### Estructura del Modal:

Las configuraciones se muestran organizadas por categorías:

1. **Alertas de Stock** - Configuraciones relacionadas con el inventario mínimo
2. **Alertas de Préstamos** - Configuraciones de vencimiento de préstamos
3. **Alertas de Equipos** - Configuraciones de equipos dañados
4. **Alertas de Electrónica** - Configuraciones de componentes electrónicos
5. **Alertas de Robótica** - Configuraciones de robots

### Cómo editar:
1. Cada configuración muestra su valor actual
2. Modifica el número en el campo de texto
3. Haz clic en el botón de **Guardar** (💾) para aplicar cambios
4. El sistema guardará automáticamente en la base de datos

### Configuraciones típicas:
- Stock mínimo para alertar
- Días antes de alertar préstamos por vencer
- Límite de días de préstamo
- Máximo préstamos por usuario
- Umbrales de stock por categoría

### Nota:
Las configuraciones mostradas dependen de las definidas en el backend. Si no aparece alguna configuración, contacta al administrador del sistema.

---

## Notificaciones

Sistema de alertas en el header.

### Cómo acceder:
1. Haz clic en el **icono de campana** en el header
2. Se despliega un panel con notificaciones

### Tipos de notificaciones:
- ⚠️ **Advertencia** - Préstamos por vencer, stock bajo
- ❌ **Error** - Stocks agotados, préstamos vencidos
- ✅ **Éxito** - Préstamos devueltos, confirmaciones

### Características:
- Contador de notificaciones no leídas
- Indicador visual de notificaciones nuevas
- Click en notificación para ver detalles

---

## Modo Oscuro

### Cómo activar:
Haz clic en el **icono de sol/luna** en el header.

- ☀️ **Sol** - Modo claro (default)
- 🌙 **Luna** - Modo oscuro

### Características:
- Se mantiene la preferencia al navegar
- Colores adaptados para reducir fatiga visual
- Tema profesional con colores suaves

---

## Glosario

| Término | Descripción |
|----------|-------------|
| **API** | Interfaxe de programación de aplicaciones |
| **CRUD** | Crear, Leer, Actualizar, Eliminar |
| **Dashboard** | Panel principal con resumen |
| **Préstamo** | Asignación temporal de un item |
| **Prestatario** | Usuario que recibe un préstamo |
| **Stock** | Cantidad disponible en inventario |
| **Inventario** | Registro de todos los activos |

---

## Preguntas Frecuentes

### ¿Cómo obtengo acceso al sistema?
Contacta al administrador del sistema para que te cree una cuenta.

### ¿Puedo prestar más de un item a la vez?
Sí, pero cada item requiere un préstamo separado.

### ¿Qué pasa si no devuelvo a tiempo?
El préstamo se marcará como "vencido" y aparecerá en las alertas.

### ¿Cómo reporto un equipo dañado?
Los equipos dañados aparecen automáticamente en la sección "Dañados". También puedes contactar al administrador.

### ¿Puedo exportar los datos?
Sí, ve a la sección "Reportes" y elige el formato de exportación.

---

## Soporte

Para dudas o problemas:
- Email: soporte@cie.edu
- Documentación técnica: docs/MANUAL_TECNICO.md

---

**© 2026 Inventario CIE API - Centro de Innovación Educativa**
