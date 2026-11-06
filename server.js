const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '9296660841:AAERerzw60pG3E3JZPcIL4XZnbUMoqdj49w';
const MINI_APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let smcSignals = {
    "EURUSD": { symbol: "EUR/USD", action: "MONITORING", entry: "---", structure_4h: "Waiting 4H Zone", choch_15m: "Scanning CHoCH", sl: "---", tp1: "---", tp2: "---" },
    "XAUUSD": { symbol: "GOLD (XAU/USD)", action: "MONITORING", entry: "---", structure_4h: "Waiting 4H Zone", choch_15m: "Scanning CHoCH", sl: "---", tp1: "---", tp2: "---" },
    "NAS100": { symbol: "NASDAQ (NAS100)", action: "MONITORING", entry: "---", structure_4h: "Waiting 4H Zone", choch_15m: "Scanning CHoCH", sl: "---", tp1: "---", tp2: "---" },
    "DXY": { symbol: "DXY (Dollar Index)", action: "MONITORING", entry: "---", structure_4h: "Waiting 4H Zone", choch_15m: "Scanning CHoCH", sl: "---", tp1: "---", tp2: "---" }
};

let activeSignal = smcSignals["EURUSD"];

bot.start((ctx) => {
    ctx.reply(
        "🤖 *Apex AI SMC Master Engine*\n\n4H Supply/Demand & 15M CHoCH + FVG + OB + RR 1:4 (Partial & Full TP) Live Analyzer.",
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("⚡ Open SMC Mini App", MINI_APP_URL)]
            ])
        }
    );
});

app.post('/webhook/tradingview', (req, res) => {
    const alert = req.body;
    if (alert && alert.symbol) {
        const cleanSymbol = alert.symbol.replace('/', '').toUpperCase();
        
        smcSignals[cleanSymbol] = {
            symbol: alert.symbol,
            action: alert.action || "BUY/SELL",
            entry: alert.entry || "Market Price",
            structure_4h: alert.structure_4h || "4H Level Confirmed",
            choch_15m: alert.choch_15m || "CHoCH Verified",
            sl: alert.sl || "---",
            tp1: alert.tp1 || "---",
            tp2: alert.tp2 || "---",
            timestamp: new Date().toLocaleTimeString()
        };
        
        activeSignal = smcSignals[cleanSymbol];
        console.log(`[SMC Master Alert] ${alert.symbol}:`, activeSignal);
        return res.status(200).json({ status: "success" });
    }
    res.status(400).json({ status: "error" });
});

app.get('/api/signal', (req, res) => {
    const requestedSymbol = req.query.symbol;
    if (requestedSymbol && smcSignals[requestedSymbol]) {
        return res.json(smcSignals[requestedSymbol]);
    }
    res.json(activeSignal);
});

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apex AI Bot running on port ${PORT}`));
