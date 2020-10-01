import axios from "axios"
import { xmlToJson } from '../utils/XmlConfig';

export default async (body: any) => {
    const PickUpDateTime = body.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = body.VehAvailRQCore.VehRentalCore.ReturnDateTime
    const pickLocation = body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode
    const Age = body.VehAvailRQInfo.Customer.Primary.DriverType.Age
    const Code = body.VehAvailRQInfo.Customer.Primary.CitizenCountryName.Code

    const xml = `<?xml version="1.0"?>
            <OTA_VehAvailRateRQDeep xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05OTA_VehAvailRateRQ.xsd" TimeStamp="2010-11-12T11:00:00" Target="Test" Version="1.002">
            <POS>
                <Source>
                    <RequestorID Type="5" ID="1000022"/>
                </Source>
            </POS>
            <VehAvailRQCore Status="Available">
                <Currency Code="EUR"/>
                <VehRentalCore PickUpDateTime="${PickUpDateTime}" ReturnDateTime="${ReturnDateTime}">
                
                <PickUpLocation LocationCode="${pickLocation}"/>

                <ReturnLocation LocationCode="${dropLocation}"/>
                </VehRentalCore>
            </VehAvailRQCore>
            <VehAvailRQInfo>
                <Customer>
                <Primary>
                    <CitizenCountryName Code="${Code || "UK"}"/>
                    <DriverType Age="${Age || 35}"/>
                </Primary>
                </Customer>
                <TPA_Extensions>
                <ConsumerIP>192.168.102.14</ConsumerIP>
                </TPA_Extensions>
            </VehAvailRQInfo>
            </OTA_VehAvailRateRQDeep>
    `;

    const { data } = await axios.post('https://ota.right-cars.com', xml, {
            headers: {
                'Content-Type': 'text/plain; charset=UTF8',
            }
        })

    return xmlToJson(data);
}