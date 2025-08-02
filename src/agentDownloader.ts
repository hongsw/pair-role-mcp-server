import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ProjectAnalysis {
  projectType: string;
  technologies: string[];
  frameworks: string[];
  complexity: number;
  phase: string;
  teamSize: number;
  description?: string;
  goals?: string[];
  requirements?: string[];
}

export interface AgentRecommendation {
  name: string;
  description: string;
  relevanceScore: number;
  reasoning: string;
  tools: string[];
  category: string;
  priority: 'essential' | 'recommended' | 'optional';
}

export interface DownloadOptions {
  targetDir: string;
  claudeMdPath: string;
  format: 'md' | 'yaml' | 'json';
  language: 'en' | 'ko' | 'ja' | 'zh';
  limit: number;
  dryRun: boolean;
  overwrite: boolean;
}

/**
 * Agent Downloader - Analyzes projects and downloads recommended agents
 */
export class AgentDownloader {
  private agentsSourceDir: string;

  constructor() {
    this.agentsSourceDir = path.join(__dirname, '../claude/agents');
  }

  /**
   * Main entry point - analyze project and download agents
   */
  async downloadAgents(options: DownloadOptions): Promise<{ 
    analysis: ProjectAnalysis; 
    recommendations: AgentRecommendation[];
    downloaded?: string[];
  }> {
    // 1. Analyze project
    const analysis = await this.analyzeProject(options.claudeMdPath);
    
    // 2. Generate recommendations
    const recommendations = await this.generateRecommendations(analysis);
    
    // 3. Sort and limit recommendations
    const sortedRecommendations = recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, options.limit);

    if (options.dryRun) {
      return { analysis, recommendations: sortedRecommendations };
    }

    // 4. Download agent files
    const downloaded = await this.downloadAgentFiles(
      sortedRecommendations, 
      options
    );

