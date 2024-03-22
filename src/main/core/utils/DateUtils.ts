/**
 * 两个时间相差的天数
 * @param date1 时间1
 * @param date2 时间2
 */
export function betweenDays(date1: Date, date2: Date): number {
    // 将差值转换为天数
    const differenceInDays = betweenMs(date1, date2) / (1000 * 60 * 60 * 24);

    return Math.round(differenceInDays);
}

/**
 * 两个时间相差的毫秒
 * @param date1 时间1
 * @param date2 时间2
 */
export function betweenMs(date1: Date, date2: Date): number {
    // 获取两个日期的时间戳
    const timestamp1 = date1.getTime();
    const timestamp2 = date2.getTime();

    return Math.abs(timestamp1 - timestamp2);
}

/**
 * 获取给定时间的那个月有多少天
 * @param date 时间
 */
export function getDaysInMonth(date: Date): number {
    let year = date.getFullYear();
    // 注意，这里获取的月份是从0开始的
    let month = date.getMonth();
    return new Date(year, month + 1, 0).getDate()
}
