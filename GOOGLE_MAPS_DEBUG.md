# Google Maps API Debugging Guide

## InvalidKeyMapError Resolution

If you're seeing the `InvalidKeyMapError` in your console, follow these steps to resolve it:

### 1. Set Up Your API Key

Create a `.env.local` file in your project root directory:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC1DvthAdrn2NWMEZx5ovFtPfe9pM_E3mg
```

### 2. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key (it should start with `AIza`)

### 3. Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. In Google Cloud Console, go to **Credentials**
2. Click on your API key
3. Under **Application restrictions**, select **HTTP referrers**
4. Add your domain (e.g., `localhost:3000/*` for development)
5. Under **API restrictions**, select **Restrict key**
6. Select **Maps JavaScript API**

### 4. Enable Billing

Google Maps API requires billing to be enabled:

1. Go to **Billing** in Google Cloud Console
2. Link a billing account to your project
3. The Maps JavaScript API has a generous free tier

### 5. Debug Information

The enhanced error handling will show you:

- ✅ **Valid API Key**: Key format is correct
- ❌ **Missing API Key**: No environment variable found
- ❌ **Invalid API Key**: Key format is incorrect or API is not enabled

### 6. Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `InvalidKeyMapError` | API key is invalid or not enabled | Enable Maps JavaScript API |
| `QuotaExceededError` | Billing quota exceeded | Check billing status |
| `RequestDeniedError` | Domain restrictions | Add your domain to allowed referrers |
| `ZeroResultsError` | Location not found | Check coordinates |

### 7. Testing Your Setup

1. Restart your development server after adding the `.env.local` file
2. Open browser console to see debug information
3. Click the "Debug" button in the error UI for detailed logs

### 8. Environment Variables

Make sure your `.env.local` file is in the project root and contains:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
```

**Note**: The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

### 9. Production Deployment

For production, set the environment variable in your hosting platform:

- **Vercel**: Add in project settings → Environment Variables
- **Netlify**: Add in site settings → Environment Variables
- **Railway**: Add in project variables

### 10. Security Best Practices

- ✅ Use domain restrictions on your API key
- ✅ Enable API restrictions to only Maps JavaScript API
- ✅ Monitor usage in Google Cloud Console
- ❌ Never commit API keys to version control
- ❌ Don't share API keys publicly

## Debug Console Output

When you click the "Debug" button, you'll see detailed information like:

```
🔍 Google Maps API Key Debug Info:
Environment variable exists: true
API Key length: 39
API Key starts with "AIza": true
API Key is placeholder: false
Current environment: development
Full API Key (first 10 chars): AIzaSyYour...
✅ Google Maps API Key appears to be valid
```

This will help you identify exactly what's wrong with your API key configuration. 