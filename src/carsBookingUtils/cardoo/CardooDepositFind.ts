import axios from "axios";
import { ApiError } from "../../utils/ApiError";
import { validateFor } from "../../utils/JsonValidator";

const schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "http://example.com/sdsdsdwsd.json",
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
          ApiKey: "c32419e4-d316-4a54-b20d-296eb2dcf7a2",
        },
      },
      OrderId: "3a58ed01-9fab-45b4-b22b-c84478e68f1d",
    },
  ],
  required: ["xmlns", "xmlns:xsi", "xsi:schemaLocation", "POS", "OrderId"],
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
            ApiKey: "c32419e4-d316-4a54-b20d-296eb2dcf7a2",
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
              ApiKey: "c32419e4-d316-4a54-b20d-296eb2dcf7a2",
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
              examples: ["c32419e4-d316-4a54-b20d-296eb2dcf7a2"],
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
    OrderId: {
      $id: "#/properties/OrderId",
      type: "string",
      title: "The OrderId schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["3a58ed01-9fab-45b4-b22b-c84478e68f1d"],
    },
  },
  additionalProperties: true,
};

export default async (body: any) => {
  const validator = validateFor(schema);
  validator(body);

  try {
    const { data: cardooResponse } = await axios({
      method: "get",
      url:
        "https://sandbox-api.cardoo.finance/partner_api/orders/onetime/" +
        body.OrderId,
      headers: {
        "Access-Token": "4d55cd2c-68af-4d5a-9d6b-2e2946fa37b7",
      },
    });

    return [
      cardooResponse,
      200,
      "OTA_DepositFreeRes",
      {
        "xsi:schemaLocation":
          "http://www.opentravel.org/OTA/2003/05 OTA_VehRetResRS.xsd",
      },
    ];
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
      throw new ApiError(error.response.data.message);
    } else {
      throw error;
    }
  }
};
