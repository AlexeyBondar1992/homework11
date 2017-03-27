var rate = {} ;

function createCurrencyList(list) {
    var select = document.createElement('select');
    list.forEach(function (currency) {
        var option = document.createElement('option');
        option.value = currency.Cur_Abbreviation;
        option.textContent = currency.Cur_Name;
        select.appendChild(option);
    });
    return select;
}

function makeRequest(params, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(params.method, params.url, true);
    xhr.responseType = 'json';
    xhr.addEventListener('loadend', function listener() {
        xhr.removeEventListener('loadend', listener);
        rate = xhr.response;
        callback(rate);
    });
    xhr.send();
}

function loadCurrencyRate(code, callback) {
    makeRequest({
        method: 'GET',
        url: 'http://www.nbrb.by/API/ExRates/Rates/' + code + '?ParamMode=2'
    }, callback);
}
function loaderCurrencyRate(select, input, p) {
    var currencyCode = select.value;
    loadCurrencyRate(currencyCode, function (rate) {
        resolver(input, rate, p);
    });
}


makeRequest({
    method: 'GET',
    url: 'http://www.nbrb.by/API/ExRates/Currencies'
}, function (list) {
    var select = createCurrencyList(list),
        input = createInput(),
        p = document.createElement('p');
    loaderCurrencyRate(select, input, p);
    select.addEventListener('change', function () {
        loaderCurrencyRate(select, input, p);
    });
    input.addEventListener ('input', function () {
        resolver(input, rate, p);
    });
    document.body.appendChild(select);
    document.body.appendChild(input);
    document.body.appendChild(p);

});


function createInput() {
    var input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'введите сумму';
    return input;
}


function resolver(input, object, p) {
    var summ = (input.value * object.Cur_OfficialRate / object.Cur_Scale).toFixed(2);
    p.textContent = `= ${summ} BYN`;
}
document.body.style.display = 'flex';

