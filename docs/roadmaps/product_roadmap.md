# Sellast POS/ERP - Hoja de Ruta del Producto (Product Roadmap)

Este documento define la estrategia, alcance y prioridades para transformar Sellast en un sistema POS/ERP Enterprise completo.

## 1. Backlog Priorizado (Epics & Features)

### 🟥 FASE 1: Core Operativo (P0 - Imprescindible)
*Estas funcionalidades son críticas para que el negocio pueda operar legal y funcionalmente.*

- **[POS-01] Caja y Turnos**: Apertura/Cierre de caja, Arqueos ciegos, Control de efectivo (X/Z), Fondos y Retiros.
- **[POS-02] Motor de Ventas**: Carrito POS robusto, múltiples métodos de pago (Mixtos), Descuentos (ítem/global), Tickets con QR.
- **[INV-01] Inventario Multi-almacén**: Stock en tiempo real, Kardex de movimientos, Transferencias simples.
- **[CAT-01] Catálogo Base**: Productos simples y con variantes, Precios, Códigos de barra, Categorías.
- **[ADM-01] Roles y Permisos (RBAC)**: Roles de Cajero, Gerente, Admin. Auditoría de acciones sensibles.
- **[FIS-01] Facturación MX (Básica)**: Configuración de impuestos (IVA), Datos fiscales cliente, Solicitar factura.

### 🟨 FASE 2: Logística y eCommerce (P1 - Importante)
*Expansión a venta en línea y gestión eficiente de la cadena de suministro.*

- **[ECO-01] Gestión de Pedidos Web**: Sincronización de pedidos, Estados (Prep/Enviado), Notas.
- **[LOG-01] Envíos y Guías**: Integración Paqueterías (o carga manual), Gestión de Repartidores propios.
- **[COM-01] Compras y Proveedores**: Órdenes de compra, Recepción de mercancía (Entrada de stock), Costos.
- **[REP-01] BI & Reportes**: Dashboard financiero, Top ventas, Margen de utilidad, Reporte de impuestos.

### 🟦 FASE 3: Fidelización y Escalamiento (P2 - Deseable)
*Herramientas para crecer la base de clientes y optimizar operaciones.*

- **[CRM-01] Fidelización**: Puntos por compra, Historial detallado, Segmentación.
- **[MKT-01] Promociones**: Cupones avanzados, Reglas de descuento automáticas (2x1).
- **[INT-01] Integraciones**: Notificaciones WhatsApp/Email automáticas, Webhooks.

---

## 2. Especificaciones Funcionales por Módulo

### A. Módulo de Caja (POS Ops)
**Objetivo**: Controlar el flujo de efectivo y asegurar la integridad de las ventas diarias.
*   **Pantallas**: `/admin/pos/caja` (Dashboard Caja), `/admin/pos/cierre` (Corte).
*   **Acciones**: Abrir Turno (Monto inicial), Registrar Venta, Retiro de Efectivo (Gastos/Sangría), Ingreso, Corte Z (Cierre definitivo).
*   **Reglas de Negocio**:
    *   No se puede vender si la caja está cerrada.
    *   El "Arqueo" es ciego (el cajero cuenta lo que tiene, el sistema compara).
    *   Diferencias > $X requieren autorización de Supervisor.

### B. Módulo de Ventas (POS)
**Objetivo**: Procesar transacciones de venta de forma rápida y flexible.
*   **Pantallas**: `/admin/pos` (Terminal de Venta).
*   **Funcionalidades**:
    *   Búsqueda elástica (Nombre, SKU, EAN).
    *   Cliente: "Mostrador" (default) o búsqueda/creación de cliente.
    *   Pagos Mixtos: Ej. $500 Efectivo + $200 Tarjeta.
    *   Tickets: Impresión térmica (58mm/80mm) y Envío por Email.

### C. Compras y Abastecimiento
**Objetivo**: Gestionar la entrada de mercancía y el costo de ventas (COGS).
*   **Pantallas**: `/admin/compras`, `/admin/proveedores`.
*   **Flujo**:
    1.  Crear Orden de Compra (OC) estado `Borrador`.
    2.  Enviar a Proveedor -> Estado `Pendiente`.
    3.  Recepción de Mercancía: Conteo y validación -> Estado `Recibido`.
    4.  **Impacto**: Aumenta Stock, Calcula Costo Promedio Ponderado.

### D. Facturación e Impuestos (México)
**Objetivo**: Cumplimiento fiscal CFDI 4.0.
*   **Datos**: RFC, Razón Social, Régimen Fiscal, Código Postal, Uso CFDI.
*   **Flujo**:
    *   Venta POS -> Cliente solicita factura -> Escaneo de Cédula/Ingreso manual.
    *   Timbrado asíncrono (vía API Proveedor PAC).
    *   PDF/XML enviado por correo.

## 3. Criterios de Aceptación Globales
1.  **Integridad de Datos**: El inventario nunca es negativo sin autorización explícita (logueada).
2.  **Trazabilidad**: Todo movimiento de stock o dinero tiene un `user_id`, `timestamp` y `motivo`.
3.  **Performance**: Búsqueda de productos en POS < 200ms.
4.  **UX**: Terminal POS 100% operable con teclado y touch.
