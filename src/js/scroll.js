// Scroll

function scrollDown () {
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

    console.log('function executed')

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    })
}
// export { scrollDown }
