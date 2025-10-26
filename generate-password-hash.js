#!/usr/bin/env node

/**
 * Password Hash Generator
 * 
 * This script generates a SHA256 hash for admin passwords.
 * Run this locally and never commit the output to the repository.
 * 
 * Usage: node generate-password-hash.js
 */

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generatePasswordHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

console.log('🔐 Password Hash Generator');
console.log('========================');
console.log('');
console.log('⚠️  WARNING: This script should only be run locally!');
console.log('⚠️  Never commit the generated hash to the repository!');
console.log('');

rl.question('Enter the password to hash: ', (password) => {
  if (!password.trim()) {
    console.log('❌ Password cannot be empty!');
    rl.close();
    return;
  }

  const hash = generatePasswordHash(password);
  
  console.log('');
  console.log('✅ Password hash generated:');
  console.log('==========================');
  console.log(hash);
  console.log('');
  console.log('📝 Copy this hash and use it in your SQL scripts');
  console.log('📝 Replace ADMIN_PASSWORD_HASH with this value');
  console.log('');
  console.log('⚠️  Remember to delete this terminal output after copying!');
  
  rl.close();
});

rl.on('close', () => {
  console.log('');
  console.log('🔒 Script completed. Keep your credentials secure!');
});
