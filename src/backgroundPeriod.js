/** @param {Date} [date] */
export function getBackgroundPeriod(date = new Date()) {
    const hour = date.getHours();
    return hour >= 6 && hour < 20 ? 'day' : 'night';
}
