<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.grcgds.com/XML/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="UTF-8"?>
  <OTA_VehAvailRateRQ xmlns="http://www.opentravel.org/OTA/2003/05"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRQ.xsd"
  TimeStamp="2020-06-04T19:32:01" Target="Production" Version="1.002">
  <POS>
  <Source>
  <RequestorID Type="5" ID="GRC-650000" RATEID="GRC-1550001" RATETYPES=""/>
  </Source>
  </POS>
  <VehAvailRQCore Status="Available">
  <VehRentalCore PickUpDateTime="2021-03-11T12:00:00" ReturnDateTime="2021-03-12T10:00:00">
  <PickUpLocation LocationCode="TLLA01" />
  <ReturnLocation LocationCode="TLLA01" />
  </VehRentalCore>
  <DriverType Age="35"/>
  </VehAvailRQCore>
  <VehAvailRQInfo >
  <Customer>
  <Primary>
  <CitizenCountryName Code="DE"/>
  </Primary>
  </Customer>
  </VehAvailRQInfo>
  </OTA_VehAvailRateRQ>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
