#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
// import { execSync } from 'child_process';

console.log('🚀 Claude Agents Power MCP Installer\n');

// Get Claude Desktop config path
const configPaths = [
  path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
  path.join(os.homedir(), '.config', 'claude', 'claude_desktop_config.json'),
  path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json')
];

let configPath = null;
for (const p of configPaths) {
  if (fs.existsSync(p)) {
    configPath = p;
    break;
  }
}

if (!configPath) {
  // Try to find Claude config directory
  const configDirs = [
    path.join(os.homedir(), 'Library', 'Application Support', 'Claude'),
    path.join(os.homedir(), '.config', 'claude'),
    path.join(os.homedir(), 'AppData', 'Roaming', 'Claude')
  ];
  
  for (const dir of configDirs) {
    if (fs.existsSync(dir)) {
      configPath = path.join(dir, 'claude_desktop_config.json');
      break;
    }
  }
}

if (!configPath) {
  console.error('❌ Could not find Claude Desktop configuration directory');
  console.log('\nPlease create the config file manually at one of these locations:');
  configPaths.forEach(p => console.log(`  - ${p}`));
  process.exit(1);
}

console.log(`📁 Found Claude config at: ${configPath}`);

// Read existing config or create new one
let config = { mcpServers: {} };
if (fs.existsSync(configPath)) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(content);
    if (!config.mcpServers) {
      config.mcpServers = {};
    }
  } catch (error) {
    console.error('⚠️  Error reading existing config, will create new one');
  }
}

// Check if already installed
if (config.mcpServers['claude-agents-power']) {
  console.log('✅ claude-agents-power is already configured in Claude Desktop');
  console.log('\nTo update, remove the existing entry and run this installer again.');
  process.exit(0);
}

// Add claude-agents-power to config
config.mcpServers['claude-agents-power'] = {
  command: 'npx',
  args: ['claude-agents-power']
};

// Write config
try {
  // Create directory if it doesn't exist
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Successfully added claude-agents-power to Claude Desktop configuration');
  
  console.log('\n📝 Next steps:');
  console.log('1. Restart Claude Desktop');
  console.log('2. Look for MCP tools starting with "mcp__claude-agents-power__"');
  console.log('\n🎯 Example usage in Claude:');
  console.log('   "claude-agents-power를 이용해서 이 프로젝트를 위한 추천 및 agents/*.md 파일을 다운로드 해줘"');
  
} catch (error) {
  console.error('❌ Error writing configuration:', error.message);
  console.log('\nPlease add this to your claude_desktop_config.json manually:');
  console.log(JSON.stringify({ 
    mcpServers: { 
      'claude-agents-power': { 
        command: 'npx', 
        args: ['claude-agents-power'] 
      } 
    } 
  }, null, 2));
  process.exit(1);
}