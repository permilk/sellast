'use server';

// ============================================
// CATEGORIES SERVER ACTIONS - Prisma Database
// ============================================

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Get all categories
export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return categories.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            productCount: c._count.products
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Create category
export async function createCategory(data: { name: string; description?: string }) {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description || null
            }
        });
        revalidatePath('/admin/categorias');
        revalidatePath('/admin/productos/nuevo');
        return { success: true, category };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Error al crear categoría' };
    }
}

// Update category
export async function updateCategory(id: string, data: { name?: string; description?: string }) {
    try {
        const category = await prisma.category.update({
            where: { id },
            data
        });
        revalidatePath('/admin/categorias');
        revalidatePath('/admin/productos/nuevo');
        return { success: true, category };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Error al actualizar categoría' };
    }
}

// Delete category (checks for products first)
export async function deleteCategory(id: string) {
    try {
        // Check if category has products
        const productCount = await prisma.product.count({
            where: { categoryId: id }
        });

        if (productCount > 0) {
            return {
                success: false,
                error: `No se puede eliminar: tiene ${productCount} productos asociados`
            };
        }

        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categorias');
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Error al eliminar categoría' };
    }
}
