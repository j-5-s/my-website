import React, { useEffect, useState } from 'react';
import './btcpay.css';

export const BTCPayButton = () => {
  const [price, setPrice] = useState('100') 
  useEffect(() => {
    if (!window.btcpay) {
      var script = document.createElement('script');
      script.src = "https://pay.j5s.dev/modal/btcpay.js";
      document.getElementsByTagName('head')[0].append(script);
    }
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && this.responseText) {
            window.btcpay.appendInvoiceFrame(JSON.parse(this.responseText).invoiceId);
        }
    };
    xhttp.open('POST', event.target.getAttribute('action'), true);
    xhttp.send(new FormData(event.target));
  }
  const handlePlusMinus = (event) => {
    event.preventDefault();
    const root = event.target.closest('.btcpay-form');
    const el = root.querySelector('.btcpay-input-price');
    const step = parseInt(event.target.dataset.step) || 1;
    const min = parseInt(event.target.dataset.min) || 1;
    const max = parseInt(event.target.dataset.max);
    const type = event.target.dataset.type;
    const price = parseInt(el.value) || min;
    if (type === '-') {
      setPrice(price - step < min ? min : price - step);
    } else if (type === '+') {
      setPrice(price + step > max ? max : price + step);
    }
  }


  const handlePriceInput = () => {
    event.preventDefault();
    const root = event.target.closest('.btcpay-form');
    let p = event.target.value;
    if (isNaN(p)) {
      p = price;
    }
    const min = parseInt(event.target.getAttribute('min')) || 1;
    const max = parseInt(event.target.getAttribute('max'));
    if (p < min) {
        p = min;
    } else if (p > max) { 
        p = max;
    }
    setPrice(p);
  }

  return (
    <form method="POST" onSubmit={onSubmit} action="https://pay.j5s.dev/api/v1/invoices" className="btcpay-form btcpay-form--block">
      <input type="hidden" name="storeId" value="DGY3PQ2xcNNkZhPcJRHx4TDk2voUA8ip78HFX27Y9fph" />
      <input type="hidden" name="jsonResponse" value="true" />
    
      <div className="btcpay-custom-container">
        <div className="btcpay-custom flex">
          <div classNameName="btcpay-price mb-10">
            <input className="btcpay-input-price p-5" onChange={handlePriceInput} type="number" name="price" min="1" max="10000000" step="1" value={price} data-price={price} style={{width:"3em;"}} />
            <select name="currency" className="p-5">
              <option value="SATS" selected>SATS</option>
              <option value="BTC">BTC</option>
              <option value="USD" >USD</option>
            </select>
          </div>
         
        </div>

      </div>
      <input type="hidden" name="defaultPaymentMethod" value="BTC_LNURLPAY" />
      <input type="image" className="submit" name="submit" src="https://pay.j5s.dev/img/paybutton/pay.svg" style={{"width": 209}} alt="Pay with BTCPay Server, a Self-Hosted Bitcoin Payment Processor" />
    </form>
  )
}