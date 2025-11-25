# OAuth Setup Guide for Vercel Deployment

## Production URL
Your stable production URL: **https://code-editor.vercel.app**

## ✅ STEP 1: Google OAuth Configuration

1. Go to: https://console.cloud.google.com/apis/credentials
2. Sign in with the Google account that created the OAuth app
3. Find your OAuth 2.0 Client ID: `105389876515-ogehps36pfng6m1dscgfrj2tsq2v2hqf.apps.googleusercontent.com`
4. Click on it to edit

### Add Authorized Redirect URIs:
```
https://code-editor.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### Add Authorized JavaScript Origins:
```
https://code-editor.vercel.app
http://localhost:3000
```

5. Click **SAVE** at the bottom
6. Wait 1-2 minutes for changes to propagate

---

## ✅ STEP 2: GitHub OAuth Configuration

1. Go to: https://github.com/settings/developers
2. Click on "OAuth Apps"
3. Find your app with Client ID: `Ov23li7Z6c79iJxEsWYR`
4. Click on it to edit

### Update Settings:
- **Homepage URL**: `https://code-editor.vercel.app`
- **Authorization callback URL**: `https://code-editor.vercel.app/api/auth/callback/github`

5. Click **Update application**

---

## ✅ STEP 3: Verify Environment Variables in Vercel

Run this command to verify all env vars are set:
```bash
vercel env ls production
```

You should see:
- DATABASE_URL
- AUTH_SECRET
- AUTH_GITHUB_ID
- AUTH_GITHUB_SECRET
- AUTH_GOOGLE_ID
- AUTH_GOOGLE_SECRET
- NEXTAUTH_URL (should be: https://code-editor.vercel.app)
- AUTH_TRUST_HOST (should be: true)

---

## ✅ STEP 4: Test Authentication

1. Visit: https://code-editor.vercel.app
2. Click "Get Started"
3. You'll be redirected to: https://code-editor.vercel.app/auth/sign-in
4. Click "Sign in with Google" or "Sign in with GitHub"
5. Complete OAuth flow
6. You should be redirected to: https://code-editor.vercel.app/dashboard

---

## 🔧 Troubleshooting

### "Error 401: invalid_client"
- Google OAuth redirect URIs are not updated
- Wait 1-2 minutes after saving changes
- Clear browser cache and try again

### "redirect_uri_mismatch"
- The callback URL doesn't match what's registered
- Double-check the exact URL in OAuth settings
- Ensure no trailing slashes

### Stuck on loading/blank screen
- Database connection issue
- Check MongoDB Atlas Network Access (whitelist 0.0.0.0/0)
- Verify DATABASE_URL is correct in Vercel

### "Access Denied"
- OAuth app is not published/verified
- Check OAuth consent screen status in Google Console

---

## 📝 What Was Fixed

1. **Added `trustHost: true`** to NextAuth config (required for Vercel)
2. **Added pages config** to specify custom sign-in page
3. **Added `/auth/sign-in` to public routes** so it's accessible
4. **Added `redirectTo` parameter** in sign-in functions
5. **Added `allowDangerousEmailAccountLinking`** for account linking
6. **Set NEXTAUTH_URL** to stable production domain
7. **Set AUTH_TRUST_HOST=true** for NextAuth v5

---

## 🎯 How OAuth Works with Vercel

### Flow:
1. User clicks "Sign in with Google/GitHub"
2. Server action calls `signIn("google", { redirectTo: "/dashboard" })`
3. NextAuth redirects to Google/GitHub OAuth
4. User authorizes the app
5. OAuth provider redirects back to: `https://code-editor.vercel.app/api/auth/callback/google`
6. NextAuth handles the callback, creates session
7. User is redirected to `/dashboard`

### Why Configuration Matters:
- **Redirect URIs must match exactly** - OAuth providers reject mismatched URLs for security
- **NEXTAUTH_URL must be set** - NextAuth needs to know the base URL for callbacks
- **trustHost: true** - Vercel uses dynamic deployment URLs, this tells NextAuth to trust the host header
- **AUTH_TRUST_HOST** - Environment variable version of trustHost for production

---

## ✅ Final Checklist

- [ ] Google OAuth redirect URI updated
- [ ] GitHub OAuth callback URL updated
- [ ] Waited 1-2 minutes for changes to propagate
- [ ] Tested sign-in flow on https://code-editor.vercel.app
- [ ] Both Google and GitHub authentication work
- [ ] Dashboard loads after successful sign-in

---

## 🚀 Your App is Live!

**Production URL**: https://code-editor.vercel.app

Once OAuth is configured, users can:
1. Visit the landing page
2. Click "Get Started"
3. Sign in with Google or GitHub
4. Access the full code editor dashboard
