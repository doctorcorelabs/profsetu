#!/usr/bin/env node

/**
 * Pre-Deployment Test Script
 * Verifikasi semua konfigurasi sebelum deploy ke Netlify
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REQUIRED_FILES = [
  'netlify.toml',
  'netlify/functions/rss-scheduler.js',
  'netlify/functions/rss-processor.js',
  'netlify/functions/package.json',
  'src/components/RSSNewsSection.tsx',
  'run-rss-processor-local.js'
];

const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let passed = 0;
let failed = 0;

function checkPass(message) {
  console.log(`✅ ${message}`);
  passed++;
}

function checkFail(message) {
  console.log(`❌ ${message}`);
  failed++;
}

console.log('═══════════════════════════════════════════════');
console.log('🧪 PRE-DEPLOYMENT TEST SUITE');
console.log('═══════════════════════════════════════════════\n');

// Test 1: Check required files
console.log('📁 Test 1: Required Files');
console.log('─────────────────────────────────────────────');
REQUIRED_FILES.forEach(file => {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    checkPass(`Found: ${file}`);
  } else {
    checkFail(`Missing: ${file}`);
  }
});

// Test 2: Check environment variables
console.log('\n🔐 Test 2: Environment Variables');
console.log('─────────────────────────────────────────────');
REQUIRED_ENV_VARS.forEach(varName => {
  if (process.env[varName]) {
    checkPass(`${varName} is set`);
  } else {
    checkFail(`${varName} is missing`);
  }
});

// Test 3: Validate Supabase connection
console.log('\n🔗 Test 3: Supabase Connection');
console.log('─────────────────────────────────────────────');
try {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { data, error } = await supabase
      .from('rss_news')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        checkFail('Table rss_news not found. Run rss-news-schema.sql');
      } else {
        checkFail(`Supabase error: ${error.message}`);
      }
    } else {
      checkPass('Supabase connection successful');
      checkPass(`Table rss_news exists`);
    }
  } else {
    checkFail('Cannot test Supabase: missing credentials');
  }
} catch (error) {
  checkFail(`Supabase test failed: ${error.message}`);
}

// Test 4: Check RSS news data
console.log('\n📰 Test 4: RSS News Data');
console.log('─────────────────────────────────────────────');
try {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: cnnData } = await supabase
      .from('rss_news')
      .select('*')
      .eq('source', 'CNN Indonesia')
      .gte('expires_at', new Date().toISOString());
    
    const { data: antaraData } = await supabase
      .from('rss_news')
      .select('*')
      .eq('source', 'Antara News')
      .gte('expires_at', new Date().toISOString());
    
    const cnnCount = cnnData?.length || 0;
    const antaraCount = antaraData?.length || 0;
    
    if (cnnCount > 0) {
      checkPass(`CNN Indonesia: ${cnnCount} active news`);
    } else {
      checkFail(`CNN Indonesia: No active news. Run npm run rss:fetch`);
    }
    
    if (antaraCount > 0) {
      checkPass(`Antara News: ${antaraCount} active news`);
    } else {
      checkFail(`Antara News: No active news. Run npm run rss:fetch`);
    }
    
    // Check expiry dates
    if (cnnData && cnnData.length > 0) {
      const sample = cnnData[0];
      const expiresAt = new Date(sample.expires_at);
      const createdAt = new Date(sample.created_at);
      const diffDays = Math.round((expiresAt - createdAt) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 3) {
        checkPass(`Expiry configured correctly: 3 days`);
      } else {
        checkFail(`Expiry misconfigured: ${diffDays} days (expected 3)`);
      }
    }
  }
} catch (error) {
  checkFail(`RSS data test failed: ${error.message}`);
}

// Test 5: Check Netlify Scheduled Function config
console.log('\n⚙️  Test 5: Netlify Scheduled Function');
console.log('─────────────────────────────────────────────');
try {
  const netlifyTomlPath = join(__dirname, 'netlify.toml');
  if (existsSync(netlifyTomlPath)) {
    const content = readFileSync(netlifyTomlPath, 'utf-8');
    
    if (content.includes('[functions."rss-scheduler"]')) {
      checkPass('Scheduled function configured in netlify.toml');
    } else {
      checkFail('Scheduled function not found in netlify.toml');
    }
    
    if (content.includes('schedule = "0 6,18 * * *"')) {
      checkPass('Cron schedule: 2x daily (06:00 & 18:00 UTC)');
    } else {
      checkFail('Cron schedule not found or incorrect');
    }
  }
  
  // Check rss-scheduler.js
  const schedulerPath = join(__dirname, 'netlify/functions/rss-scheduler.js');
  if (existsSync(schedulerPath)) {
    const schedulerContent = readFileSync(schedulerPath, 'utf-8');
    
    if (schedulerContent.includes('@netlify/functions')) {
      checkPass('Using @netlify/functions package');
    } else {
      checkFail('@netlify/functions not imported');
    }
    
    if (schedulerContent.includes('schedule(')) {
      checkPass('Scheduler function properly configured');
    } else {
      checkFail('schedule() function not found');
    }
  }
} catch (error) {
  checkFail(`Netlify config test failed: ${error.message}`);
}

// Test 6: Check package.json scripts
console.log('\n📦 Test 6: NPM Scripts');
console.log('─────────────────────────────────────────────');
try {
  const packagePath = join(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  if (packageJson.scripts?.['rss:fetch']) {
    checkPass('rss:fetch script configured');
  } else {
    checkFail('rss:fetch script missing');
  }
  
  if (packageJson.dependencies?.['rss-parser']) {
    checkPass('rss-parser dependency installed');
  } else {
    checkFail('rss-parser dependency missing');
  }
  
  if (packageJson.dependencies?.['@supabase/supabase-js']) {
    checkPass('@supabase/supabase-js dependency installed');
  } else {
    checkFail('@supabase/supabase-js dependency missing');
  }
  
  if (packageJson.dependencies?.['@netlify/functions']) {
    checkPass('@netlify/functions dependency installed');
  } else {
    checkFail('@netlify/functions dependency missing (required for scheduled functions)');
  }
} catch (error) {
  checkFail(`Package.json test failed: ${error.message}`);
}

// Summary
console.log('\n═══════════════════════════════════════════════');
console.log('📊 TEST SUMMARY');
console.log('═══════════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log('═══════════════════════════════════════════════\n');

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ Ready for deployment to Netlify');
  console.log('\nNext steps:');
  console.log('1. Push to GitHub: git push origin master');
  console.log('2. Deploy to Netlify (connect repo or manual deploy)');
  console.log('3. Set environment variables in Netlify Dashboard:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - VITE_SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('4. Redeploy site after setting env vars');
  console.log('5. Check Functions tab for rss-scheduler (should be "Scheduled")');
  console.log('\n📚 See NETLIFY_DEPLOYMENT_GUIDE.md for details\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED');
  console.log('❌ Fix the issues above before deploying');
  console.log('\nCommon fixes:');
  console.log('- Missing data? Run: npm run rss:fetch');
  console.log('- Missing env vars? Check .env file');
  console.log('- Missing files? Check git status\n');
  process.exit(1);
}
