import axios from "axios";
import { ApiError } from "../../utils/ApiError";
import { validateFor } from "../../utils/JsonValidator";

const schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  properties: {
    xmlns: {
      type: "string",
    },
    "xmlns:xsi": {
      type: "string",
    },
    "xsi:schemaLocation": {
      type: "string",
    },
    POS: {
      type: "object",
      properties: {
        Source: {
          type: "object",
          properties: {
            ApiKey: {
              type: "string",
            },
          },
          required: ["ApiKey"],
        },
      },
      required: ["Source"],
    },
    Vehicle: {
      type: "string",
    },
    DepositAmount: {
      type: "object",
      properties: {
        Cents: {
          type: "string",
        },
        CurrencyIso: {
          type: "string",
        },
      },
      required: ["Cents", "CurrencyIso"],
    },
    PickupTime: {
      type: "string",
    },
    DropoffTime: {
      type: "string",
    },
    PartnerOrderId: {
      type: "string",
    },
    Customer: {
      type: "object",
      properties: {
        FirstName: {
          type: "string",
        },
        LastName: {
          type: "string",
        },
        Email: {
          type: "string",
        },
        PhoneNumber: {
          type: "string",
        },
      },
      required: ["FirstName", "LastName", "Email", "PhoneNumber"],
    },
    City: {
      type: "string",
    },
    Country: {
      type: "string",
    },
    Callbacks: {
      type: "object",
      properties: {
        GuaranteeStatusChanged: {
          type: "string",
        },
      },
      required: ["GuaranteeStatusChanged"],
    },
    Redirects: {
      type: "object",
      properties: {
        SuccessUrl: {
          type: "string",
        },
        FailureUrl: {
          type: "string",
        },
      },
      required: ["SuccessUrl", "FailureUrl"],
    },
    DepositFree: {
      type: "object",
      properties: {
        DepositFreePriceRequestId: {
          type: "string",
        },
      },
      required: ["DepositFreePriceRequestId"],
    },
    Acquiring: {
      type: "object",
      properties: {
        Prepay: {
          type: "string",
        },
        Price: {
          type: "object",
          properties: {
            Cents: {
              type: "string",
            },
            CurrencyIso: {
              type: "string",
            },
          },
          required: ["Cents", "CurrencyIso"],
        },
      },
      required: ["Prepay", "Price"],
    },
  },
  required: [
    "xmlns",
    "xmlns:xsi",
    "xsi:schemaLocation",
    "POS",
    "Vehicle",
    "DepositAmount",
    "PickupTime",
    "DropoffTime",
    "PartnerOrderId",
    "Customer",
    "City",
    "Country",
    "Callbacks",
    "Redirects",
    "DepositFree",
    "Acquiring",
  ],
};



const BASE_URL =
  "https://sandbox-api.cardoo.finance/partner_api/orders/onetime";

export default async (body: any) => {
  const validator = validateFor(schema);
  validator(body);
  const { DepositAmount, DropoffTime, PickupTime, Vehicle } = body;
  const { Cents, CurrencyIso } = DepositAmount;
  try {
    const bodyData1 = {
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
      url: BASE_URL + "/deposit_free_price_request",
      data: bodyData1,
      headers: {
        "Access-Token": "4d55cd2c-68af-4d5a-9d6b-2e2946fa37b7",
      },
    });

    const bodyData2 = {
      partner_order_id: body.PartnerOrderId,
      customer: {
        first_name: body.Customer.FirstName,
        last_name: body.Customer.LastName,
        email: body.Customer.Email,
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
          cardooResponse.deposit_free_price_request_id,
      },
      acquiring: {
        prepay: body.Acquiring.Prepay,
        price: {
          cents: parseInt(body.Acquiring.Price.Cents, 10),
          currency_iso: body.Acquiring.Price.CurrencyIso,
        },
      },
    };

    const { data: cardooOrderResponse } = await axios({
      method: "POST",
      url: BASE_URL,
      data: bodyData2,
      headers: {
        "Access-Token": "4d55cd2c-68af-4d5a-9d6b-2e2946fa37b7",
      },
    });

    const { data: cardooFindResponse } = await axios({
      method: "get",
      url: BASE_URL + "/" + cardooOrderResponse.order_id,
      headers: {
        "Access-Token": "4d55cd2c-68af-4d5a-9d6b-2e2946fa37b7",
      },
    });

    return [
      {
        OrderId: cardooFindResponse.order_id,
        GuaranteeIssuanceStatus: cardooFindResponse.guarantee_issuance_status,
        InvoiceState: cardooFindResponse.invoice_state,
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
