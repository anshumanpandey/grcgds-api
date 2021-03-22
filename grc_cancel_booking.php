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
  CURLOPT_POSTFIELDS =>'<OTA_VehCancelRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 VehCancelRQ.xsd">
    <POS>
        <Source>
            <RequestorID Type="5" ID="GRC-580000" ID_NAME="Acme Rent A Car"/>
        </Source>
    </POS>
    <VehCancelRQCore>
        <ResNumber Number="'. $_GET["resnumber"].'" />
    </VehCancelRQCore>
    <VehCancelRQInfo>
    </VehCancelRQInfo>
</OTA_VehCancelRQ>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
header("Content-type: text/xml");
echo $response;
