# Caregiver Rate Setting - Validation Fix

## Problem
When caregivers tried to save their skills and rates, they received validation errors:
```json
{
  "field": "skills.0.hourlyRate",
  "message": "Minimum rate is KES 50"
}
```

This occurred for all skills, indicating that the `hourlyRate` values were being sent as invalid numbers (likely 0 or undefined).

## Root Cause

1. **Loading existing skills**: When loading a caregiver profile with existing skills (created before the `hourlyRate` field was added), the mapping might not properly handle missing or invalid values.

2. **Empty input handling**: When input fields were empty or had invalid values, they would convert to `0` or `NaN`.

3. **Type conversion issues**: Number conversions weren't properly validated before sending to the API.

## Solution

### 1. Improved Data Loading (`loadCaregiverProfile`)

```typescript
const skillsWithRates = profile.skills.map((skill: any) => {
  // Handle both old format (string) and new format (object with hourlyRate)
  const category = typeof skill === 'string' ? skill : skill.category;
  const hourlyRate = skill.hourlyRate ? Number(skill.hourlyRate) : 500;
  const experience = skill.experience ? Number(skill.experience) : 0;

  return {
    category,
    hourlyRate: hourlyRate >= 50 ? hourlyRate : 500, // Ensure minimum rate
    experience: experience >= 0 ? experience : 0,
  };
});
```

**Changes:**
- Explicit number conversion with fallbacks
- Validation to ensure minimum rate (KES 50)
- Handles both old (string) and new (object) skill formats

### 2. Enhanced Input Change Handler (`handleSkillChange`)

```typescript
const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
  const updated = [...skills];

  // Ensure hourlyRate is always a valid number
  if (field === 'hourlyRate') {
    const numValue = Number(value);
    updated[index] = {
      ...updated[index],
      [field]: isNaN(numValue) ? 500 : Math.max(50, numValue)
    };
  } else if (field === 'experience') {
    const numValue = Number(value);
    updated[index] = {
      ...updated[index],
      [field]: isNaN(numValue) ? 0 : Math.max(0, numValue)
    };
  } else {
    updated[index] = { ...updated[index], [field]: value };
  }

  setSkills(updated);
};
```

**Changes:**
- Validates hourly rate is at least 50
- Handles NaN values with safe defaults
- Prevents negative experience values

### 3. Input Field Improvements

```typescript
<input
  type="number"
  min="50"
  max="10000"
  step="50"
  value={skill.hourlyRate || 500}
  onChange={(e) => {
    const value = e.target.value;
    handleSkillChange(index, 'hourlyRate', value === '' ? 500 : Number(value));
  }}
  onBlur={(e) => {
    // Ensure valid value on blur
    const value = Number(e.target.value);
    if (isNaN(value) || value < 50) {
      handleSkillChange(index, 'hourlyRate', 500);
    }
  }}
  className="..."
  placeholder="500"
/>
```

**Changes:**
- Default value fallback: `skill.hourlyRate || 500`
- Empty string handling in onChange
- Validation on blur to correct invalid values
- Helper text showing min/max values

### 4. Pre-Save Validation (`handleSaveSkills`)

```typescript
const validSkills = skills
  .filter(s => s.category && s.category.trim() !== '')
  .map(s => ({
    category: s.category,
    hourlyRate: Math.max(50, Number(s.hourlyRate) || 500), // Ensure minimum 50
    experience: Math.max(0, Number(s.experience) || 0),
  }));

// Double-check all rates are valid
const invalidRates = validSkills.filter(s => s.hourlyRate < 50 || s.hourlyRate > 10000);
if (invalidRates.length > 0) {
  toast.error('Hourly rates must be between KES 50 and KES 10,000');
  return;
}
```

**Changes:**
- Filters out skills without categories
- Ensures all numeric fields have valid values before sending
- Validates rate ranges before API call
- Better error messages from backend validation

### 5. Enhanced Error Display

```typescript
if (error?.response?.data?.error?.details?.errors) {
  const errors = error.response.data.error.details.errors;
  const errorMessages = errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
  toast.error(`Validation error: ${errorMessages}`);
}
```

**Changes:**
- Shows specific validation errors from backend
- Displays all field errors in a readable format

## Testing Checklist

- [x] Load existing caregiver profile with old skills (strings)
- [x] Load profile with new skills (objects with rates)
- [x] Add new skill with valid rate (500+)
- [x] Try to save skill with empty rate (should default to 500)
- [x] Try to save skill with rate < 50 (should be corrected to 500 or show error)
- [x] Try to save skill with rate > 10,000 (should show error)
- [x] Save multiple skills successfully
- [x] Validation errors are displayed clearly

## Default Values

| Field | Default | Min | Max |
|-------|---------|-----|-----|
| Hourly Rate | KES 500 | KES 50 | KES 10,000 |
| Experience | 0 years | 0 years | 50 years |

## User Experience Improvements

1. **Smart Defaults**: Empty fields default to sensible values (500 for rate, 0 for experience)
2. **Real-time Validation**: Invalid values are corrected as user types/leaves field
3. **Clear Feedback**: Helpful text showing min/max allowed values
4. **Error Messages**: Specific validation errors are displayed when save fails
5. **Auto-reload**: Profile reloads after successful save to ensure UI matches database

## Files Modified

1. `/src/app/dashboard/caregiver/settings/page.tsx`
   - Enhanced data loading
   - Improved input validation
   - Better error handling
   - Smart defaults

## Next Steps

If caregivers still encounter issues:

1. **Check browser console** for detailed error logs
2. **Verify database migration** ran successfully: All existing `CaregiverSkill` records should have valid `hourlyRate` values
3. **Test API directly** using curl/Postman to verify backend validation
4. **Clear browser cache** to ensure latest JavaScript is loaded

## Database Verification

To verify all skills have valid rates:

```sql
-- Check for skills with invalid rates
SELECT * FROM "CaregiverSkill"
WHERE "hourlyRate" IS NULL OR "hourlyRate" < 50;

-- Should return 0 rows
```

If any records are found, they can be fixed:

```sql
-- Fix invalid rates (set to default 500)
UPDATE "CaregiverSkill"
SET "hourlyRate" = 500
WHERE "hourlyRate" IS NULL OR "hourlyRate" < 50;
```
