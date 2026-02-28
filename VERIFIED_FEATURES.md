# ScrollOff Verified Features
## Based on Actual Running Code (Branch: main-work-do-not-touch-prod/2026-02-28.v03)

This document lists ONLY features that are verified in the actual codebase implementation.

---

## ✅ VERIFIED SUBSCRIPTION TIERS

### 1. Free ($0)
**Product ID**: scrolloff.free
**Features**:
- Block up to 3 apps
- Website blocking on Safari
- 1 minute time per use
- Same-day minute rollover
- 45 min/day earn cap
- 2-hour cooldown
- Today-only stats, 7-day ledger
- Ad-free experience

### 2. Quiet Hours ($0.99/month)
**Product ID**: scrolloff.quiethours.monthly
**Tier Classification**: Add-on (can be purchased with any tier)
**Features**:
- Scheduled app blocking with automatic start/end
- Multiple Quiet Hours modes
- Overnight schedules supported
- Included in Premium & Pro (no extra charge)

### 3. Premium ($4.99/month)
**Product ID**: scrolloff.premium.monthly
**Features**:
- Unlimited app blocking
- 2 minute time per use
- 3 free 1-min emergency tokens/month
- 3-day rollover (45 min/day max)
- 90 min/day earn cap
- 1-hour cooldown
- 7-day stats, 30-day ledger
- 7-day trends
- Website blocking on Safari
- Still ad-free

### 4. Pro Monthly ($8.99/month)
**Product ID**: scrolloff.pro.monthly
**Features**:
- 14-day free trial
- 5 minute time per use
- 3 free 5-min emergency tokens/month
- 7-day rollover (60 min/day max)
- 120 min/day earn cap
- 30-minute cooldown
- 30-day stats, 90-day ledger
- 30-day trends + behavioral patterns
- Website blocking on Safari
- Zero ads, maximum control

### 5. Pro Yearly ($69.99/year)
**Product ID**: scrolloff.pro.yearly
**Features**:
- Save 35% vs monthly
- 14-day free trial
- 5 minute time per use
- 3 free 5-min emergency tokens/month
- 7-day rollover (60 min/day max)
- 120 min/day earn cap
- 30-minute cooldown
- 30-day stats, 90-day ledger
- 30-day trends + behavioral patterns
- Website blocking on Safari
- Best value, pay once per year

---

## ✅ VERIFIED CONSUMABLE PURCHASES

### Emergency Tokens (Available to all tiers)

1. **1 Minute Emergency Access** - $0.49
   - Product ID: scrolloff.emergency.token.1min
   - Duration: 60 seconds
   - Consumable purchase
   - Unlimited purchases

2. **2 Minutes Emergency Access** - $0.99 (Most popular)
   - Product ID: scrolloff.emergency.token.2min
   - Duration: 120 seconds
   - Consumable purchase
   - Unlimited purchases

3. **5 Minutes Emergency Access** - $1.49 (Best value)
   - Product ID: scrolloff.emergency.token.5min
   - Duration: 300 seconds
   - Consumable purchase
   - Unlimited purchases

### Hard Lock (No-Go Zone) Tokens (Available to all tiers)

1. **15 Minutes No-Go Zone Unlock**
   - Product ID: scrolloff.hardlock.token.15min
   - Duration: 900 seconds (15 minutes)
   - Works during No-Go Zone
   - Wallet-based accumulation

2. **Emergency No-Go Zone Disable**
   - Product ID: scrolloff.hardlock.emergency.disable
   - Immediately end No-Go Zone session
   - Disable No-Go Zone restrictions
   - Regain access to settings
   - Use only for true emergencies

---

## ✅ VERIFIED NEW FEATURES

### 1. Quiet Hours ⏰
**Implementation**: QuietHoursManager.swift, QuietHoursMode.swift
**What it does**: Schedule-based app blocking with NO wallet penalties

