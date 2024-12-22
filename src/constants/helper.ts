
import { BASE_URL  } from "../constants/api";

export const getPath = (path: string, baseUrl: string) => {
    if(baseUrl) {
        return `${baseUrl}/${path}`;
    }
    return `${BASE_URL}/${path}`;
}