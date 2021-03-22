<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.grcgds.com/surprice_api/available_api.php?pickuplocationcode=325&pickupdate=2021-03-20&pickuptime=09:00&returnlocationcode=325&returndate=2021-03-28&returntime=09:00&age=30',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);

curl_close($curl);
header('Content-Type: application/json');
echo $response;
