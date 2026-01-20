// ============================================
// STRIPE SERVICE
// ============================================

import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        stripeInstance = new Stripe(key, {
            apiVersion: '2025-12-15.clover',
            typescript: true,
        });
    }
    return stripeInstance;
}

// For backward compatibility
export const stripe = {
    get instance() {
        return getStripe();
    }
};

export interface CreateCheckoutSessionParams {
    orderId: string;
    orderNumber: string;
    customerEmail: string;
    lineItems: {
        name: string;
        description?: string;
        amount: number;
        quantity: number;
        images?: string[];
    }[];
    shippingCost: number;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
}

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

    const session = await getStripe().checkout.sessions.create({
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
        billing_address_collection: 'required',
    });

    return session;
}

export function constructWebhookEvent(
    payload: string | Buffer,
    signature: string
): Stripe.Event {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    return getStripe().webhooks.constructEvent(payload, signature, secret);
}

export async function createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
    return getStripe().refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason,
    });
}
