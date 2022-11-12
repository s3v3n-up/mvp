// A function that converts dates to string format ("yyyy-dd-mm")
export function dateConverter(date: Date, showTime = false): string {
    const convertedDate = new Date(date)
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");

    const convertedTime = new Date(date)
        .toLocaleTimeString("en-GB", { hour12: true });

    return !showTime?
        convertedDate:
        `${convertedDate} ${convertedTime}`;
}

/**
 * convert date to utc and get time in milliseconds
 * @param date - Date to get the time from
 * @returns - number of milliseconds
 */
export function getUTCTime(date: Date | string): number {
    let inputDate: Date = new Date(date);
    if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid date");
    }

    //convert to UTC and get time in milliseconds
    const convertedDate = new Date(inputDate.toUTCString()).getTime();

    return convertedDate;
}

/**
 * convert date to local date and get time in milliseconds
 * @param date - Date to get the time from
 * @returns - number of milliseconds
 */
export function getLocaleTime(date: Date | string): number {
    let inputDate: Date = new Date(date);
    if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid date");
    }

    //convert to UTC and get time in milliseconds
    const convertedDate = new Date(inputDate).getTime();

    return convertedDate;
}

/**
 * alternative to setInterval
 * @param callback - callback function to repeat
 * @param interval - interval in milliseconds(default: 1000)
 * @returns function to stop the interval
 * @see https://blog.bitsrc.io/how-to-get-an-accurate-setinterval-in-javascript-ca7623d1d26a
 */
export function alterSetInterval(callback: Function, interval = 1000) {
    let counter = 1;
    let timeoutId: NodeJS.Timeout | number;
    const startTime = Date.now();

    function main() {
        const nowTime = Date.now();
        const nextTime = startTime + counter * interval;
        timeoutId = setTimeout(main, interval - (nowTime - nextTime));
        counter += 1;
        callback();
    }

    timeoutId = setTimeout(main, interval);

    return () => {
        clearTimeout(timeoutId);
    };
}

