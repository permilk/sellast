# Sellast POS/ERP - Arquitectura Técnica & Diseño

Este documento describe la arquitectura, estructura de archivos y diseño de seguridad para la implementación del sistema.

## 1. Stack Tecnológico
- **Frontend/Fullstack**: Next.js 14+ (App Router), React, Tailwind CSS.
- **Base de Datos**: PostgreSQL (via Supabase), Prisma ORM.
- **Autenticación**: Supabase Auth (o NextAuth).
- **Estado Global**: Zustand (para carrito POS y estado de caja).
- **UI Components**: Shadcn/UI (recomendado) o componentes propios con Tailwind.

## 2. Estructura de Proyecto Propuesta (File Tree)

```
src/
├── app/
│   ├── (admin)/                 # Layout autenticado para el panel
│   │   ├── admin/
│   │   │   ├── dashboard/       # KPIs Generales
│   │   │   ├── pos/             # Módulo Punto de Venta
│   │   │   ├── ventas/          # Historial y Devoluciones
│   │   │   ├── productos/       # Catálogo
│   │   │   ├── inventario/      # Stock y Ajustes
│   │   │   ├── compras/         # Proveedores y Órdenes
│   │   │   ├── clientes/        # CRM
│   │   │   └── configuracion/   # Usuarios, Impuestos, Tickets
│   ├── (shop)/                  # Layout público para eCommerce
│   ├── api/                     # Endpoints internos (si server actions no bastan)
│   └── layout.tsx
├── components/
│   ├── ui/                      # Átomos (Botones, Inputs, Cards)
│   ├── pos/                     # Componentes específicos POS (Cart, Numpad, PayModal)
│   ├── shared/                  # Tablas, Modales, Filtros reusables
│   └── layout/                  # Sidebar, Header
├── lib/
│   ├── prisma.ts                # Instancia DB
│   ├── utils.ts                 # Helpers
│   ├── services/                # Lógica de negocio (Service Layer)
│   │   ├── pos.service.ts
│   │   ├── inventory.service.ts
│   │   └── billing.service.ts   # Adaptador Facturación
│   └── hooks/                   # Custom Hooks
└── prisma/
    └── schema.prisma            # Modelo de Datos
```

## 3. Diseño de Seguridad y RBAC

### Modelo de Permisos
Implementar un sistema "Role-Based Access Control" (RBAC) granular.

**Roles:**
1.  **Super Admin**: Acceso total.
2.  **Gerente**: Acceso total a su sucursal, reportes financieros, ajustes de stock.
3.  **Cajero**: Venta POS, Corte de su propia caja, Clientes (lectura).
4.  **Almacenista**: Gestión de inventario, Recepción de compras.

**Middleware de Seguridad:**
Validar permisos en cada Server Action o API Route.
```typescript
// Ejemplo conceptual
if (!user.hasPermission('inventory.adjust')) {
  throw new UnauthorizedError();
}
```

## 4. Flujos Críticos (End-to-End)

### A. Flujo de Venta POS
1.  **Inicio**: Cajero escanea producto o busca manual.
2.  **Validación Stock**: El sistema verifica disponibilidad (warn si bajo stock).
3.  **Carrito**: Se agregan items -> Calculo subtotal, impuestos, descuentos.
4.  **Checkout**: 
    - Selección método pago (Efectivo/Tarjeta).
    - Si Efectivo -> Cálculo de cambio.
5.  **Confirmación**:
    - **DB Transaction**: 
        1. Crear registro `Sale`.
        2. Crear registros `SaleItem`.
        3. Descontar `Inventory` (decremento atómico).
        4. Registrar `CashMovement` (ingreso dinero).
    - **Output**: Generar Ticket (PDF/Print), Limpiar carrito.

### B. Cierre de Caja (Corte Z)
1.  **Solicitud**: Cajero inicia "Cerrar Turno".
2.  **Conteo Ciego**: Cajero ingresa cuánto efectivo tiene físicamente.
3.  **Procesamiento**:
    - Sistema calcula: `Fondo Inicial + Ventas Efectivo + Ingresos - Retiros`.
    - Compara con `Monto Ingresado`.
4.  **Resultado**:
    - Si `Diferencia == 0`: Cierre Exitoso.
    - Si `Diferencia != 0`: Registrar `CashDiscrepancy` y notificar Gerente.
5.  **Finalización**: Cerrar sesión de caja, Generar reporte de turno.

## 5. Auditoría
Todas las tablas críticas (`Inventory`, `CashShift`, `PriceList`) deben tener campos de auditoría o tabla espejo de logs:

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  entity    String   // e.g., "Product"
  entityId  String
  action    String   // "UPDATE_PRICE"
  userId    String
  oldValue  Json?
  newValue  Json?
  createdAt DateTime @default(now())
}
```
