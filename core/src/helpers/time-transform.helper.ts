
export class TimeTransformHelper {

    public static fromMinutesToAdaptiveMinutes(minutes: number): number {
        let result = 0;
        const hours = minutes/60;
        if (hours < 1) return parseFloat(`0.${minutes}`);
        const mins = minutes - parseInt(hours.toString())*60;
        result = parseFloat(`${parseInt(hours.toString())}.${mins}`);
        return result;
    }
}
