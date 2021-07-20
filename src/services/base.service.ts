import axios from "axios";
import { Config } from "../environment";

export class HttpService {
    CancelToken
    source

    constructor() {
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source();
    }

    /**
     * Set Token On Header
     * @param token
     */
    static setToken(token) {
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    /**
     * Fetch data from server
     * @param url Endpoint link
     * @return Promise
     */
    get = (url, params ) =>
        axios.get(`${Config.API_ENDPOINT}/${url}`, {
            params,
            cancelToken: this.source.token,
        });

    /**
     * Write data over server
     * @param url Endpoint link
     * @param body Data to send over server
     * @return Promise
     */
    post = (url, body, options = {}) =>
        axios.post(`${Config.API_ENDPOINT}/${url}`, body, {
            ...options,
            cancelToken: this.source.token,
        });

    /**
     * Delete Data From Server
     * @param url Endpoint link
     * @param params Embed as query params
     * @return Promise
     */
    delete = (url, params, data) =>
        axios.delete(`${Config.API_ENDPOINT}/${url}`, { params, data });

    /**
     * Update data on server
     * @param url Endpoint link
     * @param body Data to send over server
     * @param params Embed as query params
     * @return Promise
     */
    put = (url, body, params) =>
        axios.put(`${Config.API_ENDPOINT}/${url}`, body, {
            ...params,
            cancelToken: this.source.token,
        });

    updateCancelToken() {
        this.source = this.CancelToken.source();
    }

    cancel = () => {
        this.source.cancel("Explicitly cancelled HTTP request");
        this.updateCancelToken();
    };
}
