function escapeCsvCell(cellData: any): string {
    const stringData = String(cellData ?? ''); // Handle null/undefined
    if (stringData.includes('"') || stringData.includes(',') || stringData.includes('\n')) {
        return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
}


function convertToCSV(data: any[]): string {
    if (!data || data.length === 0) {
        return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.map(escapeCsvCell).join(','));

    for (const row of data) {
        const values = headers.map(header => escapeCsvCell(row[header]));
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

export function exportToCsv(data: any[], filename: string) {
    if (!data || data.length === 0) {
        console.warn("Export aborted: No data to export.");
        return;
    }
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
