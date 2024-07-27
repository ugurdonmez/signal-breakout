// src/breakout.ts

import { SMA, RSI, MACD } from 'technicalindicators';
import { MarketData } from './marketData';
import {MACDOutput} from "technicalindicators/declarations/generated";

interface MACDResult {
    MACD: number | undefined;
    signal: number | undefined;
}

const calculateSMA = (data: number[], period: number): number[] => {
    return SMA.calculate({ period, values: data });
};

const calculateRSI = (data: number[], period: number): number[] => {
    return RSI.calculate({ period, values: data });
};

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

export const identifyBreakouts = (data: MarketData[], lookbackPeriod: number, volumeThreshold: number): any[] => {
    const breakouts: any[] = [];

    for (let i = lookbackPeriod; i < data.length; i++) {
        const currentData = data[i];
        const previousData = data.slice(i - lookbackPeriod, i);

        const highestHigh = Math.max(...previousData.map(d => d.high));
        const lowestLow = Math.min(...previousData.map(d => d.low));

        // Check for breakout above resistance
        if (currentData.close > highestHigh && currentData.volume > volumeThreshold) {
            breakouts.push({
                timestamp: currentData.timestamp,
                type: 'Bullish Breakout',
                price: currentData.close,
                volume: currentData.volume
            });
        }

        // Check for breakdown below support
        if (currentData.close < lowestLow && currentData.volume > volumeThreshold) {
            breakouts.push({
                timestamp: currentData.timestamp,
                type: 'Bearish Breakdown',
                price: currentData.close,
                volume: currentData.volume
            });
        }
    }

    return breakouts;
};
