import { useEffect, useState, useRef } from "react";
import usePageLoader from './usePageLoader';

const useFetch = () => {
    const [loader, showLoader, hideLoader] = usePageLoader();
    const [applications, setApplicationsData] = useState([]);
    const hasErrors = useRef(false);

    useEffect(() => {

        let retries = 4;

        function wait(delay){
            return new Promise((resolve) => setTimeout(resolve, delay));
        }
        
        function retry() {
            hasErrors.current = true;
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

    return [loader, applications, hasErrors];

};

export { useFetch };