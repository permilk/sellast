import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type CreateProductDTO = {
    name: string;
    description?: string;
    categoryId: string;
    price: number;
    cost: number;
    sku: string;
    barcode?: string;
    trackStock: boolean;
    initialStock?: number;
    minStock?: number;
};

export class ProductService {

    static async getAll(filter?: { query?: string; status?: string }) {
        const where: Prisma.ProductWhereInput = {
            isActive: true, // Default active
        };

        if (filter?.query) {
            where.OR = [
                { name: { contains: filter.query, mode: 'insensitive' } },
                { variants: { some: { OR: [{ sku: { contains: filter.query } }, { barcode: { contains: filter.query } }] } } }
            ];
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                variants: {
                    include: {
                        inventory: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Flatten for UI
        return products.map(p => {
            const mainVariant = p.variants[0]; // Assuming simple product for listing
            const totalStock = p.variants.reduce((acc, v) => acc + v.inventory.reduce((sum, i) => sum + i.quantity, 0), 0);

            return {
                id: mainVariant?.id || p.id,
                productId: p.id, // Keep ref to parent
                name: p.name,
                category: p.category.name,
                price: mainVariant?.salePrice.toNumber() || 0,
                cost: mainVariant?.costPrice.toNumber() || 0,
                sku: mainVariant?.sku || '',
                barcode: mainVariant?.barcode || '',
                stock: totalStock,
                status: p.isActive ? 'Activo' : 'Inactivo',
                variantCount: p.variants.length
            };
        });
    }

    static async create(data: CreateProductDTO) {
        // Transaction to create Product -> Variant -> Inventory
        return await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    name: data.name,
                    description: data.description,
                    categoryId: data.categoryId,
                    isActive: true,
                    variants: {
                        create: {
                            name: 'Default',
                            sku: data.sku,
                            barcode: data.barcode,
                            salePrice: data.price,
                            costPrice: data.cost,
                            // If tracking stock, create inventory entry for default warehouse
                            inventory: data.trackStock ? {
                                create: {
                                    warehouseId: (await prisma.warehouse.findFirst())?.id || 'default-warehouse', // Fallback or fetch real
                                    quantity: data.initialStock || 0,
                                    minStock: data.minStock || 5
                                }
                            } : undefined
                        }
                    }
                }
            });
            return product;
        });
    }

    static async getCategories() {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    }
}
