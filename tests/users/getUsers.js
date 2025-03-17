import http from "k6/http";
import { check } from "k6";
import { BASE_URL, USER_URL } from '../../utils/config.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.25"],
    },
};

export default function () {
    let res = http.get(`${BASE_URL}/${USER_URL}`);
    check(res, {
        "Status 200": (r) => r.status === 200,
        "Response time < 1000ms": (r) => r.timings.duration < 1000,
    });
}
