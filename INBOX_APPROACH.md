# Folk Unified Inbox — Design Rationale

## What we built

A unified **Inbox** that replaces the previous separate Notifications + Tasks pages. It consolidates all action items into one place, organized by state rather than by time.

### Three tabs

| Tab | Content | Grouped by |
|-----|---------|------------|
| **Inbox** | All active items (mentions, assignments, follow-ups, reminders, group invites) | Today / This week / Older |
| **Upcoming** | Reminders only | This week / Next week / Later |
| **Done** | All actioned items | Flat list |

### Item types

- **Mention** — a teammate mentioned you on a contact
- **Assignment** — a teammate assigned you to a contact
- **Follow-up suggestion** — folk AI suggests you follow up (triggered by inactivity or email signals)
- **Reminder** — a user-set reminder with a due date
- **Group invite** — someone invited you to a group

---

## Rationale

### Why a unified inbox?

Previously, notifications and tasks lived on separate pages. This created friction:
- Users had to switch between two places to understand what they needed to do today
- Conceptually, a "mention" and a "reminder" are both action items — they deserve the same treatment
- A single inbox creates a clear daily ritual: open it, work through it, close it

### Why state-based tabs (Inbox / Upcoming / Done) instead of time-based?

The original time-based design (Today / This week / Next week) had a critical flaw: **items would silently disappear**. If you go on holiday for a week, you come back to an empty "Today" tab — but all those items were real and still need attention.

State-based tabs solve this:
- Items persist in **Inbox** until you explicitly action them (mark done, dismiss, snooze)
- Nothing is lost. Older items are still visible, just grouped further down
- The model matches how email inboxes work — users already understand it

### Why is Upcoming reminders-only (not follow-ups)?

Follow-ups are **reactive** — they are triggered by signals (email replies, inactivity periods, AI analysis). You can't predict when a follow-up will appear, so they cannot be "scheduled." Including them in Upcoming would create noise and false expectations.

Reminders, on the other hand, are **user-set** with explicit future dates, making them safe to show in a calendar-like upcoming view.

---

## Pros

- **Single destination** — one place to start and end the day
- **Nothing gets lost** — persistent model means items survive holidays and busy periods
- **Clear mental model** — Inbox (act now) / Upcoming (act later) / Done (review)
- **Scalable** — new item types (e.g., contract signature requests) can be added without restructuring
- **Familiar** — maps to email inbox patterns users already know
- **Contextual actions** — hover actions are type-specific (reply for mentions, snooze for reminders, accept/decline for invites)

## Cons / Tradeoffs

- **Inbox can grow unbounded** — without discipline, the inbox fills up permanently. Requires snooze or dismiss patterns to stay clean. Risk of "notification bankruptcy" if users ignore it.
- **Upcoming is reminders-only** — follow-ups don't appear here even if they feel future-oriented. Could feel incomplete to some users.
- **No priority signal** — items are ordered by recency only. An urgent mention from 3 days ago looks the same as a low-priority one from today.
- **Merging unlike things** — a group invite and a task reminder feel semantically different. Some users may prefer separate surfaces for social vs. personal productivity.
- **Done tab may be underused** — once actioned, users rarely review done items. The tab may be mostly dead weight in practice.
- **No cross-contact view** — the CP task panel (Overdue / Completed) is contact-scoped. The inbox is global. There's no "all my tasks across all contacts" view yet.

---

## Open questions

1. Should **snooze** move items to Upcoming, or just hide them temporarily?
2. Should items have a **priority/urgency** signal to sort within groups?
3. Is **Done** worth keeping as a tab, or should actioned items just disappear?
4. Should follow-up suggestions in the inbox link directly to the email thread that triggered them?
5. Long-term: should the CP task panel and the global inbox share the same data model?
