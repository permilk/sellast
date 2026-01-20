// ============================================
// LÓGICA DE NEGOCIO: CÁLCULO DE ENVÍO
// ============================================

import { z } from 'zod';

// Schema de validación para dirección
export const AddressSchema = z.object({
    street: z.string().min(5, 'Dirección muy corta'),
    extNumber: z.string().min(1, 'Número exterior requerido'),
    intNumber: z.string().optional(),
    colony: z.string().min(3, 'Colonia requerida'),
    city: z.string().min(2, 'Ciudad requerida'),
    state: z.string().min(2, 'Estado requerido'),
    zipCode: z.string().regex(/^\d{5}$/, 'Código postal inválido'),
    country: z.string().default('México'),
});

export type AddressInput = z.infer<typeof AddressSchema>;

// Estados dentro de CDMX y área metropolitana
const CDMX_STATES = [
    'Ciudad de México',
    'CDMX',
    'DF',
    'Distrito Federal',
];

const AREA_METROPOLITANA_CITIES = [
    'Naucalpan',
    'Tlalnepantla',
    'Ecatepec',
    'Nezahualcóyotl',
    'Coacalco',
    'Atizapán',
    'Cuautitlán Izcalli',
    'Huixquilucan',
];

// Costos de envío configurables
const SHIPPING_CONFIG = {
    // Envío local propio
    LOCAL: {
        base: 0, // Gratis en CDMX
        freeThreshold: 500, // Gratis arriba de $500
        flatRate: 99, // Si no alcanza el mínimo
    },
    // FedEx Nacional
    STANDARD: {
        base: 149,
        perKg: 15,
        estimatedDays: '3-5 días hábiles',
    },
    // FedEx Express
    EXPRESS: {
        base: 249,
        perKg: 25,
        estimatedDays: '1-2 días hábiles',
    },
    // Recoger en tienda
    PICKUP: {
        base: 0,
        estimatedDays: 'Disponible en 24 hrs',
    },
};

export interface ShippingOption {
    method: 'LOCAL' | 'STANDARD' | 'EXPRESS' | 'PICKUP';
    name: string;
    description: string;
    cost: number;
    estimatedDelivery: string;
    isAvailable: boolean;
}

export interface ShippingCalculation {
    options: ShippingOption[];
    isLocalDelivery: boolean;
    address: AddressInput;
}

/**
 * Calcula las opciones de envío basándose en la dirección del cliente
 * 
 * @param address - Dirección de envío validada
 * @param cartTotal - Total del carrito (para envío gratis)
 * @param totalWeight - Peso total en kg (para cálculo FedEx)
 * @returns Opciones de envío disponibles con costos
 */
export function calculateShipping(
    address: AddressInput,
    cartTotal: number,
    totalWeight: number = 1
): ShippingCalculation {
    const validatedAddress = AddressSchema.parse(address);

    // Determinar si es entrega local (CDMX o área metropolitana)
    const isLocalDelivery =
        CDMX_STATES.some(s =>
            validatedAddress.state.toLowerCase().includes(s.toLowerCase())
        ) ||
        AREA_METROPOLITANA_CITIES.some(city =>
            validatedAddress.city.toLowerCase().includes(city.toLowerCase())
        );

    const options: ShippingOption[] = [];

    if (isLocalDelivery) {
        // === ENVÍO LOCAL (CDMX) ===
        const localCost = cartTotal >= SHIPPING_CONFIG.LOCAL.freeThreshold
            ? 0
            : SHIPPING_CONFIG.LOCAL.flatRate;

        options.push({
            method: 'LOCAL',
            name: 'Envío Local CDMX',
            description: cartTotal >= SHIPPING_CONFIG.LOCAL.freeThreshold
                ? '¡Envío GRATIS!'
                : `Envío local por moto/mensajero`,
            cost: localCost,
            estimatedDelivery: 'Mismo día o siguiente día hábil',
            isAvailable: true,
        });
    }

    // === ENVÍO NACIONAL (FEDEX ESTÁNDAR) ===
    const standardCost = SHIPPING_CONFIG.STANDARD.base +
        (totalWeight * SHIPPING_CONFIG.STANDARD.perKg);

    options.push({
        method: 'STANDARD',
        name: 'Envío Nacional Estándar',
        description: 'FedEx Ground',
        cost: Math.round(standardCost),
        estimatedDelivery: SHIPPING_CONFIG.STANDARD.estimatedDays,
        isAvailable: true,
    });

    // === ENVÍO EXPRESS (FEDEX EXPRESS) ===
    const expressCost = SHIPPING_CONFIG.EXPRESS.base +
        (totalWeight * SHIPPING_CONFIG.EXPRESS.perKg);

    options.push({
        method: 'EXPRESS',
        name: 'Envío Express',
        description: 'FedEx Express (Entrega rápida)',
        cost: Math.round(expressCost),
        estimatedDelivery: SHIPPING_CONFIG.EXPRESS.estimatedDays,
        isAvailable: true,
    });

    // === RECOGER EN TIENDA ===
    options.push({
        method: 'PICKUP',
        name: 'Recoger en Tienda',
        description: 'Sucursal Centro Histórico',
        cost: 0,
        estimatedDelivery: SHIPPING_CONFIG.PICKUP.estimatedDays,
        isAvailable: true,
    });

    return {
        options,
        isLocalDelivery,
        address: validatedAddress,
    };
}

/**
 * Obtiene el costo de envío para un método específico
 */
export function getShippingCost(
    method: ShippingOption['method'],
    address: AddressInput,
    cartTotal: number,
    totalWeight: number = 1
): number {
    const calculation = calculateShipping(address, cartTotal, totalWeight);
    const option = calculation.options.find(o => o.method === method);

    if (!option) {
        throw new Error(`Método de envío no disponible: ${method}`);
    }

    return option.cost;
}
