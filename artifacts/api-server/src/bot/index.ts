import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { generateVideoIdeas } from "./videoIdeas";

const WELCOME_MESSAGE = `👋 Привет! Я бот для генерации идей для видео.

Просто напиши мне тему или нишу — и я придумаю 5 крутых идей для видео!

Примеры запросов:
• фитнес для новичков
• путешествия по Азии
• кулинария для студентов
• криптовалюта простыми словами
• лайфхаки для работы из дома

Напиши свою тему — начнём! 🚀`;

const HELP_MESSAGE = `ℹ️ *Как пользоваться ботом:*

1. Напиши тему или нишу для видео
2. Получи 5 готовых идей с заголовками и описаниями

*Команды:*
/start — начать заново
/help — эта справка

Бот работает на ИИ и генерирует уникальные идеи каждый раз!`;

export function startBot(): TelegramBot {
  const token = process.env["TELEGRAM_BOT_TOKEN"];

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
  }

  const bot = new TelegramBot(token, { polling: true });

  logger.info("Telegram bot started");

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, WELCOME_MESSAGE);
    logger.info({ chatId, username: msg.from?.username }, "User started bot");
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, HELP_MESSAGE, { parse_mode: "Markdown" });
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    logger.info({ chatId, topic: text }, "Received topic request");

    const thinking = await bot.sendMessage(
      chatId,
      `⏳ Генерирую идеи для темы *"${text}"*...\n\nОбычно занимает 5-10 секунд.`,
      { parse_mode: "Markdown" },
    );

    try {
      const ideas = await generateVideoIdeas(text);

      await bot.deleteMessage(chatId, thinking.message_id);

      await bot.sendMessage(
        chatId,
        `💡 *Идеи для видео по теме: "${text}"*\n\n${ideas}\n\n---\n✍️ Хочешь ещё идеи? Напиши другую тему!`,
        { parse_mode: "Markdown" },
      );
    } catch (err) {
      logger.error({ err, chatId }, "Error generating video ideas");

      await bot.deleteMessage(chatId, thinking.message_id).catch(() => {});

      await bot.sendMessage(
        chatId,
        "❌ Что-то пошло не так. Попробуй ещё раз или напиши другую тему.",
      );
    }
  });

  bot.on("polling_error", (err) => {
    logger.error({ err }, "Telegram polling error");
  });

  return bot;
}
