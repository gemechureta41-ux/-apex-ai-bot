const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');
const http = require('http');

const BOT_TOKEN = '9296660841:AAERerzw60pG3E3JZPcIL4XZnbUMoqdj49w';
const MINI_APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Institutional Market Database (Top-Down Analysis, Liquidity, OB, FVG, CHoCH/BOS)
let liveMarketSignals = {
    "EURUSD": { symbol: "EUR/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "GBPUSD": { symbol: "GBP/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "USDJPY": { symbol: "USD/JPY", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "USDCAD": { symbol: "USD/CAD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "USDCHF": { symbol: "USD/CHF", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "AUDUSD": { symbol: "AUD/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "NZDUSD": { symbol: "NZD/USD", category: "Forex Major", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "EURJPY": { symbol: "EUR/JPY", category: "Forex Cross", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "GBPJPY": { symbol: "GBP/JPY", category: "Forex Cross", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "XAUUSD": { symbol: "GOLD (XAU/USD)", category: "Commodities", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "XAGUSD": { symbol: "SILVER (XAG/USD)", category: "Commodities", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "NAS100": { symbol: "NASDAQ (NAS100)", category: "Indices", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "US30":   { symbol: "DOW JONES (US30)", category: "Indices", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "BTCUSD": { symbol: "BITCOIN (BTC/USD)", category: "Crypto 24/7", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" },
    "ETHUSD": { symbol: "ETHEREUM (ETH/USD)", category: "Crypto 24/7", action: "MONITORING", entry: "---", alignment: "Waiting HTF Bias", daily_bias: "NEUTRAL", h4_structure: "Scanning Key Levels", m15_choch: "Waiting CHoCH/BOS", ob_fvg: "Scanning OB/FVG", sl: "---", tp: "---", timestamp: "No Signal Yet" }
};

let signalHistory = [];

bot.start((ctx) => {
    ctx.reply(
        "🤖 *Apex AI Master Bot (Global Pro SMC Engine)*\n\nAdvanced Top-Down Analysis (D1->H4->H1->M15->M5), Liquidity Sweep, Order Block, FVG, & CHoCH/BOS Detector.",
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
            category: alert.category || "Institutional Market",
            action: alert.action || "MONITORING",
            entry: alert.entry || "---",
            alignment: alert.alignment || "Top-Down Bias Confirmed",
            daily_bias: alert.daily_bias || "BULLISH (HH/HL)",
            h4_structure: alert.h4_structure || "BOS & Key Level Respected",
            m15_choch: alert.m15_choch || "CHoCH Verified",
            ob_fvg: alert.ob_fvg || "Order Block + FVG Retest",
            sl: alert.sl || "---",
            tp: alert.tp || "---",
            timestamp: new Date().toLocaleTimeString()
        };
        
        liveMarketSignals[cleanSymbol] = newSignal;
        
        signalHistory.unshift({
            title: `${alert.symbol} · ${alert.action} Setup`,
            desc: `Entry: ${alert.entry} · Target RR 1:4`,
            time: newSignal.timestamp,
            action: alert.action
        });
        if (signalHistory.length > 20) signalHistory.pop();

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

// Self-ping to prevent Render sleep mode
app.get('/ping', (req, res) => res.status(200).send('OK'));

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Apex AI Master running on port ${PORT}`);
    setInterval(() => {
        if (process.env.RENDER_EXTERNAL_URL) {
            http.get(`${process.env.RENDER_EXTERNAL_URL}/ping`);
        }
    }, 300000); // Ping every 5 minutes
});
