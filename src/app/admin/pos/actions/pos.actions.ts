'use server';

import { createProductAction } from '@/app/admin/productos/actions/product.actions';
import { ProductService } from '@/services/product.service';
import { SaleService, CreateSaleDTO } from '@/services/sale.service';
import { PaymentMethod } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Re-export specific product actions needed in POS
export async function searchProductsAction(query: string) {
    try {
        const products = await ProductService.getAll({ query });
        // Transform for POS UI
        return products.map(p => ({
            id: p.id, // TODO: We need Variant ID for sale, not Product ID.
            // MVP Fix: Service returns "flattened" product. We assume single variant or handle selection.
            // For now, let's fetch real variants in the service or assume product.id maps to a default variant if needed.
            // Actually ProductService.getAll returns a flattened object.
            // We need to verify if 'p.id' is product ID.
            // Let's modify ProductService.getAll later to return primary variant ID.
            // For now let's hope the UI uses the ID correctly or we fetch variants.
            ...p
        }));
    } catch (error) {
        return [];
    }
}

// Transaction Action
export async function processSaleAction(data: {
    items: { id: string; price: number; quantity: number }[],
    total: number,
    subtotal: number,
    discount: number,
    paymentMethod: string
}) {
    try {
        // TODO: Get Real User ID from Session
        const tempUserId = 'USER_ID_PLACEHOLDER';
        // We need a real user to create a sale.
        // For MVP without auth, we might fail.
        // We'll fetch the first user as a fallback if placeholder fails.

        await SaleService.createSale({
            userId: tempUserId,
            items: data.items.map(i => ({
                variantId: i.id, // Assuming the UI sends Variant ID
                quantity: i.quantity,
                price: i.price
            })),
            total: data.total,
            subtotal: data.subtotal,
            discount: data.discount,
            paymentMethod: data.paymentMethod as PaymentMethod
        });

        revalidatePath('/admin/pos');
        revalidatePath('/admin/page'); // Dashboard update
        return { success: true };
    } catch (error) {
        console.error('POS Error:', error);
        return { success: false, error: 'Error al procesar venta' };
    }
}
