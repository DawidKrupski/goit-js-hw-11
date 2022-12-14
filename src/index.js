import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('input');
const btn = document.querySelector('button[type="submit"]');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

const photoPerPage = 40;
let page = '1';
const apiKey = '13558836-548568db06f41293b437b04a2';

const search = async event => {
  loadMoreBtn.style.display = 'none';
  const searchImage = input.value;
  event.preventDefault();
  const list = document.querySelector('.gallery');
  const renderedPhoto = document.querySelector('.gallery>ul');

  if (renderedPhoto !== null && event.target === btn) {
    renderedPhoto.remove();
    page = 1;
  }
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchImage}&image_type=photo&orientation=horizontal&per_page=${photoPerPage}&page=${page}&safesearch=true`;

  await axios
    .get(`${url}`)
    .then(function (response) {
      const photoList = document.createElement('ul');
      const resultLength = response.data.hits.length;
      const totalHits = response.data.totalHits;
      const photos = response.data.hits;
      photoList.className = 'gallery-list';
      list.append(photoList);

      if (event.target === btn) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

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
          `<a href="${photos[i].webformatURL}"> 
            <img src="${photos[i].webformatURL} loading="lazy"
            alt = "${photos[i].tags}"/> 
          </a>
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
        const renderedPhoto = document.querySelector('.gallery>ul');
        const elementCount = renderedPhoto.childElementCount;
        loadMoreBtn.style.display = 'flex';
        if (event.target === loadMoreBtn || event === undefined) {
          renderedPhoto.append(link);
          if (elementCount >= response.data.totalHits) {
            Notiflix.Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
            loadMoreBtn.style.display = 'none';
          }
          const { height: cardHeight } = document
            .querySelector('.gallery-list')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        } else {
          photoList.append(link);
          if (elementCount + 1 >= response.data.total) {
            loadMoreBtn.style.display = 'none';
          }
        }
        lightbox.refresh();
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      page++;
    });
};

let lightbox = new simpleLightbox('.photo-card a', {
  captionDelay: 250,
  captionsData: 'alt',
});

btn.addEventListener('click', search);
loadMoreBtn.addEventListener('click', search);

const backTop = document.querySelector('.back-top');
window.onscroll = function () {
  scrollFunction();
  infiniteScroll();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backTop.style.display = 'block';
  } else {
    backTop.style.display = 'none';
  }
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

backTop.addEventListener('click', backToTop);

const infiniteScroll = event => {
  const switchMethod2 = document.querySelector('.switch-method input').checked;
  if (switchMethod2 === true) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMoreBtn.click();
    }
  } else {
    return false;
  }
};

const switchMethod = document.querySelector('.switch-method');
switchMethod.addEventListener('click', infiniteScroll);
