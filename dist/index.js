#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { Command } from 'commander';
import { ProjectAnalyzer } from './projectAnalyzer.js';
import { AgentManager } from './agentManager.js';
import { initializeAnalytics, trackEvent, AnalyticsEvents, shutdown as shutdownAnalytics } from './analytics.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';
import { AgentDownloader } from './agentDownloader.js';
import { AIAnalysisService } from './aiAnalysisService.js';
// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables from .env file
dotenv.config();
// Get version from package.json
const packageJsonPath = path.join(__dirname, '../package.json');
let version = '1.6.0'; // fallback version
try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    version = packageJson.version;
}
catch (error) {
    console.error('[MCP Sub-Agents] Could not read package.json version:', error);
}
// Check for slash commands flags first (manual parsing to avoid commander issues)
const hasInstallSlashCommands = process.argv.includes('--install-slash-commands');
const hasUninstallSlashCommands = process.argv.includes('--uninstall-slash-commands');
const hasAgentDownload = process.argv.includes('--agent-download');
// Parse CLI arguments using commander
const program = new Command()
    .name('claude-agents-power')
    .option('--transport <stdio>', 'transport type', 'stdio')
    .option('--debug', 'enable debug logging')
    .option('--install', 'install MCP configuration to Claude Desktop')
    .option('--install-slash-commands', 'install slash commands to Claude Code')
    .option('--uninstall-slash-commands', 'uninstall slash commands from Claude Code')
    .option('--agent-download', 'download recommended agents for current project')
    .option('--target-dir <dir>', 'target directory for agent files (default: "./agents")')
    .option('--claude-md <path>', 'path to CLAUDE.md file (default: "./CLAUDE.md")')
    .option('--format <format>', 'agent file format: md, yaml, json (default: "md")')
    .option('--language <lang>', 'preferred language: en, ko, ja, zh (default: "en")')
    .option('--limit <n>', 'maximum number of agents to download (default: 10)')
    .option('--dry-run', 'preview recommendations without downloading')
    .option('--overwrite', 'overwrite existing agent files')
    .allowUnknownOption() // let MCP Inspector / other wrappers pass through extra flags
    .parse(process.argv);