    return { analysis, recommendations: sortedRecommendations, downloaded };
  }

  /**
   * Analyze project context from CLAUDE.md and project structure
   */
  private async analyzeProject(claudeMdPath: string): Promise<ProjectAnalysis> {
    let analysis: ProjectAnalysis = {
      projectType: 'unknown',
      technologies: [],
      frameworks: [],
      complexity: 5,
      phase: 'development',
      teamSize: 5
    };

    // Try to read CLAUDE.md
    try {
      if (fs.existsSync(claudeMdPath)) {
        const claudeMdContent = fs.readFileSync(claudeMdPath, 'utf8');
        analysis = this.parseClaudeMd(claudeMdContent);
      }
    } catch (error) {
      console.warn(`Could not read CLAUDE.md: ${error}`);
    }

    // Analyze project structure
    const structureAnalysis = await this.analyzeProjectStructure();
    
    // Merge analyses
    return {
      ...analysis,
      technologies: [...new Set([...analysis.technologies, ...structureAnalysis.technologies])],
      frameworks: [...new Set([...analysis.frameworks, ...structureAnalysis.frameworks])],
      projectType: analysis.projectType !== 'unknown' ? analysis.projectType : structureAnalysis.projectType,
      complexity: Math.max(analysis.complexity, structureAnalysis.complexity)
    };
  }

  /**
   * Parse CLAUDE.md file content
   */
  private parseClaudeMd(content: string): ProjectAnalysis {
    const analysis: ProjectAnalysis = {
      projectType: 'unknown',
      technologies: [],
      frameworks: [],
      complexity: 5,
      phase: 'development',
      teamSize: 5,
      description: '',
      goals: [],
      requirements: []
    };

    // Extract description (first paragraph or # title)
    const descMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)$/m);
    if (descMatch) {
      analysis.description = descMatch[1].trim();
    }

    // Detect technologies and frameworks from content
    const techKeywords = {
      'React': ['react', 'jsx', 'tsx'],
      'Vue': ['vue', 'vue.js'],
      'Angular': ['angular', '@angular'],
      'Node.js': ['node', 'nodejs', 'node.js', 'express'],
      'TypeScript': ['typescript', 'ts', '.ts'],
      'JavaScript': ['javascript', 'js'],
      'Python': ['python', 'django', 'flask', 'fastapi'],
      'Java': ['java', 'spring', 'spring boot'],
      'Docker': ['docker', 'container'],
      'PostgreSQL': ['postgresql', 'postgres'],
      'MongoDB': ['mongodb', 'mongo'],
      'Redis': ['redis'],
      'AWS': ['aws', 'amazon web services'],
      'GraphQL': ['graphql'],
      'REST': ['rest', 'restful', 'api'],
      'Machine Learning': ['ml', 'machine learning', 'ai', 'tensorflow', 'pytorch'],
      'Mobile': ['mobile', 'ios', 'android', 'react native', 'flutter']
    };

    const contentLower = content.toLowerCase();
    
    for (const [tech, keywords] of Object.entries(techKeywords)) {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        if (['React', 'Vue', 'Angular'].includes(tech)) {
          analysis.frameworks.push(tech);
        } else {
          analysis.technologies.push(tech);
        }
      }
    }

    // Determine project type
    if (analysis.frameworks.some(f => ['React', 'Vue', 'Angular'].includes(f))) {
      analysis.projectType = 'web-frontend';
    } else if (analysis.technologies.includes('Node.js') || analysis.technologies.includes('Python')) {
      analysis.projectType = 'web-backend';
    } else if (analysis.technologies.includes('Mobile')) {
      analysis.projectType = 'mobile';
    } else if (analysis.technologies.includes('Machine Learning')) {
      analysis.projectType = 'data-science';
    } else if (contentLower.includes('api') || contentLower.includes('server')) {
      analysis.projectType = 'api';
    } else if (contentLower.includes('cli') || contentLower.includes('command')) {
      analysis.projectType = 'cli-tool';
    }

    // Estimate complexity
    let complexityScore = 5;
    if (analysis.technologies.length > 5) complexityScore += 2;
    if (analysis.frameworks.length > 1) complexityScore += 1;
    if (contentLower.includes('microservice') || contentLower.includes('enterprise')) complexityScore += 3;
    if (contentLower.includes('machine learning') || contentLower.includes('ai')) complexityScore += 2;
    
    analysis.complexity = Math.min(10, complexityScore);

    return analysis;
  }

  /**
   * Analyze project structure from filesystem
   */
  private async analyzeProjectStructure(): Promise<ProjectAnalysis> {
    const analysis: ProjectAnalysis = {
      projectType: 'unknown',
      technologies: [],
      frameworks: [],
      complexity: 5,
      phase: 'development',
      teamSize: 5
    };

    try {
      // Check package.json
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Extract technologies from dependencies
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };

        Object.keys(allDeps).forEach(dep => {
          if (dep.includes('react')) analysis.frameworks.push('React');
          if (dep.includes('vue')) analysis.frameworks.push('Vue');
          if (dep.includes('angular')) analysis.frameworks.push('Angular');
          if (dep.includes('express')) analysis.technologies.push('Node.js');
          if (dep.includes('typescript')) analysis.technologies.push('TypeScript');
          if (dep.includes('graphql')) analysis.technologies.push('GraphQL');
          if (dep.includes('postgres')) analysis.technologies.push('PostgreSQL');
          if (dep.includes('mongo')) analysis.technologies.push('MongoDB');
          if (dep.includes('redis')) analysis.technologies.push('Redis');
        });

        analysis.projectType = 'web-application';
      }

      // Check Python files
      if (fs.existsSync('requirements.txt') || fs.existsSync('pyproject.toml')) {
        analysis.technologies.push('Python');
        analysis.projectType = 'python-application';
      }

      // Check Dockerfile
      if (fs.existsSync('Dockerfile')) {
        analysis.technologies.push('Docker');
        analysis.complexity += 1;
      }

      // Check for mobile development
      if (fs.existsSync('android') || fs.existsSync('ios')) {
        analysis.projectType = 'mobile';
        analysis.technologies.push('Mobile');
      }

    } catch (error) {
      console.warn(`Error analyzing project structure: ${error}`);
    }

    return analysis;
  }

  /**
   * Generate agent recommendations based on project analysis
   */
  private async generateRecommendations(analysis: ProjectAnalysis): Promise<AgentRecommendation[]> {
    const recommendations: AgentRecommendation[] = [];

    // Define agent scoring rules
    const agentRules = [
      // Web Frontend
      {
        name: 'frontend-developer',
        condition: () => analysis.frameworks.includes('React') || analysis.frameworks.includes('Vue') || analysis.frameworks.includes('Angular'),
        score: 95,
        category: 'development',
        priority: 'essential' as const,
        reasoning: 'Essential for frontend framework development'
      },
      {
        name: 'ui-designer', 
        condition: () => analysis.projectType.includes('web') || analysis.projectType.includes('mobile'),
        score: 80,
        category: 'design',
        priority: 'recommended' as const,
        reasoning: 'Important for user interface design'
      },

      // Backend
      {
        name: 'backend-engineer',
        condition: () => analysis.technologies.includes('Node.js') || analysis.technologies.includes('Python') || analysis.projectType.includes('backend'),
        score: 95,
        category: 'development', 
        priority: 'essential' as const,
        reasoning: 'Essential for backend development and APIs'
      },

      // Full-stack
      {
        name: 'full-stack-developer',
        condition: () => analysis.frameworks.length > 0 && (analysis.technologies.includes('Node.js') || analysis.technologies.includes('Python')),
        score: 90,
        category: 'development',
        priority: 'essential' as const,
        reasoning: 'Perfect for full-stack web applications'
      },

      // DevOps
      {
        name: 'devops-engineer',
        condition: () => analysis.technologies.includes('Docker') || analysis.complexity > 7,
        score: 85,
        category: 'infrastructure',
        priority: 'recommended' as const,
        reasoning: 'Required for deployment and infrastructure'
      },

      // QA
      {
        name: 'qa-engineer',
        condition: () => analysis.complexity > 5,
        score: 75,
        category: 'quality',
        priority: 'recommended' as const,
        reasoning: 'Important for quality assurance'
      },

      // Security
      {
        name: 'security-engineer',
        condition: () => analysis.projectType.includes('web') || analysis.complexity > 8,
        score: 80,
        category: 'security',
        priority: 'recommended' as const,
        reasoning: 'Critical for secure applications'
      },

      // Mobile
      {
        name: 'mobile-developer',
        condition: () => analysis.projectType === 'mobile' || analysis.technologies.includes('Mobile'),
        score: 95,
        category: 'development',
        priority: 'essential' as const,
        reasoning: 'Essential for mobile app development'
      },

      // Data Science
      {
        name: 'data-scientist',
        condition: () => analysis.technologies.includes('Machine Learning') || analysis.projectType === 'data-science',
        score: 95,
        category: 'data',
        priority: 'essential' as const,
        reasoning: 'Essential for ML and data science projects'
      },

      // Management
      {
        name: 'tech-lead',
        condition: () => analysis.complexity > 6 || analysis.technologies.length > 3,
        score: 85,
        category: 'management',
        priority: 'recommended' as const,
        reasoning: 'Needed for technical leadership in complex projects'
      },

      {
        name: 'product-manager',
        condition: () => analysis.projectType.includes('web') || analysis.projectType.includes('mobile'),
        score: 70,
        category: 'management',
        priority: 'optional' as const,
        reasoning: 'Valuable for product strategy and roadmap'
      },

      // Documentation
      {
        name: 'technical-writer',
        condition: () => analysis.complexity > 5,
        score: 65,
        category: 'documentation',
        priority: 'optional' as const,
        reasoning: 'Important for documentation and user guides'
      }
    ];

    // Apply rules and generate recommendations
    for (const rule of agentRules) {
      if (rule.condition()) {
        // Try to load agent details
        const agentDetails = await this.loadAgentDetails(rule.name, 'en');
        
        recommendations.push({
          name: rule.name,
          description: agentDetails?.description || `${rule.name} specialist`,
          relevanceScore: rule.score,
          reasoning: rule.reasoning,
          tools: agentDetails?.tools || ['Read', 'Write'],
          category: rule.category,
          priority: rule.priority
        });
      }
    }

    return recommendations;
  }

  /**
   * Load agent details from file
   */
  private async loadAgentDetails(agentName: string, language: string): Promise<{
    description: string;
    tools: string[];
  } | null> {
    try {
      const agentPath = path.join(this.agentsSourceDir, language, `${agentName}.md`);
      
      if (!fs.existsSync(agentPath)) {
        return null;
      }

      const content = fs.readFileSync(agentPath, 'utf8');
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        return null;
      }

      const frontmatter = frontmatterMatch[1];
      const descMatch = frontmatter.match(/description:\s*(.+)/);
      const toolsMatch = frontmatter.match(/tools:\s*(.+)/);

      return {
        description: descMatch ? descMatch[1].trim() : '',
        tools: toolsMatch ? toolsMatch[1].split(',').map(t => t.trim()) : ['Read', 'Write']
      };
    } catch (error) {
      console.warn(`Error loading agent details for ${agentName}: ${error}`);
      return null;
    }
  }

  /**
   * Download agent files to target directory
   */
  private async downloadAgentFiles(
    recommendations: AgentRecommendation[],
    options: DownloadOptions
  ): Promise<string[]> {
    const downloaded: string[] = [];

    // Create target directory
    if (!fs.existsSync(options.targetDir)) {
      fs.mkdirSync(options.targetDir, { recursive: true });
    }

    for (const rec of recommendations) {
      try {
        const sourcePath = path.join(
          this.agentsSourceDir, 
          options.language, 
          `${rec.name}.md`
        );

        if (!fs.existsSync(sourcePath)) {
          console.warn(`Agent file not found: ${sourcePath}`);
          continue;
        }

        const targetPath = path.join(options.targetDir, `${rec.name}.${options.format}`);

        // Check if file exists and overwrite flag
        if (fs.existsSync(targetPath) && !options.overwrite) {
          console.log(`Skipping existing file: ${targetPath}`);
          continue;
        }

        // Copy file
        const content = fs.readFileSync(sourcePath, 'utf8');
        
        if (options.format === 'md') {
          fs.writeFileSync(targetPath, content);
        } else if (options.format === 'yaml') {
          // Convert to YAML format (simplified)
          const yamlContent = this.convertToYaml(content, rec);
          fs.writeFileSync(targetPath, yamlContent);
        } else if (options.format === 'json') {
          // Convert to JSON format
          const jsonContent = this.convertToJson(content, rec);
          fs.writeFileSync(targetPath, jsonContent);
        }

        downloaded.push(targetPath);
        console.log(`✅ Downloaded: ${rec.name}.${options.format}`);

      } catch (error) {
        console.error(`Error downloading ${rec.name}: ${error}`);
      }
    }

    // Create README
    await this.createReadme(recommendations, options);

    return downloaded;
  }

  /**
   * Convert agent content to YAML format
   */
  private convertToYaml(content: string, rec: AgentRecommendation): string {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
    
    if (!frontmatterMatch) {
      return content;
    }

    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    return `# Agent: ${rec.name}
${frontmatter}
relevance_score: ${rec.relevanceScore}
reasoning: "${rec.reasoning}"
category: ${rec.category}
priority: ${rec.priority}

# Content
content: |
${body.split('\n').map(line => `  ${line}`).join('\n')}
`;
  }

  /**
   * Convert agent content to JSON format
   */
  private convertToJson(content: string, rec: AgentRecommendation): string {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
    
    const agent = {
      name: rec.name,
      description: rec.description,
      relevanceScore: rec.relevanceScore,
      reasoning: rec.reasoning,
      category: rec.category,
      priority: rec.priority,
      tools: rec.tools,
      content: frontmatterMatch ? frontmatterMatch[2].trim() : content
    };

    return JSON.stringify(agent, null, 2);
  }

  /**
   * Create README file with usage instructions
   */
  private async createReadme(recommendations: AgentRecommendation[], options: DownloadOptions): Promise<void> {
    const readmePath = path.join(options.targetDir, 'README.md');

    const content = `# 🤖 Downloaded Agents

This directory contains ${recommendations.length} agents recommended for your project.

## 📋 Agent Summary

| Agent | Category | Priority | Relevance | Description |
|-------|----------|----------|-----------|-------------|
${recommendations.map(rec => 
  `| **${rec.name}** | ${rec.category} | ${rec.priority} | ${rec.relevanceScore}% | ${rec.description} |`
).join('\n')}

## 🎯 Usage in Claude Code

Each agent can be activated by referencing their expertise:

\`\`\`
"${recommendations[0]?.name} 에이전트를 활용해서 [specific task]를 해줘"
\`\`\`

## 📊 Recommendations by Priority

### ⭐ Essential (${recommendations.filter(r => r.priority === 'essential').length})
${recommendations.filter(r => r.priority === 'essential').map(r => 
  `- **${r.name}**: ${r.reasoning}`
).join('\n')}

### 🔧 Recommended (${recommendations.filter(r => r.priority === 'recommended').length})
${recommendations.filter(r => r.priority === 'recommended').map(r => 
  `- **${r.name}**: ${r.reasoning}`
).join('\n')}

### 💡 Optional (${recommendations.filter(r => r.priority === 'optional').length})
${recommendations.filter(r => r.priority === 'optional').map(r => 
  `- **${r.name}**: ${r.reasoning}`
).join('\n')}

## 🚀 Getting Started

1. **Review Agent Roles**: Read individual agent files to understand their capabilities
2. **Start with Essentials**: Begin with essential priority agents for core functionality  
3. **Add Specialists**: Include recommended agents based on specific project needs
4. **Customize as Needed**: Modify agent instructions for your specific requirements

Generated by claude-agents-power v${this.getVersion()} on ${new Date().toISOString()}
`;

    fs.writeFileSync(readmePath, content);
  }

  /**
   * Get package version
   */
  private getVersion(): string {
    try {
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.version;
    } catch (error) {
      return 'unknown';
    }
  }
}