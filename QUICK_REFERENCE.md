# Quick Reference - Recurrly Custom Clerk Auth

## 📋 File Structure

```
app/
├── _layout.tsx                    ← Root with auth-aware routing
├── index.tsx                      ← Redirects to (tabs)
├── (auth)/
│   ├── _layout.tsx               ← Auth stack navigator
│   ├── sign-in.tsx               ← Sign-in screen
│   └── sign-up.tsx               ← Sign-up screen
└── (tabs)/
    └── ...                        ← Rest of app

components/
├── AuthInput.tsx                 ← Reusable input
├── AuthButton.tsx                ← Reusable button
├── ListHeading.tsx               ← Existing component
├── SubscriptionCard.tsx          ← Existing component
└── UpcomingSubscriptionCard.tsx  ← Existing component

lib/
├── clerk-provider.tsx            ← Clerk setup
├── auth.ts                       ← Validation utils
└── utils.ts                      ← Existing utils

constants/
├── theme.ts
├── data.ts
└── icons.ts
```

## 🎨 Design System Quick Ref

### Colors

- Primary: `#081126` (dark navy) - text, primary actions
- Accent: `#ea7a53` (orange) - secondary actions, focus
- Background: `#fff9e3` (cream) - screen background
- Card: `#fff8e7` (light cream) - card background
- Muted: `#f6eecf` (beige) - disabled
- Destructive: `#dc2626` (red) - errors
- Success: `#16a34a` (green) - success

### Typography

- Font: PlusJakartaSans (Regular, Bold, Medium, SemiBold, ExtraBold, Light)
- Heading: 3xl, font-sans-bold, text-primary
- Body: base, font-sans-medium, text-primary
- Helper: sm, font-sans-medium, text-muted-foreground
- Error: xs, font-sans-medium, text-destructive

### Spacing

- Use: 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px)
- Gap classes: `gap-2`, `gap-3`, `gap-4`, `gap-5`
- Padding: `px-4`, `py-4`, `p-5`, `p-6`

### Border Radius

- Large: `rounded-3xl` or `4xl` (2rem) - cards, large elements
- Medium: `rounded-2xl` (1rem) - inputs, buttons
- Small: `rounded-lg` (0.5rem) - badges
- Full: `rounded-full` - pills

## 🔑 Key Components

### AuthInput

```tsx
<AuthInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  helper="Optional helper text"
  keyboardType="email-address"
  returnKeyType="next"
  onSubmitEditing={() => nextRef?.focus()}
/>
```

### AuthButton

```tsx
<AuthButton
  text="Sign In"
  onPress={handleSignIn}
  isLoading={isLoading}
  isDisabled={!isValid}
  variant="primary" // or "secondary"
/>
```

## ✅ Validation Functions

```tsx
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  getPasswordStrength,
  sanitizeInput,
  extractClerkErrors,
  formatErrorMessage,
} from "@/lib/auth";

// Email
validateEmail("user@example.com"); // boolean

// Password
const { isValid, errors } = validatePassword("MyPass123");
// errors: ["Password must be at least 8 characters", ...]

// Confirm
validatePasswordMatch("MyPass123", "MyPass123"); // boolean

// Strength
getPasswordStrength("password"); // "weak" | "fair" | "good" | "strong"

// Sanitize
sanitizeInput("  hello  world  "); // "hello world"

// Errors
extractClerkErrors(error); // ["Email is already in use"]
formatErrorMessage(error); // "Email is already in use"
```

## 🎯 Styling Classes (from global.css)

### Auth-specific Classes

```css
.auth-safe-area       /* SafeAreaView wrapper */
.auth-screen          /* Screen flex container */
.auth-scroll          /* ScrollView flex */
.auth-content         /* Main content padding */

.auth-brand-block     /* Brand logo container */
.auth-logo-wrap       /* Logo + wordmark row */
.auth-logo-mark       /* R badge circle */
.auth-wordmark        /* "Recurrly" text */
.auth-wordmark-sub    /* "Track & Manage" text */

.auth-title           /* Main heading */
.auth-subtitle        /* Subtitle text */

.auth-card            /* Form card container */
.auth-form            /* Form fields gap */
.auth-field           /* Single field gap */
.auth-label           /* Input label */
.auth-input           /* Text input */
.auth-input-error     /* Input with error border */
.auth-error           /* Error message text */
.auth-helper          /* Helper text */

.auth-button          /* Primary button */
.auth-button-disabled /* Disabled primary */
.auth-button-text     /* Button text */
.auth-secondary-button         /* Secondary button */
.auth-secondary-button-text    /* Secondary text */

.auth-divider-row     /* Divider with text */
.auth-divider-line    /* Divider line */
.auth-divider-text    /* Divider text */

.auth-link-row        /* Link row */
.auth-link-copy       /* Link supporting text */
.auth-link            /* Link text */
```

