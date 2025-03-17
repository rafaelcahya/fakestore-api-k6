import getUser from '../users/getUser.js'
import getUsers from '../users/getUsers.js'
import addUser from '../users/addUser.js'
import updateUser from '../users/updateUser.js'
import deleteUser from '../users/deleteUser.js'

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
    getUser()
    getUsers()
    addUser()
    updateUser()
    deleteUser()
}
