// ============================================
// SCHEMAS DE VALIDACIÓN ZOD
// Tipos seguros para toda la aplicación
// ============================================

import { z } from 'zod';

// ============ USUARIO ============
export const CreateUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    name: z.string().min(2, 'Nombre muy corto'),
    phone: z.string().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

// ============ DIRECCIÓN ============
export const AddressSchema = z.object({
    name: z.string().min(2, 'Nombre del destinatario requerido'),
    street: z.string().min(5, 'Dirección muy corta'),
    extNumber: z.string().min(1, 'Número exterior requerido'),
    intNumber: z.string().optional(),
    colony: z.string().min(3, 'Colonia requerida'),
    city: z.string().min(2, 'Ciudad requerida'),
    state: z.string().min(2, 'Estado requerido'),
    zipCode: z.string().regex(/^\d{5}$/, 'Código postal inválido (5 dígitos)'),
    country: z.string().default('México'),
    phone: z.string().min(10, 'Teléfono inválido'),
    isDefault: z.boolean().default(false),
});

// ============ PERFIL FISCAL ============
export const InvoiceProfileSchema = z.object({
    rfc: z.string()
        .min(12, 'RFC muy corto')
        .max(13, 'RFC muy largo')
        .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido'),
    razonSocial: z.string().min(3, 'Razón social muy corta'),
    regimenFiscal: z.string().min(3, 'Régimen fiscal requerido'),
    usoCfdi: z.string().min(3, 'Uso de CFDI requerido'),
    codigoPostal: z.string().regex(/^\d{5}$/, 'Código postal inválido'),
    email: z.string().email('Email para factura inválido'),
});

// ============ PRODUCTO ============
export const CreateProductSchema = z.object({
    sku: z.string().min(3, 'SKU muy corto'),
    name: z.string().min(3, 'Nombre muy corto'),
    slug: z.string().min(3, 'Slug muy corto').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
    description: z.string().optional(),
    price: z.number().positive('Precio debe ser positivo'),
    comparePrice: z.number().positive().optional(),
    costPrice: z.number().positive().optional(),
    stock: z.number().int().min(0, 'Stock no puede ser negativo'),
    weight: z.number().positive().optional(),
    categoryId: z.string().cuid('ID de categoría inválido'),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// ============ CARRITO ============
export const AddToCartSchema = z.object({
    productId: z.string().cuid('ID de producto inválido'),
    variantId: z.string().cuid().optional(),
    quantity: z.number().int().positive('Cantidad debe ser positiva'),
});

export const UpdateCartItemSchema = z.object({
    quantity: z.number().int().positive('Cantidad debe ser positiva'),
});

// ============ CHECKOUT ============
export const CheckoutSchema = z.object({
    addressId: z.string().cuid('ID de dirección inválido'),
    shippingMethod: z.enum(['LOCAL', 'STANDARD', 'EXPRESS', 'PICKUP']),
    couponCode: z.string().optional(),
    customerNote: z.string().max(500).optional(),
    requiresInvoice: z.boolean().default(false),
    invoiceProfileId: z.string().cuid().optional(),
});

// ============ PEDIDO ============
export const OrderStatusSchema = z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
]);

export const UpdateOrderSchema = z.object({
    status: OrderStatusSchema.optional(),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().url().optional(),
    adminNote: z.string().optional(),
});

// ============ RESEÑA ============
export const CreateReviewSchema = z.object({
    productId: z.string().cuid('ID de producto inválido'),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(100).optional(),
    comment: z.string().max(1000).optional(),
});

// ============ CUPÓN ============
export const CreateCouponSchema = z.object({
    code: z.string().min(3).max(20).toUpperCase(),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
    value: z.number().positive(),
    minPurchase: z.number().positive().optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    validFrom: z.coerce.date(),
    validUntil: z.coerce.date(),
});

export const ApplyCouponSchema = z.object({
    code: z.string().min(3, 'Código muy corto'),
});

// ============ BÚSQUEDA ============
export const SearchSchema = z.object({
    query: z.string().min(2, 'Búsqueda muy corta'),
    categoryId: z.string().cuid().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(50).default(12),
});

// ============ PAGINACIÓN ============
export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============ TYPES INFERIDOS ============
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type InvoiceProfileInput = z.infer<typeof InvoiceProfileSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
