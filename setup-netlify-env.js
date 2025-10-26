#!/usr/bin/env node

/**
 * Netlify Environment Variables Setup Helper
 * 
 * This script helps you create the correct .env file for Netlify deployment
 * Run this locally and copy the output to Netlify dashboard
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Netlify Environment Variables Setup Helper');
console.log('==========================================');
console.log('');
console.log('This script will help you create environment variables for Netlify deployment.');
console.log('You can copy the output directly to Netlify dashboard.');
console.log('');

const questions = [
  {
    key: 'VITE_SUPABASE_URL',
    question: 'Enter your Supabase Project URL (e.g., https://abcdefghijklmnop.supabase.co): ',
    required: true
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    question: 'Enter your Supabase Anon Key (starts with eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9): ',
    required: true
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    question: 'Enter your Supabase Service Role Key (starts with eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9): ',
    required: true
  },
  {
    key: 'ADMIN_USERNAME',
    question: 'Enter admin username (default: daivanlabs): ',
    required: false,
    default: 'daivanlabs'
  },
  {
    key: 'ADMIN_PASSWORD',
    question: 'Enter admin password (default: codecure): ',
    required: false,
    default: 'codecure'
  },
  {
    key: 'ADMIN_PASSWORD_HASH',
    question: 'Enter admin password hash (default: a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d): ',
    required: false,
    default: 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateOutput();
    return;
  }

  const q = questions[index];
  const prompt = q.default ? `${q.question}[${q.default}] ` : q.question;

  rl.question(prompt, (answer) => {
    const value = answer.trim() || q.default || '';
    
    if (q.required && !value) {
      console.log('❌ This field is required!');
      askQuestion(index);
      return;
    }

    answers[q.key] = value;
    askQuestion(index + 1);
  });
}

function generateOutput() {
  console.log('');
  console.log('✅ Environment Variables Generated!');
  console.log('=====================================');
  console.log('');
  console.log('📋 Copy these to Netlify Dashboard:');
  console.log('');
  console.log('Go to: Site Settings → Environment Variables');
  console.log('Add each variable below:');
  console.log('');

  Object.entries(answers).forEach(([key, value]) => {
    console.log(`Key: ${key}`);
    console.log(`Value: ${value}`);
    console.log(`Scopes: All scopes`);
    console.log('---');
  });

  console.log('');
  console.log('📝 Additional Optional Variables:');
  console.log('');
  console.log('Key: NODE_ENV');
  console.log('Value: production');
  console.log('Scopes: All scopes');
  console.log('---');
  console.log('');
  console.log('Key: VITE_APP_TITLE');
  console.log('Value: Setiya Utama Vision');
  console.log('Scopes: All scopes');
  console.log('---');
  console.log('');
  console.log('Key: VITE_APP_DESCRIPTION');
  console.log('Value: Website resmi Setiya Utama dengan admin dashboard dan RSS news');
  console.log('Scopes: All scopes');
  console.log('---');
  console.log('');
  console.log('🔒 Security Notes:');
  console.log('- Never commit .env files to repository');
  console.log('- Rotate credentials regularly');
  console.log('- Monitor access logs');
  console.log('- Keep service role key secure');
  console.log('');
  console.log('🚀 After adding all variables, trigger a new deploy!');
  
  rl.close();
}

// Start the questionnaire
askQuestion(0);

rl.on('close', () => {
  console.log('');
  console.log('🔒 Setup completed. Keep your credentials secure!');
});
