// ============================================
// API V1 - PRODUCTS ENDPOINT
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/v1/products - List all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = { isActive: true };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    variants: {
                        include: {
                            inventory: true
                        }
                    },
                    images: true
                },
                take: limit,
                skip: offset,
                orderBy: { name: 'asc' }
            }),
            prisma.product.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + products.length < total
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error fetching products' },
            { status: 500 }
        );
    }
}

// POST /api/v1/products - Create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, description, categoryId, sku, price, stock, taxRate } = body;

        if (!name || !categoryId) {
            return NextResponse.json(
                { success: false, error: 'Name and categoryId are required' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                categoryId,
                sku,
                price: price || 0,
                stock: stock || 0,
                taxRate: taxRate || 0.16
            },
            include: {
                category: true
            }
        });

        return NextResponse.json({
            success: true,
            data: product
        }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error creating product' },
            { status: 500 }
        );
    }
}
