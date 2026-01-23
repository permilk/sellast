'use client';

// ============================================
// BRANCH SELECTOR COMPONENT
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useBranchStore } from '@/stores/branchStore';
import { getUserBranchPermissions } from '@/stores/branchData';

export default function BranchSelector() {
    const { data: session } = useSession();
    const { branches, currentBranch, setCurrentBranch } = useBranchStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get user role and permissions
    const userRole = (session?.user as any)?.role || 'cajero';
    const permissions = getUserBranchPermissions(userRole);
    const canSwitch = permissions.canSwitchBranch;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter branches based on user permissions
    const allowedBranches = branches.filter(b =>
        b.isActive && permissions.branches.includes(b.id)
    );

    // If user can't switch, just show current branch as text
    if (!canSwitch) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                color: '#A5B4FC',
                fontSize: '0.85rem',
                fontWeight: 500
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{currentBranch?.name || 'Sucursal'}</span>
                <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(251, 191, 36, 0.2)',
                    color: '#FBBF24',
                    padding: '2px 6px',
                    borderRadius: '4px'
                }}>Fijo</span>
            </div>
        );
    }

    const activeBranches = allowedBranches.filter(b => b.isActive);

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="branch-selector-btn"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: '#A5B4FC',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="branch-name">{currentBranch?.name || 'Seleccionar sucursal'}</span>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="branch-arrow"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    minWidth: '220px',
                    background: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '10px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #374151',
                        fontSize: '0.7rem',
                        color: '#9CA3AF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Sucursales
                    </div>
                    {activeBranches.map((branch) => (
                        <button
                            key={branch.id}
                            onClick={() => {
                                setCurrentBranch(branch.id);
                                setIsOpen(false);
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                background: branch.id === currentBranch?.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                                border: 'none',
                                borderLeft: branch.id === currentBranch?.id ? '3px solid #6366F1' : '3px solid transparent',
                                color: branch.id === currentBranch?.id ? '#A5B4FC' : '#E5E7EB',
                                fontSize: '0.9rem',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                                    {branch.name}
                                    {branch.isMain && (
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            fontSize: '0.65rem',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: '#34D399',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}>Principal</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                    {branch.code}
                                </div>
                            </div>
                            {branch.id === currentBranch?.id && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
