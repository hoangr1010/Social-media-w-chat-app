# Social Media Chat App with Video Call

## Overview

This project is a social media chat application that allows users to interact through a social media and also communicate with each other through text messages and video calls. It aims to provide a seamless and engaging communication experience for users.

- Youtube Demo : <a target="__blanck" href="">Click On Me</a>

## Technologies Used

- MERN stack (MongoDB, Express.js, React.js, and Node.js)
- Material UI
- Redux Toolkit
- Socket.io
- WebRTC (Peerjs)
- AWS S3
- JWT

## Features

- Social Interaction: users are able to post status with picture, like and comment feature is also offered
- User authentication: users can sign up, log in, and log out
- Profile page where users can show their avatar and display name
- Real-time chat: users can send and receive messages in real-time, online/offline feature is offered
- Video call: Enjoy the real-time video chat
- Notifications: users can receive notifications on new messages
- Responsive design: the website is optimized for different screen sizes and devices
- Dark mode: user can select between dark/light mode

## Configuration and Setup
In order to run this project locally, simply fork and clone the repository or download as zip and unzip on your machine.

- Open the project in your prefered code editor.
- Go to terminal -> New terminal (If you are using VS code)
- Split your terminal into two (run the client on one terminal and the server on the other terminal)

In the CLIENT terminal
- cd client and create folder name 'env' and create .env file in 'env' folder of your client directory.
- Supply the following credentials

```
REACT_APP_BACKEND_URL=
REACT_APP_STATIC_ASSETS_URL=<YOUR_AWS_S3_URL>
```

```
$ cd client
$ npm install (to install client-side dependencies)
$ npm start (to start the client)
```
In the SERVER terminal
- cd server and create folder name 'env' and create .env file in 'env' folder of your client directory.
- Supply the following credentials

```
PORT=
MONGODB_URL=
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_DB=
JWT_SECRET=
CLIENT_URL=
```

For server, we need to configure AWS S3 credentials, do this (for linux/macOS):

```
$ mkdir ~/.aws && touch ~/.aws/credentials
```
Inside file credentials, we write this:
```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

