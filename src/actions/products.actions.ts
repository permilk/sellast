'use server';

// ============================================
// PRODUCTS SERVER ACTIONS - Prisma Database
// ============================================

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Get all products with category
export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                images: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            categoryId: p.categoryId,
            categoryName: p.category.name,
            sku: p.sku,
            price: Number(p.price),
            stock: p.stock,
            isActive: p.isActive,
            image: p.images.find(i => i.isPrimary)?.url || p.images[0]?.url,
            createdAt: p.createdAt
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Get single product
export async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: true,
                variants: true
            }
        });
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Create product
export async function createProduct(data: {
    name: string;
    description?: string;
    categoryId: string;
    sku?: string;
    price: number;
    stock: number;
    imageUrl?: string;
}) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                categoryId: data.categoryId,
                sku: data.sku,
                price: data.price,
                stock: data.stock,
                images: data.imageUrl ? {
                    create: {
                        url: data.imageUrl,
                        isPrimary: true
                    }
                } : undefined
            }
        });

        revalidatePath('/admin/productos');
        revalidatePath('/admin/inventario');
        revalidatePath('/admin/pos');

        return { success: true, product };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Error al crear producto' };
    }
}

// Update product
export async function updateProduct(id: string, data: {
    name?: string;
    description?: string;
    categoryId?: string;
    sku?: string;
    price?: number;
    stock?: number;
    isActive?: boolean;
}) {
    try {
        const product = await prisma.product.update({
            where: { id },
            data
        });

        revalidatePath('/admin/productos');
        revalidatePath('/admin/inventario');
        revalidatePath('/admin/pos');

        return { success: true, product };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Error al actualizar producto' };
    }
}

// Update stock (for inventory)
export async function updateStock(id: string, change: number, reason: string) {
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                stock: { increment: change }
            }
        });

        revalidatePath('/admin/inventario');
        revalidatePath('/admin/pos');

        return { success: true, newStock: product.stock };
    } catch (error) {
        console.error('Error updating stock:', error);
        return { success: false, error: 'Error al actualizar stock' };
    }
}

// Delete product
export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });

        revalidatePath('/admin/productos');
        revalidatePath('/admin/inventario');

        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Error al eliminar producto' };
    }
}
