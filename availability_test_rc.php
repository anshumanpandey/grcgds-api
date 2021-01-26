<?php

$url='<?xml version="1.0" encoding="UTF-8"?>
<OTA_VehAvailRateRQDeep xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05OTA_VehAvailRateRQ.xsd" TimeStamp="2010-11-12T11:00:00" Target="Test" Version="1.002">
  <POS>
    <Source>
      <RequestorID Type="5" ID="Mobile001"/>
    </Source>
  </POS>
  <VehAvailRQCore Status="Available">
  	<Currency Code="EUR"/>
    <VehRentalCore PickUpDateTime="2021-02-15T12:00:00" ReturnDateTime="2021-02-17T10:00:00">
      <PickUpLocation LocationCode="RAKA01"/>
      <ReturnLocation LocationCode="RAKA01"/>
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
</OTA_VehAvailRateRQDeep>';

//var_dump($url);

$gg="https://ota.right-cars.com/";

$ch = curl_init();    // initialize curl handle
curl_setopt($ch, CURLOPT_URL,$gg); // set url to post to
curl_setopt($ch, CURLOPT_POST,0); // set url to post to
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  false);
curl_setopt($ch, CURLOPT_USERAGENT, $defined_vars['HTTP_USER_AGENT'] );
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); // return into a variable
curl_setopt($ch, CURLOPT_POSTFIELDS, $url); // add POST fields
curl_setopt($ch, CURLOPT_TIMEOUT, 40); // times out after 4s
curl_setopt($ch, CURLOPT_HTTPHEADER, array (
    "Content-Type: application/soap+xml;charset=utf-8"
));

$result = curl_exec($ch); // run the whole process
header("Content-type: text/xml");
echo $result;