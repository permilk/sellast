'use client';

// ============================================
// ADMIN - PROGRAMA DE LEALTAD / PUNTOS
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getLoyaltyProgram, updateLoyaltyProgram, getAllCustomersLoyalty, LoyaltyProgram, CustomerLoyalty } from '@/stores/loyaltyStore';
import { getClients } from '@/stores/clientsStore';

export default function LealtadPage() {
    const [program, setProgram] = useState<LoyaltyProgram | null>(null);
    const [customers, setCustomers] = useState<(CustomerLoyalty & { nombre: string })[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        pointsPerPeso: 1,
        pesosPerPoint: 0.10,
        minPointsToRedeem: 100,
        expirationDays: 365
    });

    useEffect(() => {
        const prog = getLoyaltyProgram();
        setProgram(prog);
        setFormData({
            pointsPerPeso: prog.pointsPerPeso,
            pesosPerPoint: prog.pesosPerPoint,
            minPointsToRedeem: prog.minPointsToRedeem,
            expirationDays: prog.expirationDays
        });

        const loyalty = getAllCustomersLoyalty();
        const clients = getClients();
        const merged = loyalty.map(l => ({
            ...l,
            nombre: clients.find(c => c.id === l.clientId)?.nombre || 'Cliente Desconocido'
        }));
        setCustomers(merged);
    }, []);

    const handleSave = () => {
        const updated = updateLoyaltyProgram(formData);
        setProgram(updated);
        setEditMode(false);
    };

    const toggleProgram = () => {
        if (program) {
            const updated = updateLoyaltyProgram({ enabled: !program.enabled });
            setProgram(updated);
        }
    };

    const totalPoints = customers.reduce((sum, c) => sum + c.pointsBalance, 0);
    const totalEarned = customers.reduce((sum, c) => sum + c.totalEarned, 0);
    const totalRedeemed = customers.reduce((sum, c) => sum + c.totalRedeemed, 0);

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Programa de Lealtad
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gestiona el programa de puntos y recompensas para clientes
                    </p>
                </div>
                {program && (
                    <button
                        onClick={toggleProgram}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: program.enabled ? '#EF4444' : '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {program.enabled ? 'Desactivar Programa' : 'Activar Programa'}
                    </button>
                )}
            </div>

            {/* KPIs */}
            <KPISummary cards={[
                { label: 'Puntos en Circulación', value: totalPoints.toLocaleString(), color: 'amber' },
                { label: 'Puntos Otorgados Total', value: totalEarned.toLocaleString(), color: 'green' },
                { label: 'Puntos Canjeados', value: totalRedeemed.toLocaleString(), color: 'blue' },
                { label: 'Clientes Participantes', value: customers.length, color: 'purple' }
            ]} />

            {/* Program Config */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Configuración del Programa</h3>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            style={{ padding: '0.5rem 1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Editar
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>Puntos por Peso</label>
                        <input
                            type="number"
                            value={formData.pointsPerPeso}
                            onChange={e => setFormData({ ...formData, pointsPerPeso: Number(e.target.value) })}
                            disabled={!editMode}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: editMode ? 'white' : '#f9fafb' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>Valor por Punto ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.pesosPerPoint}
                            onChange={e => setFormData({ ...formData, pesosPerPoint: Number(e.target.value) })}
                            disabled={!editMode}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: editMode ? 'white' : '#f9fafb' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>Mínimo para Canje</label>
                        <input
                            type="number"
                            value={formData.minPointsToRedeem}
                            onChange={e => setFormData({ ...formData, minPointsToRedeem: Number(e.target.value) })}
                            disabled={!editMode}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: editMode ? 'white' : '#f9fafb' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>Días de Vigencia</label>
                        <input
                            type="number"
                            value={formData.expirationDays}
                            onChange={e => setFormData({ ...formData, expirationDays: Number(e.target.value) })}
                            disabled={!editMode}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: editMode ? 'white' : '#f9fafb' }}
                        />
                    </div>
                </div>

                {editMode && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                        <button onClick={handleSave} style={{ padding: '0.75rem 1.5rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            Guardar
                        </button>
                        <button onClick={() => setEditMode(false)} style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    </div>
                )}
            </div>

            {/* Customers Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Clientes con Puntos</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>CLIENTE</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>SALDO ACTUAL</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>ACUMULADOS</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>CANJEADOS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
                                    No hay clientes con puntos aún
                                </td>
                            </tr>
                        ) : (
                            customers.map(c => (
                                <tr key={c.clientId} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{c.nombre}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#F59E0B' }}>{c.pointsBalance.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#10B981' }}>{c.totalEarned.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#3B82F6' }}>{c.totalRedeemed.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
