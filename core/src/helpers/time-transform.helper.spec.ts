import { expect } from 'chai';
import { TimeTransformHelper } from './time-transform.helper';
const { fromMinutesToAdaptiveMinutes } = TimeTransformHelper

describe ('Time transform helper tests', () => {
    it ('120 mins => 2', done => {
        const result = fromMinutesToAdaptiveMinutes(120)
        expect(result).to.equal(2)
        done()
    })

    it ('273 mins => 4.33', done => {
        const result = fromMinutesToAdaptiveMinutes(273)
        expect(result).to.equal(4.33)
        done()
    })

    it ('47', done => {
        const result = fromMinutesToAdaptiveMinutes(47)
        expect(result).to.equal(0.47)
        done()
    })
})
