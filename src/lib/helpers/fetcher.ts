import axios from "axios";

export default async function fetcher(url: string) {
    const response = await axios.get(url);

    return response.data;
};