import ccxt from 'ccxt';

export interface MarketData {
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export const fetchMarketData = async (symbol: string, timeframe: string, limit: number): Promise<MarketData[]> => {
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
