# Availability Calendar & Conflict Prevention System

## Overview
The availability calendar system prevents double-booking and shows families when caregivers are available for booking. It combines caregiver-set availability schedules with real-time booking status.

---

## How It Works

### 1. Caregivers Set Their Availability

**Location:** `/dashboard/caregiver/settings?tab=availability`

Caregivers can set their weekly availability schedule:
- **Day of Week:** Sunday-Saturday (0-6)
- **Time Slots:** Start time and end time for each day (e.g., 08:00 - 17:00)
- **Multiple Slots:** Can add multiple time windows per day
- **Toggle:** Can enable/disable availability for specific days

**Example Schedule:**
```
Monday: 08:00 - 12:00, 14:00 - 18:00
Tuesday: 09:00 - 17:00
Wednesday: OFF
Thursday: 08:00 - 16:00
Friday: 10:00 - 18:00
```

**Database:** Stored in `CaregiverAvailability` table:
```sql
{
  caregiverId: string,
  dayOfWeek: number,    -- 0 (Sun) to 6 (Sat)
  startTime: string,    -- "HH:mm" format
  endTime: string,      -- "HH:mm" format
  isAvailable: boolean
}
```

---

### 2. Families View Available Slots

**Location:** `/dashboard/caregivers/[id]` → Book Caregiver button

When booking a caregiver, families see:

#### **A. Calendar View**
- Current month with days
- Past dates grayed out
- Available days highlighted
- Click a date to see time slots

#### **B. Time Slot Grid**
Time slots are displayed with color coding:

| Color | Status | Description |
|-------|--------|-------------|
| 🟢 Green | Available | Caregiver is free, can be booked |
| 🔴 Red | Booked | Already has a booking at this time |
| ⬜ Gray | Not Working | Caregiver doesn't work this day |
| 🔵 Blue | Selected | User has selected this slot |

#### **C. Slot Calculation**
1. System fetches caregiver's weekly availability
2. Checks day of week for selected date
3. Finds availability windows (e.g., 08:00-17:00)
4. Generates 1-hour slots within windows
5. Checks each slot against existing bookings
6. Marks slot as "available" or "booked"

**Example for Monday, Jan 15:**
```
Caregiver Availability: 08:00 - 17:00
Selected Duration: 2 hours

Generated Slots:
✅ 08:00 - 09:00 (Available)
✅ 09:00 - 10:00 (Available)
❌ 10:00 - 11:00 (Booked - existing booking)
❌ 11:00 - 12:00 (Booked - same booking)
✅ 12:00 - 13:00 (Available)
✅ 13:00 - 14:00 (Available)
...
```

---

### 3. Conflict Prevention

The system prevents double-booking in **two places**:

#### **Backend Validation** (`booking.service.ts`)

When creating a booking, the system checks:

1. **Availability Schedule Check:**
   ```typescript
   // Is caregiver working on this day/time?
   const availability = await prisma.caregiverAvailability.findFirst({
     where: {
       caregiverId,
       dayOfWeek: scheduledDate.getDay(),
       isAvailable: true,
       startTime: { lte: requestedTime },
       endTime: { gte: requestedTime },
     },
   });

   if (!availability) {
     throw new BadRequestError('Caregiver not available at this time');
   }
   ```

2. **Booking Conflict Check:**
   ```typescript
   // Are there overlapping bookings?
   const conflicts = await prisma.booking.findMany({
     where: {
       caregiverId,
       scheduledDate: { /* same day */ },
       status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
     },
   });

   for (const booking of conflicts) {
     const hasOverlap = checkTimeOverlap(
       requestedStart,
       requestedEnd,
       booking.scheduledDate,
       booking.duration
     );

     if (hasOverlap) {
       throw new BadRequestError('Time slot already booked');
     }
   }
   ```

#### **Frontend Prevention** (`AvailabilityCalendar.tsx`)

