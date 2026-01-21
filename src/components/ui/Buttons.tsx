'use client';

// ============================================
// COMPONENTES DE BOTONES REUTILIZABLES
// Sistema de UI Sellast - Estilo Pastel Premium
// ============================================

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

// ============================================
// TIPOS
// ============================================

type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ActionButtonType = 'view' | 'edit' | 'delete' | 'print' | 'cancel' | 'download';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    fullWidth?: boolean;
}

interface ButtonProps extends BaseButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

interface ActionButtonProps extends BaseButtonProps {
    actionType: ActionButtonType;
    showLabel?: boolean;
}

// ============================================
// ESTILOS BASE
// ============================================

const variantStyles: Record<ButtonVariant, { bg: string; bgHover: string; text: string; border?: string }> = {
    primary: { bg: '#06B6D4', bgHover: '#0891B2', text: '#FFFFFF' },
    success: { bg: '#10B981', bgHover: '#059669', text: '#FFFFFF' },
    danger: { bg: '#EF4444', bgHover: '#DC2626', text: '#FFFFFF' },
    warning: { bg: '#F59E0B', bgHover: '#D97706', text: '#FFFFFF' },
    info: { bg: '#3B82F6', bgHover: '#2563EB', text: '#FFFFFF' },
    ghost: { bg: 'transparent', bgHover: '#F1F5F9', text: '#64748B', border: '1px solid #E2E8F0' },
};

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; height: string }> = {
    sm: { padding: '0.5rem 0.75rem', fontSize: '0.8rem', height: '32px' },
    md: { padding: '0.75rem 1rem', fontSize: '0.9rem', height: '40px' },
    lg: { padding: '1rem 1.5rem', fontSize: '1rem', height: '48px' },
};

const actionTypeStyles: Record<ActionButtonType, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
    view: {
        bg: '#CFFAFE',
        color: '#06B6D4',
        label: 'Ver',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
    },
    edit: {
        bg: '#FEF3C7',
        color: '#F59E0B',
        label: 'Editar',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
    },
    delete: {
        bg: '#FEE2E2',
        color: '#EF4444',
        label: 'Eliminar',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
        ),
    },
    print: {
        bg: '#DBEAFE',
        color: '#3B82F6',
        label: 'Imprimir',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
            </svg>
        ),
    },
    cancel: {
        bg: '#FEE2E2',
        color: '#EF4444',
        label: 'Cancelar',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
    download: {
        bg: '#CFFAFE',
        color: '#06B6D4',
        label: 'Descargar',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
        ),
    },
};

// ============================================
// SPINNER COMPONENT
// ============================================

const Spinner = () => (
    <svg
        className="animate-spin"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: 'spin 1s linear infinite' }}
    >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
);

// ============================================
// BUTTON COMPONENT
// ============================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading = false, disabled = false, fullWidth = false, leftIcon, rightIcon, children, style, ...props }, ref) => {
        const variantStyle = variantStyles[variant];
        const sizeStyle = sizeStyles[size];
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: sizeStyle.padding,
                    fontSize: sizeStyle.fontSize,
                    fontWeight: 600,
                    background: isDisabled ? '#E2E8F0' : variantStyle.bg,
                    color: isDisabled ? '#94A3B8' : variantStyle.text,
                    border: variantStyle.border || 'none',
                    borderRadius: '8px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    width: fullWidth ? '100%' : 'auto',
                    ...style,
                }}
                onMouseEnter={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.background = variantStyle.bgHover;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.background = variantStyle.bg;
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }
                }}
                onMouseDown={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                    }
                }}
                onMouseUp={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1)';
                    }
                }}
                {...props}
            >
                {loading ? <Spinner /> : leftIcon}
                {children}
                {rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

// ============================================
// ACTION BUTTON COMPONENT
// ============================================

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ actionType, showLabel = false, loading = false, disabled = false, style, ...props }, ref) => {
        const typeStyle = actionTypeStyles[actionType];
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                title={typeStyle.label}
                style={{
                    width: showLabel ? 'auto' : '32px',
                    height: '32px',
                    padding: showLabel ? '0 12px' : '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: showLabel ? '6px' : '0',
                    background: isDisabled ? '#F1F5F9' : typeStyle.bg,
                    color: isDisabled ? '#94A3B8' : typeStyle.color,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.6 : 1,
                    transition: 'all 0.15s ease',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    ...style,
                }}
                onMouseEnter={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                }}
                onMouseDown={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.transform = 'scale(0.95)';
                    }
                }}
                onMouseUp={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }
                }}
                {...props}
            >
                {loading ? <Spinner /> : typeStyle.icon}
                {showLabel && <span>{typeStyle.label}</span>}
            </button>
        );
    }
);

ActionButton.displayName = 'ActionButton';

// ============================================
// ICON BUTTON COMPONENT
// ============================================

interface IconButtonProps extends BaseButtonProps {
    icon: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, variant = 'ghost', size = 'md', loading = false, disabled = false, style, ...props }, ref) => {
        const variantStyle = variantStyles[variant];
        const sizeStyle = sizeStyles[size];
        const isDisabled = disabled || loading;
        const btnSize = size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px';

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                style={{
                    width: btnSize,
                    height: btnSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDisabled ? '#E2E8F0' : variantStyle.bg,
                    color: isDisabled ? '#94A3B8' : variantStyle.text,
                    border: variantStyle.border || 'none',
                    borderRadius: '8px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    ...style,
                }}
                onMouseEnter={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.background = variantStyle.bgHover;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isDisabled) {
                        e.currentTarget.style.background = variantStyle.bg;
                    }
                }}
                {...props}
            >
                {loading ? <Spinner /> : icon}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';

// ============================================
// EXPORT BUTTON (Pre-configured)
// ============================================

interface ExportButtonProps extends Omit<ButtonProps, 'leftIcon' | 'variant'> { }

export const ExportButton = forwardRef<HTMLButtonElement, ExportButtonProps>(
    ({ children = 'Exportar', ...props }, ref) => {
        const downloadIcon = (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
        );

        return (
            <Button ref={ref} variant="primary" leftIcon={downloadIcon} {...props}>
                {children}
            </Button>
        );
    }
);

ExportButton.displayName = 'ExportButton';

// ============================================
// BUTTON GROUPS
// ============================================

interface ActionButtonGroupProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    disableView?: boolean;
    disableEdit?: boolean;
    disableDelete?: boolean;
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
    onView,
    onEdit,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true,
    disableView = false,
    disableEdit = false,
    disableDelete = false,
}) => {
    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {showView && <ActionButton actionType="view" onClick={onView} disabled={disableView} />}
            {showEdit && <ActionButton actionType="edit" onClick={onEdit} disabled={disableEdit} />}
            {showDelete && <ActionButton actionType="delete" onClick={onDelete} disabled={disableDelete} />}
        </div>
    );
};
