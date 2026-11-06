const { Telegraf, Markup } = require('telegraf');
const http = require('http');
const fs = require('fs');
const path = require('path');

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

// HTTP Server isa index.html dubbisee Mini App agarsiisu
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
