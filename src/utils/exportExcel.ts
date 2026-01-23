'use client';

import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param sheetName - Name of the Excel sheet (optional)
 */
export function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    sheetName: string = 'Datos'
): void {
    if (data.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate and download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date): string {
    if (typeof date === 'string') {
        return date;
    }
    return date.toLocaleDateString('es-MX');
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(amount: number): string {
    return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}
