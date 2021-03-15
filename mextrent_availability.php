<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://mexrentacar.com/oauth/token',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => array('grant_type' => 'client_credentials','client_id' => '30','client_secret' => 'yIlY8W2XtoK3aOXvCtdBu9TVJuftSiv0Pk2mhJlF','scope' => ''),
));

$response = curl_exec($curl);

curl_close($curl);
$loginResponse = json_decode($response, true);

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://mexrentacar.com/api/v1/rateRequest',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => array('email_client_service' => 'admin@bookingclik.com','pickup_code' => 'QRO','dropoff_code' => 'QRO','date_pickup' => '2021-03-15','date_dropoff' => '2021-03-25','hour_pickup' => '08:00 am','hour_dropoff' => '09:00 pm','code_rate' => 'INCPOA'),
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer ' . $loginResponse["access_token"]
  ),
));

$response = curl_exec($curl);

curl_close($curl);
header('Content-Type: application/json');
echo $response;
