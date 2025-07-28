# /agents:suggest

Get intelligent agent recommendations based on your current project context.

## Usage
```
/agents:suggest [context] [--flags]
```

## Parameters
- `context` (optional): Project context or task description
- `--project-type <type>`: Specify project type (web, mobile, data, enterprise, etc.)
- `--team-size <size>`: Team size (solo, small, medium, large)
- `--phase <phase>`: Project phase (planning, development, testing, deployment, maintenance)
- `--stack <tech>`: Technology stack information
- `--priority <focus>`: Priority focus (speed, quality, security, performance)

## Examples
```
/agents:suggest
/agents:suggest "building a React e-commerce platform"
/agents:suggest --project-type web --phase development --stack "React, Node.js, PostgreSQL"
/agents:suggest "data pipeline for analytics" --team-size small --priority performance
/agents:suggest --phase testing --stack "Python, Django, AWS"
```

## Description
This command provides intelligent recommendations for which agents would be most valuable for your specific situation. It analyzes:

1. **Project Context**: Current files, technology stack, project structure
2. **Development Phase**: What stage of development you're in
3. **Technical Requirements**: Complexity, scale, and technical challenges
4. **Team Composition**: What expertise gaps might exist

## Recommendation Engine
The suggestion system considers:
- **Current Project Files**: Analyzes your codebase to understand technologies
- **Recent Activities**: What you've been working on recently
- **Common Patterns**: Typical agent combinations for similar projects
- **Skill Gaps**: Identifies areas where specialized expertise would help
- **Workflow Optimization**: Agents that work well together

## Suggestion Categories

### **Core Development Team**
Essential agents for most projects:
- Technical leadership (tech-lead, architect)
- Development expertise (frontend, backend, full-stack)
- Quality assurance (qa-engineer, testing specialist)

### **Specialized Expertise**
Domain-specific agents based on your needs:
- **Data Projects**: data-scientist, data-engineer, bi-developer
- **Mobile Apps**: mobile-developer, ui-designer, ux-designer
- **Enterprise**: solution-architect, security-engineer, devops-engineer
- **Startups**: product-manager, growth-hacker, full-stack-developer

### **Phase-Specific Agents**
- **Planning**: business-analyst, product-manager, architect
- **Development**: Relevant technical specialists
- **Testing**: qa-engineer, security-engineer, performance-engineer
- **Deployment**: devops-engineer, site-reliability-engineer
- **Maintenance**: support-engineer, documentation-specialist

## Smart Features
- **Context Awareness**: Automatically detects your project characteristics
- **Team Balance**: Suggests complementary skill sets
- **Workflow Integration**: Recommends agents that enhance your existing workflow
- **Learning**: Improves suggestions based on your preferences and feedback

## Output Format
Suggestions include:
- **Priority Level**: Essential, Recommended, Optional
- **Reasoning**: Why this agent is suggested for your context
- **Use Cases**: Specific ways this agent could help
- **Synergies**: How it works with other recommended agents
- **Getting Started**: First steps to engage with the agent

## Pro Tips
- Run without parameters to get general project analysis
- Be specific about your current challenges for targeted suggestions
- Consider suggestions for future project phases
- Mix different expertise levels based on your team's experience

Perfect for assembling the right expertise team for any development challenge.