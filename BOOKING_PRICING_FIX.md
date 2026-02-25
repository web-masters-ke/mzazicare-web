# Booking Pricing Fix - Caregiver-Specific Rates

## Problem
When booking a caregiver, the system was showing "insufficient balance" error even when users had enough money. The root cause was that the system was using global service pricing instead of the caregiver's specific hourly rate for each service.

## Root Cause

### Backend Issue
The `createBooking` method in `booking.service.ts` was calling:
```typescript
const pricing = await serviceCatalogService.calculatePricing(
  data.serviceTypeId,
  data.duration
);
```

This calculated pricing using the global `ServiceType.pricePerHour`, ignoring the caregiver's custom rate stored in `CaregiverSkill.hourlyRate`.

### Frontend Issue
The `calculateBookingCost()` function in the caregiver profile page was using:
```typescript
const hourlyAmount = Number(service.pricePerHour) * hours;
```

This also used the global service rate instead of checking the caregiver's specific rate for the selected service.

## Solution

### 1. Backend - Service Catalog Service

**File:** `/src/services/service-catalog.service.ts`

Updated `calculatePricing()` method to accept an optional `caregiverId` parameter:

```typescript
async calculatePricing(
  serviceId: string,
  duration: number,
  caregiverId?: string // NEW: Optional caregiver ID
): Promise<PriceCalculation> {
  const service = await this.getServiceById(serviceId);
  const hours = duration / 60;

  let hourlyRate = Number(service.pricePerHour);

  // If caregiverId is provided, get their specific rate
  if (caregiverId) {
    const caregiverSkill = await prisma.caregiverSkill.findFirst({
      where: {
        caregiverId,
        category: service.category,
      },
    });

    if (caregiverSkill && caregiverSkill.hourlyRate) {
      hourlyRate = Number(caregiverSkill.hourlyRate);
      console.log(`Using caregiver ${caregiverId} specific rate: KES ${hourlyRate}/hour for ${service.category}`);
    }
  }

  // Calculate using caregiver's rate (or fallback to default)
  const baseAmount = Number(service.basePrice);
  const hourlyAmount = hourlyRate * hours;
  const serviceAmount = baseAmount + hourlyAmount;
  // ... rest of calculation
}
```

**Key Changes:**
- Added `caregiverId?: string` parameter
- Queries `CaregiverSkill` table to get the caregiver's hourly rate for the service
- Falls back to global service rate if caregiver has no custom rate set
- Logs which rate is being used for debugging

### 2. Backend - Booking Service

**File:** `/src/services/booking.service.ts`

Updated the `createBooking` method to pass `caregiverId` to pricing calculation:

```typescript
// Calculate pricing (use caregiver's specific rate if provided)
const pricing = await serviceCatalogService.calculatePricing(
  data.serviceTypeId,
  data.duration,
  data.caregiverId // Pass caregiverId to use their specific rate
);

console.log(`[Booking] Pricing calculated for service ${data.serviceTypeId}:`, {
  totalAmount: pricing.totalAmount,
  breakdown: pricing.breakdown,
  caregiverId: data.caregiverId || 'none (using default rates)',
});
```

**Key Changes:**
- Passes `data.caregiverId` to `calculatePricing()`
- Adds detailed logging for debugging pricing issues
- Now correctly uses caregiver's custom rate when booking specific caregivers

### 3. Frontend - Caregiver Profile Page

**File:** `/src/app/dashboard/caregivers/[id]/page.tsx`

#### Updated Cost Calculation

```typescript
const calculateBookingCost = () => {
  const service = getServiceByCategory(serviceType);
  if (!service) return 0;

  const hours = Number(bookingDuration) / 60;
  const baseAmount = Number(service.basePrice);

  // Use caregiver's specific hourly rate if available
  let hourlyRate = Number(service.pricePerHour);

  if (currentCaregiver?.skills && Array.isArray(currentCaregiver.skills)) {
    // Find the caregiver's rate for this specific service
    const caregiverSkill = currentCaregiver.skills.find((skill: any) => {
      const skillCategory = typeof skill === 'string' ? skill : skill.category;
      return skillCategory === serviceType;
    }) as any;

    if (caregiverSkill && typeof caregiverSkill === 'object' && caregiverSkill.hourlyRate) {
      hourlyRate = Number(caregiverSkill.hourlyRate);
      console.log(`Using caregiver's specific rate: KES ${hourlyRate}/hour for ${serviceType}`);
    }
  }

  const hourlyAmount = hourlyRate * hours;
  return baseAmount + hourlyAmount;
};
```

**Key Changes:**
- Checks if caregiver has skills with hourly rates
- Finds the specific skill matching the selected service type
- Uses caregiver's hourly rate if available, otherwise uses global rate
- Logs which rate is being used for transparency

#### Updated Skills Display

Changed from simple badge list to detailed cards showing rates:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {caregiver.skills.map((skill: any, idx: number) => {
    const skillName = typeof skill === 'string' ? skill : skill.category;
    const hourlyRate = typeof skill === 'object' && skill.hourlyRate
      ? Number(skill.hourlyRate)
      : null;
    const experience = typeof skill === 'object' && skill.experience
      ? skill.experience
      : null;

    return (
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-bold">{skillName.replace(/_/g, ' ')}</h3>
          {hourlyRate && (
            <div className="bg-green-100 px-2 py-1 rounded-lg">
              <span className="text-xs font-bold">
                <DollarSign className="w-3 h-3" />
                {hourlyRate}/hr
              </span>
            </div>
          )}
        </div>
        {experience && (
          <p className="text-xs">
            <Clock className="w-3 h-3" />
            {experience} years experience
          </p>
        )}
      </div>
    );
  })}
</div>
```

