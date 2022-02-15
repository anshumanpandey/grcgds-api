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
          ApiKey: "c32419e4-d316-4a54-b20d-296eb2dcf7a2",
        },
      },
      PartnerOrderId: "X666",
      Customer: {
        FirstName: "Jane",
        LastName: "Doe",
        Email: "jane@gmail.com",
        PhoneNumber: "+1-541-754-3010",
      },
      PickupTime: "2021-12-24T10:00:00+02:00",
      DropoffTime: "2021-12-28T10:00:00+02:00",
      City: "Florence",
      Country: "Italy",
      Vehicle: "BMW I5",
      Callbacks: {
        GuaranteeStatusChanged: "https://CallbackUrl",
      },
      Redirects: {
        SuccessUrl: "https://success",
        FailureUrl: "https://FailureUrl",
      },
      DepositFree: {
        DepositFreePriceRequestId: "76aed270-4b39-44ca-b6c2-a1b8d0b67288",
      },
      Acquiring: {
        Prepay: "full",
        Price: {
          Cents: "10000",
          CurrencyIso: "EUR",
        },
      },
    },
  ],
  required: [
    "xmlns",
    "xmlns:xsi",
    "xsi:schemaLocation",
    "POS",
    "PartnerOrderId",
    "Customer",
    "PickupTime",
    "DropoffTime",
    "City",
    "Country",
    "Vehicle",
    "Callbacks",
    "Redirects",
    "DepositFree",
    "Acquiring",
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
    PartnerOrderId: {
      $id: "#/properties/PartnerOrderId",
      type: "string",
      title: "The PartnerOrderId schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["X666"],
    },
    Customer: {
      $id: "#/properties/Customer",
      type: "object",
      title: "The Customer schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          FirstName: "Jane",
          LastName: "Doe",
          Email: "jane@gmail.com",
          PhoneNumber: "+1-541-754-3010",
        },
      ],
      required: ["FirstName", "LastName", "Email", "PhoneNumber"],
      properties: {
        FirstName: {
          $id: "#/properties/Customer/properties/FirstName",
          type: "string",
          title: "The FirstName schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["Jane"],
        },
        LastName: {
          $id: "#/properties/Customer/properties/LastName",
          type: "string",
          title: "The LastName schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["Doe"],
        },
        Email: {
          $id: "#/properties/Customer/properties/Email",
          type: "string",
          title: "The Email schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["jane@gmail.com"],
        },
        PhoneNumber: {
          $id: "#/properties/Customer/properties/PhoneNumber",
          type: "string",
          title: "The PhoneNumber schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["+1-541-754-3010"],
        },
      },
      additionalProperties: true,
    },
    PickupTime: {
      $id: "#/properties/PickupTime",
      type: "string",
      title: "The PickupTime schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["2021-12-24T10:00:00+02:00"],
    },
    DropoffTime: {
      $id: "#/properties/DropoffTime",
      type: "string",
      title: "The DropoffTime schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["2021-12-28T10:00:00+02:00"],
    },
    City: {
      $id: "#/properties/City",
      type: "string",
      title: "The City schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["Florence"],
    },
    Country: {
      $id: "#/properties/Country",
      type: "string",
      title: "The Country schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["Italy"],
    },
    Vehicle: {
      $id: "#/properties/Vehicle",
      type: "string",
      title: "The Vehicle schema",
      description: "An explanation about the purpose of this instance.",
      default: "",
      examples: ["BMW I5"],
    },
    Callbacks: {
      $id: "#/properties/Callbacks",
      type: "object",
      title: "The Callbacks schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          GuaranteeStatusChanged: "https://CallbackUrl",
        },
      ],
      required: ["GuaranteeStatusChanged"],
      properties: {
        GuaranteeStatusChanged: {
          $id: "#/properties/Callbacks/properties/GuaranteeStatusChanged",
          type: "string",
          title: "The GuaranteeStatusChanged schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["https://CallbackUrl"],
        },
      },
      additionalProperties: true,
    },
    Redirects: {
      $id: "#/properties/Redirects",
      type: "object",
      title: "The Redirects schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          SuccessUrl: "https://success",
          FailureUrl: "https://FailureUrl",
        },
      ],
      required: ["SuccessUrl", "FailureUrl"],
      properties: {
        SuccessUrl: {
          $id: "#/properties/Redirects/properties/SuccessUrl",
          type: "string",
          title: "The SuccessUrl schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["https://success"],
        },
        FailureUrl: {
          $id: "#/properties/Redirects/properties/FailureUrl",
          type: "string",
          title: "The FailureUrl schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["https://FailureUrl"],
        },
      },
      additionalProperties: true,
    },
    DepositFree: {
      $id: "#/properties/DepositFree",
      type: "object",
      title: "The DepositFree schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          DepositFreePriceRequestId: "76aed270-4b39-44ca-b6c2-a1b8d0b67288",
        },
      ],
      required: ["DepositFreePriceRequestId"],
      properties: {
        DepositFreePriceRequestId: {
          $id: "#/properties/DepositFree/properties/DepositFreePriceRequestId",
          type: "string",
          title: "The DepositFreePriceRequestId schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["76aed270-4b39-44ca-b6c2-a1b8d0b67288"],
        },
      },
      additionalProperties: true,
    },
    Acquiring: {
      $id: "#/properties/Acquiring",
      type: "object",
      title: "The Acquiring schema",
      description: "An explanation about the purpose of this instance.",
      default: {},
      examples: [
        {
          Prepay: "full",
          Price: {
            Cents: "10000",
            CurrencyIso: "EUR",
          },
        },
      ],
      required: ["Prepay", "Price"],
      properties: {
        Prepay: {
          $id: "#/properties/Acquiring/properties/Prepay",
          type: "string",
          title: "The Prepay schema",
          description: "An explanation about the purpose of this instance.",
          default: "",
          examples: ["full"],
        },
        Price: {
          $id: "#/properties/Acquiring/properties/Price",
          type: "object",
          title: "The Price schema",
          description: "An explanation about the purpose of this instance.",
          default: {},
          examples: [
            {
              Cents: "10000",
              CurrencyIso: "EUR",
            },
          ],
          required: ["Cents", "CurrencyIso"],
          properties: {
            Cents: {
              $id: "#/properties/Acquiring/properties/Price/properties/Cents",
              type: "string",
              title: "The Cents schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["10000"],
            },
            CurrencyIso: {
              $id: "#/properties/Acquiring/properties/Price/properties/CurrencyIso",
              type: "string",
              title: "The CurrencyIso schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["EUR"],
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
};

export default async (body: any) => {
  const validator = validateFor(schema);
  validator(body);

  try {
    const bodyData = {
      partner_order_id: body.PartnerOrderId,
      customer: {
        first_name: body.Customer.FirstName,
        last_name: body.Customer.LastName,
        email: body.Customer.LastName,
        phone_number: body.Customer.PhoneNumber,
      },
      pickup_time: body.PickupTime,
      dropoff_time: body.DropoffTime,
      city: body.City,
      country: body.Country,
      vehicle: body.Vehicle,
      callbacks: {
        guarantee_status_changed: body.Callbacks.GuaranteeStatusChanged,
      },
      redirects: {
        success_url: body.Redirects.SuccessUrl,
        failure_url: body.Redirects.FailureUrl,
      },
      deposit_free: {
        deposit_free_price_request_id:
          body.DepositFree.DepositFreePriceRequestId,
      },
      acquiring: {
        prepay: body.Acquiring.prepay,
        price: {
          cents: body.Acquiring.Price.Cents,
          currency_iso: body.Acquiring.Price.CurrencyIso,
        },
      },
    };

    const { data: cardooResponse } = await axios({
      method: "POST",
      url: "https://sandbox-api.cardoo.finance/partner_api/orders/onetime",
      data: bodyData,
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
      throw new ApiError(error.response.data.error.message);
    } else {
      throw error;
    }
  }
};
