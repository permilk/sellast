'use client';

// ============================================
// ADMIN - REGISTRO DE ACTIVIDAD (LOGS)
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getLogs, getActivityLabel, ActivityLog, ActivityType } from '@/stores/activityLogsStore';

export default function ActividadPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [filterType, setFilterType] = useState<string>('');
    const [filterModule, setFilterModule] = useState<string>('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        const allLogs = getLogs(500);
        setLogs(allLogs);
    }, []);

    const filteredLogs = logs.filter(log => {
        if (filterType && log.type !== filterType) return false;
        if (filterModule && log.module !== filterModule) return false;
        if (dateFrom) {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            if (logDate < dateFrom) return false;
        }
        if (dateTo) {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            if (logDate > dateTo) return false;
        }
        return true;
    });

    const modules = [...new Set(logs.map(l => l.module))];
    const types = [...new Set(logs.map(l => l.type))];

    const todayCount = logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
    const salesCount = logs.filter(l => l.type === 'sale_created').length;
    const usersCount = [...new Set(logs.map(l => l.userId))].length;

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Registro de Actividad
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Historial de acciones realizadas en el sistema
                </p>
            </div>

            {/* KPIs */}
            <KPISummary cards={[
                { label: 'Acciones Hoy', value: todayCount, color: 'blue' },
                { label: 'Ventas Registradas', value: salesCount, color: 'green' },
                { label: 'Usuarios Activos', value: usersCount, color: 'purple' },
                { label: 'Total Registros', value: logs.length, color: 'cyan' }
            ]} />

            {/* Filters */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>TIPO</label>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    >
                        <option value="">Todos</option>
                        {types.map(t => (
                            <option key={t} value={t}>{getActivityLabel(t as ActivityType).label}</option>
                        ))}
                    </select>
                </div>
                <div style={{ minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>MÓDULO</label>
                    <select
                        value={filterModule}
                        onChange={e => setFilterModule(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    >
                        <option value="">Todos</option>
                        {modules.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>DESDE</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>HASTA</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                </div>
            </div>

            {/* Logs Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>FECHA/HORA</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>USUARIO</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>TIPO</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>ACCIÓN</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>DETALLES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem' }}>
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <div>No hay registros de actividad</div>
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.slice(0, 100).map(log => {
                                const label = getActivityLabel(log.type as ActivityType);
                                return (
                                    <tr key={log.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                                            {new Date(log.timestamp).toLocaleString('es-MX')}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{log.userName}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: label.color + '20',
                                                color: label.color
                                            }}>
                                                {label.icon} {label.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{log.action}</td>
                                        <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.85rem' }}>{log.details}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
