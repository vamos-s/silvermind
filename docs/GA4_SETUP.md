# Google Analytics 4 Setup Guide

This guide explains how to set up Google Analytics 4 for the SilverMind project.

## 1. Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or create a new property
3. Set up a property:
   - Property name: `SilverMind` (or your preferred name)
   - Reporting time zone: Select your time zone
   - Currency: Select your currency (optional)
4. Click "Create" and accept the terms

## 2. Get Your Measurement ID

After creating the property, you'll receive a **Measurement ID** in the format: `G-XXXXXXXXXX`

Copy this ID - you'll need it for the next step.

## 3. Configure Local Environment

Add your Measurement ID to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## 4. Configure Vercel Environment Variables

Add the Measurement ID to Vercel:

1. Go to your Vercel project dashboard: https://vercel.com/vamosclaw-6625s-projects/silvermind
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add the following:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: Your Measurement ID (e.g., `G-XXXXXXXXXX`)
   - **Environments**: Production, Preview, Development (all)
5. Click **Save**
6. Redeploy the project for the changes to take effect

## 5. Test the Setup

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and check for GA4 loading:
   ```javascript
   console.log(window.gtag)
   ```
   This should return a function if GA4 is loaded correctly.

3. Visit the GA4 **Realtime** report to see if visits are being tracked:
   - Go to Google Analytics → Reports → Realtime

## 6. Available Tracking Events

The project includes the following tracking events:

### Page Views
Automatically tracked on all page navigations.

### Game Events
Custom events for game interactions:

```typescript
// When a game starts
trackGameStart(category: string, game: string)

// Example usage:
import { trackGameStart } from '@/lib/ga'
trackGameStart('memory', 'pattern-matching')
```

```typescript
// When a game is completed
trackGameComplete(category: string, game: string, score: number, difficulty: string)

// Example usage:
import { trackGameComplete } from '@/lib/ga'
trackGameComplete('memory', 'pattern-matching', 850, 'medium')
```

```typescript
// When a level is completed
trackLevelUp(category: string, game: string, level: number)

// Example usage:
import { trackLevelUp } from '@/lib/ga'
trackLevelUp('memory', 'pattern-matching', 5)
```

### Custom Events
Track any custom event:

```typescript
import { trackEvent } from '@/lib/ga'

trackEvent('button_click', {
  button_name: 'start_game',
  page: 'memory/pattern-matching'
})
```

## 7. Data Privacy Notes

- This implementation only tracks anonymized user behavior
- No personal information is collected
- GA4 cookies are used for analytics purposes only
- Users can opt out using browser privacy settings or ad blockers

## 8. Troubleshooting

### No data showing in Realtime report
- Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly in Vercel
- Make sure you've redeployed after adding the environment variable
- Check browser console for any errors

### TypeScript errors
- Ensure `lib/ga.ts` is imported correctly
- The `Window` interface is extended for `gtag` in the ga.ts file

### Development vs Production
- GA4 will work in both environments if the environment variable is set
- Consider creating separate GA4 properties for dev/prod to separate test data from real data

## 9. Additional Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [Next.js with GA4](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries/google-analytics)
- [Event Measurement](https://support.google.com/analytics/answer/9216061)

---

**Last Updated**: March 9, 2026
