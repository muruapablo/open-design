import { DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

/**
 * OpenCode Zen proxy agent definition.
 * This agent does not require a local CLI binary. Instead, it uses the
 * daemon's internal OpenAI proxy endpoint (/api/proxy/openai/stream)
 * to route requests through OpenCode Zen's compatible API.
 * 
 * Available when OPENAI_BASE_URL is configured (e.g. https://opencode.ai/zen/v1).
 */
export const zenAgentDef = {
  id: 'zen',
  name: 'OpenCode Zen',
  bin: '', // No local binary required
  versionArgs: [],
  fallbackModels: [
    DEFAULT_MODEL_OPTION,
    { id: 'kimi-k2-6', label: 'Kimi K2.6 (via Zen)' },
    { id: 'gpt-4', label: 'GPT-4 (via Zen)' },
    { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (via Zen)' },
  ],
  // This agent uses the OpenAI proxy internally, so no CLI args needed
  buildArgs: () => [],
  streamFormat: 'openai-proxy',
  promptViaStdin: false,
} satisfies RuntimeAgentDef;
