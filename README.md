# Google Calendar Skill 📅

Multi-agent Google Calendar automation for OpenClaw agents. Syncs external data sources (like schabi.ch for teacher), creates events, and manages reminders with OneDrive material links.

## Multi-Agent Usage

This skill is designed to work with **any OpenClaw agent**:

- **Teacher Agent**: Syncs schabi.ch homework/exams
- **CTO Agent**: Can manage meeting schedules, deadlines
- **Personal Agent**: Can manage personal calendars
- **Any Agent**: Extensible for custom use cases

## Quick Start

```bash
# Initialize for any agent
google-calendar-skill init --agent <agent-name>

# Sync data source to calendar
google-calendar-skill sync <source>

# Create event
google-calendar-skill create-event --summary "Meeting" --date "2026-02-25"
```

## Features

- 🔄 **Multi-Source Sync**: Sync from various data sources
- 📎 **OneDrive Integration**: Material links in events
- 🎨 **Smart Color Coding**: Customizable per agent
- ⏰ **Intelligent Reminders**: Configurable per event type
- 📅 **Recurring Events**: Weekly schedules
- 🔀 **Multi-Agent**: One skill, many agents

## Configuration

Each agent can have its own `config.json`:

```json
{
  "agent": "teacher",
  "google_calendar": {
    "account": "workhorsejames@gmail.com",
    "colors": {
      "exam": 11,
      "homework": 6,
      "study": 5
    }
  },
  "onedrive": {
    "share_link": "https://1drv.ms/..."
  },
  "sources": {
    "schabi": {
      "auto_sync": true,
      "skill_path": "~/.openclaw/skills/schabi-integration"
    }
  }
}
```

## Installation

```bash
ln -s ~/.openclaw/workspace/projects/google-calendar-skill/bin/google-calendar-skill ~/.local/bin/
```

## Extending for New Agents

To add calendar support for a new agent:

1. Create config in `configs/<agent-name>.json`
2. Add source sync logic if needed
3. Use CLI with `--agent <agent-name>` flag

## License

MIT
