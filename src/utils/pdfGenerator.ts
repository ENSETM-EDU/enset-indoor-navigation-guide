import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionData, StudentPresenceData, PresenceManager } from './presenceManager';

export class PDFReportGenerator {
  static generatePresenceReport(sessionId: string): void {
    const session = PresenceManager.getSessionById(sessionId);
    if (!session) {
      alert('Session non trouvée');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // En-tête du document
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RAPPORT DE PRÉSENCE', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('École Normale Supérieure de l\'Enseignement Technique', pageWidth / 2, 30, { align: 'center' });
    
    // Informations de la session
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const sessionInfo = [
      `Date: ${new Date(session.date).toLocaleDateString('fr-FR')}`,
      `Heure: ${session.time}`,
      `Épreuve: ${session.epreuve}`,
      `Surveillant: ${session.surveillant}`,
      `ID Session: ${session.sessionId}`
    ];
    
    let yPosition = 45;
    sessionInfo.forEach(info => {
      doc.text(info, 20, yPosition);
      yPosition += 7;
    });
    
    // Statistiques
    const stats = PresenceManager.getSessionStats(sessionId);
    if (stats) {
      yPosition += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('STATISTIQUES:', 20, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      const statsInfo = [
        `Total étudiants vérifiés: ${stats.total}`,
        `Présents (confirmé): ${stats.present}`,
        `Validation surveillant uniquement: ${stats.surveillantOnly}`,
        `Validation étudiant uniquement: ${stats.studentOnly}`,
        `Taux de présence: ${stats.presentagePresent}%`
      ];
      
      statsInfo.forEach(stat => {
        doc.text(stat, 20, yPosition);
        yPosition += 6;
      });
    }
    
    // Tableau des étudiants
    yPosition += 15;
    
    const tableColumns = [
      'N° Examen',
      'CNE',
      'Nom',
      'Prénom',
      'Salle',
      'Surveillant',
      'Étudiant',
      'Statut',
      'Heure'
    ];
    
    const tableData = session.students.map(student => [
      student.numero_examen.toString(),
      student.id,
      student.nom,
      student.prenom,
      student.salle_examen,
      student.surveillantValidation ? '✓' : '✗',
      student.studentValidation ? '✓' : '✗',
      this.getStatusText(student),
      new Date(student.timestamp).toLocaleTimeString('fr-FR')
    ]);
    
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { halign: 'center', cellWidth: 15 },
        5: { halign: 'center', cellWidth: 12 },
        6: { halign: 'center', cellWidth: 12 },
        7: { halign: 'center', cellWidth: 20 },
        8: { halign: 'center', cellWidth: 15 }
      },
      didParseCell: function(data) {
        // Colorer les lignes selon le statut
        if (data.section === 'body') {
          const student = session.students[data.row.index];
          if (student.presenceComplete) {
            data.cell.styles.fillColor = [212, 237, 218]; // Vert clair
          } else if (student.surveillantValidation || student.studentValidation) {
            data.cell.styles.fillColor = [255, 243, 205]; // Jaune clair
          } else {
            data.cell.styles.fillColor = [248, 215, 218]; // Rouge clair
          }
        }
      }
    });
    
    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Généré le ${new Date().toLocaleString('fr-FR')} - Page ${i}/${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Téléchargement
    const fileName = `Presence_${session.epreuve}_${session.date}_${session.time.replace(/:/g, '-')}.pdf`;
    doc.save(fileName);
  }

  static generateSummaryReport(epreuve: string, dateRange?: { start: string; end: string }): void {
    const allSessions = PresenceManager.getAllSessions();
    let filteredSessions = allSessions.filter(s => s.epreuve === epreuve);
    
    if (dateRange) {
      filteredSessions = filteredSessions.filter(s => 
        s.date >= dateRange.start && s.date <= dateRange.end
      );
    }
    
    if (filteredSessions.length === 0) {
      alert('Aucune session trouvée pour les critères spécifiés');
      return;
    }
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RAPPORT RÉCAPITULATIF DE PRÉSENCE', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('École Normale Supérieure de l\'Enseignement Technique', pageWidth / 2, 30, { align: 'center' });
    
    // Informations générales
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 45;
    doc.text(`Épreuve: ${epreuve}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Période: ${dateRange ? `${dateRange.start} à ${dateRange.end}` : 'Toutes les dates'}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Nombre de sessions: ${filteredSessions.length}`, 20, yPosition);
    yPosition += 15;
    
    // Tableau récapitulatif des sessions
    const tableColumns = [
      'Date',
      'Heure',
      'Surveillant',
      'Total',
      'Présents',
      'Taux (%)',
      'En attente'
    ];
    
    const tableData = filteredSessions.map(session => {
      const stats = PresenceManager.getSessionStats(session.sessionId);
      return [
        new Date(session.date).toLocaleDateString('fr-FR'),
        session.time,
        session.surveillant,
        stats?.total.toString() || '0',
        stats?.present.toString() || '0',
        stats?.presentagePresent.toString() || '0',
        ((stats?.surveillantOnly || 0) + (stats?.studentOnly || 0)).toString()
      ];
    });
    
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Statistiques globales
    const totalStudents = filteredSessions.reduce((sum, session) => {
      const stats = PresenceManager.getSessionStats(session.sessionId);
      return sum + (stats?.total || 0);
    }, 0);
    
    const totalPresent = filteredSessions.reduce((sum, session) => {
      const stats = PresenceManager.getSessionStats(session.sessionId);
      return sum + (stats?.present || 0);
    }, 0);
    
    const globalPercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
    
    // @ts-ignore
    yPosition = doc.lastAutoTable.finalY + 20;
    
    doc.setFont('helvetica', 'bold');
    doc.text('STATISTIQUES GLOBALES:', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total vérifications: ${totalStudents}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Total présences confirmées: ${totalPresent}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Taux de présence global: ${globalPercentage}%`, 20, yPosition);
    
    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Généré le ${new Date().toLocaleString('fr-FR')} - Page ${i}/${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Téléchargement
    const fileName = `Recapitulatif_${epreuve}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  private static getStatusText(student: StudentPresenceData): string {
    if (student.presenceComplete) return 'Présent';
    if (student.surveillantValidation && !student.studentValidation) return 'Surveillant seul';
    if (!student.surveillantValidation && student.studentValidation) return 'Étudiant seul';
    return 'Non confirmé';
  }
}
