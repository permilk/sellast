'use client';

import { useState } from 'react';
import AccountsReceivableModal from './components/AccountsReceivableModal';
import CustomerModal from './components/CustomerModal';

interface Customer {
    id: string;
    documento: string;
    nombre: string;
    tipo: 'mayorista' | 'minorista';
    telefono: string;
    email: string;
    totalCompras: number;
}

const mockCustomers: Customer[] = [
    { id: '1', documento: '45214589', nombre: 'Cristiano Ronaldo', tipo: 'mayorista', telefono: '55 1234 5678', email: 'cr7@email.com', totalCompras: 1700.00 },
    { id: '2', documento: '42201458', nombre: 'Lionel Messi', tipo: 'minorista', telefono: '55 9876 5432', email: 'messi@email.com', totalCompras: 325.00 },
    { id: '3', documento: '45780205', nombre: 'Cristian Cueva', tipo: 'minorista', telefono: '55 5555 1234', email: 'cueva@email.com', totalCompras: 0.00 },
];

export default function ClientesPage() {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.documento.includes(searchTerm)
    );

    const handleAddCustomer = () => {
        setEditingCustomer(null);
        setShowCustomerModal(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setShowCustomerModal(true);
    };

    const handleSaveCustomer = (data: Partial<Customer>) => {
        if (editingCustomer) {
            setCustomers(prev => prev.map(c =>
                c.id === editingCustomer.id ? { ...c, ...data } : c
            ));
        } else {
            const newCustomer: Customer = {
                id: Date.now().toString(),
                documento: data.documento || '',
                nombre: data.nombre || '',
                tipo: data.tipo || 'minorista',
                telefono: data.telefono || '',
                email: data.email || '',
                totalCompras: 0
            };
            setCustomers(prev => [...prev, newCustomer]);
        }
        setShowCustomerModal(false);
    };

    const handleDeleteCustomer = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            setCustomers(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Gestión de Clientes
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Administra tu base de clientes
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => setShowAccountsModal(true)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Cuentas por Pagar
                    </button>
                    <button
                        onClick={handleAddCustomer}
                        style={{
                            padding: '0.75rem 1rem',
                            background: '#2563EB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <svg
                        width="20" height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o documento..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Documento</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Nombre/Razón Social</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Tipo</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Teléfono</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Compras</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{customer.documento}</td>
                                <td style={{ padding: '1rem' }}>{customer.nombre}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: customer.tipo === 'mayorista' ? '#F59E0B' : '#10B981',
                                        color: 'white'
                                    }}>
                                        {customer.tipo}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{customer.telefono || '-'}</td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{customer.email || '-'}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                                    $ {customer.totalCompras.toFixed(2)}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => setShowAccountsModal(true)}
                                            style={{
                                                width: '32px', height: '32px', background: '#CFFAFE', border: 'none',
                                                borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Ver cuentas"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEditCustomer(customer)}
                                            style={{
                                                width: '32px', height: '32px', background: '#FEF3C7', border: 'none',
                                                borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Editar"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                            style={{
                                                width: '32px', height: '32px', background: '#FEE2E2', border: 'none',
                                                borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Eliminar"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCustomers.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        No se encontraron clientes
                    </div>
                )}
            </div>

            {/* Modals */}
            <AccountsReceivableModal
                isOpen={showAccountsModal}
                onClose={() => setShowAccountsModal(false)}
            />

            <CustomerModal
                isOpen={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                customer={editingCustomer}
                onSave={handleSaveCustomer}
            />
        </div>
    );
}
