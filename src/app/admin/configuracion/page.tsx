'use client';

import { useState, useEffect } from 'react';

export default function ConfiguracionPage() {
    const [activeTab, setActiveTab] = useState('empresa');

    // Company data
    const [nombreEmpresa, setNombreEmpresa] = useState('Sellast POS');
    const [rfc, setRfc] = useState('SEL260121XX0');
    const [direccion, setDireccion] = useState('Av. Reforma 100, Col. Centro, CDMX');
    const [telefono, setTelefono] = useState('55 1234 5678');
    const [email, setEmail] = useState('contacto@sellast.com');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    // Tax config
    const [ivaRate, setIvaRate] = useState(16);
    const [retencionIva, setRetencionIva] = useState(false);
    const [retencionIsr, setRetencionIsr] = useState(false);

    // Ticket config
    const [mostrarLogo, setMostrarLogo] = useState(true);
    const [mostrarQr, setMostrarQr] = useState(true);
    const [mensajeTicket, setMensajeTicket] = useState('¡Gracias por su compra!');
    const [anchoTicket, setAnchoTicket] = useState('80mm');

    // Load saved config on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('sellast_config');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                if (config.nombreEmpresa) setNombreEmpresa(config.nombreEmpresa);
                if (config.rfc) setRfc(config.rfc);
                if (config.direccion) setDireccion(config.direccion);
                if (config.telefono) setTelefono(config.telefono);
                if (config.email) setEmail(config.email);
                if (config.logoUrl) setLogoUrl(config.logoUrl);
                if (config.ivaRate !== undefined) setIvaRate(config.ivaRate);
                if (config.retencionIva !== undefined) setRetencionIva(config.retencionIva);
                if (config.retencionIsr !== undefined) setRetencionIsr(config.retencionIsr);
                if (config.mostrarLogo !== undefined) setMostrarLogo(config.mostrarLogo);
                if (config.mostrarQr !== undefined) setMostrarQr(config.mostrarQr);
                if (config.mensajeTicket) setMensajeTicket(config.mensajeTicket);
                if (config.anchoTicket) setAnchoTicket(config.anchoTicket);
            } catch (e) {
                console.error('Error loading config:', e);
            }
        }
    }, []);

    const tabs = [
        { id: 'empresa', label: 'Empresa', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
        { id: 'impuestos', label: 'Impuestos', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
        { id: 'tickets', label: 'Tickets', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
        { id: 'usuarios', label: 'Usuarios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
        { id: 'seguridad', label: 'Seguridad', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
    ];

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
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Configuración
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Personaliza tu sistema de punto de venta
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Sidebar */}
                <div style={{ width: '220px', flexShrink: 0 }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1.25rem',
                                    background: activeTab === tab.id ? '#EEF2FF' : 'transparent',
                                    border: 'none',
                                    borderLeft: activeTab === tab.id ? '3px solid #3B82F6' : '3px solid transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.9rem',
                                    fontWeight: activeTab === tab.id ? 600 : 400,
                                    color: activeTab === tab.id ? '#3B82F6' : '#6b7280'
                                }}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '1.5rem'
                    }}>
                        {/* Empresa Tab */}
                        {activeTab === 'empresa' && (
                            <>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>
                                    Datos de la Empresa
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={labelStyles}>Nombre de la Empresa</label>
                                        <input
                                            type="text"
                                            value={nombreEmpresa}
                                            onChange={e => setNombreEmpresa(e.target.value)}
                                            style={inputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyles}>RFC</label>
                                        <input
                                            type="text"
                                            value={rfc}
                                            onChange={e => setRfc(e.target.value)}
                                            style={inputStyles}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyles}>Dirección Fiscal</label>
                                    <input
                                        type="text"
                                        value={direccion}
                                        onChange={e => setDireccion(e.target.value)}
                                        style={inputStyles}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={labelStyles}>Teléfono</label>
                                        <input
                                            type="tel"
                                            value={telefono}
                                            onChange={e => setTelefono(e.target.value)}
                                            style={inputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyles}>Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            style={inputStyles}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyles}>Logo de la Empresa</label>
                                    <div style={{
                                        border: '2px dashed #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        background: logoUrl ? '#f9fafb' : 'transparent'
                                    }}
                                        onClick={() => document.getElementById('logo-input')?.click()}
                                    >
                                        <input
                                            id="logo-input"
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        alert('El archivo debe ser menor a 2MB');
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        setLogoUrl(event.target?.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />

                                        {logoUrl ? (
                                            <div>
                                                <img
                                                    src={logoUrl}
                                                    alt="Logo de empresa"
                                                    style={{
                                                        maxWidth: '150px',
                                                        maxHeight: '100px',
                                                        objectFit: 'contain',
                                                        marginBottom: '0.5rem'
                                                    }}
                                                />
                                                <p style={{ color: '#10B981', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                                                    ✓ Logo cargado correctamente
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLogoUrl(null);
                                                    }}
                                                    style={{
                                                        marginTop: '0.5rem',
                                                        padding: '0.25rem 0.75rem',
                                                        background: '#FEE2E2',
                                                        color: '#DC2626',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Eliminar logo
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                                                    Arrastra tu logo aquí o haz click para seleccionar
                                                </p>
                                                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                                                    PNG, JPG hasta 2MB
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Impuestos Tab */}
                        {activeTab === 'impuestos' && (
                            <>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>
                                    Configuración de Impuestos
                                </h2>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyles}>Tasa de IVA (%)</label>
                                    <input
                                        type="number"
                                        value={ivaRate}
                                        onChange={e => setIvaRate(Number(e.target.value))}
                                        min="0"
                                        max="100"
                                        style={{ ...inputStyles, maxWidth: '150px' }}
                                    />
                                    <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                        La tasa estándar en México es del 16%
                                    </p>
                                </div>

                                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={retencionIva}
                                            onChange={e => setRetencionIva(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                        />
                                        <div>
                                            <span style={{ fontWeight: 500, color: '#374151' }}>Retención de IVA</span>
                                            <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                                                Aplica retención del 10.67% de IVA
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={retencionIsr}
                                            onChange={e => setRetencionIsr(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                        />
                                        <div>
                                            <span style={{ fontWeight: 500, color: '#374151' }}>Retención de ISR</span>
                                            <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                                                Aplica retención del 10% de ISR
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Tickets Tab */}
                        {activeTab === 'tickets' && (
                            <>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>
                                    Configuración de Tickets
                                </h2>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyles}>Ancho de Papel</label>
                                    <select
                                        value={anchoTicket}
                                        onChange={e => setAnchoTicket(e.target.value)}
                                        style={{ ...inputStyles, maxWidth: '200px', cursor: 'pointer' }}
                                    >
                                        <option value="58mm">58mm (Térmico pequeño)</option>
                                        <option value="80mm">80mm (Térmico estándar)</option>
                                        <option value="A4">A4 (Carta)</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={mostrarLogo}
                                            onChange={e => setMostrarLogo(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                        />
                                        <span style={{ fontWeight: 500, color: '#374151' }}>Mostrar logo en ticket</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={mostrarQr}
                                            onChange={e => setMostrarQr(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                        />
                                        <span style={{ fontWeight: 500, color: '#374151' }}>Mostrar código QR</span>
                                    </label>
                                </div>

                                <div>
                                    <label style={labelStyles}>Mensaje de agradecimiento</label>
                                    <textarea
                                        value={mensajeTicket}
                                        onChange={e => setMensajeTicket(e.target.value)}
                                        rows={3}
                                        style={{ ...inputStyles, resize: 'vertical' }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Usuarios Tab */}
                        {activeTab === 'usuarios' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                                        Gestión de Usuarios
                                    </h2>
                                    <button style={{
                                        padding: '0.5rem 1rem',
                                        background: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}>
                                        + Nuevo Usuario
                                    </button>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>USUARIO</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ROL</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ESTADO</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { nombre: 'Administrador', email: 'admin@sellast.com', rol: 'Administrador', activo: true },
                                            { nombre: 'Cajero 1', email: 'cajero1@sellast.com', rol: 'Cajero', activo: true },
                                            { nombre: 'Vendedor', email: 'vendedor@sellast.com', rol: 'Vendedor', activo: false },
                                        ].map((user, i) => (
                                            <tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <div style={{ fontWeight: 500 }}>{user.nombre}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{user.email}</div>
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: user.rol === 'Administrador' ? '#DBEAFE' : '#E5E7EB',
                                                        color: user.rol === 'Administrador' ? '#2563EB' : '#6B7280'
                                                    }}>
                                                        {user.rol}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: user.activo ? '#D1FAE5' : '#FEE2E2',
                                                        color: user.activo ? '#059669' : '#DC2626'
                                                    }}>
                                                        {user.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <button style={{
                                                        padding: '0.35rem 0.75rem',
                                                        background: '#F59E0B',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        marginRight: '0.5rem'
                                                    }}>
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {/* Seguridad Tab */}
                        {activeTab === 'seguridad' && (
                            <>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>
                                    Configuración de Seguridad
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                            />
                                            <div>
                                                <span style={{ fontWeight: 500, color: '#374151' }}>Autenticación de dos factores</span>
                                                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                                                    Requiere código adicional al iniciar sesión
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                            />
                                            <div>
                                                <span style={{ fontWeight: 500, color: '#374151' }}>Registro de actividad</span>
                                                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                                                    Guarda bitácora de todas las acciones
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={false}
                                                style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                            />
                                            <div>
                                                <span style={{ fontWeight: 500, color: '#374151' }}>Bloqueo automático</span>
                                                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                                                    Bloquea sesión después de 5 minutos de inactividad
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Save Button */}
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button style={{
                                padding: '0.75rem 1.5rem',
                                background: '#6B7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    // Save all settings to localStorage
                                    const config = {
                                        nombreEmpresa,
                                        rfc,
                                        direccion,
                                        telefono,
                                        email,
                                        logoUrl,
                                        ivaRate,
                                        retencionIva,
                                        retencionIsr,
                                        mostrarLogo,
                                        mostrarQr,
                                        mensajeTicket,
                                        anchoTicket
                                    };
                                    localStorage.setItem('sellast_config', JSON.stringify(config));
                                    alert('✅ Configuración guardada exitosamente');
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
