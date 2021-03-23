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
  CURLOPT_POSTFIELDS =>'<?xml version="1.0"?>
    <OTA_VehResRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 VehResRQ.xsd">
      <POS>
        <Source>
          <RequestorID Type="5" ID="GRC-660000" RATEID="GRC-100000" />
        </Source>
      </POS>
      <VehResRQCore>
        <VehRentalCore PickUpDateTime="2021-05-25T10:30" ReturnDateTime="2021-05-29T10:30">
            <PickUpLocation LocationCode="DBVC01" />
            <ReturnLocation LocationCode="DBVC01" />
        </VehRentalCore>
        <Customer>
          <Primary>
            <PersonName>
              <NamePrefix>Sr</NamePrefix>
                <GivenName>Rick</GivenName>
                <Surname>Little</Surname>
            </PersonName>
            <Telephone> 
                <PhoneNumber>+44 4169943464</PhoneNumber> 
            </Telephone> 
            <Email>test25@test.com</Email>
            <Address>
              <StreetNmbr/>
              <CityName/>
              <PostalCode/>
            </Address>
            <CustLoyalty ProgramID="" MembershipID=""/>
          </Primary>
        </Customer>
        <VendorPref/>
        <VehPref RateId="RATE OCT" SearchId="" Code="MDMR-8-3493" Acriss="MCMR" price="" />
        <SpecialEquipPrefs>
    
    </SpecialEquipPrefs>
        <PromoDesc/>
      </VehResRQCore>
      <VehResRQInfo/>
      <ArrivalDetails FlightNo="IB3154"/>
      <RentalPaymentPref>
      <Voucher Identifier="4JM88670FY273401R">
          <PaymentCard CardType="Paypal" CardCode="" CardNumber="1111111111111111111111111" ExpireDate="MM/YY">
          <CardHolderName>Leonardo </CardHolderName>
          <AmountPaid>90.94</AmountPaid>
          <CurrencyUsed>USD</CurrencyUsed>
          </PaymentCard>
        </Voucher>
      </RentalPaymentPref>
      <CONTEXT>
        <Filter content="" Language="EN" contactless="Yes"/>
      </CONTEXT>
    </OTA_VehResRQ>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
header("Content-type: text/xml");
echo $response;
