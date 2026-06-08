import { formatDateTimeForFilename } from './date';

export async function exportDhPatientPDF(): Promise<void> {
  const el = document.getElementById('dh-patient-report');
  if (!el) return;
  const html2pdf = (await import('html2pdf.js')).default;
  const filename = `dh_patient_report_${formatDateTimeForFilename(new Date())}.pdf`;
  html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(el)
    .save();
}

export async function exportDhDoctorPDF(): Promise<void> {
  const el = document.getElementById('dh-doctor-report');
  if (!el) return;
  const html2pdf = (await import('html2pdf.js')).default;
  const filename = `dh_doctor_report_${formatDateTimeForFilename(new Date())}.pdf`;
  html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(el)
    .save();
}

export async function exportPatientPDF(): Promise<void> {
  const el = document.getElementById('patient-report');
  if (!el) return;

  const html2pdf = (await import('html2pdf.js')).default;
  const filename = `patient_report_${formatDateTimeForFilename(new Date())}.pdf`;

  html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(el)
    .save();
}

export async function exportDoctorPDF(): Promise<void> {
  const el = document.getElementById('doctor-report');
  if (!el) return;

  const html2pdf = (await import('html2pdf.js')).default;
  const filename = `doctor_report_${formatDateTimeForFilename(new Date())}.pdf`;

  html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(el)
    .save();
}
