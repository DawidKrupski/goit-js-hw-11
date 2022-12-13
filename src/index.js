import './css/styles.css';
import axios from 'axios';

const input = document.querySelector('input');

const search = event => {
  const searchImage = input.value;
  event.preventDefault();
  const url = `https://pixabay.com/api/?key=13558836-548568db06f41293b437b04a2&q=${searchImage}&image_type=photo`;
  axios
    .get(`${url}`)
    .then(function (response) {
      // handle success
      console.log(response);

      const resultLength = response.data.hits.length;
      const photos = response.data.hits;
      for (let i = 0; i < resultLength; i++) {
        const list = document.querySelector('photos');
        const li = document.createElement('li');
        list.append;
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
