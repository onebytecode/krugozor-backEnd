import { PriceCounter } from './price.counter';
import { TimeTransformHelper } from '../time-transform.helper';
import { PriceInterface } from '../../database/models/room.model';

export class TotalPriceCounter {
    public static countPrice(
        prices: Array<PriceInterface>,
        startDate: Date,
        endDate: Date,
        maxPrice: number
    ): number {
        const minutes = this.getMinutes(startDate, endDate);
        const adaptiveMinutes = TimeTransformHelper.fromMinutesToAdaptiveMinutes(minutes);
        const price = PriceCounter.countPrice(prices, adaptiveMinutes, maxPrice);

        return price;
    }

    private static getMinutes(startDate: Date, endDate: Date): number {
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        const seconds = (endTime - startTime) / 1000;
        const minutes = seconds / 60;
        
        return minutes;
    }
}
