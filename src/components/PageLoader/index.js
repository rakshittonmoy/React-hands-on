import React from "react";
import Spinner from "../../resources/images/spinner.gif";

const PageLoader = () => {
    return (
        <div className="d-flex justify-content-center">
            <img src={Spinner} width={100} height={100} alt="loading" />
        </div>
    );
};

export default PageLoader;
