<?php

$url = '<OTA_CountryListRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 CountryListRQ.xsd" TimeStamp="2019-05-09T08:00:00" Target="Test" Version="1.002">

<POS>

<Source>

<RequestorID Type="5" ID="210004"/>

</Source>

</POS>
<CONTEXT> 
</CONTEXT> 

</OTA_CountryListRQ>';

$curl = curl_init();

curl_setopt_array($curl, array(
CURLOPT_URL => "https://www.grcgds.com/ota/",
CURLOPT_RETURNTRANSFER => true,
CURLOPT_ENCODING => "",
CURLOPT_MAXREDIRS => 10,
CURLOPT_TIMEOUT => 0,
CURLOPT_FOLLOWLOCATION => true,
CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
CURLOPT_CUSTOMREQUEST => "GET",
CURLOPT_POSTFIELDS =>$url,
CURLOPT_HTTPHEADER => array(
"Content-Type: application/xml"
),
));

$response = curl_exec($curl);

if(!$response)
{
echo 'Curl error: ' . curl_error($ch);
}
else {
echo $response;
}

curl_close($curl);