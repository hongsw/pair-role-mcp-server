import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function initializeAnalytics(): PostHog | null {
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST || 'https://app.posthog.com';
  
  if (!apiKey) {
    console.error('[MCP Sub-Agents] PostHog API key not found. Analytics disabled.');
    return null;
  }

  try {
    posthogClient = new PostHog(apiKey, {
      host,
      flushAt: 20,
      flushInterval: 10000,
    });
    console.error('[MCP Sub-Agents] ✅ Analytics initialized with PostHog');
    return posthogClient;
  } catch (error) {
    console.error('[MCP Sub-Agents] Failed to initialize PostHog:', error);
    return null;
  }
}

export function trackEvent(
  event: string,
  properties?: Record<string, any>
): void {
  if (!posthogClient) {
    return;
  }

  try {
    // Generate a session ID based on process ID and timestamp
    const sessionId = `mcp-${process.pid}-${Date.now()}`;
    
    posthogClient.capture({
      distinctId: sessionId,
      event,
      properties: {
        ...properties,
        mcp_server: 'claude-agents-power',
        version: process.env.npm_package_version || 'unknown',
        platform: process.platform,
        node_version: process.version,
      },
    });
  } catch (error) {
    console.error('[MCP Sub-Agents] Failed to track event:', error);
  }
}

export function shutdown(): void {
  if (posthogClient) {
    posthogClient.shutdown();
  }
}

// Track common events
export const AnalyticsEvents = {
  // Server events
  SERVER_STARTED: 'mcp_server_started',
  SERVER_ERROR: 'mcp_server_error',
  
  // Tool usage events
  TOOL_CALLED: 'mcp_tool_called',
  TOOL_ERROR: 'mcp_tool_error',
  
  // Agent events
  AGENT_SEARCHED: 'agent_searched',
  AGENT_LISTED: 'agent_listed',
  AGENT_INSTALLED: 'agent_installed',
  AGENT_NOT_FOUND: 'agent_not_found',
  AGENT_ISSUE_CREATED: 'agent_issue_created',
  
  // Project analysis events
  PROJECT_ANALYZED: 'project_analyzed',
  PROJECT_RECOMMENDATION: 'project_recommendation',
  
  // Resource events
  RESOURCE_ACCESSED: 'resource_accessed',
} as const;