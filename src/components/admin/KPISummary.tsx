'use client';

// ============================================
// KPI SUMMARY CARD COMPONENT
// Standardized across all admin pages
// ============================================

interface KPICardProps {
    label: string;
    value: string | number;
    color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan' | 'gray';
    prefix?: string; // e.g., '$' for money
}

interface KPISummaryProps {
    cards: KPICardProps[];
}

const colorMap = {
    blue: { border: '#3B82F6', text: '#3B82F6' },
    green: { border: '#22C55E', text: '#22C55E' },
    amber: { border: '#F59E0B', text: '#F59E0B' },
    red: { border: '#EF4444', text: '#EF4444' },
    purple: { border: '#7C3AED', text: '#7C3AED' },
    cyan: { border: '#06B6D4', text: '#06B6D4' },
    gray: { border: '#6B7280', text: '#374151' },
};

export function KPICard({ label, value, color = 'blue', prefix = '' }: KPICardProps) {
    const colors = colorMap[color];

    return (
        <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            borderLeft: `4px solid ${colors.border}`,
            flex: 1,
            minWidth: '160px'
        }}>
            <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.35rem'
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: colors.text,
                fontFamily: "'Inter', sans-serif"
            }}>
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </div>
        </div>
    );
}

export function KPISummary({ cards }: KPISummaryProps) {
    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
        }}>
            {cards.map((card, index) => (
                <KPICard key={index} {...card} />
            ))}
        </div>
    );
}

export default KPISummary;
