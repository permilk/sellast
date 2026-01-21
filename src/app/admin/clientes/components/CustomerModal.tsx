'use client';

import { useState, useEffect } from 'react';

interface Customer {
    id: string;
    documento: string;
    nombre: string;
    tipo: 'mayorista' | 'minorista';
    telefono: string;
    email: string;
    totalCompras: number;
}

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    onSave: (data: Partial<Customer>) => void;
}

export default function CustomerModal({ isOpen, onClose, customer, onSave }: CustomerModalProps) {
    const [documento, setDocumento] = useState('');
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState<'mayorista' | 'minorista'>('minorista');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [limiteCredito, setLimiteCredito] = useState(0);

    useEffect(() => {
        if (customer) {
            setDocumento(customer.documento);
            setNombre(customer.nombre);
            setTipo(customer.tipo);
            setTelefono(customer.telefono);
            setEmail(customer.email);
        } else {
            setDocumento('');
            setNombre('');
            setTipo('minorista');
            setTelefono('');
            setEmail('');
            setDireccion('');
            setLimiteCredito(0);
        }
    }, [customer, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            documento,
            nombre,
            tipo,
            telefono,
            email
        });
    };

    const modalStyles: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
    };

    const contentStyles: React.CSSProperties = {
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    };

    const headerStyles: React.CSSProperties = {
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px 16px 0 0'
    };

    const inputStyles: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '0.95rem',
        color: '#374151'
    };

    const labelStyles: React.CSSProperties = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '0.5rem'
    };

    return (
        <div style={modalStyles} onClick={onClose}>
            <div style={contentStyles} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={headerStyles}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >×</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyles}>RFC / CURP *</label>
                        <input
                            type="text"
                            value={documento}
                            onChange={e => setDocumento(e.target.value)}
                            placeholder="Ej: XAXX010101000"
                            required
                            style={inputStyles}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyles}>Nombre o Razón Social *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Nombre completo o razón social"
                            required
                            style={inputStyles}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyles}>Tipo de Cliente</label>
                        <select
                            value={tipo}
                            onChange={e => setTipo(e.target.value as 'mayorista' | 'minorista')}
                            style={{ ...inputStyles, cursor: 'pointer' }}
                        >
                            <option value="minorista">Minorista</option>
                            <option value="mayorista">Mayorista</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyles}>Teléfono</label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                                placeholder="55 1234 5678"
                                style={inputStyles}
                            />
                        </div>
                        <div>
                            <label style={labelStyles}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="cliente@email.com"
                                style={inputStyles}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyles}>Dirección</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={e => setDireccion(e.target.value)}
                            placeholder="Calle, número, colonia, CP"
                            style={inputStyles}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyles}>Límite de Crédito ($)</label>
                        <input
                            type="number"
                            value={limiteCredito}
                            onChange={e => setLimiteCredito(Number(e.target.value))}
                            min="0"
                            step="100"
                            style={inputStyles}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#6B7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            {customer ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
