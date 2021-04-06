<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://www.grcgds.com/ota/",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="UTF-8"?><OTA_VehAvailRateRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRQ.xsd" TimeStamp="2020-06-04T19:32:01" Target="Production" Version="1.002">   <POS>      <Source ISOCurrency="USD">         <RequestorID Type="5" ID="GRC-120000" ID_NAME="Acme Rent A Car" />         <ApiKey>            c32419e4-d316-4a54-b20d-296eb2dcf7a2         </ApiKey>      </Source>   </POS>   <CONTEXT>      <Filter content="" Language="EN" contactless="No"/>   </CONTEXT>   <VehAvailRQCore Status="Available">      <VehRentalCore PickUpDateTime="2021-04-18T12:00:00" ReturnDateTime="2021-04-19T10:00:00">      <PickUpLocation LocationCode="MCOA01"/>      <ReturnLocation LocationCode="MCOA01"/>      </VehRentalCore>   </VehAvailRQCore>   <VehAvailRQInfo>      <Customer>         <Primary>            <DriverType Age=""/>            <CitizenCountryName Code=""/>         </Primary>      </Customer>   </VehAvailRQInfo></OTA_VehAvailRateRQ>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
header("Content-type: text/xml");
echo $response;
