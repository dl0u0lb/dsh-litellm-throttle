const { Schema } = require('cordis');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.name = 'litellm-throttle';

exports.Config = Schema.object({
  apiKey: Schema.string().role('secret').default('').description('Google AI Studio API Key'),
  targetModel: Schema.string().default('gemini/gemini-3.1-flash-lite').description('LiteLLM Target Model'),
  rpm: Schema.number().default(12).min(1).max(1000).description('Max Requests Per Minute (RPM)'),
  tpm: Schema.number().default(200000).min(1000).description('Max Tokens Per Minute (TPM)'),
});

exports.apply = (ctx, config) => {
  let child = null;
  const PORT = 4000;
  const MASTER_KEY = 'sk-local-proxy';
  const configPath = path.join(os.tmpdir(), `dsh-litellm-${PORT}.yaml`);
  const litellmBin = path.join(os.homedir(), '.local', 'bin', 'litellm');

  ctx.on('ready', () => {
    if (!config.apiKey) {
      ctx.logger?.warn?.('[litellm-throttle] API Key is empty. Please set it in plugin settings.');
      return;
    }

    const yamlContent = [
      'model_list:',
      '  - model_name: gemini-safe',
      '    litellm_params:',
      `      model: ${config.targetModel}`,
      `      api_key: "${config.apiKey}"`,
      `      rpm: ${config.rpm}`,
      `      tpm: ${config.tpm}`,
      'litellm_settings:',
      '  num_retries: 5',
      '  request_timeout: 120',
      'general_settings:',
      `  master_key: "${MASTER_KEY}"`,
      ''
    ].join('\n');

    fs.writeFileSync(configPath, yamlContent, 'utf8');

    child = spawn(litellmBin, ['--config', configPath, '--port', String(PORT)], {
      stdio: 'ignore',
      detached: false,
    });

    child.on('error', (err) => {
      ctx.logger?.error?.('[litellm-throttle] Failed to start:', err.message);
    });
  });

  ctx.on('dispose', () => {
    if (child && !child.killed) {
      child.kill('SIGTERM');
      child = null;
    }
    try {
      if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
    } catch (_) {}
  });
};
