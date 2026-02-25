# Role-Based Access Control (RBAC)

## Overview

The MzaziCare platform now has proper role-based access control to ensure users only see and access features relevant to their role.

## User Roles

### 1. FAMILY_USER
Family members who need caregiving services for their elderly loved ones.

**Access:**
- ✅ Family Dashboard (`/dashboard`)
- ✅ Book Caregivers (`/dashboard/caregivers`)
- ✅ Manage Elderly Profiles (`/dashboard/elderly`)
- ✅ View/Manage Bookings (`/dashboard/bookings`)
- ✅ Wallet & Payments (`/dashboard/wallet`)
- ✅ Messages (`/dashboard/messages`)
- ✅ Profile & Settings

**Restrictions:**
- ❌ Cannot access Caregiver Dashboard (`/dashboard/caregiver`)
- ❌ Cannot access Jobs page (`/dashboard/jobs`)
- ❌ Cannot access Earnings page (`/dashboard/earnings`)

### 2. CAREGIVER
Professional caregivers who provide services to elderly clients.

**Access:**
- ✅ Caregiver Dashboard (`/dashboard/caregiver`)
- ✅ Professional Settings (`/dashboard/caregiver/settings`)
  - Set hourly rates for services
  - Manage skills and experience
  - Set availability schedule
  - Update professional bio
- ✅ Job Opportunities (`/dashboard/jobs`)
- ✅ Earnings & Payouts (`/dashboard/earnings`)
- ✅ Messages (`/dashboard/messages`)
- ✅ Profile & Settings

**Restrictions:**
- ❌ Cannot access Family Dashboard (auto-redirected to `/dashboard/caregiver`)
- ❌ Cannot access Find Caregivers page (`/dashboard/caregivers`)
- ❌ Cannot access Manage Elderly Profiles (`/dashboard/elderly`)

## Navigation Differences

### Family User Navigation

**Top Nav (Desktop):**
- Dashboard
- Bookings
- Elderly Profiles
- Find Caregivers
- Wallet
- Messages

**Bottom Nav (Mobile):**
- Home → `/dashboard`
- Bookings → `/dashboard/bookings`
- Elderly → `/dashboard/elderly`
- Caregivers → `/dashboard/caregivers`
- Profile → `/dashboard/profile`

### Caregiver Navigation

**Top Nav (Desktop):**
- Dashboard → `/dashboard/caregiver`
- My Jobs → `/dashboard/jobs`
- Earnings → `/dashboard/earnings`
- Messages → `/dashboard/messages`

**Bottom Nav (Mobile):**
- Home → `/dashboard/caregiver`
- Jobs → `/dashboard/jobs`
- Messages → `/dashboard/messages`
- Earnings → `/dashboard/earnings`
- Profile → `/dashboard/profile`

## Automatic Redirects

### Main Dashboard (`/dashboard`)

When accessing the main dashboard:

1. **FAMILY_USER:** Shows family dashboard with stats, bookings, caregivers
2. **CAREGIVER:** Automatically redirected to `/dashboard/caregiver`

This ensures caregivers always land on their specialized dashboard.

### Logo Click

The MzaziCare logo in the navigation:
- **FAMILY_USER:** Goes to `/dashboard`
- **CAREGIVER:** Goes to `/dashboard/caregiver`

## Page Protection

All role-specific pages use the `ProtectedRoute` component with `allowedRoles` prop:

### Family-Only Pages

```tsx
<ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
  <ElderlyContent />
</ProtectedRoute>
```

**Protected Pages:**
- `/dashboard/elderly` - Manage elderly profiles
- `/dashboard/caregivers` - Find and book caregivers

### Caregiver-Only Pages

```tsx
<ProtectedRoute allowedRoles={[UserRole.CAREGIVER]}>
  <JobsContent />
</ProtectedRoute>
```