**Key Features**:
- Create up to 10 different modes
- Default presets: Work (9 AM - 5 PM Mon-Fri), Sleep (10 PM - 7 AM), Custom (6 PM - 9 PM)
- Minimum duration: 5 minutes
- Maximum duration: 23 hours 59 minutes
- No penalties, no wallet deduction, just gentle blocking
- App limits: Free tier (3 apps), Premium/Pro (unlimited)
- Supports overnight schedules (e.g., 10 PM to 7 AM)
- Multiple recovery windows if DeviceActivity events fail

**Entitlement**:
- Free users: Must purchase Quiet Hours add-on ($0.99/mo)
- Premium/Pro users: Included automatically

---

### 2. Focus Challenge 🎯
**Implementation**: FocusChallengeManager.swift, FocusChallenge.swift
**What it does**: Timed focus sessions with bonus token rewards

**Key Features**:
- Duration: 1-12 hours (user selects)
- Active hours: 6 AM to midnight only
- Earn 30 bonus seconds per hour of successful focus
- One challenge per day limit
- Cannot start if peek is active
- Must complete before midnight (same day)
- Track stats: Played, Won, Lost
- Real-time countdown timer
- Abandon option available

**Requirements**:
- Premium or Pro tier only
- No active peek when starting
- Must have enough time to complete before midnight

---

### 3. Milestones 🏆
**Implementation**: Milestone.swift, MilestoneTracker.swift
**What it does**: Track achievement moments

**Milestone Types**:
- Streak milestones
- Time saved milestones
- Urges resisted milestones
- Mindful breaks milestones
- Custom milestones

**Implementation Details**:
- Adds neutral ledger entries (0 balance change)
- Appears in Recent Activity / Ledger History
- Format: "Milestone unlocked: [description]|milestone:[kind]"
- SwiftData model with unique ID

**Note**: Rate limiting and daily caps are configured in AppConfig.Milestones (3 per day, 6-hour minimum interval)

---

### 4. Focus Score Calculator 📊
**Implementation**: FocusScoreCalculator.swift
**What it does**: Compute multi-factor progress score (0-100)

**Four Components**:

1. **Restraint (35% weight)**
   - How little peek time used TODAY vs daily cap
   - Formula: `1.0 - (todayPeekSeconds / dailyCapSeconds)`
   - Range: 0-100

2. **Discipline (30% weight)**
   - How few times peeked in period
   - Reference: 10 peeks per day = 0 discipline
   - Formula: `1.0 - (peekCount / (10 * days))`
   - Range: 0-100

3. **Consistency (20% weight)**
   - Days with zero peeks in period
   - For "Today" view: uses 5 peeks as reference instead of binary 0/100
   - Formula: `peekFreeDays / totalDays`
   - Range: 0-100

4. **Commitment (15% weight)**
   - Number of blocked apps
   - Scale: 0 apps=0, 1=20, 2=40, 3=60, 4=80, 5+=100
   - Range: 0-100

**Overall Score**: Weighted average of all four components

**Minimum Data Requirement**: 10 minutes of elapsed time in period (returns nil if less)

---

### 5. Enhanced Stats & History 📈
**Implementation**: HistoryManager.swift, StatsOverview.swift

**Tier-Based Stats Access**:
- **Free**: Today only (0 days historical)
- **Premium**: 7 days of detailed stats
- **Pro**: 30 days of detailed stats

**Ledger Retention**:
- **Free**: 7 days
- **Premium**: 30 days
- **Pro**: 90 days

**Insights Access**:
- **Free**: None
- **Premium**: 7-day insights
- **Pro**: 30-day insights + behavioral patterns

**Features**:
- Focus summary (time earned vs spent)
- 7-day focus trend graphs
- Most accessed apps list with peek counts
- Self-control checkpoint tracking
- Clean day streaks
- Verified self-control metrics

---

### 6. App-Based Distinction 📱
**What it does**: Show actual app names and icons in ledger

**Confirmed Locations**:
- Ledger entries show specific app names
- "Most accessed apps" list shows app icons and names
- Peek counts per app

**NOT Confirmed**:
- Notifications (user confirmed NOT in notifications, only in ledger)

---

### 7. Enhanced Dashboard UI 🎨
**Implementation**: DashboardView.swift, DashboardStats.swift

