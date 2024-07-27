import { fetchMarketData, MarketData } from './marketData';
import { identifyBreakouts } from './breakout';

const main = async () => {
    const symbol = 'BTC/USDT';
    const timeframe = '5m';
    const limit = 250;

    const marketData: MarketData[] = await fetchMarketData(symbol, timeframe, limit);
    const lookbackPeriod = 20;  // Lookback period to identify support/resistance
    const volumeThreshold = 1000;  // Minimum volume to confirm breakout

    const breakouts = identifyBreakouts(marketData, lookbackPeriod, volumeThreshold);

    console.log('Promising Pairs:', breakouts);
};

main();
