# Бот идей для видео

Telegram бот, который генерирует идеи для видео с помощью ИИ (Groq / Llama 3.3).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — запустить сервер и бота (port 5000)
- `pnpm run typecheck` — проверка типов
- `pnpm run build` — сборка всех пакетов

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Telegram: node-telegram-bot-api (polling mode)
- ИИ: Groq SDK (модель llama-3.3-70b-versatile)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/bot/index.ts` — логика Telegram бота, команды /start /help
- `artifacts/api-server/src/bot/videoIdeas.ts` — запросы к Groq API, системный промпт
- `artifacts/api-server/src/index.ts` — точка входа, запускает сервер + бота

## Architecture decisions

- Бот запускается в режиме polling (не webhook) — проще для разработки, не требует публичного URL
- Groq используется вместо OpenAI — быстрее и бесплатно в разумных лимитах
- Бот встроен в существующий Express сервер — один процесс, один workflow

## Product

Пользователь пишет тему или нишу → бот отвечает 5 идеями для видео с заголовками, описаниями и форматом.

## User preferences

_Populate as you build._

## Gotchas

- При смене TELEGRAM_BOT_TOKEN нужно перезапустить workflow
- Polling mode не работает если два экземпляра бота запущены одновременно

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
