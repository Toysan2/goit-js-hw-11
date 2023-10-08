import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '9553753-ea4dda346b6c3bb2d3db6490b';

let page = 1;

async function fetchImages(query) {
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

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImages(response.data.hits);
      page++;
    }

    if (page * 40 >= response.data.totalHits) {
      document.querySelector('.load-more').style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      document.querySelector('.load-more').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('An error occurred. Please try again.');
  }
}

function renderImages(images) {
  const gallery = document.querySelector('.gallery');
  images.forEach(image => {
    const imgElement = document.createElement('div');
    imgElement.classList.add('photo-card');
    imgElement.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes:</b> ${image.likes}
                </p>
                <p class="info-item">
                    <b>Views:</b> ${image.views}
                </p>
                <p class="info-item">
                    <b>Comments:</b> ${image.comments}
                </p>
                <p class="info-item">
                    <b>Downloads:</b> ${image.downloads}
                </p>
            </div>
        `;
    gallery.appendChild(imgElement);
  });
}

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = e.target.searchQuery.value.trim();
  if (!query) return;
  page = 1; // Reset the page counter
  document.querySelector('.gallery').innerHTML = ''; // Clear previous images
  fetchImages(query);
});

document.querySelector('.load-more').addEventListener('click', function () {
  const query = document.getElementById('search-form').searchQuery.value.trim();
  fetchImages(query);
});
