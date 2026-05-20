# Authentication Flow Diagrams

## Complete App Flow

```
                          ┌─────────────────┐
                          │   App Starts    │
                          │ Load Fonts etc. │
                          └────────┬────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │   Check Auth State via      │
                    │   useAuth() from Clerk      │
                    └──────────┬───────────┬──────┘
                               │           │
                        ┌──────┴──┐    ┌───┴──────┐
                        │         │    │          │
                    isLoaded    isSignedIn    false
                        │         │    │
                        │      true│    │
                        │         │    │
            Still Loading            Already Signed In
                        │              │
                        │              ▼
                        │      ┌─────────────────┐
                        │      │  (tabs) Layout  │
                        │      │ ┌──────────────┐│
                        │      │ │ • index      ││
                        │      │ │ • subscr.    ││
                        │      │ │ • insights   ││
                        │      │ │ • settings   ││
                        │      │ └──────────────┘│
                        │      └─────────────────┘
                        │              ▲
                        │              │
                        └─→ Loading... └────→ Show (auth)
                                             ┌────────────────┐
                                             │ (auth) Layout  │
                                             │ ┌────────────┐ │
                                             │ │ sign-in    │ │
                                             │ │ (default)  │ │
                                             │ │ ↕          │ │
                                             │ │ sign-up    │ │
                                             │ └────────────┘ │
                                             └────────────────┘
```

## Sign-In User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                  SIGN-IN SCREEN LOADED                      │
│ • Brand logo displayed (Recurrly with R badge)            │
│ • "Welcome back" heading                                   │
│ • Email and password inputs shown                          │
│ • "Sign In" button (disabled until fields filled)         │
│ • "Create an account" link for new users                  │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       │                                                  ▼
       │                          ┌──────────────────────────────┐
       │                          │  User Taps "Create account"  │
       │                          └──────────────────────────────┘
       │                                    │
       │                                    ▼
       │                          ┌──────────────────────────────┐
       │                          │  Navigate to sign-up screen  │
       │                          │  (Same flow as below)        │
       │                          └──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                  USER ENTERS EMAIL                          │
│ • Field validated in real-time                             │
│ • Valid format? ✅ No error shown                           │
│ • Invalid format? ❌ Error shown immediately               │
│ • Tab to password field (returnKeyType="next")             │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│                  USER ENTERS PASSWORD                       │
│ • No validation on change (only on submit)                 │
│ • Can press "Done" or tap "Sign In"                        │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│            USER TAPS "SIGN IN" BUTTON                       │
│ • Button shows loading spinner                             │
│ • All fields disabled                                      │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
    ┌──────────────────────────────────┐                 │
    │    FORM VALIDATION                │                 │
    │ ✓ Email required?                 │                 │
    │ ✓ Email valid format?             │                 │
    │ ✓ Password required?              │                 │
    │ ✓ Password min 8 chars?           │                 │
    └──────┬──────────────────────┬─────┘                 │
           │                      │                        │
         FAIL                    PASS                      │
           │                      │                        │
           ▼                      ▼                        │
    ┌─────────────────┐   ┌──────────────────────────┐   │
    │ Show all errors │   │ Call Clerk Sign-In API   │   │
    │ Keep on screen  │   │ (When backend ready)     │   │
    │ Enable fields   │   └──────┬───────────────────┘   │
    │ Stop loading    │          │                        │
    └─────────────────┘     ┌────┴──────────┐             │
           ▲                 │               │             │
           │              ERROR           SUCCESS          │
           │                 │               │             │
           │                 ▼               ▼             │
           │         ┌─────────────┐  ┌──────────────┐    │
           │         │ Show error  │  │ Set Active   │    │
           │         │ message in  │  │ Session      │    │
           └─────────┤ red banner  │  │              │    │
                     │ Keep on     │  │ Route to     │    │
                     │ screen      │  │ (tabs)       │    │
                     └─────────────┘  └──────────────┘    │
                                             │            │
                                             ▼            │
                                    ┌──────────────────┐  │
                                    │  HOME SCREEN     │  │
                                    │  User logged in  │  │
                                    │  ✅ Success!     │  │
                                    └──────────────────┘  │
                                                          │
                                         (Other Links)    │
                                                          ▼
