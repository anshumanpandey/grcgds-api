<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://ota.right-cars.com',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="UTF-8"?>
<OTA_VehAvailRateRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05OTA_VehAvailRateRQ.xsd" TimeStamp="2010-11-12T11:00:00" Target="Test" Version="1.002">
  <POS>
    <Source>
      <RequestorID Type="5" ID="Mobile001"/>
    </Source>
  </POS>
  <VehAvailRQCore Status="Available">
  	<Currency Code="EUR"/>
    <VehRentalCore PickUpDateTime="2021-04-15T12:00:00" ReturnDateTime="2021-04-17T10:00:00">
      <PickUpLocation LocationCode="MCOA01"/>
      <ReturnLocation LocationCode="MCOA01"/>
    </VehRentalCore>
  </VehAvailRQCore>
  <VehAvailRQInfo>
    <Customer>
      <Primary>
        <CitizenCountryName Code="GB"/>
        <DriverType Age="30"/>
      </Primary>
    </Customer>
    <TPA_Extensions>
      <ConsumerIP>192.168.102.14</ConsumerIP>
    </TPA_Extensions>
  </VehAvailRQInfo>
</OTA_VehAvailRateRQ>
',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
header("Content-type: text/xml");
echo $response;
