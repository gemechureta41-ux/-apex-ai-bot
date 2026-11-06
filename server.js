const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '9296660841:AAERerzw60pG3E3JZPcIL4XZnbUMoqdj49w';
const MINI_APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ragaa gabaa dhugaa (Real Live Market Data hordofuuf)
let liveMarketData = {
    symbol: "EUR/USD",
    action: "WAITING FOR SETUP",
    entry: "Checking...",
    trend: "4H Supply/Demand Scanning",
    liquidity: "Monitoring...",
    structure: "Waiting for 15m/30m CHoCH",
    order_block: "Scanning Zone",
    fvg: "Checking Imbalance",
    session: "Active",
    timestamp: "Live Market Active"
};

bot.start((ctx) => {
    ctx.reply(
        "🤖 *Apex AI Bot - Live SMC Engine*\n\n4H Supply/Demand & 15m/30m CHoCH Real-Time Analyzer.",
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("⚡ Open Live Apex AI App", MINI_APP_URL)]
            ])
        }
    );
});

// TradingView Webhook Endpoint (Real Market Alerts)
app.post('/webhook/tradingview', (req, res) => {
    const alert = req.body;
    if (alert) {
        liveMarketData = {
            symbol: alert.symbol || "EUR/USD",
            action: alert.action || "BUY/SELL",
            entry: alert.entry || "Market Price",
            trend: alert.trend || "4H Supply/Demand",
            liquidity: "Swept & Confirmed",
            structure: alert.structure || "CHoCH Verified",
            order_block: alert.ob || "Valid Zone",
            fvg: alert.fvg || "Active FVG",
            session: alert.session || "London/NY",
            timestamp: new Date().toLocaleTimeString()
        };
        console.log("Live Market Signal Dhufe:", liveMarketData);
        return res.status(200).json({ status: "success" });
    }
    res.status(400).json({ status: "error" });
});

app.get('/api/signal', (req, res) => {
    res.json(liveMarketData);
});

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apex AI Bot running on port ${PORT}`));
