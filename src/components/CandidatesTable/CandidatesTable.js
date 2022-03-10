import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { TableHeader, Pagination, Search } from "../DataTable";
import { fetchQueryParams, updateQueryParams } from "./CandidatesTable.actions";
import { HEADERS as headers, ITEMS_PER_PAGE } from './constants';
import usePageLoader from '../../hooks/usePageLoader';

const DataTable = () => {
    const { page, searchStr, sortOn, sortOrder } = fetchQueryParams();
    const [loader, showLoader, hideLoader] = usePageLoader();
    const [applications, setApplicationsData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);
    const [search, setSearch] = useState(searchStr);
    const [sorting, setSorting] = useState({ field: sortOn, order: sortOrder });
    const errorsFound = useRef(false);
    const history = useHistory();

    useEffect(() => {

        let retries = 4;

        function wait(delay){
            return new Promise((resolve) => setTimeout(resolve, delay));
        }
        
        function retry() {
            errorsFound.current = true;
            hideLoader();
            if (--retries) {
                wait(5000).then(() => getData());
            }
        }

        const getData = () => { 
            showLoader();
            fetch("http://personio-fe-test.herokuapp.com/api/v1/candidates")
                .then(response => response.json())
                .then(json => {
                    hideLoader();
                    if(json.error) {
                        throw Error(json.error);
                    }
                    setApplicationsData(json);
                }, 
                error => {
                    retry();
                })
                .catch(err => retry());
        };

        getData();
    }, []);

    const applicationsData = useMemo(() => {
        let computedApplications = applications.data || [];

        updateQueryParams(history, search, sorting, currentPage);

        // Applying the search criteria
        if (search) {
            computedApplications = computedApplications.filter(
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedApplications.length);

        //Sorting applications
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedApplications = computedApplications.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
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
                        {applicationsData.length === 0 && errorsFound.current===false && <tr>No data found</tr>}
                        {applicationsData.length === 0 && errorsFound.current===true && <tr>Error while retrieving data</tr>}
                    </tbody>
                </table>
    
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
