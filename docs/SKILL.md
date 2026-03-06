---
name: google-calendar-skill
description: Multi-agent Google Calendar automation with schabi.ch sync, OneDrive integration, and intelligent event management for any agent
homepage: https://github.com/jamesWH2/google-calendar-skill
metadata:
  openclaw:
    emoji: 📅
    requires:
      bins: ["node", "gog"]
---

# Google Calendar Skill

Automated Google Calendar management for Mara's school life. Syncs schabi.ch homework, creates study sessions, and manages exam reminders with OneDrive material links.

## Quick Start

```bash
# Sync schabi.ch to calendar
google-calendar-skill sync-schabi

# Create study session with material links
google-calendar-skill create-study --subject mathe --topic "Brüche" --date 2026-02-24
```

## Setup (SOTA/Service Account)

1.  Create a Google Service Account JSON key.
2.  Store it at `~/.openclaw/config/credentials/service-account-james.json`.
3.  Share your Google Calendar with the service account's `client_email` ("Make changes to events").
4.  Update `config.json` with the service account path:

```json
{
  "google_calendar": {
    "account": "your-calendar@gmail.com",
    "service_account_key": "/home/dataling/.openclaw/config/credentials/service-account-james.json"
  }
}
```

## Legacy Setup (OAuth)

(Deprecated) `gog auth credentials ...` and `gog auth add ...`.
Requires periodic manual re-authentication and is not recommended for background agents.

## Features

- 🔄 **Schabi.ch Auto-Sync**: Automatically creates calendar events from schabi.ch homework and exams
- 📎 **OneDrive Integration**: Material links directly in calendar events
- 🎨 **Smart Color Coding**: Exams (red), homework (orange), study sessions (yellow)
- ⏰ **Intelligent Reminders**: 1 week before exams, 2 days before deadlines
- 📅 **Recurring Events**: Weekly study sessions, recurring reminders

## Installation

```bash
# Symlink to make available in PATH
ln -s ~/.openclaw/workspace/projects/google-calendar-skill/bin/google-calendar-skill ~/.local/bin/google-calendar-skill
```

## Commands

```bash
google-calendar-skill init                 # Initialize connection
google-calendar-skill sync-schabi [--dry-run]  # Sync schabi.ch data
google-calendar-skill create-exam ...      # Create exam event
google-calendar-skill create-homework ...  # Create homework deadline
google-calendar-skill create-study ...     # Create study session
google-calendar-skill status               # Show status
```

## Configuration

Edit `config.json` in project root.

## License

MIT
