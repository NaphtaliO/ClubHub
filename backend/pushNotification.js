const jwt = require("jsonwebtoken");
const fs = require('fs');
const http2 = require('http2');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const authorizationToken = jwt.sign(
    {
        iss: process.env.APPLE_TEAM_ID,
        iat: Math.round(new Date().getTime() / 1000),
    },
    fs.readFileSync("./AuthKey_4FFK68U64B.p8", "utf8"),
    {
        header: {
            alg: "ES256",
            kid: "4FFK68U64B",
        },
    }
);

const sendNotification = async (notification) => {
    const IS_PRODUCTION = true;
    try {
        if (notification.token.type === 'ios') {
            const client = http2.connect(
                IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
            );
            const request = client.request({
                ':method': 'POST',
                ':scheme': 'https',
                'apns-topic': 'com.naphtali2003.ClubHub',
                ':path': '/3/device/' + notification.token.data, // This is the native device token you grabbed client-side
                authorization: `bearer ${authorizationToken}`, // This is the JSON web token generated in the "Authorization" step
            });
            request.setEncoding('utf8');

            request.write(
                JSON.stringify({
                    aps: {
                        alert: {
                            title: notification.title,
                            body: notification.body,
                        },
                    },
                    sound: "default",
                    body: notification.data,
                    experienceId: '@naphtali2003/ClubHub', // Required when testing in the Expo Go app
                    scopeKey: '@naphtali2003/ClubHub', // Required when testing in the Expo Go app
                })
            );
            request.on('response', (headers, flags) => {
                for (const name in headers) {
                    console.log(`${name}: ${headers[name]}`);
                }
            });

            let dataString = '';
            request.on('data', chunk => {
                dataString += chunk;
            });

            request.on('end', () => {
                console.log(`\n${dataString}`);
                client.close();
            });

            request.end();
        } else {
            await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `key=${process.env.FCM_SERVER_KEY}`,
                },
                body: JSON.stringify({
                    to: `${notification.token.data}`,
                    priority: 'normal',
                    data: {
                        experienceId: '@naphtali2003/ClubHub',
                        scopeKey: '@naphtali2003/ClubHub',
                        title: notification.title,
                        message: notification.body,
                        body: notification.data
                    },
                }),
            });
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    sendNotification
};