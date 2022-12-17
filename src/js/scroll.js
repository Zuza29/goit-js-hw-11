// Scroll
let scrollHeight = 0;

function scrollDown() {

    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    scrollHeight = scrollHeight + cardHeight * 40
    window.scrollBy({
        top: scrollHeight,
        behavior: "smooth",
    })
}

export { scrollDown }
