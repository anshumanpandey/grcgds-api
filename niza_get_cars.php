<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://webservice.nizacars.es/Rentway_WS/getMultiplePrices_GroupDetails.asmx',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <MultiplePrices xmlns="http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices">
      <objRequest>
        <currency>GBP</currency>
        <companyCode>9906</companyCode>
        <customerCode>2809</customerCode>
        <pickUp>
          <Date>2021-02-28 10:00</Date>
          <rentalStation>10</rentalStation>
        </pickUp>
        <dropOff>
          <Date>2021-03-05 20:00</Date>
          <rentalStation>10</rentalStation>
        </dropOff>
        <Date_of_Birth>1990-01-30</Date_of_Birth>
        <username>usrBookingClik</username>
        <password>Ix;aesooS0que4bo</password>
        <includeHourlyRates>true</includeHourlyRates>
      </objRequest>
    </MultiplePrices>
  </soap:Body>
</soap:Envelope>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: text/xml; charset=utf-8',
    'SOAPAction: http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices_GroupDetails/MultiplePrices_GroupDetails'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
