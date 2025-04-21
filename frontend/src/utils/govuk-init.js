import { initAll } from "govuk-frontend";

export const initGovUK = () => {
    document.body.className = document.body.className
    ? document.body.className + ' js-enabled' 
    : 'js-enabled';

    initAll();
}