# Social Login UI - Design & Technical Plan
**Phase 1: Google + Facebook Login Buttons**

## 🎨 Design Mockup & UI/UX Requirements

### Current State Analysis
- **Design System**: TRVE minimal black/white aesthetic with orange/purple accents
- **Layout**: Split-screen with branding left, form right (mobile stacks)
- **Existing Flow**: Email/password → divider → demo button → register link
- **Color Palette**: 
  - Primary: `oklch(0.1 0 0)` (black)
  - Background: `oklch(0.98 0 0)` (white)  
  - Accent: Orange `oklch(0.75 0.18 45)`, Purple `oklch(0.6 0.25 300)`
  - Border: `oklch(0.85 0 0)` (light gray)

### Social Login Button Design
**Placement**: Replace current demo button section with social login buttons

```
┌─────────────────────────────────┐
│ [Email Input]                   │
│ [Password Input]                │
│ [Remember] [Forgot Password?]   │
│ [Sign In Button - Primary]      │
│                                 │
│ ─── or continue with ───       │
│                                 │
│ [🔴 Continue with Google]       │
│ [🔵 Continue with Facebook]     │
│                                 │
│ ─── or ───                     │
│                                 │
│ [👤 Try Demo Account]           │
│                                 │
│ Don't have account? Create one  │
└─────────────────────────────────┘
```

### Button Specifications

#### Google Button
- **Style**: White background, dark border, Google logo + text
- **Colors**: `bg-background border-border hover:border-foreground`
- **Logo**: Official Google "G" multicolor logo (16x16px)
- **Text**: "Continue with Google" (matches existing pattern)
- **Size**: `h-12` (matches existing buttons)

#### Facebook Button  
- **Style**: Facebook blue background, white text
- **Colors**: `bg-[#1877f2] text-white hover:bg-[#166fe5]`
- **Logo**: Facebook "f" logo in white (16x16px)
- **Text**: "Continue with Facebook"
- **Size**: `h-12` (matches existing buttons)

### Mobile Responsive Design
- **Breakpoints**: Same as existing (lg:, md:, sm:)
- **Stacking**: Buttons stack vertically on mobile
- **Touch Targets**: 44px minimum height for accessibility
- **Spacing**: Consistent `space-y-3` between social buttons

### Loading States
- **Google**: Show Google logo + spinner + "Signing in with Google..."
- **Facebook**: Show Facebook logo + spinner + "Signing in with Facebook..."
- **Pattern**: Consistent with existing `isLoading` states
- **Disable**: All buttons when any OAuth flow is active

### Error Handling
- **OAuth Failures**: Red error banner above form (matches existing pattern)
- **Messages**: 
  - "Google login failed. Please try again."  
  - "Facebook login was cancelled."
  - "Social login temporarily unavailable."
- **Fallback**: Always allow email/password as backup

## 🏗️ Component Architecture

### New Components to Create

#### 1. `SocialLoginButton.tsx`
```typescript
interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
  isLoading: boolean;
  onClick: () => Promise<void>;
  disabled?: boolean;
}
```

#### 2. `SocialLoginSection.tsx` 
```typescript
interface SocialLoginSectionProps {
  isLoading: boolean;
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
}
```

#### 3. `OAuthCallback.tsx`
```typescript
// Handle OAuth redirects
// Route: /auth/callback/:provider
// Parse tokens, exchange for JWT, redirect to /app
```

### Directory Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx (existing)
│   │   └── SocialLoginButton.tsx (new)
│   └── auth/
│       ├── SocialLoginSection.tsx (new)
│       └── OAuthCallback.tsx (new)
├── pages/
│   └── auth/
│       ├── LoginPage.tsx (update)
│       └── OAuthCallbackPage.tsx (new)
├── services/
│   ├── authService.ts (update)
│   └── oauthService.ts (new)
└── types/
    └── auth.ts (update with OAuth types)