**New Dashboard Elements**:
- Guilt-Free Time Earned (circular progress)
- Scroll Time Breakdown (focus/free time with icons)
- Daily free restock countdown
- Daily cap reached indicator
- Progress bars for Restraint, Discipline, Consistency, Commitment
- "Open notes" and "Manage apps" buttons
- "Your Progress Today" score

**Tier-Specific Themes**:
- Free: Teal (#1DC0BF)
- Premium: Burgundy/Maroon
- Pro: Olive/Gold

---

### 8. No-Go Zone (Hard Lock) Performance Tracking 🔒
**What it does**: Track Hard Lock session analytics

**Metrics Tracked**:
- Total sessions
- Completed sessions
- Unlocked sessions (emergency limit used)
- Forfeited sessions (emergency disabled)
- Emergency tokens used (time)
- Hours protected in No-Go-Zone

**Hard Lock Minimums by Tier**:
- Free: 8 hours
- Premium: 4 hours
- Pro: 2 hours

---

## ⚙️ TIER COMPARISON CHART

| Feature | Free | Quiet Hours | Premium | Pro |
|---------|------|-------------|---------|-----|
| **Price** | $0 | $0.99/mo | $4.99/mo | $8.99/mo or $69.99/yr |
| **Max Apps** | 3 | N/A (add-on) | Unlimited | Unlimited |
| **Peek Duration** | 1 min | N/A | 2 min | 5 min |
| **Daily Earn Cap** | 45 min | N/A | 90 min | 120 min |
| **Rollover** | Same-day only | N/A | 3 days (45 min/day max) | 7 days (60 min/day max) |
| **Cooldown** | 2 hours | N/A | 1 hour | 30 minutes |
| **Stats History** | Today only | N/A | 7 days | 30 days |
| **Ledger Retention** | 7 days | N/A | 30 days | 90 days |
| **Insights** | None | N/A | 7-day trends | 30-day trends + patterns |
| **Hard Lock Min** | 8 hours | N/A | 4 hours | 2 hours |
| **Free Tokens/Month** | None | N/A | 3 × 1 min | 3 × 5 min |
| **Quiet Hours** | ❌ (must purchase) | ✅ | ✅ (included) | ✅ (included) |
| **Focus Challenge** | ❌ | ❌ | ✅ | ✅ |
| **Daily Free Peek Balance** | 1 min | N/A | 2 min | 5 min |

---

## 📸 SCREENSHOT MAPPING

| Screenshot File | Feature Shown | Description |
|----------------|---------------|-------------|
| dashboard-free.png | Free tier dashboard | Teal theme, basic features |
| focus-summary.png | Stats & Focus Summary | 7-day view, net gain, self-control checkpoint |
| metrics-detailed.png | Verified Self-Control Metrics | Detailed progress stats, percentages |
| dashboard-premium.png | Premium tier dashboard | Burgundy theme, enhanced features |
| milestones.png | Milestones & Progress Spotlight | Forfeited/completed tracking, focus trend graph |
| dashboard-pro.png | Pro tier dashboard | Olive/gold theme, maximum features |
| focus-challenge.png | Focus Challenge | Active challenge timer, stats |
| quiet-hours.png | Quiet Hours settings | Mode configuration, app selection |
| nogozone-performance.png | No-Go Zone Performance | Hard Lock analytics, Focus Challenge stats |

---

## ❌ FEATURES NOT IMPLEMENTED (EXCLUDED FROM WEBSITE)

Based on user feedback and code review:

1. **Per-app wallets**: Feature flag exists in AppConfig but NOT implemented
2. **App names in notifications**: Only in ledger, NOT in notifications

---

## 📝 DYNAMIC PRICING NOTE

All prices are fetched dynamically from StoreKit at app launch. The fallback USD prices shown above are used only until StoreKit loads. Prices may vary by region.

**Mock Billing**: Currently disabled (`AppConfig.Testing.mockPurchasesEnabled = false`)

---

**Document Created**: 2026-02-28
**Purpose**: Website update reference (site-test branch)
**Source**: Actual Swift code analysis from main-work-do-not-touch-prod/2026-02-28.v03
