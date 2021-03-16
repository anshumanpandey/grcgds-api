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
        <OTA_VehAvailRateMoreRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" PrimaryLangID="EN" MaxResponses="50" Target="Production" Version="3.0" TransactionIdentifier="100000002" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05">
            <POS>
                <Source ISOCountry="US">
                    <RequestorID Type="4" >
                        <CompanyName Code="bookingclik" CompanyShortName="bookingclik"/>
                    </RequestorID>
                </Source>
                <Source>
                    <RequestorID Type="4" ID="00000000" ID_Context="IATA"/>
                </Source>
            </POS>
            <VehAvailRQCore Status="Available">
                <VehRentalCore PickUpDateTime="2021-07-08T10:00:00" ReturnDateTime="2021-07-20T10:00:00">
                    <PickUpLocation LocationCode="AUC2874S" PointCode="1"/>
                    <ReturnLocation LocationCode="AUC2874S" PointCode="1"/>
                </VehRentalCore>
                <VendorPrefs>
                    <VendorPref Code="yesaway"/>
                </VendorPrefs>
                <DriverType Age="35"/>
                <TPA_Extensions>
                    <TPA_Extension_Flags EnhancedTotalPrice="true"/>
                </TPA_Extensions>
            </VehAvailRQCore>
        </OTA_VehAvailRateMoreRQ>
    </soap:Body>
</soap:Envelope>',
  CURLOPT_HTTPHEADER => array(
    'Authorization: Basic Ym9va2luZ2NsaWs6MWFiNzQ3NmFmM2U2NmM4ODAzOTdkNGM5OWUzMDA0NzI=',
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
