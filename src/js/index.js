import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api.js';

let lightbox;
let isLoading = false;

function renderImages(images) {
  const gallery = document.querySelector('.gallery');
  images.forEach(image => {
    const imgElement = document.createElement('div');
    imgElement.classList.add('photo-card');
    imgElement.innerHTML = `
            <a href="${image.largeImageURL}" target="_blank">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
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

document
  .getElementById('search-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const query = e.target.searchQuery.value.trim();
    if (!query) return;

    document.querySelector('.gallery').innerHTML = '';

    try {
      isLoading = true;
      const data = await fetchImages(query);
      isLoading = false;

      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (data.totalHits === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} image.`);
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      renderImages(data.hits);

      if (lightbox) {
        lightbox.refresh();
      } else {
        lightbox = new SimpleLightbox('.gallery a', {});
      }
    } catch (error) {
      isLoading = false;
      Notiflix.Notify.failure('An error occurred. Please try again.');
    }
  });

window.addEventListener('scroll', async function () {
  const query = document.getElementById('search-form').searchQuery.value.trim();
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    !isLoading
  ) {
    try {
      isLoading = true;
      const data = await fetchImages(query);
      isLoading = false;

      renderImages(data.hits);

      if (lightbox) {
        lightbox.refresh();
      } else {
        lightbox = new SimpleLightbox('.gallery a', {});
      }
    } catch (error) {
      isLoading = false;
      Notiflix.Notify.failure('An error occurred. Please try again.');
    }
  }
});