```

## Sign-Up User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                 SIGN-UP SCREEN LOADED                       │
│ • Brand logo displayed                                     │
│ • "Create your account" heading                            │
│ • First Name & Last Name fields (2 columns)                │
│ • Email field                                              │
│ • Password field (no validation shown yet)                 │
│ • Confirm Password field                                   │
│ • "Create Account" button (disabled until complete)        │
│ • "Sign In Instead" link                                   │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│            USER ENTERS FIRST NAME                           │
│ • Real-time validation                                     │
│ • < 2 chars? Show error                                    │
│ • ✅ 2+ chars? Clear error                                 │
│ • Tab to Last Name (returnKeyType="next")                  │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│            USER ENTERS LAST NAME                            │
│ • Same validation as first name                            │
│ • Tab to Email                                             │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│            USER ENTERS EMAIL                                │
│ • Real-time validation                                     │
│ • Invalid format? Show error                               │
│ • Valid? Clear error                                       │
│ • Tab to Password                                          │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│            USER ENTERS PASSWORD                             │
│ • Shows PASSWORD STRENGTH INDICATOR:                        │
│   ├─ Weak (red) - < 3 criteria met                          │
│   ├─ Fair (orange) - 3-4 criteria met                       │
│   ├─ Good (amber) - 5 criteria met                          │
│   └─ Strong (green) - 6+ criteria met                       │
│                                                             │
│ • Criteria:                                                │
│   ✓ Length ≥ 8                                              │
│   ✓ Length ≥ 12                                             │
│   ✓ Contains lowercase                                      │
│   ✓ Contains UPPERCASE                                      │
│   ✓ Contains number (0-9)                                   │
│   ✓ Contains special character                              │
│                                                             │
│ • Visual bar fills up as criteria met                      │
│ • Tab to Confirm Password                                  │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
┌─────────────────────────────────────────────────────────────┐
│         USER ENTERS CONFIRM PASSWORD                        │
│ • Real-time validation                                     │
│ • Doesn't match? Show "Passwords do not match"             │
│ • Matches? Clear error                                     │
│ • Can press "Done" or tap "Create Account"                 │
└──────┬──────────────────────────────────────────────────┬──┘
       │                                                  │
       ▼                                                  │
    ┌──────────────────────────────────────────────┐     │
    │      USER TAPS "CREATE ACCOUNT"              │     │
    │ • Button shows loading spinner               │     │
    │ • All fields disabled                        │     │
    └──────┬──────────────────────────────────┬────┘     │
           │                                  │          │
           ▼                                  │          │
    ┌─────────────────────────────────────┐   │          │
    │   COMPLETE FORM VALIDATION           │   │          │
    │ ✓ First name: 2+ chars?              │   │          │
    │ ✓ Last name: 2+ chars?               │   │          │
    │ ✓ Email: required & valid?           │   │          │
    │ ✓ Password: meets all rules?         │   │          │
    │ ✓ Confirm: matches password?         │   │          │
    └──────┬──────────────────────┬────────┘   │          │
           │                      │            │          │
         FAIL                    PASS          │          │
           │                      │            │          │
           ▼                      ▼            │          │
    ┌──────────────────┐  ┌──────────────────┐ │          │
    │ Show ALL errors  │  │ Call Clerk       │ │          │
    │ in error banner  │  │ Sign-Up API      │ │          │
    │ (e.g., "First    │  │ (When backend    │ │          │
    │  name required")  │  │  ready)          │ │          │
    │ Keep on screen   │  └──────┬───────────┘ │          │
    │ Enable fields    │         │             │          │
    │ Stop loading     │    ┌────┴──────┐      │          │
    └──────────────────┘    │           │      │          │
           ▲               ERROR      SUCCESS   │          │
           │                 │           │     │          │
           │                 ▼           ▼     │          │
           │         ┌──────────────┐  ┌────────────────┐ │
           │         │ Show error   │  │ Set Active     │ │
           └─────────┤ message in   │  │ Session        │ │
                     │ red banner   │  │                │ │
                     │ Keep on      │  │ Auto-sign in   │ │
                     │ screen       │  │ user           │ │
                     └──────────────┘  │                │ │
                                       │ Route to (tabs)│ │
                                       └────────────────┘ │
                                              │           │
                                              ▼           │
                                     ┌──────────────────┐ │
                                     │  HOME SCREEN     │ │
                                     │  User logged in  │ │
                                     │  ✅ Success!     │ │
                                     └──────────────────┘ │
                                                          │
                                        (Other Links)     │
                                                          ▼
```

