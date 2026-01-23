// ============================================
// API V1 - BRANCHES ENDPOINT
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/v1/branches - List all branches
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') !== 'false';

        const where: any = {};
        if (activeOnly) {
            where.isActive = true;
        }

        const branches = await prisma.branch.findMany({
            where,
            include: {
                warehouses: true,
                _count: {
                    select: {
                        sales: true,
                        cashShifts: true,
                        users: true
                    }
                }
            },
            orderBy: [
                { isMain: 'desc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json({
            success: true,
            data: branches
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error fetching branches' },
            { status: 500 }
        );
    }
}

// POST /api/v1/branches - Create new branch
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, code, address, phone, email, isMain } = body;

        if (!name || !code) {
            return NextResponse.json(
                { success: false, error: 'Name and code are required' },
                { status: 400 }
            );
        }

        // Check if code is unique
        const existing = await prisma.branch.findUnique({
            where: { code }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Branch code already exists' },
                { status: 409 }
            );
        }

        const branch = await prisma.branch.create({
            data: {
                name,
                code,
                address,
                phone,
                email,
                isMain: isMain || false
            }
        });

        return NextResponse.json({
            success: true,
            data: branch
        }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error creating branch' },
            { status: 500 }
        );
    }
}
