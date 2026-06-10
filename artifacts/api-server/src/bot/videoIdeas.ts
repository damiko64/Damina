import Groq from "groq-sdk";
import { logger } from "../lib/logger";

const groq = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

export async function generateVideoIdeas(topic: string): Promise<string> {
  logger.info({ topic }, "Generating video ideas");

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Ты эксперт по созданию вирусного контента для YouTube, TikTok и других видеоплатформ. 
Твоя задача — генерировать конкретные, цепляющие идеи для видео на основе темы или ниши пользователя.

Формат ответа — строго:
🎬 *Идея 1: [Заголовок]*
📝 [Краткое описание — 1-2 предложения о чём видео и почему оно зайдёт аудитории]
🎯 Формат: [тип видео — обзор/топ/туториал/влог/реакция/эксперимент и т.д.]

Генерируй 5 идей. Заголовки должны быть цепляющими, конкретными и вызывать желание кликнуть. Используй числа, интригу, личный опыт. Не давай банальных советов.`,
      },
      {
        role: "user",
        content: `Тема/ниша: ${topic}`,
      },
    ],
    temperature: 0.9,
    max_tokens: 1500,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from Groq");
  }

  return content;
}
