import RentitCarsSearchUtil from "../carSearchUtils/RentitCarsSearchUtil"
import SurpriceCarsSearchUtil from "../carSearchUtils/SurpriceCarsSearchUtil"

export const GetSerchForClients = (ids: string[]) => {
    const search: {[k: string]: any} = {
        "11": RentitCarsSearchUtil,
        "37": SurpriceCarsSearchUtil,
    }


    return ids.reduce<any[]>((arr, next) => {
        if (search[next]) {
            arr.push(search[next])
        }

        return arr

    },[])

}