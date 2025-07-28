# /agents:search

Search for specific agents by skills, domain, or keywords.

## Usage
```
/agents:search <query> [--flags]
```

## Parameters
- `query` (required): Search terms (skills, domain, keywords)
- `--language <lang>`: Limit search to specific language (en, ko, ja, zh)
- `--fuzzy`: Enable fuzzy matching for broader results
- `--exact`: Require exact keyword matches
- `--limit <n>`: Limit number of results (default: 10)

## Examples
```
/agents:search "machine learning"
/agents:search "frontend react" --language en
/agents:search "데이터 분석" --language ko --fuzzy
/agents:search "security audit" --exact --limit 5
/agents:search "project management agile"
```

## Description
This command performs intelligent search across all available agents to find the best matches for your specific needs. It searches through:
- Agent names and titles
- Skill descriptions and capabilities
- Tool permissions and specializations
- Keywords and tags

The search algorithm considers:
1. **Exact matches**: Direct keyword matches in titles and descriptions
2. **Semantic similarity**: Related concepts and synonyms
3. **Skill relevance**: Matching technical and soft skills
4. **Language context**: Language-specific terms and concepts

## Search Categories
- **Technical Skills**: programming languages, frameworks, tools
- **Domain Expertise**: industry knowledge, business domains
- **Methodologies**: agile, DevOps, security practices
- **Soft Skills**: communication, leadership, analysis

## Results Format
Each result shows:
- **Relevance Score**: How well the agent matches your query (0-100%)
- **Agent Details**: Name, role, primary capabilities
- **Key Skills**: Highlighted matching skills and expertise
- **Languages Available**: Which language versions exist
- **Usage Suggestion**: How to best utilize this agent

## Smart Features
- **Auto-suggestions**: Related search terms and refinements
- **Multi-language**: Searches work across all supported languages
- **Context awareness**: Learns from your project context
- **Recommendation engine**: Suggests complementary agents

## Integration Tips
- Use specific technical terms for better precision
- Combine multiple keywords for complex requirements
- Try different languages if working in international teams
- Use --fuzzy for exploratory discovery of related expertise

Perfect for finding the right expertise when you know what you need but not exactly which role provides it.