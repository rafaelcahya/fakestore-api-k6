import http from "k6/http";
import { check, group } from "k6";
import { BASE_URL, USER_URL, USER_ID, USER_ID_NOT_FOUND } from '../../utils/config.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        'http_req_duration{group:::Get user found}':["p(95)<1000"], 
        'http_req_duration{group:::Get user not found}':["p(95)<1000"],
        'http_req_failed{group:::Get user found}':["rate<0.01"], 
        'http_req_failed{group:::Get user not found}':["rate>0.095"],
        checks: ["rate>0.25"],
        'checks{group:::Get user found}':["rate>0.25"], 
        'checks{group:::Get user not found}':["rate>0.25"],
    },
};

export default function () {
    group("Get user found", function () {
        let res = http.get(`${BASE_URL}/${USER_URL}/${USER_ID}`);
        check(res, {
            "Status 200": (r) => r.status === 200,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })

    group("Get user not found", function () {
        let res = http.get(`${BASE_URL}/${USER_URL}/${USER_ID_NOT_FOUND}`);
        check(res, {
            "Status 400": (r) => r.status === 400,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })
}