## 🔒 Auth State Usage

```tsx
import { useAuth } from "@clerk/expo";

function MyComponent() {
  const { isLoaded, isSignedIn, userId, sessionId } = useAuth();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <RedirectToAuth />;

  return <ProtectedContent userId={userId} />;
}
```

## 🚀 Common Patterns

### Form Validation Pattern

```tsx
const [value, setValue] = useState("");
const [error, setError] = useState("");

// On change - validate as user types
const handleChange = (text: string) => {
  setValue(text);
  if (text && !isValid(text)) {
    setError("Error message");
  } else {
    setError("");
  }
};

// On submit - validate all fields
const handleSubmit = () => {
  if (!validate()) return; // Show all errors
  // Submit
};
```

### Navigation Pattern

```tsx
import { useRouter } from "expo-router";

const router = useRouter();

// Navigate to auth
router.push("/(auth)/sign-up");

// Navigate in app
router.push("/(tabs)/subscriptions");

// Replace (remove from history)
router.replace("/(tabs)");

// Back
router.back();
```

### Loading Pattern

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await apiCall();
    // Success
  } catch (err) {
    setError(formatError(err));
  } finally {
    setIsLoading(false);
  }
};
```

## 📱 Responsive Design

All components use flex and NativeWind for responsiveness:

```tsx
// Column layout
<View className="gap-4">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

// Row layout
<View className="flex-row gap-3">
  <View className="flex-1">Left</View>
  <View className="flex-1">Right</View>
</View>

// Custom sizes
<View className="size-12">Square</View>
<View className="w-44">Custom width</View>
<View className="h-50">Custom height</View>
```

## 🎓 Common Gotchas

### Keyboard Navigation

✅ Use `returnKeyType` on all inputs
✅ Use refs to focus next field
✅ Last input should have `returnKeyType="done"`
✅ Use `KeyboardAvoidingView` for iOS

### Form Submission

✅ Validate form before submitting
✅ Disable button during loading
✅ Show error banner if fails
✅ Keep user on form if error

### State Management

✅ Clear errors when user edits field
✅ Show errors only after submit attempt
✅ Don't validate empty fields in onChange
✅ Validate everything on form submit

### Navigation

✅ Use `useEffect` to redirect based on auth state
✅ Use `router.replace()` to prevent back button
✅ Handle loading state before redirect
✅ Don't push to same screen

## 📝 Environment Variables

```bash
# .env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Must start with `EXPO_PUBLIC_` to be available in app!

## 🧪 Testing Quick Commands

```bash
# Install dependencies
npm install @clerk/expo --legacy-peer-deps

# Start dev server
npm start

# Lint check
npm run lint

# Build APK/IPA (not set up yet)
npm run build
```

## 🔗 Important Links

- Clerk Docs: https://clerk.com/docs/expo
- Expo Router: https://expo.github.io/router
- NativeWind: https://www.nativewind.dev/
- React Native: https://reactnative.dev/
- Your Docs: See AUTH_IMPLEMENTATION.md

## 🎯 Error Codes & Solutions

| Error                 | Solution                        |
| --------------------- | ------------------------------- |
| Module not found      | Run `npm install`               |
| Types not found       | Run `npm install`               |
| Env var missing       | Add to `.env` and restart       |
| Keyboard issues       | Use `KeyboardAvoidingView`      |
| Layout jumping        | Use `keyboardShouldPersistTaps` |
| Form submitting twice | Check loading state             |
| Wrong colors          | Check class names in theme.ts   |
| Focus issues          | Use refs properly               |

## ✨ Best Practices

✅ Always validate before submission
✅ Always show loading state
✅ Always handle errors gracefully
✅ Always use refs for keyboard nav
✅ Always use proper TypeScript types
✅ Always sanitize user input
✅ Always secure tokens
✅ Always test on real device
✅ Always follow brand guidelines
✅ Always document changes

## 🎉 You're All Set!

Everything is configured and ready to use. Just add your Clerk key to `.env` and start testing!

Questions? Check the full documentation:

- `AUTH_IMPLEMENTATION.md` - Architecture & details
- `CLERK_AUTH_SETUP.md` - Setup & examples
- `IMPLEMENTATION_SUMMARY.md` - Overview & checklist

---

**Last Updated**: May 17, 2026
**Status**: ✅ Ready to Use
