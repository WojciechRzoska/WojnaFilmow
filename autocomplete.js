const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b>Wyszukaj</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;
  const input = root.querySelector('.input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const onInput = async (e) => {
    const items = await fetchData(e.target.value);
    resultsWrapper.innerHTML = '';

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    dropdown.classList.add('is-active');
    for (let item of items) {
      const itemOption = document.createElement('a');

      itemOption.classList.add('dropdown-item');
      itemOption.innerHTML = renderOption(item);
      itemOption.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      resultsWrapper.appendChild(itemOption);
    }
  };

  input.addEventListener('input', debounce(onInput));

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};
