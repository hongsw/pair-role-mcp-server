# /agents:load

Load and display available Claude agents for your development team.

## Usage
```
/agents:load [language] [role] [--flags]
```

## Parameters
- `language` (optional): Filter by language (en, ko, ja, zh)
- `role` (optional): Filter by specific role name
- `--all`: Show all available agents across all languages
- `--count`: Show only agent counts by language
- `--detailed`: Show detailed agent descriptions

## Examples
```
/agents:load
/agents:load ko
/agents:load backend-engineer
/agents:load ko backend-engineer
/agents:load --all --detailed
/agents:load --count
```

## Description
This command interfaces with the claude-agents-power MCP server to load and display available specialized agents. It provides easy access to 100+ professional role-based agents that can assist with development tasks.

When you use this command, Claude Code will:
1. Connect to the MCP server
2. Query available agents based on your criteria
3. Display agent information in an organized format
4. Provide usage instructions for each agent

## Agent Categories
- **Technical Roles**: backend-engineer, frontend-developer, devops-engineer, data-scientist, etc.
- **Business Roles**: product-manager, business-analyst, project-manager, etc.
- **Support Roles**: qa-engineer, technical-writer, scrum-master, etc.
- **Leadership Roles**: tech-lead, architect, team-lead, etc.

## Integration
This command automatically uses the claude-agents-power MCP server. Make sure you have:
1. Installed claude-agents-power: `npm install -g claude-agents-power`
2. Configured it in Claude Desktop settings
3. The MCP server is running and accessible

## Output Format
The command will display:
- Agent name and role
- Brief description of capabilities
- Available languages
- Usage instructions
- Related agents and suggestions

Use this command to discover and load the right expertise for your development needs.