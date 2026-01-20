// ============================================
// STRIPE SERVICE
// ============================================

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
});

export interface CreateCheckoutSessionParams {
    orderId: string;
    orderNumber: string;
    customerEmail: string;
    lineItems: {
        name: string;
        description?: string;
        amount: number; // En centavos MXN
        quantity: number;
        images?: string[];
    }[];
    shippingCost: number; // En centavos MXN
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
}

/**
 * Crea una sesión de checkout de Stripe
 */
export async function createCheckoutSession(
    params: CreateCheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
    const {
        orderId,
        orderNumber,
        customerEmail,
        lineItems,
        shippingCost,
        successUrl,
        cancelUrl,
        metadata = {},
    } = params;

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: customerEmail,
        currency: 'mxn',
        line_items: [
            ...lineItems.map(item => ({
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: item.name,
                        description: item.description,
                        images: item.images,
                    },
                    unit_amount: item.amount,
                },
                quantity: item.quantity,
            })),
            // Agregar costo de envío como line item separado
            ...(shippingCost > 0
                ? [{
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: 'Costo de Envío',
                        },
                        unit_amount: shippingCost,
                    },
                    quantity: 1,
                }]
                : []),
        ],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
            orderId,
            orderNumber,
            ...metadata,
        },
        payment_method_types: ['card'],
        // Opciones adicionales para México
        billing_address_collection: 'required',
    });

    return session;
}

/**
 * Verifica y construye el evento de webhook de Stripe
 */
export function constructWebhookEvent(
    payload: string | Buffer,
    signature: string
): Stripe.Event {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
    );
}

/**
 * Procesa un reembolso
 */
export async function createRefund(
    paymentIntentId: string,
    amount?: number, // En centavos, undefined = reembolso total
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
    return stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason,
    });
}
