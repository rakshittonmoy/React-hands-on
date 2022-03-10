
function fetchQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search') || '';
    const sortOn = urlParams.get('sortOn') || '';
    const sortOrder = urlParams.get('sortOrder') || '';
    const page = urlParams.get('page') || 1;
    return { searchStr: search, page: +page, sortOn, sortOrder };
}

function updateQueryParams(history, search, sorting, currentPage) {
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('search', search);
    currentUrlParams.set('page', currentPage);
    currentUrlParams.set('sortOn', sorting.field);
    currentUrlParams.set('sortOrder', sorting.order);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
}

export { fetchQueryParams, updateQueryParams };

