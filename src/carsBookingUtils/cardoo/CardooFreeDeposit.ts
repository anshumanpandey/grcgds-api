import axios from "axios";
import { ApiError } from "../../utils/ApiError";
import { validateFor } from "../../utils/JsonValidator";

const schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "http://example.com/example.json",
  type: "object",
  title: "The root schema",
  description: "The root schema comprises the entire JSON document.",
  default: {},
  examples: [
    {
      xmlns: "http://www.opentravel.org/OTA/2003/05",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation":
        "http://www.opentravel.org/OTA/2003/05\nVehRetResRQ.xsd",
      POS: {
        Source: {
          ApiKey: "xxx-xxx-xxx",
        },
      },
      Vehicle: "619e8f2abd63dda48263ed67",
      DepositAmount: {
        Cents: "500000",
        CurrencyIso: "EUR",
      },
      PickupTime: "2021-12-24T10:00:00Z",
      DropoffTime: "2021-12-27T10:00:00Z",
    },
  ],
  required: [
    "xmlns",
    "xmlns:xsi",
    "xsi:schemaLocation",
    "POS",
    "Vehicle",
    "DepositAmount",
    "PickupTime",
    "DropoffTime",
  ],
  properties: {
    xmlns: {
      $id: "#/properties/xmlns",
      type: "string",
      title: "The xmlns schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["http://www.opentravel.org/OTA/2003/05"],
    },
    "xmlns:xsi": {
      $id: "#/properties/xmlns%3Axsi",
      type: "string",
      title: "The xmlns:xsi schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["http://www.w3.org/2001/XMLSchema-instance"],
    },
    "xsi:schemaLocation": {
      $id: "#/properties/xsi%3AschemaLocation",
      type: "string",
      title: "The xsi:schemaLocation schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["http://www.opentravel.org/OTA/2003/05\nVehRetResRQ.xsd"],
    },
    POS: {
      $id: "#/properties/POS",
      type: "object",
      title: "The POS schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          Source: {
            ApiKey: "xxx-xxx-xxx",
          },
        },
      ],
      required: ["Source"],
      properties: {
        Source: {
          $id: "#/properties/POS/properties/Source",
          type: "object",
          title: "The Source schema",
          description: "An explanation about the purpose of this instance.",
          default: {},
          examples: [
            {
              ApiKey: "xxx-xxx-xxx",
            },
          ],
          required: ["ApiKey"],
          properties: {
            ApiKey: {
              $id: "#/properties/POS/properties/Source/properties/ApiKey",
              type: "string",
              title: "The ApiKey schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["xxx-xxx-xxx"],
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    Vehicle: {
      $id: "#/properties/Vehicle",
      type: "string",
      title: "The Vehicle schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["619e8f2abd63dda48263ed67"],
    },
    DepositAmount: {
      $id: "#/properties/DepositAmount",
      type: "object",
      title: "The DepositAmount schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          Cents: "500000",
          CurrencyIso: "EUR",
        },
      ],
      required: ["Cents", "CurrencyIso"],
      properties: {
        Cents: {
          $id: "#/properties/DepositAmount/properties/Cents",
          type: "string",
          title: "The Cents schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["500000"],
        },
        CurrencyIso: {
          $id: "#/properties/DepositAmount/properties/CurrencyIso",
          type: "string",
          title: "The CurrencyIso schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["EUR"],
        },
      },
      additionalProperties: false,
    },
    PickupTime: {
      $id: "#/properties/PickupTime",
      type: "string",
      title: "The PickupTime schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["2021-12-24T10:00:00Z"],
    },
    DropoffTime: {
      $id: "#/properties/DropoffTime",
      type: "string",
      title: "The DropoffTime schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["2021-12-27T10:00:00Z"],
    },
  },
  additionalProperties: false,
};

export default async (body: any) => {
  const validator = validateFor(schema);
  validator(body);
  const { DepositAmount, DropoffTime, PickupTime, Vehicle } = body;
  const { Cents, CurrencyIso } = DepositAmount;
  try {
    const bodyData = {
      vehicle: Vehicle,
      session_cookie_id: 1,
      deposit_amount: {
        cents: parseInt(Cents, 10),
        currency_iso: CurrencyIso,
      },
      pickup_time: PickupTime,
      dropoff_time: DropoffTime,
    };

    const { data: cardooResponse } = await axios({
      method: "POST",
      url: "https://sandbox-api.cardoo.finance/partner_api/orders/onetime/deposit_free_price_request",
      data: bodyData,
      headers: {
        "Access-Token": "4d55cd2c-68af-4d5a-9d6b-2e2946fa37b7",
      },
    });

    return [
      {
        DepositFreePriceRequestId: cardooResponse.deposit_free_price_request_id,
        Timestamp: cardooResponse.timestamp,
        Price: { Cents: cardooResponse.price.cents, CurrencyIso: cardooResponse.price.currency_iso },
      },
      200,
      "OTA_DepositFreeRes",
      {
        "xsi:schemaLocation":
          "http://www.opentravel.org/OTA/2003/05 OTA_VehRetResRS.xsd",
      },
    ];
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      throw new ApiError(error.response.data.error);
    } else {
      throw error;
    }
  }
};
