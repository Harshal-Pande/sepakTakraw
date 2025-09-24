#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'app/api/general-body/[id]/route.js',
  'app/api/results/[id]/route.js',
  'app/api/news/[id]/route.js',
  'app/api/events/[id]/route.js',
  'app/api/myas-compliance/[id]/route.js',
  'app/api/rti/[id]/route.js',
  'app/api/hero-images/[id]/route.js'
];

function fixParamsAwaiting(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix GET functions
    content = content.replace(
      /export async function GET\(request, \{ params \}\) \{\s*try\s*\{\s*const supabase = createClient\(\)\s*const \{ data, error \} = await supabase\s*\.from\('([^']+)'\)\s*\.select\('\*'\)\s*\.eq\('id', params\.id\)/g,
      (match, tableName) => {
        return match.replace('params.id', 'id').replace('try {', 'try {\n    const { id } = await params');
      }
    );
    
    // Fix PUT functions
    content = content.replace(
      /export async function PUT\(request, \{ params \}\) \{\s*try\s*\{[^}]*\.eq\('id', params\.id\)/g,
      (match) => {
        return match.replace('params.id', 'id').replace('try {', 'try {\n    const { id } = await params');
      }
    );
    
    // Fix DELETE functions
    content = content.replace(
      /export async function DELETE\(request, \{ params \}\) \{\s*try\s*\{[^}]*\.eq\('id', params\.id\)/g,
      (match) => {
        return match.replace('params.id', 'id').replace('try {', 'try {\n    const { id } = await params');
      }
    );
    
    // Fix error handling with map functions
    content = content.replace(
      /error\.errors\.map\(e => e\.message\)/g,
      '(error.errors || []).map(e => e.message)'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixParamsAwaiting(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('🎉 All files fixed!');
