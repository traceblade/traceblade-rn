import { BASE_URL } from '../constants/api';

export const getPath = (path: string, baseUrl: string) => {
  if (baseUrl) {
    const url = `${baseUrl}${path}`;
    console.log('url', url);
    return url;
  }
  return `${BASE_URL}/${path}`;
};
