import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const input = document.querySelector('input');

const search = event => {
  const searchImage = input.value;
  event.preventDefault();
  const url = `https://pixabay.com/api/?key=13558836-548568db06f41293b437b04a2&q=${searchImage}&image_type=photo$orientation=horizontal$safesearch=true`;
  const list = document.querySelector('.gallery');
  const clear = document.querySelector('.gallery>ul');
  if (clear !== null) {
    clear.remove();
  }
  axios
    .get(`${url}`)
    .then(function (response) {
      const photoList = document.createElement('ul');
      const resultLength = response.data.hits.length;
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
          `<img   object-fit: cover
          width: 100%
          height: 80% src = "${photos[i].webformatURL} loading="lazy"" 
          alt = "${photos[i].tags}"/> <div class="info"> 
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
        photoList.append(link);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};

const btn = document.querySelector('button');
btn.addEventListener('click', search);