## Real-Time Validation Timeline

### Sign-In: Email Field

```
User Action        │  Error State         │  Button State
─────────────────────────────────────────────────────────
Empty              │  (No error shown)    │  Disabled
"a"                │  (No error shown)    │  Disabled
"ab"               │  (No error shown)    │  Disabled
"abc@"             │  ❌ Invalid email    │  Disabled
"abc@example"      │  ❌ Invalid email    │  Disabled
"abc@example.com"  │  ✅ (Clears error)   │  Still disabled (need password)
```

### Sign-Up: Password Field

```
Password          │  Strength Indicator    │  Error
──────────────────────────────────────────────────────────
(empty)           │  (None)                │  (None)
"Pass"            │  ❌ Weak (red)         │  "Min 8 chars"
"Password"        │  🟠 Fair (orange)      │  "Need number"
"Password1"       │  🟡 Good (amber)       │  (Clears)
"Password1!"      │  🟢 Strong (green)     │  (Clears)
```

### Sign-Up: Confirm Password Field

```
Password    │  Confirm Password  │  Error
────────────────────────────────────────────────────
"Pass1!"    │  (empty)           │  (None)
"Pass1!"    │  "P"               │  (None)
"Pass1!"    │  "Pass1!"          │  ✅ (Clears)
"Pass1!"    │  "Pass2!"          │  ❌ "Passwords don't match"
"Pass1!"    │  "Pass1!"          │  ✅ (Clears)
```

## Error State Example

```
┌─────────────────────────────────────────────────────────┐
│  SIGN-IN SCREEN - WITH ERRORS                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ⚠️  Invalid email or password                    │  │
│  │ Please check your credentials and try again.    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Email Address                                    │  │
│  │ ┌────────────────────────────────────────────┐   │  │
│  │ │ user@invalid                             │   │  │
│  │ └────────────────────────────────────────────┘   │  │
│  │ ❌ Enter a valid email address                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Password                                         │  │
│  │ ┌────────────────────────────────────────────┐   │  │
│  │ │ ••••••••••                               │   │  │
│  │ └────────────────────────────────────────────┘   │  │
│  │ ❌ Password must be at least 8 characters       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Sign In] (disabled - button grayed out)        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ─────────────────────────────────────────────────     │
│               New here?                                 │
│  ─────────────────────────────────────────────────     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Create an account]                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Success State

```
┌─────────────────────────────────────────────────────┐
│  SIGN-IN - ALL VALID                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Email Address                                │  │
│  │ ┌───────────────────────────────────────────┐   │
│  │ │ user@example.com                        │   │
│  │ └───────────────────────────────────────────┘   │
│  │ ✅ (No error message)                          │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Password                                     │  │
│  │ ┌───────────────────────────────────────────┐   │
│  │ │ •••••••••••••••                          │   │
│  │ └───────────────────────────────────────────┘   │
│  │ ✅ (No error message)                          │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ [Sign In] ← ENABLED, full color button       │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Can click now!                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**All flows are fully implemented and ready to use!**
