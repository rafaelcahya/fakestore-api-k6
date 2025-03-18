import getProduct from '../products/getProduct.js'
import getProducts from '../products/getProducts.js'
import addProduct from '../products/addProduct.js'
import updateProduct from '../products/updateProduct.js'
import deleteProduct from '../products/deleteProduct.js'

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
