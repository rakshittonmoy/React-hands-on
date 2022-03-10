import React, { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { TableHeader, Pagination, Search } from "../DataTable";
import { fetchQueryParams, updateQueryParams } from "./CandidatesTable.actions";
import { HEADERS as headers, ITEMS_PER_PAGE } from './constants';

const DataTable = () => {
    const { page, searchStr, sortOn, sortOrder } = fetchQueryParams();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);
    const [search, setSearch] = useState(searchStr);
    const [sorting, setSorting] = useState({ field: sortOn, order: sortOrder });
    const history = useHistory();
    const [loader, applications, hasErrors] = useFetch();

    const applicationsData = useMemo(() => {
        let computedApplications = applications.data || [];

        updateQueryParams(history, search, sorting, currentPage);

        // Applying the search criteria
        if (search) {
            computedApplications = computedApplications.filter(
                item =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.status.toLowerCase().includes(search.toLowerCase()) ||
                item.position_applied.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedApplications.length);

        //Sorting applications
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedApplications = computedApplications.sort(
                (a, b) => {
                    if(sorting.field === 'year_of_experience') {
                        return reversed * (a[sorting.field] - b[sorting.field]);
                    }
                    else if (sorting.field === 'application_date') {
                        return reversed * (new Date(a[sorting.field]) - new Date(b[sorting.field]));
                    } else {
                        return reversed * a[sorting.field].localeCompare(b[sorting.field]);
                    }
                }
            );
        }

        //Current Page slice
        return computedApplications.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );

    }, [applications, currentPage, search, sorting]);

    return (
        <>
            <div className="py-5 text-center">
                <i className="fa fa-user fa-lg mr-3" aria-hidden="true"></i>
                <b>Applications</b>
            </div>

            <div className="col mb-3 col-12 text-center">
                <Search
                    searchStr={search}
                    onSearch={value => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                />

                <table className="table table-fixed table-bordered table-hover">
                    <TableHeader
                        class="sticky-top"
                        headers={headers}
                        onSorting={(field, order) =>
                            setSorting({ field, order })
                        }
                    />
                    <tbody>
                        {applicationsData.map(application => (
                            <tr key={application.id}>
                                <td>{application.name}</td>
                                <td>{application.email}</td>
                                <td>{application.birth_date}</td>
                                <td>{application.year_of_experience}</td>
                                <td>{application.position_applied}</td>
                                <td>{application.application_date}</td>
                                <td>{application.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {applicationsData.length === 0 && hasErrors.current===false && <div>No data found</div>}
                {applicationsData.length === 0 && hasErrors.current===true && <div>Error while retrieving data.</div>}
                <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={page => setCurrentPage(page)}
                />
            </div>
            {loader}
        </>
    );
};

export default DataTable;
