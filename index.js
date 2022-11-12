const axios = require("axios");
const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;

const bot = new TelegramApi(token, { polling: true });

bot.on("message", async (msg) => {
  let countryName = msg.text;
  let chatId = msg.chat.id;
  let data;

  if (msg.text === "/start") {
    bot.sendMessage(chatId, `Assalomu alaykum ${msg.from.first_name}`);
    bot.sendMessage(chatId, `Davlat nomini kiriting. Masalan: Turkey`);
  } else {
    await axios
      .get(`${BASE_URL}/${countryName}?fullText=true`)
      .then((res) => {
        data = res.data[0];
      })
      .catch((err) => {
        console.log(err);
      });
    if (data) {
      bot.sendPhoto(chatId, `${data.flags.png}`, {
        caption: `
Poytaxti: ${data.capital[0]}
Joylashuvi: ${data.continents}
Aholisi: ${data.population}
Valyutasi: ${Object.keys(data.currencies)[0]}
Umumiy tillari: ${Object.values(data.languages).map((item) => item)}
            `,
      });
    } else {
      bot.sendMessage(chatId, `Bunday davlat mavjud emas...`);
    }
  }
});
