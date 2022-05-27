const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title}
  `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const dataResponse = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '4891827d',
        s: searchTerm,
      },
    });
    if (dataResponse.data.Error) {
      return [];
    }
    return dataResponse.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-column'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-info'), 'left');
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-column'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-info'), 'right');
  },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, infoElement, side) => {
  const movieResponse = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '4891827d',
      i: movie.imdbID,
    },
  });

  infoElement.innerHTML = movieTemplate(movieResponse.data);

  if (side === 'left') {
    leftMovie = movieResponse.data;
  } else {
    rightMovie = movieResponse.data;
  }

  if (leftMovie && rightMovie) {
    runCompare();
  }
};

const runCompare = () => {
  const leftSideStats = document.querySelectorAll('#left-info .notification');
  const rightSideStats = document.querySelectorAll('#right-info .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
    leftStat.classList.remove('is-warning');
    rightStat.classList.remove('is-warning');

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      rightStat.classList.add('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      leftStat.classList.add('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
  <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article> 

  `;
};
