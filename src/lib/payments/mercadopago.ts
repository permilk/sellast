// ============================================
// MERCADOPAGO PAYMENT PROVIDER
// ============================================

import {
    IPaymentProvider,
    PaymentIntentResult,
    PaymentResult,
    RefundResult,
    WebhookResult
} from './types';

// MercadoPago SDK types
interface MercadoPagoPreference {
    id: string;
    init_point: string;
    sandbox_init_point: string;
}

export class MercadoPagoProvider implements IPaymentProvider {
    name = 'mercadopago';
    private accessToken: string;
    private isSandbox: boolean;
    private baseUrl = 'https://api.mercadopago.com';

    constructor() {
        this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
        this.isSandbox = process.env.MERCADOPAGO_SANDBOX === 'true';

        if (!this.accessToken) {
            console.warn('[MercadoPago] Access token not configured. Using mock mode.');
        }
    }

    async createPayment(params: {
        amount: number;
        currency: string;
        description: string;
        orderId: string;
        customerEmail: string;
        items: { title: string; quantity: number; unitPrice: number }[];
        successUrl?: string;
        failureUrl?: string;
        pendingUrl?: string;
    }): Promise<PaymentIntentResult> {
        const { amount, description, orderId, customerEmail, items, successUrl, failureUrl, pendingUrl } = params;

        // If no access token, return mock response
        if (!this.accessToken) {
            return {
                success: true,
                intentId: `mock-${Date.now()}`,
                redirectUrl: `/checkout/success?order=${orderId}&mock=true`,
            };
        }

        try {
            const preference = {
                items: items.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    currency_id: 'MXN'
                })),
                payer: {
                    email: customerEmail
                },
                back_urls: {
                    success: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
                    failure: failureUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
                    pending: pendingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`
                },
                auto_return: 'approved',
                external_reference: orderId,
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
                statement_descriptor: 'SELLAST',
                metadata: {
                    orderId,
                    description
                }
            };

            const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: JSON.stringify(preference)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('[MercadoPago] Create preference error:', error);
                return {
                    success: false,
                    intentId: '',
                    error: error.message || 'Error creating payment preference'
                };
            }

            const data: MercadoPagoPreference = await response.json();

            return {
                success: true,
                intentId: data.id,
                redirectUrl: this.isSandbox ? data.sandbox_init_point : data.init_point
            };
        } catch (error: any) {
            console.error('[MercadoPago] Error:', error);
            return {
                success: false,
                intentId: '',
                error: error.message || 'Payment creation failed'
            };
        }
    }

    async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
        if (!this.accessToken || paymentId.startsWith('mock-')) {
            return {
                success: true,
                transactionId: paymentId,
                status: 'succeeded'
            };
        }

        try {
            const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                return {
                    success: false,
                    transactionId: paymentId,
                    status: 'failed'
                };
            }

            const data = await response.json();

            const statusMap: Record<string, 'pending' | 'processing' | 'succeeded' | 'failed'> = {
                'pending': 'pending',
                'in_process': 'processing',
                'approved': 'succeeded',
                'rejected': 'failed',
                'cancelled': 'failed',
                'refunded': 'failed'
            };

            return {
                success: data.status === 'approved',
                transactionId: data.id.toString(),
                status: statusMap[data.status] || 'pending',
                rawResponse: data
            };
        } catch (error) {
            console.error('[MercadoPago] Get status error:', error);
            return {
                success: false,
                transactionId: paymentId,
                status: 'failed'
            };
        }
    }

    async refund(transactionId: string, amount?: number): Promise<RefundResult> {
        if (!this.accessToken || transactionId.startsWith('mock-')) {
            return {
                success: true,
                refundId: `refund-${Date.now()}`
            };
        }

        try {
            const body = amount ? { amount } : {};

            const response = await fetch(`${this.baseUrl}/v1/payments/${transactionId}/refunds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.message || 'Refund failed'
                };
            }

            const data = await response.json();
            return {
                success: true,
                refundId: data.id.toString()
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Refund failed'
            };
        }
    }

    async handleWebhook(payload: any, signature?: string): Promise<WebhookResult> {
        // MercadoPago sends IPN notifications
        const { type, data } = payload;

        if (type === 'payment') {
            const paymentStatus = await this.getPaymentStatus(data.id);

            return {
                success: paymentStatus.success,
                orderId: payload.external_reference,
                event: 'payment',
                status: paymentStatus.status
            };
        }

        return {
            success: true,
            event: type || 'unknown',
            status: 'received'
        };
    }
}
