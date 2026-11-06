const { Telegraf, Markup } = require('telegraf');
const http = require('http');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(
        "Welcome to *Apex AI Bot*! 🚀\n\nTap the button below to open the Mini App and get real live trading signals for XAUUSD, EURUSD, and more:",
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("Open Apex AI Bot", "https://YOUR-RENDER-APP-URL.onrender.com")]
            ])
        }
    );
});

bot.launch();
console.log("Apex AI Bot is running...");

// Render port scan akka qabatuuf fi akka hin cufne HTTP Server banuu
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Apex AI Bot is active and running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
