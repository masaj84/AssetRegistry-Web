# Implementation Roadmap - Social Login Phase 1

## 🎯 Implementation Summary

**Task**: T-028: Frontend Social Login UI - Phase 1
**Status**: Design & Planning Complete ✅
**Next**: Ready for development

## 📋 Development Checklist

### Phase 1: Foundation (Day 1)
- [ ] **Create branch**: `feature/oauth-frontend` 
- [ ] **Environment Setup**: Add OAuth client IDs to `.env.example`
- [ ] **Base Components**: 
  - [ ] `src/components/ui/SocialLoginButton.tsx`
  - [ ] `src/components/auth/SocialLoginSection.tsx`
- [ ] **Types**: Add OAuth types to `src/types/auth.ts`

### Phase 2: OAuth Service (Day 2)  
- [ ] **OAuth Service**: Create `src/services/oauthService.ts`
- [ ] **Auth Service**: Update `src/services/authService.ts` 
- [ ] **Callback Handler**: Create `src/components/auth/OAuthCallback.tsx`
- [ ] **Routing**: Add OAuth callback route to router

### Phase 3: AuthContext Integration (Day 3)
- [ ] **AuthContext**: Add OAuth methods to `src/context/AuthContext.tsx`
- [ ] **Testing**: Unit tests for OAuth service
- [ ] **Error Handling**: Robust error handling and user feedback

### Phase 4: UI Integration (Day 4)
- [ ] **LoginPage**: Integrate social login into `src/pages/auth/LoginPage.tsx`
- [ ] **Translations**: Add social login translations
- [ ] **Styling**: Polish button designs and responsive layout
- [ ] **Loading States**: Implement proper loading indicators

### Phase 5: Testing & Polish (Day 5)
- [ ] **Manual Testing**: Test complete OAuth flows
- [ ] **Error Scenarios**: Test error handling and edge cases  
- [ ] **Mobile Testing**: Verify responsive design
- [ ] **Accessibility**: Screen reader and keyboard navigation testing
- [ ] **Cross-browser**: Test on Chrome, Firefox, Safari

## 🔧 Technical Implementation Steps

### Step 1: Create Base Components

```bash
# Create component files
touch src/components/ui/SocialLoginButton.tsx
touch src/components/auth/SocialLoginSection.tsx
touch src/components/auth/OAuthCallback.tsx
```

### Step 2: Create Services

```bash
# Create service files  
touch src/services/oauthService.ts
mkdir -p src/types
touch src/types/oauth.ts
```

### Step 3: Environment Configuration

```bash
# Add to .env.example
echo "VITE_GOOGLE_CLIENT_ID=your_google_client_id" >> .env.example
echo "VITE_FACEBOOK_APP_ID=your_facebook_app_id" >> .env.example
```

### Step 4: Install Dependencies (if needed)

```bash
# No additional dependencies required - using native OAuth flows
# All implemented with existing React, React Router, and Axios
```

## 🔗 Backend API Requirements

### Required Endpoints (Coordinate with Case)

1. **GET** `/auth/oauth/google/config`
   - Returns: Google OAuth configuration
   - Response: `{ clientId, redirectUri, scopes }`

2. **POST** `/auth/oauth/google/callback`  
   - Body: `{ code: string, state?: string }`
   - Returns: `{ access_token, refresh_token, user }`

3. **GET** `/auth/oauth/facebook/config`
   - Returns: Facebook OAuth configuration  
   - Response: `{ appId, redirectUri, scopes }`

4. **POST** `/auth/oauth/facebook/callback`
   - Body: `{ code: string, state?: string }`
   - Returns: `{ access_token, refresh_token, user }`

### Error Responses
```json
{
  "error": "oauth_failed",
  "message": "OAuth authentication failed",
  "details": "Invalid authorization code"
}
```

## 🔄 OAuth Flow Testing

### Google OAuth Test Flow
1. Click "Continue with Google" 
2. Redirect to `https://accounts.google.com/o/oauth2/v2/auth?...`
3. User grants permissions
4. Redirect to `http://localhost:5173/auth/callback/google?code=...`  
5. Extract code, exchange for tokens
6. Store JWT, update AuthContext
7. Redirect to `/app`

### Facebook OAuth Test Flow  
1. Click "Continue with Facebook"
2. Redirect to `https://www.facebook.com/v18.0/dialog/oauth?...`
3. User grants permissions
4. Redirect to `http://localhost:5173/auth/callback/facebook?code=...`
5. Extract code, exchange for tokens
6. Store JWT, update AuthContext  
7. Redirect to `/app`

