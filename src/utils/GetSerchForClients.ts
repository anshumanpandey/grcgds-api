import RentitCarsSearchUtil from "../carSearchUtils/RentitCarsSearchUtil"

export const GetSerchForClients = (ids: string[]) => {
    const search: {[k: string]: any} = {
        "11": RentitCarsSearchUtil
    }


    return ids.reduce<any[]>((arr, next) => {
        if (search[next]) {
            arr.push(search[next])
        }

        return arr

    },[])

}