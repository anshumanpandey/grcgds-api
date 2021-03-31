export const getPaypalCredentials = ({ requetorClient, supplier }: { requetorClient: any, supplier: any }) => {
    if (requetorClient.user_type != "mobileuser") return {}
    const res = {
        "PaymentClientID": "",
        "PaymentKey": "",
        "PaymentMethod": "",
        ElectronicAgreements: supplier.electronic_agreement || "",
        AgreementFormat: supplier.agreement_format || "",
        CancellationPeriod: supplier.cancellation_period || "",
    }

    if (!supplier.paypalClientId || !supplier.paypalSecretKey) return res

    res.PaymentClientID = supplier.paypalClientId
    res.PaymentKey = supplier.paypalSecretKey
    res.PaymentMethod = "Paypal"

    return res
}