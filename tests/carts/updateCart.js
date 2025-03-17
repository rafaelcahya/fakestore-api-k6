import http from "k6/http";
import { check, group } from "k6";
import { BASE_URL, CART_URL, CART_ID, CART_ID_NOT_FOUND } from '../../utils/config.js';
import { generateNumber, generateString } from '../../utils/helpers.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        'http_req_duration{group:::Update product}':["p(95)<2000"],
        'http_req_duration{group:::Update product - Missing ID}':["p(95)<2000"],
        'http_req_duration{group:::Update product - product not found}':["p(95)<2000"],
        'http_req_failed{group:::Update product}':["rate<0.01"],
        'http_req_failed{group:::Update product - Missing ID}':["rate>0.95"],
        'http_req_failed{group:::Update product - product not found}':["rate>0.95"],
        checks: ["rate>0.95"],
        'checks{group:::Update product}':["rate>0.95"],
        'checks{group:::Update product - Missing ID}':["rate>0.95"],
        'checks{group:::Update product - product not found}':["rate>0.95"],
    },
};

export default function () {
    group('Update product', function (){
        let res = http.put(`${BASE_URL}/${CART_URL}/${CART_ID}`,
            JSON.stringify({
                userId: generateString(8),
                products: [
                    {
                        title: generateString(8),
                        price: generateNumber(),
                        description: generateString(100),
                        category: generateString(5),
                        image: generateString(5)
                    }
                ]
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 200": (r) => r.status === 200,
            "Response time < 2000ms": (r) => r.timings.duration < 2000,
        });
    })

    group('Update product - Missing ID', function (){
        let res = http.put(`${BASE_URL}/${CART_URL}/`,
            JSON.stringify({
                userId: generateString(8),
                products: [
                    {
                        title: generateString(8),
                        price: generateNumber(),
                        description: generateString(100),
                        category: generateString(5),
                        image: generateString(5)
                    }
                ]
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 404": (r) => r.status === 404,
            "Response time < 2000ms": (r) => r.timings.duration < 2000,
        });
    })

    group('Update product - product not found', function (){
        let res = http.put(`${BASE_URL}/${CART_URL}/${CART_ID_NOT_FOUND}`,
            JSON.stringify({
                userId: generateString(8),
                products: [
                    {
                        title: generateString(8),
                        price: generateNumber(),
                        description: generateString(100),
                        category: generateString(5),
                        image: generateString(5)
                    }
                ]
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 400": (r) => r.status === 400,
            "Response time < 2000ms": (r) => r.timings.duration < 2000,
        });
    })
}
