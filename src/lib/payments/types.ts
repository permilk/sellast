// ============================================
// PAYMENT PROVIDER - ABSTRACT INTERFACE
// ============================================

export interface PaymentIntentResult {
    success: boolean;
    intentId: string;
    clientSecret?: string; // For frontend
    redirectUrl?: string;  // For MercadoPago checkout
    error?: string;
}

export interface PaymentResult {
    success: boolean;
    transactionId: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed';
    rawResponse?: any;
}

export interface RefundResult {
    success: boolean;
    refundId?: string;
    error?: string;
}

export interface WebhookResult {
    success: boolean;
    orderId?: string;
    event: string;
    status: string;
}

export interface PaymentProviderConfig {
    apiKey: string;
    publicKey?: string;
    webhookSecret?: string;
    sandbox?: boolean;
}

// Payment Provider Interface
export interface IPaymentProvider {
    name: string;

    // Create payment intent/preference
    createPayment(params: {
        amount: number;
        currency: string;
        description: string;
        orderId: string;
        customerEmail: string;
        items: { title: string; quantity: number; unitPrice: number }[];
        successUrl?: string;
        failureUrl?: string;
        pendingUrl?: string;
    }): Promise<PaymentIntentResult>;

    // Confirm payment status
    getPaymentStatus(paymentId: string): Promise<PaymentResult>;

    // Process refund
    refund(transactionId: string, amount?: number): Promise<RefundResult>;

    // Handle webhook
    handleWebhook(payload: any, signature?: string): Promise<WebhookResult>;
}

// Payment Provider Factory
export type PaymentProviderType = 'mercadopago' | 'stripe' | 'paypal';

export function getPaymentProvider(type: PaymentProviderType): IPaymentProvider {
    switch (type) {
        case 'mercadopago':
            // Dynamic import to avoid loading unused providers
            const { MercadoPagoProvider } = require('./mercadopago');
            return new MercadoPagoProvider();
        case 'stripe':
            throw new Error('Stripe provider not implemented yet');
        case 'paypal':
            throw new Error('PayPal provider not implemented yet');
        default:
            throw new Error(`Unknown payment provider: ${type}`);
    }
}
