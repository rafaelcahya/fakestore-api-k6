import http from "k6/http";
import { check, group } from "k6";
import { BASE_URL, AUTH_URL, USERNAME, PASSWORD, INVALID_USERNAME, INVALID_PASSWORD } from '../../utils/config.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        'http_req_duration{group:::Auth - Valid Credentials}':["p(95)<1000"],
        'http_req_duration{group:::Auth - Invalid Credentials}':["p(95)<1000"],
        'http_req_duration{group:::Auth - Missing Credentials}':["p(95)<1000"],
        'http_req_failed{group:::Auth - Valid Credentials}':["rate<0.01"],
        'http_req_failed{group:::Auth - Invalid Credentials}':["rate>0.95"],
        'http_req_failed{group:::Auth - Missing Credentials}':["rate>0.95"],
        checks: ["rate>0.95"],
        'checks{group:::Auth - Valid Credentials}':["rate>0.95"],
        'checks{group:::Auth - Invalid Credentials}':["rate>0.95"],
        'checks{group:::Auth - Missing Credentials}':["rate>0.95"],
    },
};

export default function () {
    group('Auth - Valid Credentials', function (){
        let res = http.post(`${BASE_URL}/${AUTH_URL}`,
            JSON.stringify({
                username: USERNAME,
                password: PASSWORD,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 200": (r) => r.status === 200,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })

    group('Auth - Invalid Credentials', function (){
        let res = http.post(`${BASE_URL}/${AUTH_URL}`,
            JSON.stringify({
                username: INVALID_USERNAME,
                password: INVALID_PASSWORD,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 401": (r) => r.status === 401,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })

    group('Auth - Missing Credentials', function (){
        let res = http.post(`${BASE_URL}/${AUTH_URL}`,
            JSON.stringify({
                username: '',
                password: '',
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 400": (r) => r.status === 400,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })
}