const cliOptions = program.opts();
// Override with manual parsing results
if (hasInstallSlashCommands) {
    cliOptions.installSlashCommands = true;
}
if (hasUninstallSlashCommands) {
    cliOptions.uninstallSlashCommands = true;
}
if (hasAgentDownload) {
    cliOptions.agentDownload = true;
}
// Handle --install flag
if (cliOptions.install) {
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
        }
        catch (error) {
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
    }
    catch (error) {
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
    process.exit(0);
}
// Handle --install-slash-commands flag
if (cliOptions.installSlashCommands) {
    console.log('🚀 Claude Agents Power - Slash Commands Installer\n');
    try {
        const claudeDir = path.join(os.homedir(), '.claude');
        const commandsDir = path.join(claudeDir, 'commands');
        const sourceDir = path.join(__dirname, '../claude-slash-commands');
        // Create directories if they don't exist
        if (!fs.existsSync(claudeDir)) {
            fs.mkdirSync(claudeDir, { recursive: true });
            console.log(`📁 Created: ${claudeDir}`);
        }
        if (!fs.existsSync(commandsDir)) {
            fs.mkdirSync(commandsDir, { recursive: true });
            console.log(`📁 Created: ${commandsDir}`);
        }
        // Copy command files
        console.log('📋 Installing slash commands...');
        const commandFiles = fs.readdirSync(sourceDir);
        for (const file of commandFiles) {
            if (file.endsWith('.md')) {
                const sourcePath = path.join(sourceDir, file);
                const targetPath = path.join(commandsDir, file);
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`   ✅ Installed: ${file}`);
            }
        }
        // Create README
        const readmeContent = `# Claude Agents Power - Slash Commands

Available commands:
- /agents:load - Load and display available agents
- /agents:search - Search agents by skills or keywords  
- /agents:suggest - Get intelligent agent recommendations
- /agents:version - Check system version and status

Generated by claude-agents-power v${version}
`;
        fs.writeFileSync(path.join(commandsDir, 'README.md'), readmeContent);
        console.log('\n✅ Slash commands installed successfully!');
        console.log('\nAvailable commands in Claude Code:');
        console.log('  /agents:load     - Load and display available agents');
        console.log('  /agents:search   - Search agents by skills or keywords');
        console.log('  /agents:suggest  - Get intelligent agent recommendations');
        console.log('  /agents:version  - Check system version and status');
        console.log('\n💡 Try "/agents:load" in Claude Code to get started!');
    }
    catch (error) {
        console.error('❌ Installation failed:', error);
        process.exit(1);
    }
    process.exit(0);
}
// Handle --uninstall-slash-commands flag  
if (cliOptions.uninstallSlashCommands) {
    console.log('🗑️ Uninstalling claude-agents-power slash commands...\n');
    try {
        const commandsDir = path.join(os.homedir(), '.claude', 'commands');
        if (fs.existsSync(commandsDir)) {
            const files = fs.readdirSync(commandsDir);
            const agentCommandFiles = files.filter(file => file.startsWith('agents-') && file.endsWith('.md'));
            for (const file of agentCommandFiles) {
                const filePath = path.join(commandsDir, file);
                fs.unlinkSync(filePath);
                console.log(`   🗑️ Removed: ${file}`);
            }
            // Remove README if it exists
            const readmePath = path.join(commandsDir, 'README.md');
            if (fs.existsSync(readmePath)) {
                fs.unlinkSync(readmePath);
                console.log('   🗑️ Removed: README.md');
            }
            console.log('\n✅ Slash commands uninstalled successfully!');
        }
        else {
            console.log('No slash commands found to uninstall.');
        }
    }
    catch (error) {
        console.error('❌ Uninstallation failed:', error);
        process.exit(1);
    }
    process.exit(0);
}
// Handle --agent-download flag
if (cliOptions.agentDownload) {
    console.log('🤖 Claude Agents Power - Agent Downloader\n');
    try {
        const downloader = new AgentDownloader();
        const options = {
            targetDir: cliOptions.targetDir || './agents',
            claudeMdPath: cliOptions.claudeMd || './CLAUDE.md',
            format: cliOptions.format || 'md',
            language: cliOptions.language || 'en',
            limit: cliOptions.limit ? parseInt(cliOptions.limit) : 10,
            dryRun: cliOptions.dryRun || false,
            overwrite: cliOptions.overwrite || false
        };
        console.log('🔍 Analyzing project...');
        const result = await downloader.downloadAgents(options);
        // Display enhanced AI analysis results
        console.log('\n🧠 AI-Powered Project Analysis Results:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Project Type: ${result.analysis.projectType}`);
        console.log(`🛠️ Technologies: ${result.analysis.technologies.join(', ') || 'None detected'}`);
        console.log(`📚 Frameworks: ${result.analysis.frameworks.join(', ') || 'None detected'}`);
        console.log(`📈 Complexity: ${result.analysis.complexity}/10`);
        console.log(`🚀 Development Phase: ${result.analysis.phase}`);
        console.log(`👥 Recommended Team Size: ${result.analysis.teamSize} agents`);
        if (result.analysis.description) {
            console.log(`📝 Description: ${result.analysis.description}`);
        }
        // Display quality indicators
        if (result.analysis.qualityIndicators) {
            console.log('\n📋 Quality Assessment:');
            const qi = result.analysis.qualityIndicators;
            console.log(`   ${qi.hasTests ? '✅' : '❌'} Automated Testing`);
            console.log(`   ${qi.hasDocumentation ? '✅' : '❌'} Documentation`);
            console.log(`   ${qi.hasCI ? '✅' : '✅'} CI/CD Pipeline`);
            console.log(`   ${qi.hasLinting ? '✅' : '❌'} Code Quality Tools`);
            console.log(`   📊 Code Complexity: ${qi.codeComplexity}`);
        }
        // Display architectural patterns if available
        if (result.analysis.architecturalPatterns && result.analysis.architecturalPatterns.length > 0) {
            console.log(`\n🏗️ Architectural Patterns: ${result.analysis.architecturalPatterns.join(', ')}`);
        }
        // Display development practices if available
        if (result.analysis.developmentPractices && result.analysis.developmentPractices.length > 0) {
            console.log(`\n⚙️ Development Practices: ${result.analysis.developmentPractices.join(', ')}`);
        }
        console.log('\n🏆 AI-Generated Recommendations:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        result.recommendations.forEach((rec, index) => {
            const icon = rec.priority === 'essential' ? '⭐' :
                rec.priority === 'recommended' ? '🔧' : '💡';
            console.log(`${index + 1}. ${icon} ${rec.name} (${rec.relevanceScore}% match)`);
            console.log(`   └─ ${rec.reasoning}`);
            // Display specific tasks if available
            if (rec.specificTasks && rec.specificTasks.length > 0) {
                console.log(`   🎯 Key Tasks: ${rec.specificTasks.slice(0, 2).join(', ')}${rec.specificTasks.length > 2 ? '...' : ''}`);
            }
            // Display integration points if available
            if (rec.integrationPoints && rec.integrationPoints.length > 0) {
                console.log(`   🔗 Integrations: ${rec.integrationPoints.slice(0, 2).join(', ')}${rec.integrationPoints.length > 2 ? '...' : ''}`);
            }
        });
        if (options.dryRun) {
            console.log('\n💡 This was an AI-powered dry run analysis. Use without --dry-run to download agents.');
            console.log('\n🧠 AI Analysis Features Used:');
            console.log('   • Intelligent project structure analysis');
            console.log('   • Context-aware agent recommendations');
            console.log('   • Dynamic priority assignment');
            console.log('   • Task-specific role matching');
        }
        else if (result.downloaded && result.downloaded.length > 0) {
            console.log('\n📥 Downloaded AI-Recommended Agents:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            result.downloaded.forEach(filePath => {
                const fileName = path.basename(filePath);
                const fileSize = fs.statSync(filePath).size;
                const fileSizeKB = (fileSize / 1024).toFixed(1);
                console.log(`✅ ${fileName.padEnd(25)} (${fileSizeKB}KB)`);
            });
            console.log('\n📊 AI-Powered Summary:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`✅ ${result.downloaded.length} agents intelligently selected and downloaded`);
            console.log(`📁 Files saved to: ${options.targetDir}`);
            console.log(`📋 Enhanced README.md created with AI analysis insights`);
            console.log(`🧠 AI Features: Dynamic analysis, context-aware recommendations, smart prioritization`);
            console.log(`💡 Next: Try using your AI-recommended agents in your development workflow`);
        }
    }
    catch (error) {
        console.error('❌ Agent download failed:', error);
        process.exit(1);
    }
    process.exit(0);
}
// Debug logging function
const debug = (...args) => {
    if (cliOptions.debug) {
        console.error('[MCP Sub-Agents DEBUG]', ...args);
    }
};
// Validate transport option
const allowedTransports = ['stdio'];
if (!allowedTransports.includes(cliOptions.transport)) {
    console.error(`Invalid --transport value: '${cliOptions.transport}'. Must be: stdio.`);
    process.exit(1);
}
// Transport configuration
const TRANSPORT_TYPE = 'stdio';
// Function to create a new server instance with all tools registered
function createServerInstance() {
    const server = new Server({
        name: 'claude-agents-power-mcp-server',
        version: version,
    }, {
        capabilities: {
            tools: {},
            resources: {},
        },
    });
    return server;
}
// Initialize analytics
initializeAnalytics();
trackEvent(AnalyticsEvents.SERVER_STARTED, {
    debug_mode: cliOptions.debug,
    transport: cliOptions.transport,
});
// Initialize managers
// Support both development and production paths
const isDevelopment = process.env.NODE_ENV === 'development';
const agentsPath = isDevelopment
    ? path.join(__dirname, '../../claude/agents')
    : path.resolve(process.cwd(), 'claude/agents');
