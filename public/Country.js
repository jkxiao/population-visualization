import apiRequest from "./api.js"

export default class Country {

    static async listRegions() {
        let [status, data] = await apiRequest("GET", "/regions");
        return data.regions;
    }

    static async listCountries(opt=null) {
        let request = "/countries";
        if (opt !== null) {
            request += `/${opt.type}`;
            if (opt.type === "regions" && "region" in opt) {
                let region = opt.region.replaceAll(" ", "%20").replaceAll("&", "%26");
                request += `?region=${region}`;
            }
        }
        let [status, data] = await apiRequest("GET", request);
        return data.countries;
    }

    static async findCountry(code) {
        let [status, data] = await apiRequest("GET", `/countries/${code}`);
        return data;
    }

    static async updateData(code, year, population) {
        let [status, data] = await apiRequest("PATCH", `/countries/${code}?year=${year}`, { year, population });
        return data;
    }

    static async createEntry(entry) {
        let [status, data] = await apiRequest("POST", `/countries/new`, entry);
        return data;
    }

    constructor(data) {
        Object.assign(this, data);
    }
}