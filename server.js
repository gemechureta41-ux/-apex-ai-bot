const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '9296660841:AAERerzw60pG3E3JZPcIL4XZnbUMoqdj49w';

// Note: Render URL kee yeroo deploy goote asitti jijjirreessita (fkn: https://apex-ai-bot.onrender.com)
const MINI_APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let currentSMCData = {
    symbol: "EUR/USD",
    action: "BUY",
    entry: "1.08520",
    trend: "Bullish (4H)",
    liquidity: "SSL Swept",
    structure: "CHoCH Confirmed",
    order_block: "Valid OB (15m)",
    fvg: "Active FVG",
    session: "London / NY",
    timestamp: new Date().toLocaleTimeString()
};

bot.start((ctx) => {
    ctx.reply(
        "🤖 *Welcome to Apex AI Bot*\n\nSmart Money Concepts (SMC) & Institutional Price Action Analysis Engine.",
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("⚡ Launch Apex AI Mini App", MINI_APP_URL)]
            ])
        }
    );
});

app.post('/webhook/tradingview', (req, res) => {
    const alert = req.body;
    if (alert) {
        currentSMCData = {
            symbol: alert.symbol || "EUR/USD",
            action: alert.action || "BUY",
            entry: alert.entry || "Market Price",
            trend: alert.trend || "Bullish",
            liquidity: alert.liquidity || "Swept",
            structure: alert.structure || "BOS/CHoCH",
            order_block: alert.ob || "OB Valid",
            fvg: alert.fvg || "Active FVG",
            session: alert.session || "Active",
            timestamp: new Date().toLocaleTimeString()
        };
        console.log("TradingView Alert Haaraa Dhufe:", currentSMCData);
        return res.status(200).json({ status: "success" });
    }
    res.status(400).json({ status: "error" });
});

app.get('/api/signal', (req, res) => {
    res.json(currentSMCData);
});

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apex AI Bot running on port ${PORT}`));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
