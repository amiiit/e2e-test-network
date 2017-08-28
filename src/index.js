const URL = __OFFLINE__ ? 'http://0.0.0.0:8081' : 'https://api.coindesk.com/v1/bpi/currentprice';

(function () {
  window.addEventListener('load', function () {
    fetch(`${URL}/euro.json`)
      .then(res => res.json())
      .then(function (json) {
        document.getElementById('europrice').innerText = json.bpi.EUR.rate_float;
        document.getElementById('usdprice').innerText = json.bpi.USD.rate_float;
      })
  })
})();