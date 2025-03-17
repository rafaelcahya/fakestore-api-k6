import http from "k6/http";
import { check, group } from "k6";
import { BASE_URL, CART_URL, CART_ID, CART_ID_NOT_FOUND } from '../../utils/config.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        'http_req_duration{group:::Get cart found}':["p(95)<2000"], 
        'http_req_duration{group:::Get cart not found}':["p(95)<2000"],
        'http_req_failed{group:::Get cart found}':["rate<0.01"], 
        'http_req_failed{group:::Get cart not found}':["rate>0.095"],
        checks: ["rate>0.25"],
        'checks{group:::Get cart found}':["rate>0.25"], 
        'checks{group:::Get cart not found}':["rate>0.25"],
    },
};

export default function () {
    group("Get cart found", function () {
        let res = http.get(`${BASE_URL}/${CART_URL}/${CART_ID}`);
        check(res, {
            "Status 200": (r) => r.status === 200,
            "Response time < 2000ms": (r) => r.timings.duration < 2000,
        });
    })

    group("Get cart not found", function () {
        let res = http.get(`${BASE_URL}/${CART_URL}/${CART_ID_NOT_FOUND}`);
        check(res, {
            "Status 400": (r) => r.status === 400,
            "Response time < 2000ms": (r) => r.timings.duration < 2000,
        });
    })
}