**Protected Pages:**
- `/dashboard/caregiver` - Caregiver dashboard
- `/dashboard/caregiver/settings` - Professional settings
- `/dashboard/jobs` - Available jobs
- `/dashboard/earnings` - Earnings and payouts

### Shared Pages (Both Roles)

These pages are accessible to both roles but may show different content:

- `/dashboard/profile` - User profile
  - Caregivers see **Professional Profile** section
  - Family users see standard profile
- `/dashboard/settings` - App settings
- `/dashboard/messages` - Messaging
- `/dashboard/bookings` - Bookings (different views per role)

## Profile Page Differences

### For Family Users
The profile page shows:
- Personal information
- Family members
- Wallet
- Payment methods
- Preferences
- Support

### For Caregivers
The profile page shows **all of the above PLUS**:
- **Professional Profile Section** (prominent green card)
  - "Set Your Rates & Services" feature card
  - Quick links to:
    - Skills & Hourly Rates
    - Availability Schedule
    - Professional Bio

## Implementation Details

### Files Modified

1. **Main Dashboard** (`/src/app/dashboard/page.tsx`)
   - Added redirect for caregivers
   - Shows loading state during redirect

2. **Bottom Navigation** (`/src/components/layout/BottomNav.tsx`)
   - Different nav items per role
   - Caregiver home points to `/dashboard/caregiver`
   - Updated active state detection

3. **Top Navigation** (`/src/components/layout/DashboardNav.tsx`)
   - Different nav items per role
   - Logo link changes based on role
   - Caregiver dashboard link updated

4. **Profile Page** (`/src/app/dashboard/profile/page.tsx`)
   - Added Professional Profile section for caregivers
   - Quick links with tab support
   - Role-based section display

5. **Caregiver Settings** (`/src/app/dashboard/caregiver/settings/page.tsx`)
   - Added URL parameter support (`?tab=skills|availability|bio`)
   - Direct deep-linking to specific tabs

### Code Example: Redirect Logic

```typescript
useEffect(() => {
  // Redirect caregivers to their specific dashboard
  if (userRole === UserRole.CAREGIVER) {
    router.replace('/dashboard/caregiver');
    return;
  }

  fetchBookings();
}, [userRole, router]);
```

## Testing Checklist

### As Family User
- [x] Access `/dashboard` → See family dashboard
- [x] Access `/dashboard/elderly` → Can manage elderly profiles
- [x] Access `/dashboard/caregivers` → Can find caregivers
- [x] Try to access `/dashboard/caregiver` → Blocked/redirected
- [x] Try to access `/dashboard/jobs` → Blocked/redirected
- [x] Try to access `/dashboard/earnings` → Blocked/redirected
- [x] Bottom nav shows: Home, Bookings, Elderly, Caregivers, Profile

### As Caregiver
- [x] Access `/dashboard` → Auto-redirect to `/dashboard/caregiver`
- [x] Access `/dashboard/caregiver` → See caregiver dashboard
- [x] Access `/dashboard/caregiver/settings` → Can set rates
- [x] Access `/dashboard/jobs` → See available jobs
- [x] Access `/dashboard/earnings` → See earnings
- [x] Access `/dashboard/profile` → See Professional Profile section
- [x] Try to access `/dashboard/elderly` → Blocked
- [x] Try to access `/dashboard/caregivers` → Blocked
- [x] Bottom nav shows: Home, Jobs, Messages, Earnings, Profile
- [x] Logo click goes to `/dashboard/caregiver`

## Security Notes

1. **Client-Side Protection:** The `ProtectedRoute` component checks roles on the client
2. **Server-Side Protection:** Backend API endpoints also validate user roles
3. **Auto-Redirect:** Prevents caregivers from accessing family features
4. **Deep Link Support:** Direct links to protected pages will redirect if unauthorized

## Future Enhancements

Potential improvements:
- Admin role with full access to all features
- Multi-role support (user can be both family and caregiver)
- Permission-based access (more granular than roles)
- Audit logging for role-based actions
