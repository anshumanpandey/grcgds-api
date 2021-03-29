export const getPaypalCredentials = (user: any) => {
    const res = {
        "PaymentClientID": "",
        "PaymentKey": "",
        "PaymentMethod": "",
        ElectronicAgreements: user.electronic_agreement || "",
        AgreementFormat: user.agreement_format || "",
        CancellationPeriod: user.cancellation_period || "",
    }

    if (!user.paypalClientId || !user.paypalSecretKey) return res

    res.PaymentClientID = user.paypalClientId
    res.PaymentKey = user.paypalSecretKey
    res.PaymentMethod = "Paypal"

    return res
}