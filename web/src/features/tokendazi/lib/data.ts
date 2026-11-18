/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import type { TFunction } from 'i18next'

/** 首页与登录页共用的产品数据与文案，模型信息以当前网关实际在售模型为准。
 *  所有面向用户的文案字段存放的是 i18n key，渲染处需用 t() 取值。 */

export const MARQUEE_ITEMS = [
  'mk.landing.marquee.openai',
  'mk.landing.marquee.failover',
  'mk.landing.marquee.uptime',
  'mk.landing.marquee.clients',
  'mk.landing.marquee.routing',
  'mk.landing.marquee.billing',
  'mk.landing.marquee.onekey',
]

export type ModelSpec = {
  id: string
  /** 卡片 Pill 上的短名 */
  pill: string
  /** 展示名 */
  displayName: string
  /** API 请求里的 model 字段 */
  modelId: string
  vendor: string
  latency: number
  uptime: string
  note: string
}

// 第一个即卡片默认展示的模型，DeepSeek 放在首位
export const PASSPORT_MODELS: ModelSpec[] = [
  {
    id: 'deepseek',
    pill: 'DeepSeek',
    displayName: 'DeepSeek-V4.1-Flash-1017',
    modelId: 'deepseek-v4.1-flash-1017',
    vendor: 'DeepSeek',
    latency: 15,
    uptime: '99.99%',
    note: 'mk.landing.models.deepseek.note',
  },
  {
    id: 'qwen38',
    pill: 'Qwen',
    displayName: 'Qwen3.8-Flash',
    modelId: 'qwen3.8-flash',
    vendor: 'Alibaba',
    latency: 12,
    uptime: '99.99%',
    note: 'mk.landing.models.qwen38.note',
  },
  {
    id: 'glm53',
    pill: 'GLM',
    displayName: 'GLM-5.3',
    modelId: 'glm-5.3',
    vendor: 'Zhipu',
    latency: 24,
    uptime: '99.97%',
    note: 'mk.landing.models.glm53.note',
  },
  {
    id: 'kimi',
    pill: 'Kimi',
    displayName: 'Kimi-K2.7-Code',
    modelId: 'kimi-k2.7-code',
    vendor: 'Moonshot',
    latency: 27,
    uptime: '99.96%',
    note: 'mk.landing.models.kimi.note',
  },
]

export type TickerModel = ModelSpec

export const TICKER_MODELS: TickerModel[] = [
  ...PASSPORT_MODELS,
  {
    id: 'qwen37',
    pill: 'Qwen',
    displayName: 'Qwen3.7-Plus',
    modelId: 'qwen3.7-plus',
    vendor: 'Alibaba',
    latency: 18,
    uptime: '99.98%',
    note: 'mk.landing.models.qwen37.note',
  },
  {
    id: 'glm52',
    pill: 'GLM',
    displayName: 'GLM-5.2',
    modelId: 'glm-5.2',
    vendor: 'Zhipu',
    latency: 21,
    uptime: '99.98%',
    note: 'mk.landing.models.glm52.note',
  },
].sort((a, b) => a.latency - b.latency)

export type BentoCard = {
  accent: string
  kicker: string
  tag: string
  title: string
  description: string
}

export const BENTO_CARDS: BentoCard[] = [
  {
    accent: 'var(--tdz-orange)',
    kicker: 'mk.landing.bento.models.kicker',
    tag: 'MODEL',
    title: 'mk.landing.bento.models.title',
    description:
      'mk.landing.bento.models.desc',
  },
  {
    accent: 'var(--tdz-emerald)',
    kicker: 'mk.landing.bento.sla.kicker',
    tag: 'SLA',
    title: 'mk.landing.bento.sla.title',
    description: 'mk.landing.bento.sla.desc',
  },
  {
    accent: 'var(--tdz-blue)',
    kicker: 'mk.landing.bento.proto.kicker',
    tag: '/V1',
    title: 'mk.landing.bento.proto.title',
    description: 'mk.landing.bento.proto.desc',
  },
  {
    accent: 'var(--tdz-yellow)',
    kicker: 'mk.landing.bento.safe.kicker',
    tag: 'SAFE',
    title: 'mk.landing.bento.safe.title',
    description: 'mk.landing.bento.safe.desc',
  },
]

