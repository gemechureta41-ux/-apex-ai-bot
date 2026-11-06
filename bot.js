const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('9296660841:AAFo6BJF8Cn1xxcH7V4ngbSUTS8MN8SjdWQ');

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
