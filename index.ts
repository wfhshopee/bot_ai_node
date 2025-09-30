import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import OpenAI from "openai";

config(); // load .env

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!TELEGRAM_TOKEN || !OPENAI_API_KEY) {
  throw new Error("Missing TELEGRAM_TOKEN or OPENAI_API_KEY");
}

// Inisialisasi Telegram Bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Inisialisasi OpenAI
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Handler pesan masuk
bot.on("message", async (msg) => {
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const userText = msg.text;

  try {
    // Kirim typing action
    bot.sendChatAction(chatId, "typing");

    // Generate balasan AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userText }],
      max_tokens: 512,
    });

    const aiReply = completion.choices[0].message?.content ?? "⚠️ AI tidak merespon";
    bot.sendMessage(chatId, aiReply);
  } catch (err) {
    bot.sendMessage(chatId, `⚠️ Error AI: ${err}`);
  }
});
