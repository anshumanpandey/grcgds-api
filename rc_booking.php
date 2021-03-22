<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://OTA.right-cars.com/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<OTA_VehResRQ xmlns="http://www.opentravel.org/OTA/2003/05"

        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        
        xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 
        
        VehResRQ.xsd">
        
         <POS>
        
          <Source>
        
           <RequestorID Type="5" ID="MOBILE001"  />
        
          </Source>
        
         </POS>
        
         <VehResRQCore>
        
          <VehRentalCore PickUpDateTime="2021-07-04T10:30:00" ReturnDateTime="2021-07-05T10:30:00">
        
        <PickUpLocation LocationCode="DBVC01" />
        
        <ReturnLocation LocationCode="DBVC01" />
        
          </VehRentalCore>
        
          <Customer>
        
           <Primary>
        
                <PersonName>
        
                     <NamePrefix></NamePrefix>
        
                     <GivenName>Rick</GivenName>
        
                     <Surname>Little</Surname>
        
                </PersonName>
        
                <Telephone PhoneNumber="+58" MobileNumber="4169943464"/>
        
                <Email>eht45845@eoopy.com</Email>
        
                <Driverage>22</Driverage>
        
                      <Address>
        
                     <StreetNmbr>fgbfdgbdf fgbfdgbdf</StreetNmbr>
        
                     <CityName></CityName>
        
                     <PostalCode>fdgbfdgbdf</PostalCode>
        
                </Address>
        
                <CustLoyalty ProgramID="" MembershipID="" />
        
           </Primary>
        
          </Customer>
        
          <VendorPref></VendorPref>
        
          <VehPref Code="MDMR-8-3493" />
        
           
        
        <SpecialEquipPrefs>

        <SpecialEquipPref vendorEquipID="BSEAT" Quantity="2"/>
        
        </SpecialEquipPrefs>
        
        <PromoDesc></PromoDesc>
        
        </VehResRQCore>
        
        <VehResRQInfo>
        
            <ArrivalDetails FlightNo="fdgbdfgbdfg"/>
        
            <RentalPaymentPref>
        
           <Voucher Identifier="PAYID-L35GDPI1EN26740CJ269690E"> 
        
                <PaymentCard CardType="VI" CardCode="" CardNumber="1111111111111111111111111" 
        
                ExpireDate="MM/YY" >
        
                <CardHolderName>fgbdfg bdfgbdfg</CardHolderName>
        
            </PaymentCard> 
        
            </RentalPaymentPref>
        
        </VehResRQInfo>
        
        </OTA_VehResRQ>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/soap+xml;charset=utf-8'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
