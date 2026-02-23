/**
 * Teacher Calendar Manager
 * Wrapper around gog for Google Calendar operations
 */

const { execSync } = require('child_process');

class CalendarManager {
  constructor(config = {}) {
    this.account = config.account || 'workhorsejames@gmail.com';
    this.colors = {
      exam: 11,      // Red
      homework: 6,   // Orange
      study: 5,      // Yellow
      reminder: 2,   // Green
      ...config.colors
    };
  }

  createEvent({ summary, start, end, description = '', color = 1 }) {
    try {
      let cmd = `gog calendar create ${this.account} `;
      cmd += `--summary "${summary}" `;
      cmd += `--from "${start}" `;
      cmd += `--to "${end}" `;
      cmd += `--event-color ${color}`;
      
      if (description) {
        cmd += ` --description "${description.replace(/"/g, '\\"')}"`;
      }

      const result = execSync(cmd, { encoding: 'utf8' });
      return this._parseEvent(result);
    } catch (error) {
      console.error('Error creating event:', error.message);
      return null;
    }
  }

  createExamEvent({ subject, date, topics = [], onedriveLink = null }) {
    const summary = `📝 ${subject.toUpperCase()} PRÜFUNG - Mara`;
    const start = new Date(date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    
    let description = `${subject.toUpperCase()}-Prüfung für Mara (5. Klasse)\n\n`;
    
    if (topics.length > 0) {
      description += 'Themen:\n';
      topics.forEach(t => description += `✓ ${t}\n`);
      description += '\n';
    }
    
    if (onedriveLink) {
      description += `Material: ${onedriveLink}\n\n`;
    }
    
    description += 'Viel Erfolg, Mara! Du schaffst das! 🌟';

    return this.createEvent({
      summary,
      start: start.toISOString(),
      end: end.toISOString(),
      description,
      color: this.colors.exam
    });
  }

  createHomeworkEvent({ subject, dueDate, description: hwDescription, onedriveLink = null }) {
    const summary = `📚 Hausaufgabe: ${subject}`;
    const start = new Date(`${dueDate}T23:45:00`);
    const end = new Date(`${dueDate}T23:59:00`);
    
    let desc = `Hausaufgabe: ${hwDescription}\n\nFach: ${subject}\n\n`;
    
    if (onedriveLink) {
      desc += `Material: ${onedriveLink}\n\n`;
    }
    
    desc += 'Nicht vergessen! ⏰';

    return this.createEvent({
      summary,
      start: start.toISOString(),
      end: end.toISOString(),
      description: desc,
      color: this.colors.homework
    });
  }

  createStudyEvent({ subject, topic, date, startTime = '17:30', duration = 90, onedriveLink = null }) {
    const summary = `📚 Lernzeit: ${topic}`;
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    
    let description = `Lernzeit für ${subject}\n\nThema: ${topic}\n\n`;
    
    if (onedriveLink) {
      description += `Material: ${onedriveLink}\n\n`;
    }
    
    description += 'Viel Erfolg! 💪';

    return this.createEvent({
      summary,
      start: start.toISOString(),
      end: end.toISOString(),
      description,
      color: this.colors.study
    });
  }

  _parseEvent(output) {
    const lines = output.split('\n');
    const event = {};
    
    lines.forEach(line => {
      const [key, value] = line.split('\t');
      if (key && value) {
        event[key] = value;
      }
    });
    
    return event;
  }
}

module.exports = CalendarManager;
