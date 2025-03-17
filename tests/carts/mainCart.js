import getCart from '../users/getCart.js'
import getCarts from '../users/getCarts.js'
import addCart from '../users/addCart.js'
import updateCart from '../users/updateCart.js'
import deleteCart from '../users/deleteCart.js'

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        group_duration: ["p(95)<1000"],
        checks: ["rate>0.95"],
    },
};

export default function () {
    getCart()
    getCarts()
    addCart()
    updateCart()
    deleteCart()
}
