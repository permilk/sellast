// ============================================
// API V1 - INVENTORY ENDPOINT
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/v1/inventory - Get inventory levels
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const warehouseId = searchParams.get('warehouseId');
        const branchId = searchParams.get('branchId');
        const lowStock = searchParams.get('lowStock') === 'true';
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {};

        if (warehouseId) {
            where.warehouseId = warehouseId;
        }

        if (branchId) {
            where.warehouse = { branchId };
        }

        if (lowStock) {
            where.quantity = { lte: prisma.inventoryItem.fields.minStock };
        }

        const [inventory, total] = await Promise.all([
            prisma.inventoryItem.findMany({
                where,
                include: {
                    warehouse: {
                        include: { branch: true }
                    },
                    variant: {
                        include: {
                            product: {
                                include: { category: true }
                            }
                        }
                    }
                },
                take: limit,
                skip: offset,
                orderBy: { quantity: 'asc' }
            }),
            prisma.inventoryItem.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: inventory,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + inventory.length < total
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error fetching inventory' },
            { status: 500 }
        );
    }
}

// POST /api/v1/inventory - Adjust inventory
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { warehouseId, variantId, adjustment, reason } = body;

        if (!warehouseId || !variantId || adjustment === undefined) {
            return NextResponse.json(
                { success: false, error: 'warehouseId, variantId, and adjustment are required' },
                { status: 400 }
            );
        }

        // Find or create inventory item
        const existing = await prisma.inventoryItem.findUnique({
            where: {
                warehouseId_variantId: { warehouseId, variantId }
            }
        });

        let inventoryItem;

        if (existing) {
            inventoryItem = await prisma.inventoryItem.update({
                where: { id: existing.id },
                data: {
                    quantity: { increment: adjustment }
                }
            });
        } else {
            inventoryItem = await prisma.inventoryItem.create({
                data: {
                    warehouseId,
                    variantId,
                    quantity: adjustment > 0 ? adjustment : 0
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: inventoryItem,
            adjustment: {
                previous: existing?.quantity || 0,
                change: adjustment,
                current: inventoryItem.quantity,
                reason
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error adjusting inventory' },
            { status: 500 }
        );
    }
}
