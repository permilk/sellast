import prisma from '@/lib/prisma';
import { PaymentMethod, Sale, SaleStatus, ShiftStatus } from '@prisma/client';

export type CreateSaleDTO = {
    userId: string;
    items: {
        variantId: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    subtotal: number;
    discount: number;
    paymentMethod: PaymentMethod;
};

export class SaleService {

    // Obtener turno activo del usuario
    static async getActiveShift(userId: string) {
        return await prisma.cashShift.findFirst({
            where: {
                userId,
                status: ShiftStatus.OPEN
            }
        });
    }

    static async createSale(data: CreateSaleDTO) {
        // En un escenario real, deberíamos obtener el shift activo del request user
        // Como simplificación, buscaremos el shift abierto, si no hay, creamos uno "fantasma" o lanzamos error
        // Para MVP: Intentamos ligar a shift abierto, si no, null.

        let shift = await this.getActiveShift(data.userId);

        // Start Transaction
        return await prisma.$transaction(async (tx) => {
            // 1. Create Sale Header
            const sale = await tx.sale.create({
                data: {
                    userId: data.userId,
                    shiftId: shift?.id,
                    total: data.total,
                    subtotal: data.subtotal,
                    discountTotal: data.discount,
                    taxTotal: 0, // TODO: Implement tax calc
                    paymentMethod: data.paymentMethod,
                    status: SaleStatus.COMPLETED,
                    items: {
                        create: data.items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            unitPrice: item.price,
                            total: item.price * item.quantity
                        }))
                    }
                },
                include: { items: true }
            });

            // 2. Decrement Inventory & Validate
            for (const item of data.items) {
                // Find inventory item in default warehouse (TODO: Multi-warehouse)
                // For MVP, we assume just one warehouse or global stock logic
                // Here we find ANY inventory record for this variant

                // Opción A: Decrementar globalmente (buscando el primer item de inventario)
                const inventoryItem = await tx.inventoryItem.findFirst({
                    where: { variantId: item.variantId }
                });

                if (inventoryItem) {
                    await tx.inventoryItem.update({
                        where: { id: inventoryItem.id },
                        data: { quantity: { decrement: item.quantity } }
                    });
                } else {
                    // Si no hay record de inventario, ¿creamos negativo o error?
                    // MVP: Ignoramos si no hay control de inventario
                }
            }

            // 3. Register Cash Movement (if applicable)
            if (shift && data.paymentMethod === 'CASH') {
                await tx.cashMovement.create({
                    data: {
                        shiftId: shift.id,
                        type: 'SALE',
                        amount: data.total,
                        reason: `Venta #${sale.displayId}`
                    }
                });
            }

            return sale;
        });
    }
}
