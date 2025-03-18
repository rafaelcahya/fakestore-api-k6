import getCart from '../carts/getCart.js'
import getCarts from '../carts/getCarts.js'
import addCart from '../carts/addCart.js'
import updateCart from '../carts/updateCart.js'
import deleteCart from '../carts/deleteCart.js'

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
