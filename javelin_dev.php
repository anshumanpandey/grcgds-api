<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://javelin-api.yesaway.com/services',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opentravel.org/OTA/2003/05">
    <soap:Body>
        <OTA_VehLocSearchRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" PrimaryLangID="EN" MaxResponses="50" Target="Production" Version="3.0" TransactionIdentifier="100000002" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05">
            <POS>
                <Source>
                    <RequestorID Type="4">
                        <CompanyName Code="CompanyName_Code" CompanyShortName="Company Short Name"/>
                    </RequestorID>
                </Source>
                <Source>
                    <RequestorID Type="4" ID="00000000" ID_Context="IATA"/>
                </Source>
            </POS>
            <VehLocSearchCriterion>
                <Location Code=""/>
            </VehLocSearchCriterion>
            <Vendor Code="Supplier Code"/>
        </OTA_VehLocSearchRQ>
    </soap:Body>
</soap:Envelope>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

curl_setopt($curl, CURLOPT_USERPWD, "bookingclik:1ab7476af3e66c880397d4c99e300472"); 

$response = curl_exec($curl);

curl_close($curl);
echo $response;
