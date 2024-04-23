# ClubHub


# Installation

Install node from [Here](https://https://nodejs.org/en) if you don't have it installed already

Clone the git repository

Open a Terminal and run `cd frontend` then `npm install` to install all dependencies. Then run `touch .env` to create a file for neccessary environment variables.
Open another new Terminal and run `cd backend` then `npm install` to install all dependencies. Then run `touch .env` to create a file for neccessary environment variables.

The app will not run properly without environment variables.

These variables for the backend
`PORT` you can use 3000
`SECRET` secret key from [getstream.io](https://getstream.io/) dashboard create an application and use the secret key here
`URI` MongoDB URI for any mongoDB database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

In the backend terminal run `npm start` to start the backend

These variables for the frontend
`APIKEY`
`AUTHDOMAIN`
`PROJECTID`
`STORAGEBUCKET`
`MESSAGINGSENDERID`
`APPID`
`MEASUREMENTID`
All of the above are firebase credentials obtained from creating a firebase web app
# URL=http://172.20.10.2:3000
`URL` URL to the backend in the format of http://0.0.0.0:3000 or https://backend.com
VERSION=v1 version of the backend
LIVESTREAMAPIKEY=6wsv4848eu36
`QUALLIAPIKEY` this is the Api key from [getstream.io](https://getstream.io/) dashboard create an application and use paste the API key here.

After getting environment variables sorted, the frontend of this app uses so custom native components as such you'll need to create a development build. Follow Expo's documentation [Here](https://docs.expo.dev/develop/development-builds/create-a-build/) on how to create one.

- Create the build using EAS for which ever device you plan to run on
- Then install the build on the device 
Run the code locally using `npx expo start` and connect with development build.
Expo's documentation will run you throgh this