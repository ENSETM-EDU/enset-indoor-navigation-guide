export interface StudentPresenceData {
  id: string;
  nom: string;
  prenom: string;
  numero_examen: number;
  salle_examen: string;
  epreuve: string;
  surveillantValidation: boolean;
  studentValidation: boolean;
  presenceComplete: boolean;
  timestamp: string;
}

export interface SessionData {
  sessionId: string;
  date: string;
  time: string;
  epreuve: string;
  surveillant: string;
  students: StudentPresenceData[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'enset_presence_sessions';

export class PresenceManager {
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getCurrentSession(epreuve: string): SessionData | null {
    const sessions = this.getAllSessions();
    const today = new Date().toISOString().split('T')[0];
    
    return sessions.find(session => 
      session.epreuve === epreuve && 
      session.date === today
    ) || null;
  }

  static createNewSession(epreuve: string, surveillant: string = 'Non spécifié'): SessionData {
    const now = new Date();
    const session: SessionData = {
      sessionId: this.generateSessionId(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      epreuve,
      surveillant,
      students: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const sessions = this.getAllSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    return session;
  }

  static updateStudentPresence(
    sessionId: string,
    studentData: any,
    surveillantValidation: boolean,
    studentValidation: boolean
  ): void {
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex(s => s.sessionId === sessionId);
    
    if (sessionIndex === -1) return;

    const session = sessions[sessionIndex];
    const existingStudentIndex = session.students.findIndex(s => s.id === studentData.id);
    
    const presenceData: StudentPresenceData = {
      id: studentData.id,
      nom: studentData.nom,
      prenom: studentData.prenom,
      numero_examen: studentData.numero_examen,
      salle_examen: studentData.salle_examen,
      epreuve: studentData.epreuve,
      surveillantValidation,
      studentValidation,
      presenceComplete: surveillantValidation && studentValidation,
      timestamp: new Date().toISOString()
    };

    if (existingStudentIndex >= 0) {
      session.students[existingStudentIndex] = presenceData;
    } else {
      session.students.push(presenceData);
    }

    session.updatedAt = new Date().toISOString();
    sessions[sessionIndex] = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  static getStudentPresence(sessionId: string, studentId: string): StudentPresenceData | null {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.sessionId === sessionId);
    
    if (!session) return null;
    
    return session.students.find(s => s.id === studentId) || null;
  }

  static getAllSessions(): SessionData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des sessions:', error);
      return [];
    }
  }

  static getSessionById(sessionId: string): SessionData | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.sessionId === sessionId) || null;
  }

  static deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.sessionId !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
  }

  static exportSessionData(sessionId: string): string {
    const session = this.getSessionById(sessionId);
    return session ? JSON.stringify(session, null, 2) : '';
  }

  static importSessionData(jsonData: string): boolean {
    try {
      const sessionData = JSON.parse(jsonData);
      const sessions = this.getAllSessions();
      
      // Vérifier si la session existe déjà
      const existingIndex = sessions.findIndex(s => s.sessionId === sessionData.sessionId);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = sessionData;
      } else {
        sessions.push(sessionData);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return false;
    }
  }

  static getSessionStats(sessionId: string) {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const total = session.students.length;
    const present = session.students.filter(s => s.presenceComplete).length;
    const surveillantOnly = session.students.filter(s => s.surveillantValidation && !s.studentValidation).length;
    const studentOnly = session.students.filter(s => !s.surveillantValidation && s.studentValidation).length;
    const absent = total - present - surveillantOnly - studentOnly;

    return {
      total,
      present,
      absent,
      surveillantOnly,
      studentOnly,
      presentagePresent: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }
}
