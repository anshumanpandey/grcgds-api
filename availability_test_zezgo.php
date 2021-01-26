<?php

$url='<OTA_VehAvailRateRQ xmlns="https://www.opentravel.org/OTA/2003/05" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRQ.xsd" TimeStamp="2018-12-04T17:00:16" Target="Production" Version="1.002">
  <POS>
    <Source>
      <RequestorID Type="5" ID="Mobile002"/>
    </Source>
  </POS>
  <VehAvailRQCore Status="Available">
    <VehRentalCore PickUpDateTime="2021-01-26T11:00:00" ReturnDateTime="2021-01-27T11:00:00">
      <PickUpLocation LocationCode="MIAA02"/>
      <ReturnLocation LocationCode="MIAA02"/>
    </VehRentalCore>
    <DriverType Age="33"/>
  </VehAvailRQCore>
  <VehAvailRQInfo>
    <Customer>
      <Primary>
        <CitizenCountryName Code="US"/>
      </Primary>
    </Customer>
  </VehAvailRQInfo>
</OTA_VehAvailRateRQ>';

//var_dump($url);

$gg="https://ota.zezgo.com/";

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