debug(`Current working directory: ${process.cwd()}`);
debug(`__dirname: ${__dirname}`);
debug(`Loading agents from: ${agentsPath}`);
// Check if agents directory exists
import { existsSync } from 'fs';
if (cliOptions.debug && existsSync(agentsPath)) {
    debug(`Agents directory exists: ${agentsPath}`);
    const { readdirSync } = await import('fs');
    const files = readdirSync(agentsPath);
    debug(`Found ${files.length} files in agents directory`);
}
else if (cliOptions.debug) {
    debug(`ERROR: Agents directory not found: ${agentsPath}`);
}
const projectAnalyzer = new ProjectAnalyzer();
const agentManager = new AgentManager(agentsPath, {
    owner: 'baryonlabs',
    repo: 'claude-sub-agent-contents',
    branch: 'main',
    path: 'claude/agents'
}, cliOptions.debug || false);
const aiAnalysisService = new AIAnalysisService();
// Function to setup tools for a server instance
function setupTools(server, projectAnalyzer, agentManager, aiAnalysisService) {
    // Define resources
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {
            resources: [
                {
                    uri: 'mcp://claude-agents-power/how-it-works',
                    name: 'MCP 동작 원리',
                    description: 'Claude Agents Power MCP 서버의 동작 원리와 구조 설명',
                    mimeType: 'text/markdown',
                },
                {
                    uri: 'mcp://claude-agents-power/tool-guide',
                    name: '도구 사용 가이드',
                    description: '통합된 3개 도구의 사용 방법과 예제',
                    mimeType: 'text/markdown',
                },
                {
                    uri: 'mcp://claude-agents-power/agent-structure',
                    name: '에이전트 구조',
                    description: '에이전트 파일 구조와 다국어 지원 설명',
                    mimeType: 'text/markdown',
                },
            ],
        };
    });
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const { uri } = request.params;
        switch (uri) {
            case 'mcp://claude-agents-power/how-it-works':
                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'text/markdown',
                            text: `# Claude Agents Power MCP 서버 동작 원리

## 개요
Claude Agents Power는 Model Context Protocol(MCP)을 사용하여 100개 이상의 전문 에이전트를 Claude에서 사용할 수 있게 해주는 서버입니다.

## MCP (Model Context Protocol) 란?
MCP는 Claude와 같은 LLM이 외부 도구와 리소스에 접근할 수 있게 해주는 표준 프로토콜입니다.

### 주요 구성 요소:
1. **Tools (도구)**: Claude가 실행할 수 있는 함수들
2. **Resources (리소스)**: Claude가 읽을 수 있는 문서나 데이터
3. **Prompts (프롬프트)**: 미리 정의된 프롬프트 템플릿

## 서버 아키텍처

### 1. 에이전트 매니저 (AgentManager)
- 에이전트 파일 로딩 및 캐싱
- 다국어 지원 (en, ko, ja, zh)
- GitHub에서 에이전트 동적 로딩

### 2. 프로젝트 분석기 (ProjectAnalyzer)
- 프로젝트 구조 분석
- 적합한 에이전트 추천
- 키워드 기반 매칭

### 3. 통합 도구 시스템
기존 8개 도구를 3개로 통합:
- \`analyze-project\`: 프로젝트 분석
- \`agents\`: 에이전트 검색/목록/상세/추천
- \`manage-agents\`: 설치/통계/새로고침

## 데이터 흐름

\`\`\`
Claude Desktop → MCP Protocol → Agent Manager → Local Files
                                            ↓
                              GitHub Repository (fallback)
\`\`\`

## 에이전트 로딩 과정

1. **시작시**: \`claude/agents/{언어}/\` 디렉토리에서 에이전트 로드
2. **요청시**: 캐시에서 빠른 검색
3. **미발견시**: GitHub에서 동적 다운로드
4. **설치**: 프로젝트 디렉토리에 에이전트 파일 복사

## 성능 최적화

- 메모리 캐싱으로 빠른 응답
- YAML frontmatter 파싱으로 메타데이터 추출
- 언어별 키 매핑으로 효율적인 검색
`,
                        },
                    ],
                };
            case 'mcp://claude-agents-power/tool-guide':
                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'text/markdown',
                            text: `# 도구 사용 가이드

## 통합된 3개 도구 사용법

### 1. analyze-project
프로젝트 디렉토리를 분석하여 적합한 에이전트를 추천합니다.

**사용법:**
\`\`\`json
{
  "tool": "analyze-project",
  "arguments": {
    "projectPath": "/path/to/project"
  }
}
\`\`\`

### 2. agents
에이전트 관련 모든 작업을 처리하는 통합 도구입니다.

#### 2.1 검색 (search)
\`\`\`json
{
  "tool": "agents",
  "arguments": {
    "action": "search",
    "query": "frontend",
    "language": "en"
  }
}
\`\`\`

#### 2.2 목록 조회 (list)
\`\`\`json
{
  "tool": "agents",
  "arguments": {
    "action": "list",
    "language": "ko",
    "category": "development"
  }
}
\`\`\`

#### 2.3 상세 정보 (details)
\`\`\`json
{
  "tool": "agents",
  "arguments": {
    "action": "details",
    "query": "frontend-developer",
    "language": "en"
  }
}
\`\`\`

#### 2.4 추천 (recommend)
\`\`\`json
{
  "tool": "agents",
  "arguments": {
    "action": "recommend",
    "keywords": ["react", "typescript", "ui"]
  }
}
\`\`\`

#### 2.5 검색 (자동 Issue 생성)
\`\`\`json
{
  "tool": "agents",
  "arguments": {
    "action": "search",
    "query": "blockchain-architect",
    "language": "en",
    "autoCreateIssue": true,
    "issueBody": "We need a blockchain architect for smart contract development"
  }
}
\`\`\`

#### 2.6 요청 (request)
\`\`\`json
{
  "tool": "agents",
  "arguments": {
    "action": "request",
    "query": "ai-ethics-officer",
    "language": "en",
    "issueBody": "Need an AI ethics specialist for responsible AI development"
  }
}
\`\`\`

### 3. manage-agents
에이전트 관리 작업을 처리합니다.

#### 3.1 설치 (install)
\`\`\`json
{
  "tool": "manage-agents",
  "arguments": {
    "action": "install",
    "agentNames": ["frontend-developer", "backend-engineer"],
    "targetPath": "/path/to/project",
    "language": "en"
  }
}
\`\`\`

#### 3.2 통계 (stats)
\`\`\`json
{
  "tool": "manage-agents",
  "arguments": {
    "action": "stats",
    "limit": 10
  }
}
\`\`\`

#### 3.3 새로고침 (refresh)
\`\`\`json
{
  "tool": "manage-agents",
  "arguments": {
    "action": "refresh"
  }
}
\`\`\`

## 언어 지원
- \`en\`: English
- \`ko\`: 한국어 
- \`ja\`: 日本語
- \`zh\`: 中文

## 카테고리
- development, data, design, management
- marketing, operations, hr, finance
- legal, research, healthcare, education
- media, manufacturing, other
`,
                        },
                    ],
                };
            case 'mcp://claude-agents-power/agent-structure':
                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'text/markdown',
                            text: `# 에이전트 구조

## 파일 구조
\`\`\`
claude/agents/
├── en/          # 영어 에이전트
│   ├── frontend-developer.md
│   ├── backend-engineer.md
│   └── ...
├── ko/          # 한국어 에이전트
│   ├── frontend-developer.md
│   ├── backend-engineer.md
│   └── ...
├── ja/          # 일본어 에이전트
└── zh/          # 중국어 에이전트
\`\`\`

## 에이전트 파일 형식

각 에이전트 파일은 YAML frontmatter와 Markdown 콘텐츠로 구성됩니다:

\`\`\`markdown
---
name: frontend-developer
description: UI/UX implementation specialist with React, Vue, and modern web technologies expertise.
tools: Read, Write, Edit, MultiEdit, Bash, WebSearch
---

You are a frontend engineer specializing in modern web applications.

Focus areas:
- Build responsive and accessible interfaces
- Implement state management solutions
- Optimize performance and bundle sizes
- Ensure cross-browser compatibility
- Write maintainable component architectures

Key practices:
- Follow semantic HTML standards
- Implement WCAG accessibility guidelines
- Use modern CSS features (Grid, Flexbox)
- Optimize for Core Web Vitals
- Write comprehensive tests
\`\`\`

## 메타데이터 필드

### name (필수)
에이전트의 고유 식별자입니다. 파일명과 일치해야 합니다.

### description (필수)
에이전트의 역할과 전문성을 설명합니다. 검색에 사용됩니다.

### tools (필수)
에이전트가 사용할 수 있는 도구 목록입니다.

**사용 가능한 도구:**
- Read, Write, Edit, MultiEdit
- Bash, Grep, Glob
- WebSearch, WebFetch
- TodoWrite, Task
- NotebookRead, NotebookEdit

## 다국어 지원

### 언어별 키 매핑
- 영어: \`agent-name\`
- 기타 언어: \`agent-name-{언어코드}\`

예: 
- \`frontend-developer\` (영어)
- \`frontend-developer-ko\` (한국어)
- \`frontend-developer-ja\` (일본어)

### 언어 감지
1. 요청된 언어에 따른 에이전트 검색
2. 해당 언어가 없으면 영어 버전 사용
3. 모두 없으면 GitHub에서 다운로드 시도

## 에이전트 품질 기준

### 필수 요소
1. 명확한 역할 정의
2. 구체적인 책임 범위
3. 실용적인 가이드라인
4. 도구 적절한 선택

### 권장 구조
1. 역할 소개
2. 핵심 활동/책임
3. 주요 관행
4. 품질 기준
5. 협업 방식

## 에이전트 생성 가이드

새 에이전트를 만들 때:

1. 기존 에이전트 참고
2. 일관된 형식 유지
3. 언어별 번역 제공
4. 적절한 도구 선택
5. 구체적이고 실용적인 내용 작성
`,
                        },
                    ],
                };
            default:
                throw new Error(`Unknown resource: ${uri}`);
        }
    });
    // Define tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'analyze-project',
                    description: 'Analyze a project directory and recommend suitable sub-agents',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            projectPath: {
                                type: 'string',
                                description: 'Path to the project directory to analyze',
                            },
                        },
                        required: ['projectPath'],
                    },
                },
                {
                    name: 'ai-analyze-project',
                    description: 'Perform AI-powered comprehensive project analysis and agent recommendations',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            claudeMdPath: {
                                type: 'string',
                                description: 'Path to CLAUDE.md file or project description',
                            },
                            projectPath: {
                                type: 'string',
                                description: 'Optional path to project root directory (defaults to CLAUDE.md directory)',
                            },
                            generateRecommendations: {
                                type: 'boolean',
                                description: 'Whether to generate agent recommendations',
                                default: true,
                            },
                            maxRecommendations: {
                                type: 'number',
                                description: 'Maximum number of agent recommendations to return',
                                default: 10,
                            },
                        },
                        required: ['claudeMdPath'],
                    },
                },
                {
                    name: 'agents',
                    description: 'Search, list, get details, recommend agents, or request new ones',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: {
                                type: 'string',
                                description: 'Action to perform',
                                enum: ['search', 'list', 'details', 'recommend', 'request'],
                            },
                            query: {
                                type: 'string',
                                description: 'Search query (for search action) or agent name (for details action)',
                            },
                            keywords: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Keywords for recommendation (for recommend action)',
                            },
                            language: {
                                type: 'string',
                                description: 'Language preference',
                                enum: ['en', 'ko', 'ja', 'zh'],
                                default: 'en',
                            },
                            category: {
                                type: 'string',
                                description: 'Filter by category (for list action)',
                                enum: ['development', 'data', 'design', 'management', 'marketing', 'operations', 'hr', 'finance', 'legal', 'research', 'healthcare', 'education', 'media', 'manufacturing', 'other'],
                            },
                            autoCreateIssue: {
                                type: 'boolean',
                                description: 'Auto-create GitHub issue if no agents found (for search action)',
                                default: false,
                            },
                            issueBody: {
                                type: 'string',
                                description: 'Additional details for the issue (when autoCreateIssue is true)',
                            },
                        },
                        required: ['action'],
                    },
                },
                {
                    name: 'manage-agents',
                    description: 'Install agents, get stats, or refresh from GitHub',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: {
                                type: 'string',
                                description: 'Management action to perform',
                                enum: ['install', 'stats', 'refresh', 'version'],
                            },
                            agentNames: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Agent names to install (for install action)',
                            },
                            targetPath: {
                                type: 'string',
                                description: 'Target directory for installation (for install action)',
                            },
                            language: {
                                type: 'string',
                                description: 'Language preference for agents',
                                enum: ['en', 'ko', 'ja', 'zh'],
                                default: 'en',
                            },
                            limit: {
                                type: 'number',
                                description: 'Number of top agents to show in stats',
                                default: 10,
                            },
                        },
                        required: ['action'],
                    },
                },
            ],
        };
    });
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        // Track tool usage
        trackEvent(AnalyticsEvents.TOOL_CALLED, {
            tool_name: name,
            args_provided: Object.keys(args || {}),
        });
        switch (name) {
            case 'analyze-project': {
                const { projectPath } = args;
                const analysis = await projectAnalyzer.analyzeProject(projectPath);
                // Track project analysis
                trackEvent(AnalyticsEvents.PROJECT_ANALYZED, {
                    project_types: analysis.projectType,
                    technologies: analysis.technologies,
                    recommended_count: analysis.recommendedAgents.length,
                    confidence: analysis.confidence,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                analysis,
                                message: `Analyzed project at ${projectPath}. Found ${analysis.projectType.length} project types and recommended ${analysis.recommendedAgents.length} agents.`,
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'ai-analyze-project': {
                const { claudeMdPath, projectPath, generateRecommendations = true, maxRecommendations = 10 } = args;
                try {
                    // Perform AI-powered project analysis
                    const analysis = await aiAnalysisService.analyzeProject(claudeMdPath, projectPath);
                    let recommendations = [];
                    if (generateRecommendations) {
                        const allRecommendations = await aiAnalysisService.generateRecommendations(analysis);
                        recommendations = allRecommendations.slice(0, maxRecommendations);
                    }
                    // Track AI analysis event
                    trackEvent(AnalyticsEvents.PROJECT_ANALYZED, {
                        project_types: analysis.projectType,
                        technologies: analysis.technologies,
                        recommended_count: recommendations.length,
                        confidence: analysis.complexity / 10, // Normalize complexity as confidence
                        ai_powered: true,
                    });
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    success: true,
                                    analysis: {
                                        projectType: analysis.projectType,
                                        technologies: analysis.technologies,
                                        frameworks: analysis.frameworks,
                                        complexity: analysis.complexity,
                                        phase: analysis.phase,
                                        teamSize: analysis.teamSize,
                                        description: analysis.description,
                                        goals: analysis.goals,
                                        requirements: analysis.requirements,
                                        architecturalPatterns: analysis.architecturalPatterns,
                                        developmentPractices: analysis.developmentPractices,
                                        qualityIndicators: analysis.qualityIndicators,
                                    },
                                    recommendations: recommendations.map(rec => ({
                                        name: rec.name,
                                        description: rec.description,
                                        relevanceScore: rec.relevanceScore,
                                        reasoning: rec.reasoning,
                                        category: rec.category,
                                        priority: rec.priority,
                                        tools: rec.tools,
                                        specificTasks: rec.specificTasks,
                                        integrationPoints: rec.integrationPoints,
                                    })),
                                    message: `AI analysis completed for ${path.basename(claudeMdPath)}. Project type: ${analysis.projectType}, Complexity: ${analysis.complexity}/10, Recommended ${recommendations.length} agents.`,
                                    aiFeatures: {
                                        intelligentAnalysis: 'Comprehensive project understanding using AI reasoning',
                                        contextAwareRecommendations: 'Agent suggestions based on project context and requirements',
                                        dynamicPrioritization: 'Smart priority assignment based on project needs',
                                        taskSpecificMatching: 'Agents matched to specific tasks and integration points'
                                    }
                                }, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    success: false,
                                    error: `AI analysis failed: ${error instanceof Error ? error.message : String(error)}`,
                                    suggestion: 'Please check the CLAUDE.md file path and project structure',
                                }, null, 2),
                            },
                        ],
                    };
                }
            }
            case 'agents': {
                const { action, query, keywords, language = 'en', category, autoCreateIssue = false, issueBody } = args;
                switch (action) {
                    case 'search': {
                        if (!query) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: 'Query is required for search action',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        const agents = agentManager.searchAgents(query);
                        const filteredAgents = agents.filter(agent => !language || agent.language === language);
                        // Track search event
                        trackEvent(AnalyticsEvents.AGENT_SEARCHED, {
                            query,
                            language,
                            found_count: filteredAgents.length,
                            auto_create_issue: autoCreateIssue,
                        });
                        // Auto-create issue if no agents found and autoCreateIssue is true
                        if (filteredAgents.length === 0 && autoCreateIssue) {
                            const githubToken = process.env.GITHUB_TOKEN;
                            if (!githubToken) {
                                // Generate GitHub issue creation URL with pre-filled content
                                const issueTitle = encodeURIComponent(`[Agent Request] ${query} - New agent needed`);
                                const issueBodyContent = encodeURIComponent(`## Agent Request

**Role Name**: ${query}
**Language**: ${language}

## Description
${issueBody || 'A new agent is needed for this role.'}

## Use Cases
- [Please describe specific use cases]

## Required Tools
- [List required tools like Read, Write, Edit, etc.]

## Additional Details
- No existing agents found matching: "${query}"
- Please consider adding this agent to help users with this use case.`);
                                const createIssueUrl = `https://github.com/hongsw/claude-agents-power-mcp-server/issues/new?title=${issueTitle}&body=${issueBodyContent}&labels=agent-request`;
                                return {
                                    content: [
                                        {
                                            type: 'text',
                                            text: JSON.stringify({
                                                success: false,
                                                error: 'No agents found. GitHub token not configured for auto-issue creation.',
                                                suggestion: 'Click the link below to create an issue manually:',
                                                createIssueUrl,
                                                message: `🔍 No agents found for "${query}"\n\n📝 You can create an issue manually by clicking this link:\n${createIssueUrl}\n\n💡 Or set GITHUB_TOKEN environment variable for automatic issue creation.`,
                                            }, null, 2),
                                        },
                                    ],
                                };
                            }
                            try {
                                const issueTitle = `[Agent Request] ${query} - New agent needed`;
                                const issueBodyContent = `## Agent Request

**Role Name**: ${query}
**Language**: ${language}

## Description
${issueBody || 'A new agent is needed for this role.'}

## Use Cases
- [Please describe specific use cases]

## Required Tools
- [List required tools like Read, Write, Edit, etc.]

## Additional Details
- Requested via MCP server auto-issue creation
- No existing agents found matching: "${query}"

---
*This issue was automatically created by claude-agents-power MCP server*`;
                                const response = await fetch('https://api.github.com/repos/hongsw/claude-agents-power-mcp-server/issues', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `token ${githubToken}`,
                                        'Accept': 'application/vnd.github+json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        title: issueTitle,
                                        body: issueBodyContent,
                                        labels: ['agent-request', 'auto-created'],
                                    }),
                                });
                                if (!response.ok) {
                                    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
                                }
                                const issue = await response.json();
                                // Log to stderr for visibility
                                console.error(`[MCP Sub-Agents] ✅ GitHub issue created successfully!`);
                                console.error(`[MCP Sub-Agents] Issue #${issue.number}: ${issue.html_url}`);
                                // Track issue creation
                                trackEvent(AnalyticsEvents.AGENT_ISSUE_CREATED, {
                                    query,
                                    language,
                                    issue_number: issue.number,
                                    issue_url: issue.html_url,
                                });
                                return {
                                    content: [
                                        {
                                            type: 'text',
                                            text: JSON.stringify({
                                                success: true,
                                                count: 0,
                                                message: `🔍 No agents found for "${query}"\n\n📝 GitHub issue automatically created!\n\n🔗 Issue #${issue.number}: ${issue.title}\n📎 ${issue.html_url}\n\n💡 The maintainers will review and potentially add this agent.\n📚 Meanwhile, you can create your own agent following the guide.`,
                                                issueUrl: issue.html_url,
                                                issueNumber: issue.number,
                                                nextSteps: [
                                                    'Wait for maintainers to review the issue',
                                                    'Create your own agent following the documentation',
                                                    'Check back later for the new agent'
                                                ]
                                            }, null, 2),
                                        },
                                    ],
                                };
                            }
                            catch (error) {
                                return {
                                    content: [
                                        {
                                            type: 'text',
                                            text: JSON.stringify({
                                                success: false,
                                                count: 0,
                                                error: `Failed to create issue: ${error}`,
                                                suggestion: 'Visit https://github.com/hongsw/claude-agents-power-mcp-server/issues to manually create an issue',
                                            }, null, 2),
                                        },
                                    ],
                                };
                            }
                        }
                        // If no agents found and autoCreateIssue is false, provide manual creation link
                        if (filteredAgents.length === 0) {
                            const issueTitle = encodeURIComponent(`[Agent Request] ${query} - New agent needed`);
                            const issueBodyContent = encodeURIComponent(`## Agent Request

**Role Name**: ${query}
**Language**: ${language}

## Description
A new agent is needed for this role.

## Use Cases
- [Please describe specific use cases]

## Required Tools
- [List required tools like Read, Write, Edit, etc.]

## Additional Details
- No existing agents found matching: "${query}"
- Please consider adding this agent to help users with this use case.`);
                            const createIssueUrl = `https://github.com/hongsw/claude-agents-power-mcp-server/issues/new?title=${issueTitle}&body=${issueBodyContent}&labels=agent-request`;
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: true,
                                            count: 0,
                                            agents: [],
                                            message: `🔍 No agents found for "${query}"`,
                                            suggestion: '📝 You can request this agent by creating an issue:',
                                            createIssueUrl,
                                            tip: '💡 Set autoCreateIssue=true to automatically create issues when agents are not found.',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        count: filteredAgents.length,
                                        agents: filteredAgents.map(agent => ({
                                            name: agent.name,
                                            description: agent.description,
                                            tools: agent.tools,
                                            language: agent.language,
                                        })),
                                    }, null, 2),
                                },
                            ],
                        };
                    }
                    case 'list': {
                        let agents = agentManager.getAllAgents(language);
                        if (category) {
                            agents = agents.filter(agent => {
                                const categoryKeywords = {
                                    development: ['developer', 'engineer', 'architect'],
                                    data: ['data', 'analyst', 'scientist'],
                                    design: ['designer', 'ux', 'ui'],
                                    management: ['manager', 'owner', 'master'],
                                };
                                const keywords = categoryKeywords[category] || [];
                                return keywords.some(keyword => agent.name.includes(keyword) ||
                                    agent.description.toLowerCase().includes(keyword));
                            });
                        }
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        count: agents.length,
                                        agents: agents.map(agent => ({
                                            name: agent.name,
                                            description: agent.description,
                                            tools: agent.tools,
                                            language: agent.language,
                                        })),
                                    }, null, 2),
                                },
                            ],
                        };
                    }
                    case 'details': {
                        if (!query) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: 'Agent name is required for details action',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        const agent = agentManager.getAgent(query, language);
                        if (!agent) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: `Agent '${query}' not found in language '${language}'`,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        agent: {
                                            name: agent.name,
                                            description: agent.description,
                                            tools: agent.tools,
                                            language: agent.language,
                                            content: agent.content,
                                        },
                                    }, null, 2),
                                },
                            ],
                        };
                    }
                    case 'recommend': {
                        if (!keywords || keywords.length === 0) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: 'Keywords are required for recommend action',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        const recommendedAgents = await projectAnalyzer.getAgentsByKeywords(keywords);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        keywords,
                                        recommendedAgents,
                                        count: recommendedAgents.length,
                                    }, null, 2),
                                },
                            ],
                        };
                    }
                    case 'request': {
                        if (!query) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: 'Agent name is required for request action',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        const githubToken = process.env.GITHUB_TOKEN;
                        if (!githubToken) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: 'GitHub token not configured. Set GITHUB_TOKEN environment variable.',
                                            suggestion: 'Visit https://github.com/hongsw/claude-agents-power-mcp-server/issues to manually create an issue',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        try {
                            const issueTitle = `[Agent Request] ${query} - New agent needed`;
                            const issueBodyContent = `## Agent Request

**Role Name**: ${query}
**Language**: ${language}

## Description
${issueBody || 'A new agent is needed for this role.'}

## Use Cases
- [Please describe specific use cases]

## Required Tools
- [List required tools like Read, Write, Edit, etc.]

## Additional Details
- Requested via MCP server manual request
- Agent name: "${query}"

---
*This issue was created by claude-agents-power MCP server*`;
                            const response = await fetch('https://api.github.com/repos/hongsw/claude-agents-power-mcp-server/issues', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `token ${githubToken}`,
                                    'Accept': 'application/vnd.github+json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    title: issueTitle,
                                    body: issueBodyContent,
                                    labels: ['agent-request'],
                                }),
                            });
                            if (!response.ok) {
                                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
                            }
                            const issue = await response.json();
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: true,
                                            message: `Created GitHub issue #${issue.number} for agent "${query}"`,
                                            issueUrl: issue.html_url,
                                            issueNumber: issue.number,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        catch (error) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: `Failed to create issue: ${error}`,
                                            suggestion: 'Visit https://github.com/hongsw/claude-agents-power-mcp-server/issues to manually create an issue',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                    }
                    default:
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: `Unknown action: ${action}`,
                                    }, null, 2),
                                },
                            ],
                        };
                }
            }
            case 'manage-agents': {
                const { action, agentNames, targetPath, language = 'en', limit = 10 } = args;
                switch (action) {
                    case 'install': {
                        if (!agentNames || !targetPath) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: 'Agent names and target path are required for install action',
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        try {
                            const installedPaths = await agentManager.installMultipleAgents(agentNames, targetPath, language);
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: true,
                                            installedCount: installedPaths.length,
                                            installedPaths,
                                            message: `Successfully installed ${installedPaths.length} agents to ${targetPath}/claude/agents/`,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        catch (error) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: `Failed to install agents: ${error}`,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                    }
                    case 'stats': {
                        const stats = agentManager.getMostDownloadedAgents(limit);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        stats,
                                        message: `Top ${limit} most downloaded agents`,
                                    }, null, 2),
                                },
                            ],
                        };
                    }
                    case 'refresh': {
                        try {
                            await agentManager.refreshAgentsFromGitHub();
                            const agents = agentManager.getAllAgents();
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: true,
                                            count: agents.length,
                                            message: `Successfully refreshed agents from GitHub. Total agents: ${agents.length}`,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        catch (error) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({
                                            success: false,
                                            error: `Failed to refresh agents: ${error}`,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                    }
                    case 'version': {
                        const agents = agentManager.getAllAgents();
                        const agentsByLanguage = {
                            en: agentManager.getAllAgents('en').length,
                            ko: agentManager.getAllAgents('ko').length,
                            ja: agentManager.getAllAgents('ja').length,
                            zh: agentManager.getAllAgents('zh').length,
                        };
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        version: version,
                                        serverName: 'claude-agents-power-mcp-server',
                                        totalAgents: agents.length,
                                        agentsByLanguage,
                                        npmPackage: 'claude-agents-power',
                                        repository: 'https://github.com/hongsw/claude-agents-power-mcp-server',
                                        message: `Claude Agents Power MCP Server v${version} - ${agents.length} agents available`,
                                    }, null, 2),
                                },
                            ],
                        };
                    }
                    default:
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: `Unknown action: ${action}`,
                                    }, null, 2),
                                },
                            ],
                        };
                }
            }
            default:
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: false,
                                error: `Unknown tool: ${name}`,
                            }, null, 2),
                        },
                    ],
                };
        }
    });
}
async function main() {
    // Load agents on startup
    try {
        await agentManager.loadAgents();
        debug(`Agents loaded successfully`);
    }
    catch (error) {
        if (cliOptions.debug) {
            console.error(`[MCP Sub-Agents] ERROR loading agents:`, error);
        }
    }
    // Stdio transport - this is already stateless by nature
    const server = createServerInstance();
    setupTools(server, projectAnalyzer, agentManager, aiAnalysisService);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    if (cliOptions.debug) {
        console.error('[MCP Sub-Agents] Server running on stdio');
    }
}
// Handle graceful shutdown
process.on('SIGINT', () => {
    console.error('[MCP Sub-Agents] Shutting down...');
    shutdownAnalytics();
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.error('[MCP Sub-Agents] Shutting down...');
    shutdownAnalytics();
    process.exit(0);
});
main().catch((error) => {
    console.error('Fatal error in main():', error);
    trackEvent(AnalyticsEvents.SERVER_ERROR, {
        error: error.message,
        stack: error.stack,
    });
    shutdownAnalytics();
    process.exit(1);
});
//# sourceMappingURL=index.js.map