import http from "k6/http";
import { check } from "k6";
import { BASE_URL, CART_URL } from '../../utils/config.js';
import { generateNumber, generateString } from '../../utils/helpers.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.95"],
    },
};

export default function () {
    let res = http.post(`${BASE_URL}/${CART_URL}`,
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
}
