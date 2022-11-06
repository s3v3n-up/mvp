import axios from "axios";

/**
 * fetcher function for swr hook
 * @param url the url to fetch
 * @returns data from the fetch
 */
export default async function fetcher(url: string) {
    const response = await axios.get(url);

    return response.data;
};