**Key Changes:**
- Each service now shows its hourly rate prominently
- Shows experience years for each service
- Better visual hierarchy with cards instead of simple badges

#### Updated Booking Modal

Changed from using fixed `caregiver.hourlyRate` to dynamic `calculateBookingCost()`:

```typescript
{/* Total Cost */}
{bookingDuration && (
  <div className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm">Estimated Total</p>
        <p className="text-xs">
          Based on {(Number(bookingDuration) / 60).toFixed(1)} hours
        </p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold">
          KES {calculateBookingCost().toLocaleString()}
        </p>
      </div>
    </div>
  </div>
)}
```

**Key Changes:**
- Uses `calculateBookingCost()` instead of `caregiver.hourlyRate * hours`
- Now correctly reflects the selected service's rate
- Updates dynamically when user changes service type

## Data Flow

### Before Fix

1. User selects caregiver & service
2. **Frontend:** Calculates cost using global service rate
3. **Backend:** Calculates cost using global service rate
4. **Problem:** Both ignore caregiver's custom rate

### After Fix

1. User selects caregiver & service
2. **Frontend:**
   - Checks if caregiver has custom rate for selected service
   - Uses custom rate if available, else global rate
   - Shows correct cost in booking modal
3. **Backend:**
   - Receives `caregiverId` in booking request
   - Queries `CaregiverSkill` table for custom rate
   - Calculates pricing using caregiver's rate
   - Validates wallet balance against correct amount

## Pricing Structure

### Formula

```
Total Cost = Base Price + (Hourly Rate × Hours)
```

**Where:**
- **Base Price:** Fixed per service (e.g., KES 500 for Companionship)
- **Hourly Rate:** Caregiver-specific OR global default
  - Caregiver sets: KES 50 - 10,000 per service
  - Global default: Varies by service (e.g., KES 350/hr for Companionship)
- **Hours:** Duration in hours (e.g., 4 hours = 240 minutes ÷ 60)

### Example Calculation

**Scenario:** Book Companionship service for 4 hours

**Global Service Rates:**
- Base Price: KES 500
- Hourly Rate: KES 350
- **Total:** 500 + (350 × 4) = **KES 1,900**

**Caregiver Custom Rate:**
- Base Price: KES 500 (same)
- Hourly Rate: KES 450 (caregiver set)
- **Total:** 500 + (450 × 4) = **KES 2,300**

**Difference:** KES 400 more when using caregiver's custom rate

## Testing Checklist

### Backend Testing

- [x] Booking with caregiverId uses caregiver's custom rate
- [x] Booking without caregiverId uses global service rate
- [x] Caregiver with no custom rate falls back to global rate
- [x] Wallet balance checked against correct pricing
- [x] Console logs show which rate is being used

### Frontend Testing

- [x] Caregiver profile shows all services with individual rates
- [x] Booking modal calculates cost correctly per service
- [x] Changing service type updates cost calculation
- [x] Changing duration updates total cost
- [x] Wallet balance shows "sufficient" or "insufficient" correctly
- [x] Console logs show rate selection logic

### Edge Cases

- [x] Caregiver with old skills (string format) still works
- [x] Caregiver with new skills (object with rate) displays correctly
- [x] Mixed skills (some with rates, some without) handled
- [x] Service type not offered by caregiver uses global rate

## Files Modified

### Backend

1. `/src/services/service-catalog.service.ts`
   - Added `caregiverId` parameter to `calculatePricing()`
   - Queries `CaregiverSkill` for custom rates
   - Added logging for debugging

2. `/src/services/booking.service.ts`
   - Passes `caregiverId` to pricing calculation
   - Added detailed logging
   - Ensures correct rate used for wallet balance check

### Frontend

1. `/src/app/dashboard/caregivers/[id]/page.tsx`
   - Updated `calculateBookingCost()` to check caregiver's rate
   - Enhanced skills display to show rates and experience
   - Updated booking modal cost display
   - Changed Quick Stats to show "Services" count instead of single rate

## Database Schema

The fix leverages the existing `CaregiverSkill` table structure:

```sql
Table: CaregiverSkill
- id: text (PK)
- caregiverId: text (FK to Caregiver)
- category: ServiceCategory (enum)
- hourlyRate: numeric(10,2) ✅ Used for custom rates
- experience: integer ✅ Years of experience
- createdAt: timestamp
```

**Note:** Migration already applied in previous fix (see `CAREGIVER_RATES_FIX.md`)

## Debugging

To debug pricing issues, check console logs:

### Backend Logs
```
Using caregiver abc123 specific rate: KES 450/hour for COMPANIONSHIP
[Booking] Pricing calculated: { totalAmount: 2300, caregiverId: 'abc123' }
```

### Frontend Logs
```
Using caregiver's specific rate: KES 450/hour for COMPANIONSHIP
Booking cost breakdown: { basePrice: 500, hourlyRate: 450, hours: 4, totalCost: 2300 }
```

## Related Documentation

- `CAREGIVER_RATES_FIX.md` - How caregiver rates were added to the database
- `ROLE_BASED_ACCESS.md` - Caregiver-specific features and access control

## Success Criteria

✅ **Backend correctly calculates pricing using caregiver-specific rates**
✅ **Frontend displays each service with its hourly rate**
✅ **Booking modal shows accurate total cost**
✅ **Wallet balance check uses correct amount**
✅ **No more "insufficient balance" errors with correct amounts**
✅ **Builds successfully with no TypeScript errors**
