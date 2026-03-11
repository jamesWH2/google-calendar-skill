/**
 * Teacher Calendar Manager
 * Native Google Calendar API implementation using Service Account
 */

const { google } = require('googleapis');
const fs = require('fs');

class CalendarManager {
  constructor(config = {}) {
    this.account = config.account || 'workhorsejames@gmail.com';
    this.keyPath = config.service_account_key;
    
    this.colors = {
      exam: 11,      // Red
      homework: 6,   // Orange
      study: 5,      // Yellow
      reminder: 2,   // Green
      ...config.colors
    };

    if (!this.keyPath || !fs.existsSync(this.keyPath)) {
      throw new Error(`Service account key not found at: ${this.keyPath}`);
    }

    this.auth = new google.auth.GoogleAuth({
      keyFile: this.keyPath,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  
  async getEvents({ timeMin, timeMax, maxResults = 200, calendarId = null }) {
    try {
      const response = await this.calendar.events.list({
        calendarId: calendarId || this.account,
        timeMin: timeMin,
        timeMax: timeMax,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching events:', error.message);
      return [];
    }
  }

  async deleteEvent({ eventId, calendarId = null }) {
    try {
      await this.calendar.events.delete({
        calendarId: calendarId || this.account,
        eventId: eventId,
      });
      return true;
    } catch (error) {
      console.error('Error deleting event:', error.message);
      return false;
    }
  }

  async createEvent({ summary, start, end, description = '', color = 1, calendarId = null, allDay = false, extendedProperties = null }) {
    try {
      // Deduplication check
      const timeMin = new Date(start);
      timeMin.setHours(0,0,0,0);
      const timeMax = new Date(start);
      timeMax.setHours(23,59,59,999);
      
      const existing = await this.getEvents({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        calendarId: calendarId || this.account
      });
      
      const duplicate = existing.find(e => {
        if (extendedProperties?.private?.sourceKey) {
          const existingSourceKey = e.extendedProperties?.private?.sourceKey;
          if (existingSourceKey === extendedProperties.private.sourceKey) {
            return true;
          }
        }
        return e.summary === summary;
      });
      if (duplicate) {
        console.log(`Event "${summary}" already exists on this day. Skipping.`);
        return duplicate; // Return existing event
      }

      const event = {
        summary,
        description,
        colorId: color.toString(),
      };

      if (allDay) {
        event.start = { date: start };
        event.end = { date: end };
      } else {
        event.start = {
          dateTime: start,
          timeZone: 'Europe/Zurich',
        };
        event.end = {
          dateTime: end,
          timeZone: 'Europe/Zurich',
        };
      }

      if (extendedProperties) {
        event.extendedProperties = extendedProperties;
      }

      const response = await this.calendar.events.insert({
        calendarId: calendarId || this.account,
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error.message);
      return null;
    }
  }

  async createExamEvent({ subject, date, topics = [], onedriveLink = null, calendarId = null }) {
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
      color: this.colors.exam,
      calendarId
    });
  }

  async createHomeworkEvent({ subject, dueDate, description: hwDescription, onedriveLink = null, calendarId = null }) {
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
      color: this.colors.homework,
      calendarId
    });
  }

  async createStudyEvent({ subject, topic, date, startTime = '17:30', duration = 90, onedriveLink = null, calendarId = null }) {
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
      color: this.colors.study,
      calendarId
    });
  }
}

module.exports = CalendarManager;
