// ============================================
// API: PRODUCTS - CRUD
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/products - Listar productos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const active = searchParams.get('active');

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.categoryId = category;
        }

        if (active !== null) {
            where.isActive = active === 'true';
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

// POST /api/products - Crear producto
export async function POST(request: NextRequest) {
    try {
        // TODO: Verificar que el usuario es admin

        const body = await request.json();

        const {
            sku,
            name,
            description,
            price,
            stock,
            weight,
            categoryId,
            images,
        } = body;

        // Validar campos requeridos
        if (!sku || !name || !price || !categoryId) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        // Verificar que SKU no exista
        const existing = await prisma.product.findFirst({
            where: { sku },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Ya existe un producto con ese SKU' },
                { status: 400 }
            );
        }

        // Crear producto
        const product = await prisma.product.create({
            data: {
                sku,
                name,
                description,
                price,
                stock: stock || 0,
                weight,
                categoryId,
                images: images?.length ? {
                    create: images.map((img: { url: string }, index: number) => ({
                        url: img.url,
                        isPrimary: index === 0,
                    })),
                } : undefined,
            },
            include: {
                category: true,
                images: true,
            },
        });

        // Registrar en audit log (reemplaza inventory log)
        if (stock && stock > 0) {
            await prisma.auditLog.create({
                data: {
                    entity: 'Product',
                    entityId: product.id,
                    action: 'INITIAL_STOCK',
                    userId: 'admin', // TODO: get real user
                    details: {
                        quantity: stock,
                        reason: 'Stock inicial',
                        newQty: stock,
                    },
                },
            });
        }

        return NextResponse.json({ product }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Error al crear producto' },
            { status: 500 }
        );
    }
}
