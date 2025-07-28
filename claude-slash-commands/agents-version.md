# /agents:version

Check claude-agents-power MCP server version and system status.

## Usage
```
/agents:version [--flags]
```

## Parameters
- `--detailed`: Show detailed system information
- `--check-updates`: Check for available updates
- `--agents-count`: Show agent counts by language
- `--system-info`: Display system and environment info

## Examples
```
/agents:version
/agents:version --detailed
/agents:version --check-updates --agents-count
/agents:version --system-info
```

## Description
This command provides version information and system status for the claude-agents-power MCP server. It helps with:
- Troubleshooting installation issues
- Verifying agent availability
- Checking for updates
- Diagnosing connectivity problems

## Information Displayed

### **Basic Version Info**
- Current MCP server version
- Installation date and method
- Total agent count
- Supported languages

### **Detailed Information** (with --detailed)
- Agent breakdown by language (en, ko, ja, zh)
- MCP server status and connectivity
- Configuration settings
- Recent activity summary

### **System Information** (with --system-info)
- Node.js version and environment
- Claude Desktop configuration status
- MCP transport method
- System compatibility info

### **Update Information** (with --check-updates)
- Latest available version
- Update availability status
- Release notes summary
- Update instructions

## Status Indicators
- ✅ **Healthy**: All systems operational
- ⚠️ **Warning**: Minor issues or outdated version
- ❌ **Error**: Critical issues requiring attention
- 🔄 **Updating**: Update in progress

## Common Use Cases

### **Troubleshooting Agent Loading Issues**
```
/agents:version --detailed --agents-count
```
This helps diagnose why agents might not be loading properly.

### **Pre-Project Setup Check**  
```
/agents:version --system-info
```
Verify everything is configured correctly before starting a project.

### **Regular Maintenance**
```
/agents:version --check-updates
```
Keep your system up to date with the latest features and fixes.

## Integration Status
The command also checks:
- **MCP Server Connection**: Whether the server is reachable
- **Agent Registry**: If agent files are properly loaded
- **Claude Desktop Integration**: Configuration status
- **Analytics Status**: Telemetry and usage tracking (if enabled)

## Output Examples

**Basic Version:**
```
Claude Agents Power v1.6.1
✅ MCP Server: Connected
📊 Agents: 127 total (en: 127, ko: 76, ja: 5, zh: 8)
🌐 Languages: 4 supported
```

**Detailed Status:**
```
Claude Agents Power v1.6.1
✅ MCP Server: Connected (stdio transport)
📊 Agent Registry:
   • English: 127 agents loaded
   • Korean: 76 agents loaded  
   • Japanese: 5 agents loaded
   • Chinese: 8 agents loaded
⚙️ Configuration: ~/.claude/claude_desktop_config.json
📈 Analytics: Enabled (anonymous usage tracking)
🔧 Node.js: v18.17.0
```

## Troubleshooting
If you see issues:
1. **Connection Failed**: Check Claude Desktop configuration
2. **No Agents**: Verify installation and file permissions
3. **Outdated**: Run update commands as suggested
4. **Config Issues**: Review MCP server setup

Essential for maintaining a healthy claude-agents-power installation.