- Disables booked time slots (can't click)
- Shows visual feedback (red = booked, green = available)
- Only sends valid slot selections to backend

---

## API Endpoints

### Get Available Slots

**Endpoint:** `GET /api/v1/caregivers/:id/availability?date=2024-01-15`

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15T00:00:00.000Z",
    "dayOfWeek": 1,
    "isWorkingDay": true,
    "availabilityWindows": [
      {
        "startTime": "08:00",
        "endTime": "17:00"
      }
    ],
    "slots": [
      {
        "startTime": "08:00",
        "endTime": "09:00",
        "status": "available"
      },
      {
        "startTime": "09:00",
        "endTime": "10:00",
        "status": "available"
      },
      {
        "startTime": "10:00",
        "endTime": "11:00",
        "status": "booked",
        "bookingId": "abc-123"
      }
    ]
  }
}
```

**Query Parameters:**
- `date` (required): ISO date string for the day to check

**Authentication:** Required (Bearer token)

---

## User Flow

### Family Booking Flow

1. **Browse Caregivers** → Click caregiver profile
2. **View Profile** → Click "Book Caregiver" button
3. **Select Service** → Choose service type (Companionship, etc.)
4. **Select Duration** → Choose hours (1h, 2h, 4h, etc.)
5. **Pick Date** → Calendar shows current/future dates
6. **Pick Time Slot** → See available green slots, booked red slots
7. **Confirm Booking** → System validates and creates booking

### Caregiver Setup Flow

1. **Go to Settings** → `/dashboard/caregiver/settings`
2. **Navigate to Availability Tab**
3. **Add Time Slots:**
   - Select day of week
   - Set start time (e.g., 08:00)
   - Set end time (e.g., 17:00)
   - Click "Add Slot"
4. **Repeat for all working days**
5. **Save Changes** → Updates database

---

## Edge Cases Handled

### 1. Multiple Time Windows Per Day
✅ Caregiver works 08:00-12:00 and 14:00-18:00 (lunch break)
- System generates slots for both windows
- 12:00-14:00 not shown (no availability set)

### 2. Booking Spans Slot Boundaries
✅ User selects 10:00 slot for 2-hour booking
- System checks 10:00-12:00 for conflicts
- Validates entire duration, not just start time

### 3. Past Dates
✅ Past dates are grayed out and not clickable
- Frontend prevents selection
- Backend validates `scheduledDate > now()`

### 4. Caregiver Not Working That Day
✅ User selects a date where caregiver is off
- Calendar shows "Not available on this day" message
- No slots displayed

### 5. All Slots Booked
✅ Caregiver fully booked on a day
- All slots show red (booked)
- User can't select any slot
- Message: "No available slots on this date"

### 6. Booking During Existing Booking
❌ User tries to book 10:00-12:00, but 10:30-11:30 already booked
- Slot shows as "booked" (red)
- Can't be selected
- Error if somehow bypassed frontend: "Time slot already booked"

---

## Database Schema

### CaregiverAvailability
```sql
CREATE TABLE "CaregiverAvailability" (
  id TEXT PRIMARY KEY,
  caregiverId TEXT NOT NULL,
  dayOfWeek INTEGER NOT NULL,    -- 0-6
  startTime TEXT NOT NULL,        -- "HH:mm"
  endTime TEXT NOT NULL,          -- "HH:mm"
  isAvailable BOOLEAN NOT NULL,
  createdAt TIMESTAMP NOT NULL,

  FOREIGN KEY (caregiverId) REFERENCES Caregiver(id)
);
```

### Booking (Existing)
```sql
CREATE TABLE "Booking" (
  id TEXT PRIMARY KEY,
  caregiverId TEXT,
  scheduledDate TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,     -- minutes
  status TEXT NOT NULL,          -- PENDING, CONFIRMED, IN_PROGRESS, etc.
  ...
);
```

---

## Code Structure

### Backend

**Files:**
- `src/services/caregiver.service.ts` → `getAvailableSlots()` method
- `src/services/booking.service.ts` → Conflict checking in `createBooking()`
- `src/controllers/caregiver.controller.ts` → `getAvailableSlots()` endpoint
- `src/routes/caregiver.routes.ts` → Route definition

**Key Method:**
```typescript
async getAvailableSlots(caregiverId: string, date: Date) {
  // 1. Get caregiver with availability & bookings
  // 2. Check day of week
  // 3. Get availability windows
  // 4. Generate hourly slots
  // 5. Check each slot against bookings
  // 6. Return slots with status
}
```

### Frontend

**Files:**
- `src/components/ui/AvailabilityCalendar.tsx` → Calendar component
- `src/app/dashboard/caregivers/[id]/page.tsx` → Integration in booking modal

**Key Component:**
```typescript
<AvailabilityCalendar
  caregiverId={caregiverId}
  duration={bookingDuration}
  selectedDate={date}
  selectedTime={time}
  onSlotSelect={(date, time, duration) => {
    // Update booking form
  }}
