const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '9296660841:AAERerzw60pG3E3JZPcIL4XZnbUMoqdj49w';
const MINI_APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let assetDatabase = {
    "EURUSD": { symbol: "EUR/USD", category: "Forex", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BULLISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "GBPUSD": { symbol: "GBP/USD", category: "Forex", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BULLISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "XAUUSD": { symbol: "GOLD (XAU/USD)", category: "Commodities", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BULLISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "NAS100": { symbol: "NASDAQ (NAS100)", category: "Indices", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BEARISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "US30": { symbol: "DOW JONES (US30)", category: "Indices", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BEARISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "BTCUSD": { symbol: "BITCOIN (BTC/USD)", category: "Crypto", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BULLISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "ETHUSD": { symbol: "ETHEREUM (ETH/USD)", category: "Crypto", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BULLISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" },
    "DXY": { symbol: "DOLLAR INDEX (DXY)", category: "Indices", action: "MONITORING", entry: "---", alignment: "UNALIGNED", daily_bias: "BULLISH", h4_structure: "Tracking", m15_choch: "Scanning", sl: "---", tp: "---" }
};

let activeSignal = assetDatabase["EURUSD"];

bot.start((ctx) => {
    ctx.reply(
        "🤖 *Apex AI SMC Alignment Bot*\n\nDaily -> 4H -> 15M Timeframe Alignment + Market Hours Countdown (Forex, Crypto, Indices).",
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
        
        assetDatabase[cleanSymbol] = {
            symbol: alert.symbol,
            category: alert.category || "Market",
            action: alert.action || "BUY/SELL",
            entry: alert.entry || "Market Price",
            alignment: alert.alignment || "FULL ALIGNED",
            daily_bias: alert.daily_bias || "BULLISH",
            h4_structure: alert.h4_structure || "BOS Confirmed",
            m15_choch: alert.m15_choch || "15M CHoCH Verified",
            sl: alert.sl || "---",
            tp: alert.tp || "---",
            timestamp: new Date().toLocaleTimeString()
        };
        
        activeSignal = assetDatabase[cleanSymbol];
        console.log(`[SMC Aligned Alert] ${alert.symbol}:`, activeSignal);
        return res.status(200).json({ status: "success" });
    }
    res.status(400).json({ status: "error" });
});

app.get('/api/signal', (req, res) => {
    const requestedSymbol = req.query.symbol;
    if (requestedSymbol && assetDatabase[requestedSymbol]) {
        return res.json(assetDatabase[requestedSymbol]);
    }
    res.json(activeSignal);
});

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apex AI Bot running on port ${PORT}`));
