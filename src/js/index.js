import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import "simplelightbox/dist/simple-lightbox.min.css";
import { scrollDown } from './scroll';
import { snowflakesToggle } from './snowflakes';

// Global variables

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const list = document.createElement('ul');
const loadMoreBtn = document.querySelector('.load-more');
const toTopBtn = document.getElementById('to-top')
const snowflakesBtn = document.getElementById('snowflakes-btn');
const lightbox = new SimpleLightbox(".gallery a", { CaptionDelay: 250, captions: true, captionData: "alt" });


gallery.append(list);
loadMoreBtn.style.display = 'none';
toTopBtn.style.display = 'none';

// Search parameters

const parameters = {
    KEY: '31646288-d6f5eefd60163767746b31051',
    IMG_TYPE: 'photo',
    ORIENTATION: 'horizontal',
    SAFE_SEARCH: 'true',
    PER_PAGE: 40,
}

const { KEY, IMG_TYPE, ORIENTATION, SAFE_SEARCH, PER_PAGE } = parameters;

let currentPage = 1;

// Submit handler

let value = '';

const submitHandler = async (event) => {
    event.preventDefault();
    list.innerHTML = '';
    value = form.input.value;
    if (value.trim() === '') {
        Notiflix.Notify.info('Please do not leave the field empty.');
    } else {
        await fetchImages(form.input.value);
    }
}

const loadMore = async (event) => {
    event.preventDefault();
    await fetchImages(value);
    scrollDown()
};

// Fetch images function

const fetchImages = async (query) => {
    const response = await axios.get(
        `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safe_search=${SAFE_SEARCH}&per_page=${PER_PAGE}&page=${currentPage}`)
        .then(function (response) {

            // Handle successful fetch - notifications

            const totalPages = Math.ceil(response.data.totalHits / PER_PAGE);
            if (response.data.hits.length === 0) {
                Notiflix.Notify.info('Sorry, there are no pictures matching your search');
                return;
            }
            if (response.data.totalHits > 0 && currentPage !== totalPages && currentPage === 1) {
                Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
            }

            if (currentPage === totalPages) {
                Notiflix.Notify.info('You have reached the end of the results.');
                loadMoreBtn.style.display = 'none';
                return;
            }


            // Handle successful fetch - render images

            response.data.hits.forEach((img, idx) => {
                let imageElement = document.createElement('li');
                imageElement.innerHTML = `
                <div class="img-container"><a href="${img.largeImageURL}">
       <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /></a>
       <p>${img.likes} <strong>likes</strong> | ${img.views} <strong>views</strong> </br> ${img.comments} <strong>comments</strong> | ${img.downloads} <strong>downloads</strong></p>
       </div>`;
       
                list.append(imageElement);
            })
            lightbox.refresh();
            loadMoreBtn.style.display = 'block';
            return response;
        })

        // Handle failure

        .catch(function (error) {
            console.log(error);
            Notiflix.Notify.failure('Sorry, something went wrong...')
        })

    currentPage++;
};

// Additional functionality - falling snowflakes effect


// Event listeners on the elements

form.addEventListener('submit', submitHandler);
loadMoreBtn.addEventListener('click', loadMore);
snowflakesBtn.addEventListener('click', snowflakesToggle)

// Scroll

document.addEventListener('scroll', () => {
    if (window.pageYOffset === 0) {
        toTopBtn.style.display = 'none'
    } else {
        toTopBtn.style.display = 'block'
    }
});

toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
})
