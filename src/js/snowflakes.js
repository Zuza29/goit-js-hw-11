const snowflakesBtn = document.getElementById('snowflakes-btn');
const snowflakes = document.querySelectorAll('.snowflake');

const snowflakesToggle = () => {
    [...snowflakes].map(el => {
        el.classList.toggle('snowflakes-disabled');
    })

    if (snowflakesBtn.textContent === 'Disable snowflakes') {
        snowflakesBtn.textContent = 'Enable snowflakes'
    } else if (snowflakesBtn.textContent === 'Enable snowflakes') {
        snowflakesBtn.textContent = 'Disable snowflakes'
    }
}

export { snowflakesToggle }