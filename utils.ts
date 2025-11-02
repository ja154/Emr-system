import type { Patient } from './types';

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

declare global {
  interface Window {
    jspdf: any;
  }
}

export function exportToPdf(target: 'all' | Patient, allPatients: Patient[], options: { [key: string]: boolean }, filename: string) {
    if ((target === 'all' && allPatients.length === 0) || !target) {
        console.warn("Export aborted: No data to export.");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const addHeader = (title: string) => {
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.setDrawColor(224, 224, 224);
        doc.line(14, 32, doc.internal.pageSize.getWidth() - 14, 32);
        doc.setTextColor(0);
    };
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let finalY = 40;

    if (target === 'all') {
        addHeader('All Patients Summary');
        
        const dataToExport = allPatients.map(p => {
            const row: { [key: string]: any } = {};
            if (options.demographics) {
                row['MRN'] = p.id;
                row['Name'] = p.name;
                row['Date of Birth'] = p.dateOfBirth;
                row['Gender'] = p.gender;
            }
            if (options.alerts) {
                row['Alerts'] = p.alerts.join(', ');
            }
            return row;
        }).filter(row => Object.keys(row).length > 0);

        if (dataToExport.length > 0) {
            const head = [Object.keys(dataToExport[0])];
            const body = dataToExport.map(row => Object.values(row));
            
            doc.autoTable({
                startY: finalY,
                head: head,
                body: body,
                theme: 'striped',
                headStyles: { fillColor: [14, 165, 233] }, // sky-500
            });
        }

    } else { // Single patient
        const patient = target;
        addHeader(`Clinical Record: ${patient.name}`);

        if (options.demographics) {
            doc.setFontSize(14);
            doc.text('Patient Demographics', 14, finalY);
            finalY += 8;

            const demoData = [
                ['MRN', patient.id],
                ['Name', patient.name],
                ['Date of Birth', new Date(patient.dateOfBirth).toLocaleDateString()],
                ['Gender', patient.gender],
                ['National ID', patient.nationalId],
                ['NHIF Number', patient.nhifNumber],
            ];
            doc.autoTable({
                startY: finalY,
                body: demoData,
                theme: 'plain',
                styles: { cellPadding: 2 },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 40 },
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            finalY = doc.autoTable.previous.finalY + 10;
        }

        if (options.alerts && patient.alerts.length > 0) {
            doc.setFontSize(14);
            doc.text('Active Alerts', 14, finalY);
            finalY += 8;
            doc.autoTable({
                startY: finalY,
                head: [['Alert']],
                body: patient.alerts.map(a => [a]),
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38] }, // Red for alerts
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            finalY = doc.autoTable.previous.finalY + 10;
        }

        if (options.vitals && patient.vitals.length > 0) {
            doc.setFontSize(14);
            doc.text('Vitals History', 14, finalY);
            finalY += 8;
            doc.autoTable({
                startY: finalY,
                head: [['Date', 'BP (mmHg)', 'HR (bpm)', 'Temp (°C)', 'RR', 'SpO2 (%)']],
                body: patient.vitals.map(v => [
                    new Date(v.date).toLocaleString(),
                    v.bloodPressure,
                    v.heartRate,
                    v.temperature,
                    v.respiratoryRate,
                    v.oxygenSaturation,
                ]),
                theme: 'striped',
                headStyles: { fillColor: [14, 165, 233] },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            finalY = doc.autoTable.previous.finalY + 10;
        }

        if (options.labs && patient.labs.length > 0) {
            doc.setFontSize(14);
            doc.text('Lab Results', 14, finalY);
            finalY += 8;
            doc.autoTable({
                startY: finalY,
                head: [['Date', 'Test Name', 'Result', 'Reference Range', 'Status']],
                body: patient.labs.map(l => [
                    new Date(l.date).toLocaleDateString(),
                    l.testName,
                    l.result,
                    l.referenceRange,
                    l.status,
                ]),
                theme: 'striped',
                headStyles: { fillColor: [14, 165, 233] },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            finalY = doc.autoTable.previous.finalY + 10;
        }

        if (options.medications && patient.medications.length > 0) {
            doc.setFontSize(14);
            doc.text('Medications', 14, finalY);
            finalY += 8;
            doc.autoTable({
                startY: finalY,
                head: [['Name', 'Dosage', 'Frequency', 'Duration']],
                body: patient.medications.map(m => [
                    m.name,
                    m.dosage,
                    m.frequency,
                    m.duration,
                ]),
                theme: 'striped',
                headStyles: { fillColor: [14, 165, 233] },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            finalY = doc.autoTable.previous.finalY + 10;
        }

        if (options.notes && patient.notes.length > 0) {
            doc.setFontSize(14);
            doc.text('Clinical Notes', 14, finalY);
            finalY += 8;
            doc.autoTable({
                startY: finalY,
                head: [['Date', 'Author', 'Specialty', 'Note']],
                body: patient.notes.map(n => [
                    new Date(n.date + 'T00:00:00').toLocaleDateString(),
                    n.author,
                    n.specialty,
                    n.contentSnippet,
                ]),
                theme: 'striped',
                headStyles: { fillColor: [14, 165, 233] },
                columnStyles: { 3: { cellWidth: 'auto' } },
            });
        }
    }

    doc.save(filename);
}