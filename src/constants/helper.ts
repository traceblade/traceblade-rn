
import { BASE_URL  } from "../constants/api";

export const getPath = (path: string) => {
    return `${BASE_URL}/${path}`;
}