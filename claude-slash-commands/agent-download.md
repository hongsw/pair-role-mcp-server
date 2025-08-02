# /agent-download

Automatically analyze project context and download recommended agents to your project.

## ✅ **Status: IMPLEMENTED AND TESTED**

This feature is now fully functional! Use `npx claude-agents-power --agent-download` to try it.

## Usage
```
/agent-download [--flags]
```

## Parameters
- `--target-dir <dir>`: Target directory for agent files (default: "./agents")
- `--claude-md <path>`: Path to CLAUDE.md file (default: "./CLAUDE.md")
- `--format <format>`: Agent file format (md, yaml, json) (default: "md")
- `--language <lang>`: Preferred language for agents (en, ko, ja, zh) (default: "en")
- `--limit <n>`: Maximum number of agents to download (default: 10)
- `--dry-run`: Preview recommendations without downloading
- `--overwrite`: Overwrite existing agent files

## Examples
```
/agent-download                                    # Auto-analyze and download
/agent-download --target-dir ./team --limit 5     # Custom directory and limit
/agent-download --dry-run                          # Preview only
/agent-download --language ko --format yaml       # Korean agents in YAML format
/agent-download --claude-md docs/project.md       # Custom context file
```

## Description
This command performs intelligent project analysis and automatically downloads the most suitable agents for your development needs. It:

1. **Project Analysis**: Reads and analyzes CLAUDE.md or project structure
2. **Context Understanding**: Identifies technologies, frameworks, and project type
3. **Agent Recommendation**: Suggests optimal team composition based on analysis
4. **Automated Download**: Downloads recommended agent files to specified directory

## Analysis Process

### **1. Context Discovery**
- **CLAUDE.md Reading**: Parses project description, goals, and requirements
- **Codebase Scanning**: Analyzes file structure, package.json, technologies
- **Framework Detection**: Identifies React, Vue, Node.js, Python, etc.
- **Project Type**: Determines web app, mobile, API, CLI tool, etc.

### **2. Intelligent Recommendation**
- **Core Team**: Essential roles for project type
- **Specialized Experts**: Domain-specific expertise based on technologies
- **Project Phase**: Agents suitable for current development stage
- **Team Size**: Optimal team composition for project scale

### **3. Agent Selection Criteria**
- **Technology Match**: Agents with relevant technical expertise
- **Role Complementarity**: Balanced team with complementary skills
- **Project Complexity**: Appropriate expertise level for project scope
- **Development Stage**: Suitable agents for planning, development, or deployment

## Recommendation Categories

### **Web Development Projects**
- **Frontend**: frontend-developer, ui-designer, ux-designer
- **Backend**: backend-engineer, api-developer, database-administrator
- **Full-Stack**: full-stack-developer, software-engineer
- **DevOps**: devops-engineer, cloud-architect

### **Mobile Development**
- **Core**: mobile-developer, ui-designer, ux-designer
- **Backend**: backend-engineer, api-developer
- **QA**: qa-engineer, mobile-testing-specialist

### **Data Projects**
- **Analytics**: data-scientist, data-engineer, bi-developer
- **ML/AI**: machine-learning-engineer, ai-researcher
- **Infrastructure**: data-engineer, cloud-architect

### **Enterprise Applications**
- **Architecture**: solution-architect, enterprise-architect
- **Security**: security-engineer, compliance-officer
- **Management**: technical-pm, business-analyst

## Smart Features

### **Context-Aware Analysis**
- **Technology Stack Detection**: Automatic identification of frameworks and tools
- **Project Scope Assessment**: Scale and complexity evaluation
- **Development Phase Recognition**: Current stage and upcoming needs
- **Team Gap Analysis**: Identifies missing expertise areas

### **Intelligent Filtering**
- **Relevance Scoring**: Ranks agents by project fit (0-100%)
- **Skill Overlap Prevention**: Avoids redundant expertise
- **Priority Weighting**: Emphasizes critical roles for project success
- **Experience Level Matching**: Appropriate seniority for project complexity

### **Customization Options**
- **Language Preferences**: Multi-language agent support
- **File Formats**: Markdown, YAML, or JSON output
- **Directory Structure**: Flexible organization options
- **Template Customization**: Adaptable agent templates

## Output Format

### **Preview Mode (--dry-run)**
```
🎯 Project Analysis Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Project Type: Full-Stack Web Application
🛠️ Technologies: React, Node.js, TypeScript, PostgreSQL
📈 Complexity: Medium (Score: 7.2/10)
👥 Recommended Team Size: 5-7 agents

🏆 Top Recommendations:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ⭐ backend-engineer (95% match)
   └─ Essential for Node.js API development

2. ⭐ frontend-developer (92% match)  
   └─ Critical for React TypeScript implementation

3. ⭐ full-stack-developer (88% match)
   └─ Bridges frontend and backend integration

4. 🔧 devops-engineer (85% match)
   └─ Required for deployment and CI/CD

5. 🧪 qa-engineer (80% match)
   └─ Quality assurance and testing strategy
```

### **Download Mode**
```
🚀 Agent Download Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Target Directory: ./agents/
🌐 Language: English
📝 Format: Markdown

📥 Downloading Agents:
✅ backend-engineer.md          (3.2KB)
✅ frontend-developer.md        (2.8KB)  
✅ full-stack-developer.md      (3.5KB)
✅ devops-engineer.md          (2.9KB)
✅ qa-engineer.md              (2.4KB)

📊 Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 5 agents downloaded successfully
📁 Files saved to: ./agents/
📋 README.md created with usage guide
💡 Next: Try using agents in your development workflow
```

## Integration Tips

### **Project Setup Workflow**
```bash
# 1. Analyze and preview
/agent-download --dry-run

# 2. Download recommended team
/agent-download --target-dir ./team

# 3. Customize for specific needs
/agent-download --limit 3 --language ko

# 4. Update as project evolves
/agent-download --overwrite
```

### **Best Practices**
- **Regular Updates**: Re-run as project requirements change
- **Phase-Specific Downloads**: Different agents for different development phases
- **Team Composition**: Balance core and specialized expertise
- **Documentation**: Review generated README for agent usage guidance

## Error Handling
- **Missing CLAUDE.md**: Falls back to automatic project structure analysis
- **Invalid Directory**: Creates target directory automatically
- **Network Issues**: Provides offline recommendations based on cached data
- **Permission Errors**: Clear error messages with suggested solutions

Perfect for quickly assembling the right expertise team for any development project!