export type StepItem = {
  index: string
  title: string
  description: string
}

export const STEPS: StepItem[] = [
  {
    index: '01',
    title: 'mk.landing.steps.key.title',
    description: 'mk.landing.steps.key.desc',
  },
  {
    index: '02',
    title: 'mk.landing.steps.base.title',
    description: 'mk.landing.steps.base.desc',
  },
  {
    index: '03',
    title: 'mk.landing.steps.call.title',
    description: 'mk.landing.steps.call.desc',
  },
]

export type LanguageId = 'python' | 'curl' | 'ts' | 'go' | 'rust'

export type CodeSample = {
  id: LanguageId
  label: string
  filename: string
  code: string
}

export const DEFAULT_MODEL = 'deepseek-v4.1-flash-1017'

/** 代码示例随实际 Base URL 生成，避免出现写死的演示域名 */
export function createCodeSamples(baseUrl: string, t: TFunction): CodeSample[] {
  const endpoint = `${baseUrl}/chat/completions`
  return [
    {
      id: 'python',
      label: 'Python',
      filename: 'quick-start.py',
      code: `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="sk-your-key",
)

stream = client.chat.completions.create(
    model="${DEFAULT_MODEL}",
    messages=[{"role": "user", "content": ${t('mk.landing.code.prompt.python')}}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
    },
    {
      id: 'curl',
      label: 'cURL',
      filename: 'request.sh',
      code: `curl ${endpoint} \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DEFAULT_MODEL}",
    "messages": [{"role": "user", "content": ${t('mk.landing.code.prompt.curl')}}],
    "stream": true
  }'`,
    },
    {
      id: 'ts',
      label: 'JS / TS',
      filename: 'index.ts',
      code: `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${baseUrl}',
  apiKey: process.env.API_KEY,
})

const stream = await client.chat.completions.create({
  model: '${DEFAULT_MODEL}',
  messages: [{ role: 'user', content: ${t('mk.landing.code.prompt.ts')} }],
  stream: true,
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '')
}`,
    },
    {
      id: 'go',
      label: 'Go',
      filename: 'main.go',
      code: `package main

import (
	"context"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig("sk-your-key")
	config.BaseURL = "${baseUrl}"
	client := openai.NewClientWithConfig(config)

	stream, err := client.CreateChatCompletionStream(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "${DEFAULT_MODEL}",
			Messages: []openai.ChatCompletionMessage{
				{Role: "user", Content: ${t('mk.landing.code.prompt.go')}},
			},
		},
	)
	if err != nil {
		panic(err)
	}
	defer stream.Close()

	for {
		chunk, err := stream.Recv()
		if err != nil {
			break
		}
		fmt.Print(chunk.Choices[0].Delta.Content)
	}
}`,
    },
    {
      id: 'rust',
      label: 'Rust',
      filename: 'main.rs',
      code: `use async_openai::{config::OpenAIConfig, types::*, Client};
use futures_util::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = OpenAIConfig::new()
        .with_api_base("${baseUrl}")
        .with_api_key("sk-your-key");
    let client = Client::with_config(config);

    let mut stream = client
        .chat()
        .create_stream(CreateChatCompletionRequest {
            model: "${DEFAULT_MODEL}".to_string(),
            messages: vec![ChatCompletionRequestUserMessage::from(${t('mk.landing.code.prompt.rust')})],
            stream: Some(true),
            ..Default::default()
        })
        .await?;

    while let Some(chunk) = stream.next().await {
        if let Some(text) = chunk?.choices[0].delta.content.clone() {
            print!("{text}");
        }
    }
    Ok(())
}`,
    },
  ]
}

export const SIMULATED_RESPONSE_KEY = 'mk.landing.code.simulated'
