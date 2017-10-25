import { expect } from 'chai';
import { TotalPriceCounter } from './total-price.counter';
import { PriceInterface } from '../../database/models/room.model';

describe('Total price counter tests', () => {
    it ('should get price for 5 minutes', function(done) {
        const fakeMaxPrice = 650
        const fakePriceObj: Array<PriceInterface> = [
            {
                isFixed: true,
                price: 250
            }
        ]
        const fakeStartDate = new Date('2017-01-01T14:30')
        const fakeEndDate   = new Date('2017-01-01T14:35')

        const result = TotalPriceCounter.countPrice(fakePriceObj, fakeStartDate, fakeEndDate, fakeMaxPrice);

        expect(result).to.equal(250);
        done();
    })

    it('should get price for 3 hours 43 minutes', function(done) {
        const fakeMaxPrice = 1000
        const fakePriceObj: Array<PriceInterface> = [
            {
                isFixed: true,
                price: 250
            },
            {
                isFixed: false,
                price: 5
            }, {
                isFixed: false,
                price: 3
            }
        ]
        const fakeStartDate = new Date('2017-01-01T14:30')
        const fakeEndDate   = new Date('2017-01-01T17:43')

        const result = TotalPriceCounter.countPrice(fakePriceObj, fakeStartDate, fakeEndDate, fakeMaxPrice);

        expect(result).to.equal(730);

        done()
    })
})
