import http from "k6/http";
import { check, group } from "k6";
import { BASE_URL, USER_URL, USER_ID, USER_ID_NOT_FOUND } from '../../utils/config.js';
import { generateString } from '../../utils/helpers.js';

export const options = {
    vus: 1,
    duration: "10s",
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        'http_req_duration{group:::Update user}':["p(95)<1000"],
        'http_req_duration{group:::Update user - Missing ID}':["p(95)<1000"],
        'http_req_duration{group:::Update user - User not found}':["p(95)<1000"],
        'http_req_failed{group:::Update user}':["rate<0.01"],
        'http_req_failed{group:::Update user - Missing ID}':["rate>0.95"],
        'http_req_failed{group:::Update user - User not found}':["rate>0.95"],
        checks: ["rate>0.95"],
        'checks{group:::Update user}':["rate>0.95"],
        'checks{group:::Update user - Missing ID}':["rate>0.95"],
        'checks{group:::Update user - User not found}':["rate>0.95"],
    },
};

export default function () {
    group('Update user', function (){
        let res = http.put(`${BASE_URL}/${USER_URL}/${USER_ID}`,
            JSON.stringify({
                username: generateString(8),
                email: generateString(8) + '@test.test',
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

    group('Update user - Missing ID', function (){
        let res = http.put(`${BASE_URL}/${USER_URL}/`,
            JSON.stringify({
                username: generateString(8),
                email: generateString(8) + '@test.test',
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        check(res, {
            "Status 404": (r) => r.status === 404,
            "Response time < 1000ms": (r) => r.timings.duration < 1000,
        });
    })

    group('Update user - User not found', function (){
        let res = http.put(`${BASE_URL}/${USER_URL}/${USER_ID_NOT_FOUND}`,
            JSON.stringify({
                username: generateString(8),
                email: generateString(8) + '@test.test',
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
