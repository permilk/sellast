'use server';

import { ProductService, CreateProductDTO } from '@/services/product.service';
import { revalidatePath } from 'next/cache';

export async function getProductsAction(query?: string) {
    try {
        const products = await ProductService.getAll({ query });
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: 'Error al cargar productos' };
    }
}

export async function createProductAction(data: CreateProductDTO) {
    try {
        await ProductService.create(data);
        revalidatePath('/admin/productos');
        return { success: true };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Error al crear producto' };
    }
}

export async function getCategoriesAction() {
    try {
        const categories = await ProductService.getCategories();
        return { success: true, data: categories };
    } catch (error) {
        return { success: false, data: [] }; // Fail gracefully
    }
}
