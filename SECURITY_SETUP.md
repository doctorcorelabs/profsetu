# Security Setup Guide

## ⚠️ IMPORTANT SECURITY NOTICE

**NEVER commit actual usernames, passwords, or password hashes to the repository!**

## Environment Variables Setup

### 1. Create Local Environment File

Create a `.env` file in your project root (this file is already in `.gitignore`):

```bash
# Admin credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

# Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Generate Password Hash

Use this Node.js script to generate a secure password hash:

```javascript
const crypto = require('crypto');

function generatePasswordHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Example usage:
const password = 'your_secure_password';
const hash = generatePasswordHash(password);
console.log('Password hash:', hash);
```

Or use this online tool: https://emn178.github.io/online-tools/sha256.html

### 3. Database Setup

When running SQL scripts:

1. Replace `ADMIN_USERNAME` with your actual username
2. Replace `ADMIN_PASSWORD_HASH` with the generated hash
3. Never commit the actual values

### 4. Production Deployment

For production deployment (Netlify):

1. Set environment variables in Netlify dashboard
2. Use Netlify Functions for server-side operations
3. Never expose sensitive data in client-side code

## Security Best Practices

- ✅ Use environment variables for sensitive data
- ✅ Generate password hashes locally, never commit them
- ✅ Use strong, unique passwords
- ✅ Regularly rotate credentials
- ✅ Monitor access logs
- ❌ Never commit `.env` files
- ❌ Never hardcode credentials in source code
- ❌ Never share credentials in plain text

## Emergency Credential Reset

If credentials are compromised:

1. Change passwords immediately
2. Regenerate password hashes
3. Update database with new hashes
4. Review access logs
5. Consider rotating all credentials
