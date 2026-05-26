import { DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

/**
 * OpenCode Go proxy agent definition.
 * This agent does not require a local CLI binary. Instead, it uses the
 * daemon's internal OpenAI proxy endpoint (/api/zen/stream)
 * to route requests through OpenCode Go's compatible API.
 * 
 * Available when OPENAI_BASE_URL is configured (e.g. https://opencode.ai/zen/go/v1).
 */
export const zenAgentDef = {
  id: 'zen',
  name: 'OpenCode Go',
  bin: '', // No local binary required
  versionArgs: [],
  fallbackModels: [
    DEFAULT_MODEL_OPTION,
    { id: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash (via Go)' },
    { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro (via Go)' },
    { id: 'kimi-k2.6', label: 'Kimi K2.6 (via Go)' },
    { id: 'kimi-k2.5', label: 'Kimi K2.5 (via Go)' },
    { id: 'glm-5.1', label: 'GLM-5.1 (via Go)' },
    { id: 'glm-5', label: 'GLM-5 (via Go)' },
    { id: 'mimo-v2.5', label: 'MiMo V2.5 (via Go)' },
    { id: 'mimo-v2.5-pro', label: 'MiMo V2.5 Pro (via Go)' },
    { id: 'minimax-m2.7', label: 'MiniMax M2.7 (via Go)' },
    { id: 'minimax-m2.5', label: 'MiniMax M2.5 (via Go)' },
    { id: 'qwen3.6-plus', label: 'Qwen3.6 Plus (via Go)' },
    { id: 'qwen3.5-plus', label: 'Qwen3.5 Plus (via Go)' },
  ],
  // This agent uses the OpenAI proxy internally, so no CLI args needed
  buildArgs: () => [],
  streamFormat: 'openai-proxy',
  promptViaStdin: false,
} satisfies RuntimeAgentDef;
