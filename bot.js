const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { message } = req.body;

  // Проверяем, что запрос пришел от Telegram
  if (!message) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const chatId = message.chat.id;
  const text = message.text;

  // Поиск в базе знаний Битрикс24
  const bitrixResponse = await fetch('https://your_bitrix24_domain/rest/1/your_api_key/knowledgebase.article.list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter: { SEARCH_CONTENT: text }
    })
  });

  const articles = await bitrixResponse.json();

  // Отправка ответа в Telegram
  const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: articles.result.length ? articles.result[0].TITLE : 'Ничего не найдено.'
    })
  });

  res.status(200).json({ ok: true });
};
