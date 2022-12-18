// Imports

import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { snowflakesToggle } from './snowflakes';

// Global variables

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');

const loadMoreBtn = document.querySelector('.load-more');
const toTopBtn = document.getElementById('to-top');
const snowflakesBtn = document.getElementById('snowflakes-btn');

loadMoreBtn.style.display = 'none';
toTopBtn.style.display = 'none';

// Search parameters

const parameters = {
    KEY: '31646288-d6f5eefd60163767746b31051',
    IMG_TYPE: 'photo',
    ORIENTATION: 'horizontal',
    SAFE_SEARCH: 'true',
    PER_PAGE: 40,
};

const { KEY, IMG_TYPE, ORIENTATION, SAFE_SEARCH, PER_PAGE } = parameters;

let currentPage = 1;
let value = '';
let totalPages;

// Lightbox setup
let lb = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

// Submit handler

const submitHandler = async event => {
    event.preventDefault();
    gallery.innerHTML = '';
    value = form.input.value;

    if (value.trim() === '') {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info('Please do not leave the search field empty');
        return;
    }

    fetchImages().then(function (response) {
        totalPages = Math.ceil(response.data.totalHits / PER_PAGE);
        if (response.data.totalHits > 0) {
            renderImages(response);
            loadMoreBtn.style.display = 'block';
            currentPage++;

            return Notiflix.Notify.success(
                `Hooray! We found ${response.data.totalHits} images matching your search.`
            );
        }
        Notiflix.Notify.info('Sorry, there are no images matching your search.');
    });
};

// Render images function

function renderImages(resp) {
    let markup = '';
    resp.data.hits.forEach(img => {
        markup += `<div class="img-container"><a href="${img.largeImageURL}">
       <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /></a>
       <p>${img.likes} <strong>likes</strong> | ${img.views} <strong>views</strong> </br> ${img.comments} <strong>comments</strong> | ${img.downloads} <strong>downloads</strong></p>
       </div>`;
    });
    gallery.insertAdjacentHTML('beforeend', markup);
    lb.refresh();
}

// Fetch images function

async function fetchImages() {
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${value}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safe_search=${SAFE_SEARCH}&per_page=${PER_PAGE}&page=${currentPage}`;
    try {
        const response = await axios.get(URL);
        return response;
    } catch (error) {
        console.error(error);
        Notiflix.Notify.failure('Sorry, something went wrong...');
    }
}

// Load-more button handler

const loadMoreHandler = () => {
    fetchImages()
        .then(function (response) {
            renderImages(response);

            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();
            window.scrollBy({
                top: cardHeight * 2,
                behavior: 'smooth',
            });
        })
        .catch(error => console.log(error));
    currentPage++;
    if (currentPage > totalPages) {
        loadMoreBtn.style.display = 'none';
        return Notify.info(
            "We're sorry, but you've reached the end of search results."
        );
    }
    console.log('curr', currentPage, 'total', totalPages);
};

// Event listeners on the elements

form.addEventListener('submit', submitHandler);
snowflakesBtn.addEventListener('click', snowflakesToggle);
loadMoreBtn.addEventListener('click', loadMoreHandler);

// Scroll

document.addEventListener('scroll', () => {
    if (window.pageYOffset === 0) {
        toTopBtn.style.display = 'none';
    } else {
        toTopBtn.style.display = 'block';
    }
});

toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});