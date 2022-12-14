import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('input');

const photoPerPage = 40;
let page = 1;

const search = async event => {
  loadMoreBtn.style.display = 'none';
  const searchImage = input.value;
  event.preventDefault();
  const url = `https://pixabay.com/api/?key=13558836-548568db06f41293b437b04a2&q=${searchImage}&image_type=photo$orientation=horizontal$per_page=${photoPerPage}$page=${page}$safesearch=true`;
  const list = document.querySelector('.gallery');
  const renderedPhoto = document.querySelector('.gallery>ul');
  if (renderedPhoto !== null) {
    page = 1;
    renderedPhoto.remove();
  }

  await axios
    .get(`${url}`)
    .then(function (response) {
      const photoList = document.createElement('ul');
      photoList.className = 'gallery-list';
      const resultLength = response.data.hits.length;
      const totalHits = response.data.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      const photos = response.data.hits;
      list.append(photoList);
      if (resultLength === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      for (let i = 0; i < resultLength; i++) {
        const link = document.createElement('div');
        link.className = 'photo-card';
        link.insertAdjacentHTML(
          'beforeend',
          `<a> <img  src = "${photos[i].webformatURL} loading="lazy"" 
          alt = "${photos[i].tags}"/> </a>
          <div class="info"> 
          <p class="info-item">
          <b>Likes</b>
          ${photos[i].likes}
          </p>
          <p class="info-item">
          <b>Views</b>
          ${photos[i].views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${photos[i].comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${photos[i].downloads}
            </p>
            </div>`
        );
        link.href = `${photos[i].webformatURL}`;
        photoList.append(link);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      loadMoreBtn.style.display = 'block';
      refresh();
    });
};

const loadMore = event => {
  page++;
  const searchImage = input.value;
  const url = `https://pixabay.com/api/?key=13558836-548568db06f41293b437b04a2&q=${searchImage}&image_type=photo$orientation=horizontal$per_page=${photoPerPage}$page=${page}$safesearch=true`;
  const renderedPhoto = document.querySelector('.gallery>ul');

  axios
    .get(`${url}`)
    .then(function (response) {
      const resultLength = response.data.hits.length;
      const photos = response.data.hits;
      const elementCount = renderedPhoto.childElementCount + photoPerPage;
      if (resultLength === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      for (let i = 0; i < resultLength; i++) {
        const link = document.createElement('div');
        link.className = 'photo-card';
        link.insertAdjacentHTML(
          'beforeend',
          `<a> <img  src = "${photos[i].webformatURL} loading="lazy"" 
          alt = "${photos[i].tags}"/> </a>
          <div class="info">
          <p class="info-item">
          <b>Likes</b>
          ${photos[i].likes}
          </p>
          <p class="info-item">
          <b>Views</b>
          ${photos[i].views}
            </p>
            <p class="info-item">
            <b>Comments</b>
            ${photos[i].comments}
          </p>
          <p class="info-item">
          <b>Downloads</b>
          ${photos[i].downloads}
          </p>
          </div>`
        );
        renderedPhoto.append(link);
      }
      console.log(elementCount);
      if (elementCount >= response.data.totalHits) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.style.display = 'none';
        return false;
      }
      const { height: cardHeight } = document
        .querySelector('.gallery-list')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      refresh();
    });
};

const btn = document.querySelector('button[type="submit"]');
btn.addEventListener('click', search);

const loadMoreBtn = document.querySelector('button[type="button"]');
loadMoreBtn.style.display = 'none';
loadMoreBtn.addEventListener('click', loadMore);

let image = new simpleLightbox('.photo-card a', {
  captionDelay: 250,
  captionsData: 'alt',
});
