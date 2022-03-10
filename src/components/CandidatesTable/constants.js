const HEADERS = [
    { name: "Name", field: "name", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "Age", field: "birth_date", sortable: false },
    { name: "Experience", field: "year_of_experience", sortable: true },
    { name: "Position applied", field: "position_applied", sortable: true },
    { name: "Applied on", field: "application_date", sortable: false },
    { name: "Status", field: "status", sortable: false },
];


const ITEMS_PER_PAGE = 10;

export { HEADERS, ITEMS_PER_PAGE };