```

## 🔧 Integration Strategy

### 1. AuthContext Updates
```typescript
// Add to AuthContextType
interface AuthContextType {
  // ... existing
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  isOAuthLoading: boolean;
}
```

### 2. OAuth Service Architecture
```typescript
// src/services/oauthService.ts
export const oauthService = {
  initiateGoogleLogin: () => void;
  initiateFacebookLogin: () => void;  
  handleCallback: (provider: string, code: string) => Promise<AuthResponse>;
  exchangeCodeForTokens: (provider: string, code: string) => Promise<string>;
};
```

### 3. LoginPage.tsx Integration
- **Import**: Add `SocialLoginSection` component
- **State**: Add `isOAuthLoading` state
- **Placement**: Replace demo button section
- **Handlers**: Connect to AuthContext OAuth methods
- **Styling**: Maintain existing responsive layout

### 4. Routing Updates
```typescript
// Add new route
{
  path: "/auth/callback/:provider",
  element: <OAuthCallbackPage />
}
```

## 🔗 OAuth Flow Implementation

### Google OAuth Flow
1. **Initiate**: Redirect to Google OAuth with proper scopes
2. **Callback**: Handle redirect at `/auth/callback/google`
3. **Exchange**: Send authorization code to backend
4. **JWT**: Receive JWT token from backend
5. **Store**: Save token using existing token management
6. **Profile**: Fetch user profile and update AuthContext
7. **Redirect**: Navigate to `/app`

### Facebook OAuth Flow
1. **Initiate**: Redirect to Facebook OAuth
2. **Callback**: Handle redirect at `/auth/callback/facebook`  
3. **Exchange**: Send authorization code to backend
4. **JWT**: Receive JWT token from backend
5. **Store**: Save token using existing token management
6. **Profile**: Fetch user profile and update AuthContext
7. **Redirect**: Navigate to `/app`

### Error Recovery
- **Network Errors**: Show retry button
- **OAuth Errors**: Log details, show user-friendly message
- **Cancelled**: Silent handling, return to login form
- **Backend Errors**: Parse error response, show specific message

## 🌐 Internationalization Support

### English Translations
```javascript
social: {
  continueWithGoogle: 'Continue with Google',
  continueWithFacebook: 'Continue with Facebook',  
  signingInWithGoogle: 'Signing in with Google...',
  signingInWithFacebook: 'Signing in with Facebook...',
  googleLoginFailed: 'Google login failed. Please try again.',
  facebookLoginFailed: 'Facebook login failed. Please try again.',
  socialLoginUnavailable: 'Social login temporarily unavailable.'
}
```

### Polish Translations
```javascript
social: {
  continueWithGoogle: 'Kontynuuj z Google',
  continueWithFacebook: 'Kontynuuj z Facebook',
  signingInWithGoogle: 'Logowanie przez Google...',
  signingInWithFacebook: 'Logowanie przez Facebook...',
  googleLoginFailed: 'Logowanie przez Google nie powiodło się. Spróbuj ponownie.',
  facebookLoginFailed: 'Logowanie przez Facebook nie powiodło się. Spróbuj ponownie.',
  socialLoginUnavailable: 'Logowanie społeczne czasowo niedostępne.'
}
```

## ♿ Accessibility Compliance

### ARIA Labels
- `aria-label="Continue with Google"` 
- `aria-label="Continue with Facebook"`
- `role="button"` for social login buttons
- `aria-disabled` when loading/disabled

### Keyboard Navigation
- Tab order: Email → Password → Remember → Sign In → Google → Facebook → Demo
- Enter/Space activation for all buttons
- Focus indicators match existing design

### Screen Reader Support
- Announce loading states: "Signing in with Google, please wait"
- Error announcements: `aria-live="polite"` for error messages
- Alternative text for logos

## 🧪 Testing Strategy

### Unit Tests
- `SocialLoginButton.tsx` component rendering
- `SocialLoginSection.tsx` interaction handling  
- `oauthService.ts` URL generation and token exchange
- `OAuthCallback.tsx` code parsing and error handling

### Integration Tests  
- Complete OAuth flows (Google + Facebook)
- Error handling scenarios
- Loading states and UI feedback
- Mobile responsive behavior

### E2E Tests
- Full social login user journey
- OAuth cancellation handling
- Network error recovery
- Cross-browser compatibility

## 📋 Implementation Checklist

### Phase 1: Core Components
- [ ] Create `SocialLoginButton.tsx`
- [ ] Create `SocialLoginSection.tsx`  
- [ ] Add social login translations
- [ ] Update Button component if needed

### Phase 2: OAuth Service
- [ ] Create `oauthService.ts`
- [ ] Implement OAuth URL generation
- [ ] Add token exchange logic
- [ ] Create `OAuthCallback.tsx`

### Phase 3: Integration
- [ ] Update `AuthContext.tsx`
- [ ] Integrate into `LoginPage.tsx`
- [ ] Add OAuth callback route
- [ ] Update `authService.ts`

### Phase 4: Styling & UX
- [ ] Implement social button designs
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Mobile responsive testing

### Phase 5: Testing & Polish
- [ ] Unit tests
- [ ] Integration tests
- [ ] Accessibility audit
- [ ] Cross-browser testing

## 🔌 Backend Coordination Notes

**Coordinate with Case for API endpoints:**

1. **OAuth Initiation**: GET `/auth/oauth/:provider/url` - Returns OAuth URL
2. **Token Exchange**: POST `/auth/oauth/:provider/callback` - Exchange code for JWT
3. **Profile Sync**: Ensure OAuth users get proper profile data
4. **Error Codes**: Standardized error responses for frontend handling

**Required Scopes:**
- **Google**: `openid email profile`
- **Facebook**: `email public_profile`

This plan provides a complete roadmap for implementing Phase 1 of the social login UI while maintaining the existing TRVE design system and ensuring a seamless user experience.