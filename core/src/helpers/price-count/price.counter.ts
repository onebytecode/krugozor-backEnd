import { PriceInterface } from '../../database/models/room.model';

export class PriceCounter {

    static countPrice(
        prices: Array<PriceInterface>, 
        minutes: number,
        maxPrice: number): number {
        let total = 0;
        for (let i = 0; i < minutes; i++) {
            const diff = Math.abs(minutes - i);
            const priceObj = prices[i];
            if (!priceObj) break;
            if (diff < 1) {
                const minsDiff = diff * 100;
                if (priceObj.isFixed) {
                    total += priceObj.price;
                } else {
                    total += priceObj.price*minsDiff; 
                }
            } else {
                if (priceObj.isFixed) {
                    total += priceObj.price;
                } else {
                    total += priceObj.price*60; 
                }
            }
        }

        if (total > maxPrice) return maxPrice;
        return total;
    }
}
