# 4B4KU5 User Flow Testing Checklist

## 🔐 Authentication Flow
- [ ] Sign-up with email/password works
- [ ] Sign-up validation (email format, password strength)
- [ ] Sign-up error messages display correctly
- [ ] Email verification sent (if enabled)
- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials shows error
- [ ] Logout clears session properly
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authenticated users redirected away from login/signup pages

## 🚀 Onboarding Flow
- [ ] New users directed to onboarding after signup
- [ ] All onboarding steps are accessible
- [ ] Progress is saved between steps
- [ ] Skip option works (if applicable)
- [ ] Completion redirects to main app

## 🕯️ First Ritual Flow
- [ ] Ritual creation works
- [ ] Ritual displays correctly
- [ ] Ritual completion saves to database
- [ ] Success feedback shown

## 👤 Profile Page
- [ ] Profile loads with user data
- [ ] Edit profile works
- [ ] Avatar upload works (if applicable)
- [ ] Settings save correctly

## 📱 Mobile Responsiveness
- [ ] All pages render correctly on mobile (375px)
- [ ] Navigation is accessible on mobile
- [ ] Forms are usable on mobile
- [ ] Touch targets are adequate size (min 44px)
- [ ] No horizontal scroll

## ⏳ Loading States
- [ ] Auth loading shows indicator
- [ ] Page transitions have loading states
- [ ] API calls show loading feedback
- [ ] Skeleton loaders where appropriate
