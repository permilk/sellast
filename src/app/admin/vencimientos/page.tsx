'use client';

export default function VencimientosPage() {
    return (
        <div className="page-header">
            <h1>Vencimientos</h1>
            <p>Controla las fechas de vencimiento de productos perecederos.</p>

            <div style={{
                marginTop: '2rem',
                padding: '3rem',
                background: 'var(--bg-panel)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Módulo en Desarrollo</h3>
                <p style={{ color: 'var(--text-muted)' }}>Esta funcionalidad estará disponible próximamente.</p>
            </div>

            <style jsx>{`
                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .page-header p {
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
}
