# OAuth E2E Test Scenarios

This document outlines the end-to-end test scenarios for OAuth functionality. These should be implemented using a proper E2E testing framework like Playwright or Cypress.

## Test Setup Requirements

- Mock OAuth providers (Google/Facebook) for testing
- Test user accounts with appropriate permissions
- Clean database state for each test run
- Network mocking capabilities for error scenarios

## Core OAuth Flows

### Scenario 1: Successful Google OAuth Login
1. **Given** user is on the login page
2. **When** user clicks "Continue with Google" button
3. **Then** user is redirected to Google OAuth consent page (mocked)
4. **When** user grants permission (simulated)
5. **Then** user is redirected back to `/auth/callback/google`
6. **And** user is authenticated and redirected to `/app`
7. **And** user profile is loaded with Google account data

### Scenario 2: Successful Facebook OAuth Login
1. **Given** user is on the login page
2. **When** user clicks "Continue with Facebook" button
3. **Then** user is redirected to Facebook OAuth consent page (mocked)
4. **When** user grants permission (simulated)
5. **Then** user is redirected back to `/auth/callback/facebook`
6. **And** user is authenticated and redirected to `/app`
7. **And** user profile is loaded with Facebook account data

### Scenario 3: OAuth Login with Existing Account
1. **Given** user already has an account with email matching OAuth provider
2. **When** user completes OAuth flow
3. **Then** existing account is linked with OAuth provider
4. **And** user is logged in to existing account

## Error Handling Flows

### Scenario 4: User Cancels OAuth
1. **Given** user is on the login page
2. **When** user clicks "Continue with Google"
3. **And** user cancels on OAuth consent page
4. **Then** user is redirected back to login page
5. **And** no error message is shown (silent handling)

### Scenario 5: OAuth Provider Error
1. **Given** user is on the login page
2. **When** user clicks "Continue with Google"
3. **And** OAuth provider returns an error
4. **Then** user sees error message on callback page
5. **And** user is redirected to login page after delay
6. **And** appropriate error message is displayed

### Scenario 6: Backend OAuth Error
1. **Given** user completes OAuth flow successfully
2. **When** backend token exchange fails
3. **Then** user sees error message on callback page
4. **And** user is redirected to login page
5. **And** error is logged for debugging

### Scenario 7: Network Error During OAuth
1. **Given** user is on the login page
2. **When** user clicks social login button
3. **And** network request fails
4. **Then** error message is shown on login page
5. **And** user can retry the action

## Loading States & UI

### Scenario 8: OAuth Loading States
1. **Given** user is on the login page
2. **When** user clicks "Continue with Google"
3. **Then** button shows loading spinner and "Signing in with Google..." text
4. **And** other buttons are disabled
5. **And** form inputs are disabled

### Scenario 9: OAuth Callback Loading
1. **Given** user is redirected from OAuth provider
2. **When** callback page is processing
3. **Then** loading spinner is shown
4. **And** appropriate processing message is displayed
5. **And** user cannot navigate away during processing

## Mobile Responsive

### Scenario 10: Mobile OAuth Flow
1. **Given** user is on mobile device
2. **When** user completes OAuth flow
3. **Then** all redirects work correctly
4. **And** UI remains responsive throughout
5. **And** social login buttons are properly sized for touch

## Cross-Browser Testing

### Scenario 11: Safari OAuth Flow
1. **Given** user is using Safari browser
2. **When** user completes OAuth flow
3. **Then** all cookies and tokens are handled correctly
4. **And** user is properly authenticated

### Scenario 12: Chrome OAuth Flow
1. **Given** user is using Chrome browser
2. **When** user completes OAuth flow
3. **Then** popup blockers don't interfere
4. **And** user is properly authenticated

## Security Testing

### Scenario 13: State Parameter Validation
1. **Given** user initiates OAuth flow
2. **When** callback is received with invalid state parameter
3. **Then** authentication fails securely
4. **And** user sees appropriate error message

### Scenario 14: CSRF Protection
1. **Given** malicious site attempts to complete OAuth flow
2. **When** callback is received without proper state
3. **Then** authentication is rejected
4. **And** security event is logged

## Performance Testing

### Scenario 15: OAuth Flow Performance
1. **Given** user initiates OAuth flow
2. **When** measuring end-to-end completion time
3. **Then** total flow completes within 5 seconds
4. **And** callback processing completes within 2 seconds

## Internationalization

### Scenario 16: Polish Language OAuth
1. **Given** user has Polish language selected
2. **When** user goes through OAuth flow
3. **Then** all messages are displayed in Polish
4. **And** button text is properly translated

### Scenario 17: Language Persistence
1. **Given** user starts OAuth in Polish
2. **When** user completes OAuth flow
3. **Then** language preference is maintained
4. **And** post-login UI is in Polish

## Test Implementation Notes

- Use Page Object Model for maintainable tests
- Mock OAuth providers using tools like WireMock or similar
- Test with real OAuth providers in staging environment
- Include accessibility testing in E2E flows
- Verify analytics/tracking events are fired correctly
- Test with various network conditions (slow, offline, etc.)

## Test Data Requirements

- Test Google OAuth client credentials
- Test Facebook OAuth app credentials
- Test users with various permission combinations
- Mock backend responses for error scenarios
- Test organization accounts for business flows

## Continuous Integration

- Run E2E tests on every PR
- Test against multiple browser versions
- Include mobile device testing
- Run performance regression tests
- Generate test reports with screenshots on failures