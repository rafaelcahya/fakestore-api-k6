import getProduct from '../users/getProduct.js'
import getProducts from '../users/getProducts.js'
import addProduct from '../users/addProduct.js'
import updateProduct from '../users/updateProduct.js'
import deleteProduct from '../users/deleteProduct.js'

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
    getProduct()
    getProducts()
    addProduct()
    updateProduct()
    deleteProduct()
}
