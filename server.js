const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '9296660841:AAERerzw60pG3E3JZPcIL4XZnbUMoqdj49w';
const MINI_APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 15 Traded Assets Database (Forex Majors, Crosses, Commodities, Indices, Crypto)
let liveMarketSignals = {
    "EURUSD": { symbol: "EUR/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "GBPUSD": { symbol: "GBP/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "USDJPY": { symbol: "USD/JPY", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "USDCAD": { symbol: "USD/CAD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "USDCHF": { symbol: "USD/CHF", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "AUDUSD": { symbol: "AUD/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "NZDUSD": { symbol: "NZD/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "EURJPY": { symbol: "EUR/JPY", category: "Forex Cross", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "GBPJPY": { symbol: "GBP/JPY", category: "Forex Cross", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "XAUUSD": { symbol: "GOLD (XAU/USD)", category: "Commodities", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "XAGUSD": { symbol: "SILVER (XAG/USD)", category: "Commodities", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "NAS100": { symbol: "NASDAQ (NAS100)", category: "Indices", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "US30":   { symbol: "DOW JONES (US30)", category: "Indices", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "BTCUSD": { symbol: "BITCOIN (BTC/USD)", category: "Crypto 24/7", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "ETHUSD": { symbol: "ETHEREUM (ETH/USD)", category: "Crypto 24/7", action: "MONITORING", entry: "---", alignment: "Waiting Webhook Alert", daily_bias: "NEUTRAL", h4_structure: "Scanning BOS", m15_choch: "Waiting OB Retest", sl: "---", tp: "---", timestamp: "No Signal Yet" }
};

let signalHistory = [];

bot.start((ctx) => {
    ctx.reply(
        "🤖 *Apex AI Master Bot (Live SMC)*\n\nReal-time Supply/Demand, Order Block & BOS Analyzer (15 Assets Supported).",
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("⚡ Open Apex AI Mini App", MINI_APP_URL)]
            ])
        }
    );
});

app.post('/webhook/tradingview', (req, res) => {
    const alert = req.body;
    if (alert && alert.symbol) {
        const cleanSymbol = alert.symbol.replace('/', '').toUpperCase();
        
        const newSignal = {
            symbol: alert.symbol,
            category: alert.category || "Market",
            action: alert.action || "MONITORING",
            entry: alert.entry || "---",
            alignment: alert.alignment || "Live Confirmed",
            daily_bias: alert.daily_bias || "BULLISH",
            h4_structure: alert.h4_structure || "BOS Confirmed",
            m15_choch: alert.m15_choch || "OB Retest Verified",
            sl: alert.sl || "---",
            tp: alert.tp || "---",
            timestamp: new Date().toLocaleTimeString()
        };
        
        if (liveMarketSignals[cleanSymbol]) {
            liveMarketSignals[cleanSymbol] = newSignal;
        } else {
            liveMarketSignals[cleanSymbol] = newSignal; // Dynamic fallback
        }
        
        signalHistory.unshift({
            title: `${alert.symbol} · ${alert.action} Setup`,
            desc: `Entry: ${alert.entry} · Target RR 1:4`,
            time: newSignal.timestamp,
            action: alert.action
        });
        if (signalHistory.length > 15) signalHistory.pop();

        return res.status(200).json({ status: "success", data: newSignal });
    }
    res.status(400).json({ status: "error", message: "Invalid payload" });
});

app.get('/api/signal', (req, res) => {
    const requestedSymbol = req.query.symbol;
    if (requestedSymbol && liveMarketSignals[requestedSymbol]) {
        return res.json(liveMarketSignals[requestedSymbol]);
    }
    return res.json(liveMarketSignals["EURUSD"]);
});

app.get('/api/history', (req, res) => {
    res.json(signalHistory);
});

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apex AI Master running on port ${PORT}`));