## 🎨 Design Implementation Details

### Color Variables to Use
```css
/* Google Button */
background: var(--color-background)
border: var(--color-border)  
text: var(--color-foreground)
hover-border: var(--color-foreground)

/* Facebook Button */
background: #1877f2
text: white
border: #1877f2
hover: #166fe5
```

### Component Props Structure
```typescript
// SocialLoginButton
interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
  isLoading: boolean;
  loadingText?: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
}

// SocialLoginSection  
interface SocialLoginSectionProps {
  isGoogleLoading: boolean;
  isFacebookLoading: boolean;
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
  disabled?: boolean;
}
```

## 🧪 Testing Scenarios

### Happy Path Testing
- [ ] Google login successful → redirects to /app
- [ ] Facebook login successful → redirects to /app
- [ ] Loading states display correctly
- [ ] User profile data loads correctly

### Error Handling Testing
- [ ] User cancels OAuth → returns to login with no error
- [ ] Invalid OAuth code → shows error message  
- [ ] Network error during token exchange → shows error, allows retry
- [ ] Backend returns error → shows specific error message

### Edge Cases
- [ ] Multiple rapid clicks on social buttons
- [ ] Browser back/forward during OAuth flow
- [ ] OAuth popup blocked → graceful fallback
- [ ] Session expires during OAuth flow

### Accessibility Testing  
- [ ] Screen reader announces button states
- [ ] Keyboard navigation works correctly
- [ ] Focus indicators are visible
- [ ] Loading states are announced
- [ ] Error messages are announced

## 📱 Responsive Design Testing

### Breakpoints to Test
- [ ] **Mobile** (320px-768px): Buttons stack vertically, touch-friendly
- [ ] **Tablet** (768px-1024px): Transition layout  
- [ ] **Desktop** (1024px+): Side-by-side layout with branding

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)  
- [ ] iPad (768px)
- [ ] MacBook Air (1440px)

## 🚀 Deployment Strategy

### Development Testing
1. **Local Environment**: Test with development OAuth apps
2. **Staging Environment**: Test with staging OAuth apps  
3. **Production Environment**: Deploy with production OAuth apps

### OAuth App Configuration
```javascript
// Development
GOOGLE_CLIENT_ID: "dev_google_client_id"
FACEBOOK_APP_ID: "dev_facebook_app_id"
REDIRECT_URI: "http://localhost:5173/auth/callback/{provider}"

// Staging  
GOOGLE_CLIENT_ID: "staging_google_client_id"
FACEBOOK_APP_ID: "staging_facebook_app_id"
REDIRECT_URI: "https://staging-assetregistry.trve.io/auth/callback/{provider}"

// Production
GOOGLE_CLIENT_ID: "prod_google_client_id"  
FACEBOOK_APP_ID: "prod_facebook_app_id"
REDIRECT_URI: "https://assetregistry.trve.io/auth/callback/{provider}"
```

## ✅ Definition of Done

### Functionality
- [ ] Google OAuth login works end-to-end
- [ ] Facebook OAuth login works end-to-end
- [ ] Error handling covers all scenarios
- [ ] Loading states provide clear feedback
- [ ] Mobile responsive design works correctly

### Code Quality  
- [ ] Components follow existing patterns
- [ ] TypeScript types are properly defined
- [ ] Error handling is consistent
- [ ] Code is documented with comments
- [ ] No console errors or warnings

### Testing
- [ ] All manual test scenarios pass
- [ ] Unit tests cover OAuth service
- [ ] Integration tests cover auth flow
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility verified

### Documentation
- [ ] Implementation documented in README
- [ ] OAuth configuration documented  
- [ ] Error scenarios documented
- [ ] Deployment guide updated

## 📞 Coordination Points

### With Backend Team (Case)
- [ ] **Week 1**: Confirm OAuth endpoint specifications
- [ ] **Week 1**: Set up development OAuth apps
- [ ] **Week 2**: Test token exchange endpoints
- [ ] **Week 2**: Verify user profile data structure
- [ ] **Week 3**: Test staging environment integration
- [ ] **Week 3**: Production OAuth app setup

### With Design Team  
- [ ] **Week 1**: Confirm social button designs match TRVE system
- [ ] **Week 2**: Review loading states and animations
- [ ] **Week 2**: Validate mobile responsive layout
- [ ] **Week 3**: Final design review and polish

This implementation roadmap provides a clear path from design completion to production deployment, ensuring all aspects of the social login feature are properly implemented and tested.