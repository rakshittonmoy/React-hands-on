import React, { useState } from "react";
import PageLoader from "../components/PageLoader";

const usePageLoader = () => {
    const [loading, setLoading] = useState(false);

    return [
        loading ? <PageLoader /> : null,
        () => setLoading(true), //Show loader
        () => setLoading(false) //Hide Loader
    ];
};

export default usePageLoader;
