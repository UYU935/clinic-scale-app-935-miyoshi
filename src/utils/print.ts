export function printElement(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  const originalBody = document.body.innerHTML;
  document.body.innerHTML = el.innerHTML;
  window.print();
  document.body.innerHTML = originalBody;
  window.location.reload();
}

export function printPatientReport(): void {
  const el = document.getElementById('patient-report');
  if (!el) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>症状と生活支障の整理レポート</title>
      <style>
        ${getPrintStyles()}
      </style>
    </head>
    <body>
      ${el.outerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

export function printDoctorReport(): void {
  const el = document.getElementById('doctor-report');
  if (!el) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>医師用サマリー</title>
      <style>
        ${getPrintStyles()}
      </style>
    </head>
    <body>
      ${el.outerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

export function printDhPatientReport(): void {
  const el = document.getElementById('dh-patient-report');
  if (!el) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>デジタル健康問診レポート</title>
      <style>
        ${getPrintStyles()}
      </style>
    </head>
    <body>
      ${el.outerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

export function printDhDoctorReport(): void {
  const el = document.getElementById('dh-doctor-report');
  if (!el) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>医師用サマリー（デジタル健康問診）</title>
      <style>
        ${getPrintStyles()}
      </style>
    </head>
    <body>
      ${el.outerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

function getPrintStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif; font-size: 13px; color: #000; background: white; }
    .print-page { width: 210mm; min-height: 297mm; padding: 15mm; }
    h1 { font-size: 18px; margin-bottom: 8px; }
    h2 { font-size: 15px; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    h3 { font-size: 13px; margin-top: 12px; margin-bottom: 6px; }
    p { margin-bottom: 6px; line-height: 1.6; }
    ul { margin-left: 20px; margin-bottom: 8px; }
    li { margin-bottom: 4px; line-height: 1.6; }
    .subtitle { color: #555; font-size: 12px; margin-bottom: 12px; }
    .disclaimer { background: #f5f5f5; border-left: 3px solid #999; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; color: #444; }
    .section-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #eee; }
    .section-name { font-weight: bold; }
    .level-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; background: #e8e8e8; }
    .tag-item { margin-bottom: 12px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
    .tag-label { font-weight: bold; font-size: 13px; margin-bottom: 6px; }
    .alert-urgent { background: #fff0f0; border-left: 4px solid #cc0000; padding: 8px 12px; margin: 8px 0; font-weight: bold; color: #cc0000; }
    .alert-warning { background: #fff8e0; border-left: 4px solid #e6a000; padding: 8px 12px; margin: 8px 0; }
    .alert-notice { background: #f0f4ff; border-left: 4px solid #4070c0; padding: 8px 12px; margin: 8px 0; }
    .tips-list { list-style: decimal; }
    .caution-box { border: 1px solid #ffaaaa; background: #fff8f8; padding: 10px 14px; border-radius: 6px; }
    .caution-title { color: #cc3333; font-weight: bold; margin-bottom: 6px; }
    .no-print { display: none !important; }
    @media print {
      .no-print { display: none !important; }
      body { background: white; }
      .print-page { width: 210mm; min-height: 297mm; padding: 12mm; }
    }
  `;
}
