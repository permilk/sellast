'use client';

import { useState } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    last: string;
}

const usersMock: User[] = [
    { id: '1', name: "Admin Principal", email: "admin@sellast.com", role: "Super Admin", status: "active", last: "Hace 2 min" },
    { id: '2', name: "Vendedor Caja", email: "caja@sellast.com", role: "Vendedor", status: "active", last: "Hace 1 hora" },
    { id: '3', name: "Soporte Técnico", email: "soporte@sellast.com", role: "Soporte", status: "offline", last: "Ayer" },
    { id: '4', name: "Gestor Inventario", email: "stock@sellast.com", role: "Editor", status: "active", last: "Hace 3 horas" },
];

export default function UsuariosPage() {
    const [users, setUsers] = useState<User[]>(usersMock);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showToggleConfirm, setShowToggleConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [nuevoUsuario, setNuevoUsuario] = useState({ name: '', email: '', role: 'Vendedor' });
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const filteredUsers = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditForm({ name: user.name, email: user.email, role: user.role });
        setShowEditModal(true);
    };

    const handleToggleClick = (user: User) => {
        setSelectedUser(user);
        setShowToggleConfirm(true);
    };

    const saveEdit = () => {
        if (!editForm.name || !editForm.email) {
            setFormError('Nombre y Email son requeridos');
            return;
        }
        if (selectedUser) {
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
            setShowEditModal(false);
            setSuccessMessage(`Usuario "${editForm.name}" actualizado`);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const confirmToggle = () => {
        if (selectedUser) {
            setUsers(users.map(u =>
                u.id === selectedUser.id
                    ? { ...u, status: u.status === 'active' ? 'offline' : 'active' }
                    : u
            ));
            setShowToggleConfirm(false);
            setSuccessMessage(`Usuario "${selectedUser.name}" ${selectedUser.status === 'active' ? 'desactivado' : 'activado'}`);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleCreateUser = () => {
        if (!nuevoUsuario.name || !nuevoUsuario.email) {
            setFormError('Nombre y Email son requeridos');
            return;
        }
        const newUser: User = {
            id: Date.now().toString(),
            name: nuevoUsuario.name,
            email: nuevoUsuario.email,
            role: nuevoUsuario.role,
            status: 'active',
            last: 'Ahora'
        };
        setUsers([...users, newUser]);
        setNuevoUsuario({ name: '', email: '', role: 'Vendedor' });
        setShowModal(false);
        setFormError('');
        setSuccessMessage(`Usuario "${newUser.name}" creado exitosamente`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const modalOverlay: React.CSSProperties = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    };

    const modalContent: React.CSSProperties = {
        background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    position: 'fixed', top: '1rem', right: '1rem', zIndex: 2000,
                    background: '#10B981', color: 'white', padding: '1rem 1.5rem',
                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {successMessage}
                </div>
            )}

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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Usuarios
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gestión de acceso y roles del sistema
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
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
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nuevo Usuario
                </button>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Usuarios', value: users.length, color: 'blue' },
                { label: 'Activos', value: users.filter(u => u.status === 'active').length, color: 'green' },
                { label: 'Offline', value: users.filter(u => u.status === 'offline').length, color: 'gray' },
                { label: 'Super Admins', value: users.filter(u => u.role === 'Super Admin').length, color: 'purple' }
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
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre o email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div style={{ minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Rol</label>
                    <select
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '160px',
                            background: 'white'
                        }}
                    >
                        <option value="">Todos</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Almacenista">Almacenista</option>
                    </select>
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
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Usuario</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rol</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Último Acceso</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#E0E7FF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: '#4F46E5'
                                        }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, color: '#1f2937' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: user.role === 'Super Admin' ? '#EDE9FE' : '#DBEAFE',
                                        color: user.role === 'Super Admin' ? '#7C3AED' : '#3B82F6'
                                    }}>{user.role}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: user.status === 'active' ? '#10B981' : '#9CA3AF'
                                        }}></div>
                                        <span style={{ color: '#6b7280' }}>{user.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{user.last}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => handleEditClick(user)}
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
                                            onClick={() => handleToggleClick(user)}
                                            style={{
                                                width: '32px', height: '32px',
                                                background: user.status === 'active' ? '#FEE2E2' : '#D1FAE5',
                                                border: 'none', borderRadius: '6px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                                        >
                                            {user.status === 'active' ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <polyline points="22 4 12 14.01 9 11.01" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Nuevo Usuario */}
            {showModal && (
                <div style={modalOverlay} onClick={() => { setShowModal(false); setFormError(''); }}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Nuevo Usuario</h2>
                        {formError && (
                            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                {formError}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nombre *</label>
                                <input type="text" value={nuevoUsuario.name} onChange={e => setNuevoUsuario({ ...nuevoUsuario, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="Nombre completo" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email *</label>
                                <input type="email" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="usuario@sellast.com" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Rol *</label>
                                <select value={nuevoUsuario.role} onChange={e => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="Vendedor">Vendedor</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Soporte">Soporte</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowModal(false); setFormError(''); }} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleCreateUser} style={{ padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Guardar Usuario</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar Usuario */}
            {showEditModal && selectedUser && (
                <div style={modalOverlay} onClick={() => { setShowEditModal(false); setFormError(''); }}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Editar Usuario</h2>
                        {formError && (
                            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                {formError}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nombre *</label>
                                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email *</label>
                                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Rol *</label>
                                <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="Vendedor">Vendedor</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Soporte">Soporte</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowEditModal(false); setFormError(''); }} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={saveEdit} style={{ padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Toggle */}
            {showToggleConfirm && selectedUser && (
                <div style={modalOverlay} onClick={() => setShowToggleConfirm(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px', height: '60px',
                                background: selectedUser.status === 'active' ? '#FEE2E2' : '#D1FAE5',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                {selectedUser.status === 'active' ? (
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                    </svg>
                                ) : (
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                )}
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                ¿{selectedUser.status === 'active' ? 'Desactivar' : 'Activar'} usuario?
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                {selectedUser.status === 'active'
                                    ? `El usuario "${selectedUser.name}" perderá acceso al sistema.`
                                    : `El usuario "${selectedUser.name}" podrá acceder al sistema nuevamente.`
                                }
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowToggleConfirm(false)}
                                style={{ flex: 1, padding: '0.75rem', background: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmToggle}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    background: selectedUser.status === 'active' ? '#EF4444' : '#10B981',
                                    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                {selectedUser.status === 'active' ? 'Desactivar' : 'Activar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
