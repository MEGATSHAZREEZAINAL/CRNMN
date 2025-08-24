# Supabase Database Setup

## Overview

Your Supabase credentials are now configured in `.env.local`. Follow these steps to complete the database setup.

## Configuration Status

✅ **Supabase URL**: https://oxnoqoidftbmshbzhchm.supabase.co  
✅ **Anonymous Key**: Configured in `.env.local`  
✅ **Environment Variables**: Set up correctly

## Next Steps

### 1. Initialize Database Tables

Go to your Supabase Dashboard:

1. Visit: https://app.supabase.com/project/oxnoqoidftbmshbzhchm/sql
2. Click "New Query" or go to the SQL Editor
3. Copy and paste the initialization SQL from `services/supabase.ts` (lines 98-248)
4. Run the query to create all tables, policies, and triggers

### 2. Enable Authentication

The authentication is already set up to work with your Supabase project. Once the database is initialized, you can:

- Sign up new users
- Sign in existing users
- Use Row Level Security for data isolation

### 3. Test the Setup

After running the SQL initialization:

1. Restart your development server: `npm run dev`
2. Try signing up with a new account
3. The app should now use real Supabase authentication instead of demo mode

## Database Features Included

- **Sales tracking** with user isolation
- **Inventory management** with stock thresholds
- **Customer relationship management**
- **Project management** with task tracking
- **Invoice management** with payment status
- **Social media scheduling**
- **AI insights storage**
- **Business settings** per user
- **Row Level Security** for data protection
- **Automatic timestamps** for audit trails

## Troubleshooting

If you encounter issues:

1. Check that all tables were created successfully in Supabase Dashboard > Table Editor
2. Verify that RLS policies are enabled in Supabase Dashboard > Authentication > Policies
3. Make sure your environment variables are loaded (restart dev server)
4. Check browser console for any authentication errors

## Demo Mode Fallback

The app will automatically fall back to demo mode if:

- Supabase URL contains "your-project"
- Environment variables are not properly loaded
- Database connection fails

This ensures the app always works for development and testing.
