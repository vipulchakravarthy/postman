import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]')

document.querySelector('[data-add-query-params-btn]').addEventListener('click', e => {
    queryParamsContainer.append(createKeyValuePair());
});

document.querySelector('[data-add-request-headers-btn]').addEventListener('click', e => {
    requestHeadersContainer.append(createKeyValuePair());
});

queryParamsContainer.append(createKeyValuePair())
requestHeadersContainer.append(createKeyValuePair())

function createKeyValuePair() {
    const element = keyValueTemplate.content.cloneNode(true);
    element.querySelector('[data-remove-btn]').addEventListener('click', (e) => {
        e.target.closest('[data-key-value-pair]').remove();
    })
    return element;
}