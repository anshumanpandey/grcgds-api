<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://34.89.158.132:57453/rest/v2/inspections?key=56ff54d7-7045-4415-9f1c-60e5601e0b92&upload_type=multipart',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
  "client_process_id": "123456789",
  "client_token": "987654321",
  "basic_vehicle_data": {
    "model": {
      "model_identifier": "00416-0188",
      "make": "Kia",
      "model": "Sportage",
      "submodel": "(QL)",
      "bodystyle": "SUV 5-door",
      "year": 2015,
      "full_name": "Kia Ceed Sportswagon 2015-2018"
    },
    "license_plate_number": "3765680"
  },
  "previous_inspection_case_id": "",
  "features": [
        "EXIF_DATA_EXTRACTION",
        "VEHICLE_MODEL_CHECK",
        "LICENSE_PLATE_NUMBER_DETECTION",
        "ALL_ANGLES_CHECK",
        "PRINCIPAL_COLOR_DETECTION",
        "DAMAGE_MEASUREMENT",
        "PANEL_DISTANCE_MEASUREMENT",
        "FRAUD_DETECTION",
        "PARTS_SEGMENTATION",
        "VEHICLE_SEGMENTATION",
        "RETURN_VEHICLE_MASKS",
        "CLOSEUP_REGISTRATION",
        "RUN_DAMAGE_DETECTION_ON_UPLOAD",
        "GENERATE_DAMAGE_OVERLAY"
  ],
    "measurement_units": "US"
}',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
if($response === false) {
  echo 'Curl error: ' . curl_error($curl);
}
else {
  var_dump($response);
}
