import axios from "axios"

export const createInspection = () => {
    var data = {
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
    };

    return axios({
        method: 'post',
        url: 'http://appgw.click-ins.com/rest/v1/inspections?key=56ff54d7-7045-4415-9f1c-60e5601e0b92&upload_type=MULTIPART',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}