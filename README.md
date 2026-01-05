# XRPL Governance Companion

> Governance clarity for XRPL validators

A non-custodial, read-only-first governance decision-support application designed to increase XRPL validator participation by reducing friction, fear, and social ambiguity.

## 🎯 Purpose

XRPL amendments stall because validators:
- Lack clear, accessible context
- Fear ledger performance degradation  
- Don't know who benefits
- Procrastinate due to unclear priority
- Forget their own validator's state

**Goal:** Make participation easier than avoidance.

## 🚨 Non-Negotiable Constraints

- ✅ Read-only by default
- ✅ No private keys, no wallet custody
- ✅ No automated voting or execution
- ✅ No DAO framing
- ✅ No persuasion or recommendations
- ✅ No gamification or leaderboards
- ✅ Privacy-first (local-only storage)
- ✅ All notifications opt-in
- ✅ Institutional, neutral tone

## ✨ Features

### Home Screen - Governance Inbox
- Progress hero showing validator support status
- Notification ticker for amendments needing attention
- Needs attention panel with quick stats
- Filterable and sortable amendment list

### Amendment Cards
- Clear tier classification (A/B/C)
- Performance impact indicator
- Clarity level indicator
- Waiting time display
- Mark as completed/reviewed

### Amendment Brief (Detailed View)
- Plain-English explanation
- Who this helps (with examples)
- Ledger impact assessment
- What changed since last review
- Estimated review time
- References and links

### Settings
- **Validator Context**: Optional public key input to check public network data
- **Validator Status**: Toggle to show public signals (UNL presence, validation activity)
- **Notification Preferences**: Control in-app and OS notifications

### Additional Views
- Weekly Digest: Summary of changes, progress, and recommendations
- References: Curated resources for XRPL governance
- Governance Guide: FAQ and educational content
- Notifications Panel: Centralized notification management

## 🛠 Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Framer Motion for animations
- Lucide React for icons
- CSS Variables for theming
- Local Storage for persistence

## 🎨 Design System

### Primary Colors
- Ripple Blue: `#0033AD`
- Deep Ocean: `#0A2540`

### Neutrals
- Cloud White: `#F5F7FA`
- Slate: `#6B7280`
- Silver: `#D1D5DB`

### Accents
- Completed Green: `#16A34A`
- Attention Amber: `#F59E0B`
- Action Indigo: `#4F46E5`

## 📦 Installation

```bash
# Navigate to project directory
cd xrpl-governance-companion

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧠 UX Principles

- **Progressive disclosure**: No clutter, reveal information as needed
- **One primary action per screen**: Clear focus
- **Neutral language**: Replace "vote" with "review" / "completed"
- **Calm, authoritative tone**: No pressure or persuasion
- **Everything optional and reversible**: Users maintain full control

## 📝 Data Model

Amendments are stored as curated JSON with:
- Tier classification
- Performance impact estimates
- Clarity indicators
- Beneficiary categories
- Evidence links
- Review time estimates

## 🔒 Privacy

- All user data stored locally in browser
- No backend required for core functionality
- Validator public key (optional) used only for public data lookup
- Clear data option available in settings

## 📄 License

MIT

---

**"XRPL Governance Companion helps validators track, understand, and review amendments — with performance awareness, clarity indicators, optional validator context, and private completion tracking — without voting for them."**

*Make governance boring, safe, and obvious.*
