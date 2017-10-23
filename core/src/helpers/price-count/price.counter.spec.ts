import { expect } from 'chai'
import { PriceCounter } from './price.counter';
import { PriceInterface } from '../../database/models/room.model';

describe ('Total price counter tests', () => {

    it ('1 hour; 250 p/h; expect total === 250', done => {
        const fakeMinutes = 1
        const fakeMaxPrice = 650
        const fakePriceObj: Array<PriceInterface> = [
            {
                isFixed: true,
                price: 250
            }
        ]
        const total = PriceCounter.countPrice(
            fakePriceObj,
            fakeMinutes,
            fakeMaxPrice
        )
        expect(total).to.equal(250)
        done()
    })

    it ('fakeMinutes > prices', done => {
        const fakeMinutes = 2.55
        const fakeMaxPrice = 700
        const fakePriceObj: Array<PriceInterface> = [
            {
                isFixed: true,
                price: 250
            },
            {
                isFixed: false,
                price: 2.5
            }
        ]
        const total = PriceCounter.countPrice(
            fakePriceObj,
            fakeMinutes,
            fakeMaxPrice
        )
        expect(total).to.equal(400)
        done()
    })

    it ('total > maxPrice;', done => {
        const fakeMinutes = 1.55
        const fakeMaxPrice = 700
        const fakePriceObj: Array<PriceInterface> = [
            {
                isFixed: true,
                price: 550
            },
            {
                isFixed: false,
                price: 5
            }
        ]
        const total = PriceCounter.countPrice(
            fakePriceObj,
            fakeMinutes,
            fakeMaxPrice
        )

        expect(total).to.equal(fakeMaxPrice)
        done()
    })

    it ('diff != 60', done => {
        const fakeMinutes = 2.55
        const fakeMaxPrice = 700
        const fakePriceObj: Array<PriceInterface> = [
            {
                isFixed: true,
                price: 250
            },
            {
                isFixed: false,
                price: 2.5
            },
            {
                isFixed: false,
                price: 1.5
            }
        ]
        const total = PriceCounter.countPrice(
            fakePriceObj,
            fakeMinutes,
            fakeMaxPrice
        )

        expect(total).to.equal(482.5)
        done()
    })
})