import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';

const form = document.querySelector("[data-form]")
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

form.addEventListener('submit', e => {
    e.preventDefault();
    axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params: keyValuePairsToObject(queryParamsContainer),
        headers: keyValuePairsToObject(requestHeadersContainer),
    }).then((resp) => {
        console.log(resp)
    })
})

function keyValuePairsToObject(container) {
    const pairs = container.querySelectorAll('[data-key-value-pair]')
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]').value;
        const value = pair.querySelector('[data-value]').value;
        if (key === '') return data;
        return { ...data, [key]: value }
    }, {})
}