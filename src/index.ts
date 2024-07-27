import ccxt from 'ccxt';
import { SMA, RSI, MACD } from 'technicalindicators';
import {MACDOutput} from "technicalindicators/declarations/generated";

interface MarketData {
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const fetchMarketData = async (symbol: string, timeframe: string, limit: number): Promise<MarketData[]> => {
    const exchange = new ccxt.mexc();

    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);

    return ohlcv.map(candle => ({
        timestamp: new Date(candle[0] as number),
        open: candle[1] as number,
        high: candle[2] as number,
        low: candle[3] as number,
        close: candle[4] as number,
        volume: candle[5] as number
    }));
};

const calculateSMA = (data: number[], period: number): number[] => {
    return SMA.calculate({ period, values: data });
};

const calculateRSI = (data: number[], period: number): number[] => {
    return RSI.calculate({ period, values: data });
};

interface MACDResult {
    MACD: number | undefined;
    signal: number | undefined;
}

const calculateMACD = (data: number[]): number[] => {
    const macd: MACDOutput[] = MACD.calculate({
        values: data,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    });
    return macd.map(val => (val.MACD !== undefined && val.signal !== undefined ? val.MACD - val.signal : 0));
};

const analyzeData = (data: MarketData[]): any[] => {
    const closePrices = data.map(d => d.close);

    const sma50 = calculateSMA(closePrices, 50);
    const sma200 = calculateSMA(closePrices, 200);
    const rsi = calculateRSI(closePrices, 14);
    const macd = calculateMACD(closePrices);

    return data.slice(199).map((d, i) => ({
        ...d,
        sma50: sma50[i],
        sma200: sma200[i],
        rsi: rsi[i],
        macd: macd[i],
        signal: sma50[i] > sma200[i] ? 1 : 0
    })).filter(d => d.signal === 1);
};

const main = async () => {
    const symbol = 'BTC/USDT';
    const timeframe = '1h';
    const limit = 250;

    const marketData = await fetchMarketData(symbol, timeframe, limit);
    const analyzedData = analyzeData(marketData);

    console.log('Promising Pairs test:', analyzedData);
};

main();
