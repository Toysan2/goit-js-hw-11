import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '9553753-ea4dda346b6c3bb2d3db6490b';

let page = 1;

export async function fetchImages(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    page++;
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
