import http from "k6/http";
import { check, group } from "k6";
import { BASE_URL } from '../../utils/config.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        'http_req_duration{group:::Update product}':["p(95)<1000"],
        'http_req_duration{group:::Update product - Missing ID}':["p(95)<1000"],
        'http_req_duration{group:::Update product - product not found}':["p(95)<1000"],
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
    group('Delete product', function (){
        let res = http.del(`${BASE_URL}/${PRODUCT_URL}/${PRODUCT_ID}`);
        check(res, {
            "Status 200": (r) => r.status === 200,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })

    group('Delete product - Missing ID', function (){
        let res = http.del(`${BASE_URL}/${PRODUCT_URL}/`);
        check(res, {
            "Status 404": (r) => r.status === 404,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })

    group('Delete product - product not found', function (){
        let res = http.del(`${BASE_URL}/${PRODUCT_URL}/${PRODUCT_ID_NOT_FOUND}`);
        check(res, {
            "Status 400": (r) => r.status === 400,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })
}
