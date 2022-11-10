// A function that converts dates to string format ("yyyy-dd-mm")
export default function dateConverter(date: Date, showTime = false): string {
    const convertedDate = new Date(date)
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");

    const convertedTime = new Date(date)
        .toLocaleTimeString("en-GB", { hour12: true });

    return !showTime? convertedDate: convertedDate + " " + convertedTime;
}