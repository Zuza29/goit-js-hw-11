// Scroll

const submitHandler = async (event) => {
    event.preventDefault();
    if (!!value && value !== form.input.value) {
        list.innerHTML = '';
        currentPage = 1;
        loadMoreBtn.style.display = 'none';
    } else {
        value = form.input.value;
    }
}

export { scrollDown }
