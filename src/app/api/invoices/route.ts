// ============================================
// API: INVOICES - Facturación
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { crearFactura, validarRFC, type DatosFactura } from '@/lib/facturacion';

// POST /api/invoices - Generar factura para pedido
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { orderId, rfc, razonSocial, regimenFiscal, usoCfdi, codigoPostal, email } = body;

        // Validar campos requeridos
        if (!orderId || !rfc || !razonSocial || !regimenFiscal || !usoCfdi || !codigoPostal || !email) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos para la facturación' },
                { status: 400 }
            );
        }

        // Validar RFC
        const rfcValidacion = validarRFC(rfc);
        if (!rfcValidacion.valido) {
            return NextResponse.json(
                { error: 'El RFC proporcionado no es válido' },
                { status: 400 }
            );
        }

        // Verificar que el pedido existe
        const orden = await prisma.order.findUnique({
            where: { id: orderId },
            include: { invoice: true },
        });

        if (!orden) {
            return NextResponse.json(
                { error: 'Pedido no encontrado' },
                { status: 404 }
            );
        }

        // Verificar que no tenga factura ya
        if (orden.invoice) {
            return NextResponse.json(
                { error: 'Este pedido ya tiene una factura generada', invoice: orden.invoice },
                { status: 400 }
            );
        }

        // Verificar que el pedido esté pagado
        if (orden.paymentStatus !== 'PAID') {
            return NextResponse.json(
                { error: 'El pedido debe estar pagado para generar factura' },
                { status: 400 }
            );
        }

        // Crear factura
        const datosFactura: DatosFactura = {
            orderId,
            rfc: rfc.toUpperCase().trim(),
            razonSocial: razonSocial.toUpperCase().trim(),
            regimenFiscal,
            usoCfdi,
            codigoPostal,
            email,
        };

        const resultado = await crearFactura(orderId, datosFactura);

        if (!resultado.success) {
            return NextResponse.json(
                { error: resultado.error || 'Error al generar la factura' },
                { status: 500 }
            );
        }

        // Obtener factura creada
        const invoice = await prisma.invoice.findUnique({
            where: { orderId },
        });

        return NextResponse.json({
            success: true,
            message: 'Factura generada exitosamente',
            invoice,
        });

    } catch (error) {
        console.error('Error generating invoice:', error);
        return NextResponse.json(
            { error: 'Error al procesar la solicitud de facturación' },
            { status: 500 }
        );
    }
}

// GET /api/invoices - Listar facturas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const rfc = searchParams.get('rfc');

        const where: Record<string, unknown> = {};

        if (orderId) {
            where.orderId = orderId;
        }

        if (rfc) {
            where.invoiceProfile = {
                rfc: rfc.toUpperCase(),
            };
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        total: true,
                        createdAt: true,
                    },
                },
                invoiceProfile: {
                    select: {
                        rfc: true,
                        razonSocial: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ invoices });

    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { error: 'Error al obtener facturas' },
            { status: 500 }
        );
    }
}
