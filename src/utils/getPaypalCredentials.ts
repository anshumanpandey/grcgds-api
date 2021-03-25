export const getPaypalCredentials = (user: any) => {
    const res = {
        "PaymentClientID": "",
        "PaymentKey": "",
        "PaymentMethod": "",
    }

    if (!user.paypalClientId || !user.paypalSecretKey) return res

    res.PaymentClientID = user.paypalClientId
    res.PaymentKey = user.paypalSecretKey
    res.PaymentMethod = "Paypal"

    return res
}