DeepSeek Harness LiteLLM Throttle Plugin (dsh-litellm-throttle)
License: MIT
Cordis Plugin

[English | 中文]


English Documentation
A local proxy lifecycle management and rate-limiting plugin for DeepSeek Harness (DSH). It automatically provisions and manages a local LiteLLM Proxy instance on port 4000, smoothly queuing high-frequency Agent tool calls to prevent 429 QUOTA errors when using free-tier or rate-limited APIs (such as Google Gemini).
🚀 Features
Automated Lifecycle Management: Automatically boots the local LiteLLM proxy when the plugin starts in DSH, and cleanly terminates the process (releasing port 4000) upon plugin disposal.
Visual Settings UI: Full integration with Cordis Schema, allowing you to manage your API Key, target model, RPM, and TPM limits directly from the DSH plugin settings panel.
Robust Rate-Limiting: Flattens bursty multi-step agent tool calls into a stable, compliant token-bucket queue.
📦 Installation
Ensure you have litellm installed:

uv tool install 'litellm[proxy]'
# or pip install 'litellm[proxy]'

Install this plugin into your DeepSeek Harness environment.
⚙️ Configuration
Plugin Settings (DSH UI):
API Key: Your Google AI Studio API Key.
Target Model: gemini/gemini-3.1-flash-lite (or other supported models)
RPM: Max Requests Per Minute (default: 12)
TPM: Max Tokens Per Minute (default: 200000)
Router Routing Patch (cordis.patch.yml):

- id: llm-pi-ai
  name: "@deepseek-ai/dsh-llm-pi-ai"
  config:
    providers:
      litellm-local:
        baseUrl: "http://127.0.0.1:4000/v1"
        apiKey: "sk-local-proxy"
        api: "openai-completions"
        models:
          - id: gemini-safe
            name: Gemini 3.1 Flash Lite (Rate Limited)
            contextWindow: 120000
            maxTokens: 16384
            input:
              - text
              - image


中文说明
适用于 DeepSeek Harness (DSH) 的本地代理生命周期管理与请求限流（Rate-Limiting）插件。它能够在插件启动时自动拉起并管理本地的 LiteLLM Proxy 实例（监听 4000 端口），将高频的 Agent 工具调用平滑排队，彻底解决使用免费额度或受限 API（如 Google Gemini）时遇到的 429 QUOTA 配额耗尽报错。
🚀 核心特性
自动化生命周期管理：在 DSH 插件激活时自动启动 LiteLLM 代理，在插件注销时干净利落地终止后台进程并释放 4000 端口。
可视化设置面板：完美集成 Cordis Schema，支持直接在 DSH 插件设置界面中配置 API Key、目标模型、RPM（每分钟请求数）与 TPM（每分钟 Token 数）。
强大的流量平滑与限流：将多步骤智能体瞬间爆发的工具调用转化为稳定的令牌桶队列，合规通过 API 限额。
📦 安装指南
确保已在系统中安装 litellm：

uv tool install 'litellm[proxy]'

将本插件引入至你的 DeepSeek Harness 运行环境或 node_modules 中。
⚙️ 配置说明
插件设置面板 (DSH UI)：
API Key：你的 Google AI Studio API 密钥。
Target Model：例如 gemini/gemini-3.1-flash-lite。
RPM：每分钟最大请求数（默认 12）。
TPM：每分钟最大 Token 数（默认 200000）。
路由补丁配置 (cordis.patch.yml)：
参考上方英文配置中的 cordis.patch.yml 示例，将路由指向本地 http://127.0.0.1:4000/v1。


📜 License
MIT License. See LICENSE for details.
