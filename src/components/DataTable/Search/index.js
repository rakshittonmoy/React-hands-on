import React, { useState } from "react";
import './styles.scss';

const Search = ({ onSearch, searchStr = "" }) => {
    const [search, setSearch] = useState(searchStr);

    const onInputChange = value => {
        setSearch(value);
        onSearch(value);
    };
    return (
        <div className="input-wrapper">
            <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={search}
                onChange={e => onInputChange(e.target.value)}
            />
        </div>
    );
};

export default Search;
