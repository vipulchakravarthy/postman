import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';
import prettyBytes from 'pretty-bytes';

import setUpEditors from './setupEditor';

const form = document.querySelector("[data-form]")
const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]')
const responseHeadersContainer = document.querySelector('[data-response-headers]');

// to calculate the total time taken for a req
axios.interceptors.request.use(request => {
    request.customData = request.customData || {};
    request.customData.startTime = new Date().getTime();
    return request;
})

axios.interceptors.response.use(updateEndTime, e => {
    return Promise.reject(updateEndTime(e.response))
})

function updateEndTime(response) {
    response.customData = response.customData || {};
    response.customData.time = new Date().getTime() - response.config.customData.startTime

    return response;
}

// to add the key value input boxes
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

//text editor for json format
const { requestEditor, updateResponseEditor } = setUpEditors();

form.addEventListener('submit', e => {
    e.preventDefault();
    let data
    try {
        data = JSON.parse(requestEditor.state.doc.toString() || null)
    } catch (e) {
        alert("JSON data is malformed")
        return
    }
    axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params: keyValuePairsToObject(queryParamsContainer),
        headers: keyValuePairsToObject(requestHeadersContainer),
        data
    }).then((response) => {
        document.querySelector('[data-response-section]').classList.remove('d-none')
        updateResponseDetails(response);
        updateResponseEditor(response.data);
        // updateResponseData(response.data);
        updateResponseHeaders(response.headers);
    }).catch(error => {
        error
    })
})

function updateResponseData(response) {
    document.querySelector('[data-json-response-body]').innerHTML =
        `<pre style="word-wrap: break-word; white-space: pre-wrap;">${JSON.stringify(response, null, 2)}</pre>`;
}

function updateResponseDetails(response) {
    document.querySelector('[data-status]').textContent = response.status;
    document.querySelector('[data-time]').textContent = response.customData.time;
    document.querySelector('[data-size]').textContent = prettyBytes(JSON.stringify(response.data).length + JSON.stringify(response.headers).length);
}

function updateResponseHeaders(headers) {
    responseHeadersContainer.innerHTML = "";
    Object.entries(headers).forEach(([key, value]) => {
        const keyElement = document.createElement('div');
        keyElement.textContent = key;
        responseHeadersContainer.append(keyElement);
        const valueElement = document.createElement('div');
        valueElement.textContent = value;
        responseHeadersContainer.append(valueElement);
    })
}

function keyValuePairsToObject(container) {
    const pairs = container.querySelectorAll('[data-key-value-pair]')
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]').value;
        const value = pair.querySelector('[data-value]').value;
        if (key === '') return data;
        return { ...data, [key]: value }
    }, {})
}