// ============================================
// API: PRODUCTS/[ID] - Detalle y edición
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Obtener detalle
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: { orderBy: { sortOrder: 'asc' } },
                variants: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Error al obtener producto' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        const {
            name,
            description,
            price,
            comparePrice,
            costPrice,
            stock,
            lowStockAt,
            weight,
            isActive,
            isFeatured,
            categoryId,
        } = body;

        // Si el stock cambia, registrar en inventario
        if (stock !== undefined && stock !== existing.stock) {
            await prisma.inventoryLog.create({
                data: {
                    productId: id,
                    type: 'ADJUSTMENT',
                    quantity: stock - existing.stock,
                    reason: 'Ajuste manual desde admin',
                    previousQty: existing.stock,
                    newQty: stock,
                    createdBy: 'admin', // TODO: obtener del usuario autenticado
                },
            });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                comparePrice,
                costPrice,
                stock,
                lowStockAt,
                weight,
                isActive,
                isFeatured,
                categoryId,
            },
            include: {
                category: true,
                images: true,
            },
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Error al actualizar producto' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        // Eliminar producto (las imágenes se eliminan por cascade)
        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Error al eliminar producto' },
            { status: 500 }
        );
    }
}
