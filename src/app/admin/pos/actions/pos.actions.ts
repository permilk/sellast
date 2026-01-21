import prisma from '@/lib/prisma';
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
        // For MVP without auth, fetch the first user (usually admin from seed)
        const user = await prisma.user.findFirst();
        if (!user) throw new Error('No user found');

        await SaleService.createSale({
            userId: user.id,
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
