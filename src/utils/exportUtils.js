import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportToPDF = (transactions, title = 'Rapport CampusEat') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`, 14, 30);
  
  const tableData = transactions.map(t => [
    format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
    t.studentId,
    t.studentName,
    t.restaurant,
    t.agentName || 'N/A'
  ]);
  
  doc.autoTable({
    startY: 35,
    head: [['Date', 'ID Étudiant', 'Nom', 'Restaurant', 'Agent']],
    body: tableData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [16, 185, 129] }
  });
  
  doc.save(`campuseat-rapport-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportToExcel = (transactions, filename = 'campuseat-rapport') => {
  const data = transactions.map(t => ({
    'Date': format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
    'ID Étudiant': t.studentId,
    'Nom': t.studentName,
    'Restaurant': t.restaurant,
    'Agent': t.agentName || 'N/A',
    'Statut': t.validated ? 'Validé' : 'En attente'
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  
  XLSX.writeFile(wb, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

export const exportStatisticsToPDF = (stats, chartData) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Statistiques CampusEat', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Période: ${format(new Date(), 'MMMM yyyy')}`, 14, 30);
  doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`, 14, 36);
  
  doc.setFontSize(14);
  doc.text('Résumé', 14, 50);
  
  const summaryData = [
    ['Repas servis aujourd\'hui', stats.today.toString()],
    ['Repas cette semaine', stats.week.toString()],
    ['Repas ce mois', stats.month.toString()],
    ['Total des repas', stats.total.toString()],
    ['Étudiants actifs', stats.activeStudents.toString()],
    ['Total étudiants', stats.totalStudents.toString()]
  ];
  
  doc.autoTable({
    startY: 55,
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] }
  });
  
  doc.save(`campuseat-statistiques-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
