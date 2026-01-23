'use client';

// ============================================
// CONFIG STORE - LocalStorage based
// Stores company settings for tickets/receipts
// ============================================

export interface CompanyConfig {
    nombreEmpresa: string;
    rfc: string;
    direccion: string;
    telefono: string;
    email: string;
    logoUrl: string | null;
    ivaRate: number;
    mostrarLogo: boolean;
    mostrarQr: boolean;
    mensajeTicket: string;
    anchoTicket: string;
}

const STORAGE_KEY = 'sellast_config';

const defaultConfig: CompanyConfig = {
    nombreEmpresa: 'Mi Empresa',
    rfc: 'XAXX010101000',
    direccion: 'Av. Principal 123, Ciudad',
    telefono: '55 1234 5678',
    email: 'contacto@miempresa.com',
    logoUrl: null,
    ivaRate: 16,
    mostrarLogo: true,
    mostrarQr: true,
    mensajeTicket: '¡Gracias por su compra!',
    anchoTicket: '80mm'
};

export function getConfig(): CompanyConfig {
    if (typeof window === 'undefined') return defaultConfig;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return defaultConfig;
    }

    try {
        const parsed = JSON.parse(stored);
        return {
            ...defaultConfig,
            ...parsed
        };
    } catch (e) {
        console.error('Error loading config:', e);
        return defaultConfig;
    }
}

export function saveConfig(config: Partial<CompanyConfig>): CompanyConfig {
    const current = getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export function getCompanyName(): string {
    return getConfig().nombreEmpresa;
}

export function getTicketConfig() {
    const config = getConfig();
    return {
        companyName: config.nombreEmpresa,
        rfc: config.rfc,
        address: config.direccion,
        phone: config.telefono,
        logo: config.logoUrl,
        showLogo: config.mostrarLogo,
        showQr: config.mostrarQr,
        thankYouMessage: config.mensajeTicket,
        ticketWidth: config.anchoTicket
    };
}