/>
```

---

## Testing Checklist

### Caregiver Availability Setup
- [ ] Can add multiple time slots for a day
- [ ] Can set different hours for different days
- [ ] Can mark days as unavailable
- [ ] Changes save to database
- [ ] UI reflects current availability

### Family Booking
- [ ] Calendar shows only future dates
- [ ] Can't click past dates
- [ ] Clicking date shows time slots
- [ ] Green slots are clickable
- [ ] Red slots are disabled
- [ ] Selected slot highlights in blue
- [ ] Cost updates when slot selected

### Conflict Prevention
- [ ] Can't book during existing booking
- [ ] Can't book outside availability hours
- [ ] Can't book when caregiver is offline
- [ ] Backend validates and rejects conflicts
- [ ] Error messages are clear

### Edge Cases
- [ ] Caregiver with no availability shows "Not working"
- [ ] All slots booked shows "No available slots"
- [ ] Multi-hour bookings check full duration
- [ ] Bookings ending at midnight handled correctly
- [ ] Timezone issues handled (if applicable)

---

## Success Criteria

✅ **Caregivers can set flexible schedules** (multiple slots per day, different hours per day)
✅ **Families see real-time availability** (booked vs available)
✅ **No double-booking possible** (backend + frontend validation)
✅ **Clear visual feedback** (color-coded slots, disabled states)
✅ **Fast loading** (cached availability data per date)
✅ **Mobile responsive** (calendar works on all screen sizes)

---

## Future Enhancements

### 1. Recurring Availability
- Set weekly schedule once, applies to all future weeks
- Override specific dates (holidays, vacations)

### 2. Buffer Times
- Add 15-30 min buffer between bookings
- Prevent back-to-back scheduling

### 3. Smart Suggestions
- "Caregiver often available on Mondays at 10am"
- Show next available slot

### 4. Bulk Booking
- Book multiple sessions at once
- Recurring bookings (every Monday for 4 weeks)

### 5. Waitlist
- If slot is booked, join waitlist
- Get notified if cancellation

---

## Troubleshooting

### "No slots showing even though caregiver is available"

**Check:**
1. Caregiver has set availability for that day of week
2. Selected date is in the future
3. API call to `/availability` is successful (check Network tab)
4. Duration fits within availability window

### "Slot shows as available but booking fails"

**Check:**
1. Another booking was created between loading slots and confirming
2. Refresh availability calendar
3. Backend logs for specific error

### "Calendar not loading"

**Check:**
1. `caregiverId` is valid
2. Authentication token is present
3. API endpoint is accessible (CORS, network)
4. Console errors in browser DevTools

---

## Calendar Views

### 1. Family View - Availability Calendar (`AvailabilityCalendar.tsx`)

**Purpose:** Allows families to see when a caregiver is available and book time slots

**Locations:**
- Caregiver profile page (`/dashboard/caregivers/[id]`) - As a separate section
- Booking modal - Integrated into the booking flow

**Features:**
- Monthly calendar view
- Color-coded slots (green = available, red = booked)
- Click to select time slot
- Automatically populates booking form
- Real-time availability checking via API

**User Flow:**
1. View caregiver profile
2. See availability calendar
3. Click a date
4. View available time slots
5. Click green slot → Opens booking modal or populates form
6. Complete booking

### 2. Caregiver View - Schedule Calendar (`CaregiverCalendar.tsx`)

**Purpose:** Allows caregivers to see their schedule, bookings, and availability

**Location:** Caregiver dashboard (`/dashboard/caregiver`)

**Features:**
- Monthly calendar overview
- Color-coded days:
  - Green border = Available for work
  - Blue = Has bookings
  - Gray = Day off
- Click day to see details
- Sidebar shows:
  - Availability windows (e.g., "08:00 - 17:00")
  - All bookings for selected day
  - Booking details (service, time, client, address, amount)
  - Status badges (confirmed, pending, etc.)
- Booking indicators (dots under dates with bookings)

**Data Displayed:**
- Availability schedule (set in settings)
- Confirmed bookings
- Pending bookings
- In-progress bookings
- Booking times and durations
- Client names
- Service types
- Earnings per booking
- Booking status

**Benefits:**
- See schedule at a glance
- Plan work week
- Track upcoming jobs
- View earnings
- Identify free slots

## Related Documentation

- `BOOKING_PRICING_FIX.md` - Caregiver-specific pricing
- `CAREGIVER_RATES_FIX.md` - How hourly rates are stored
- `ROLE_BASED_ACCESS.md` - Caregiver vs family permissions
