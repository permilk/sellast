// ============================================
// API V1 - SALES ENDPOINT
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/v1/sales - List sales with filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const branchId = searchParams.get('branchId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {};

        if (branchId) {
            where.branchId = branchId;
        }

        if (status) {
            where.status = status;
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }

        const [sales, total] = await Promise.all([
            prisma.sale.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    },
                    customer: true,
                    items: {
                        include: {
                            variant: true
                        }
                    },
                    branch: true
                },
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.sale.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: sales,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + sales.length < total
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error fetching sales' },
            { status: 500 }
        );
    }
}

// POST /api/v1/sales - Create new sale (POS transaction)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            userId,
            customerId,
            branchId,
            shiftId,
            items,
            paymentMethod,
            subtotal,
            taxTotal,
            discountTotal,
            total
        } = body;

        if (!userId || !items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'userId and items are required' },
                { status: 400 }
            );
        }

        // Create sale with items in a transaction
        const sale = await prisma.$transaction(async (tx) => {
            // Create the sale
            const newSale = await tx.sale.create({
                data: {
                    userId,
                    customerId,
                    branchId,
                    shiftId,
                    paymentMethod: paymentMethod || 'CASH',
                    subtotal: subtotal || 0,
                    taxTotal: taxTotal || 0,
                    discountTotal: discountTotal || 0,
                    total: total || 0,
                    items: {
                        create: items.map((item: any) => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: item.total
                        }))
                    }
                },
                include: {
                    items: true,
                    customer: true
                }
            });

            // Update inventory (reduce stock)
            for (const item of items) {
                await tx.inventoryItem.updateMany({
                    where: { variantId: item.variantId },
                    data: {
                        quantity: { decrement: item.quantity }
                    }
                });
            }

            return newSale;
        });

        return NextResponse.json({
            success: true,
            data: sale
        }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error creating sale' },
            { status: 500 }
        );
    }
}
