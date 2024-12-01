# WhatsApp Chat Application

A real-time chat application built with Express.js, Socket.io, and Next.js. This application allows users to send and receive messages instantly, mimicking the behavior of WhatsApp.

## Features
- **Real-time Messaging**: Users can send and receive messages instantly using WebSockets (Socket.io).
- **User Authentication**: Users can sign in and start chatting immediately.
- **Responsive UI**: Built with Next.js and Tailwind CSS for a modern, responsive design.
- **Multi-room Support**: Users can join different chat rooms and chat with multiple users simultaneously.
- **Client-Server Communication**: Using Express for the backend with Socket.io integration and Next.js for the frontend.

## Tech Stack
- **Backend**: Express.js, Socket.io
- **Frontend**: Next.js, React.js, Tailwind CSS
- **Database**: MongoDB (or use any database as per your choice)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io

## Project Structure


/client # Next.js client-side code /pages # Next.js page routes /components # React components /styles # Tailwind CSS styles

/server # Express server-side code /controllers # API controllers (chat, auth) /models # Database models (User, Message) /routes # API routes /socket # Socket.io event handlers /config # Configuration (DB, Auth)

README.md # This file package.json # Project dependencies

bash


## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/whatsapp-chat.git
cd whatsapp-chat
2. Install dependencies for both client and server
Run this command in both /client and /server directories:

bash

npm install
3. Setup the environment variables
In the root directory, create a .env file for your environment variables:

env

# Backend server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-chat
JWT_SECRET=your_jwt_secret_key
In the /client directory, you might want to add any necessary environment variables for your frontend (e.g., API URLs).

4. Running the Application
1. Start the backend server (Express + Socket.io)
bash

cd /server
npm run dev
2. Start the frontend (Next.js)
bash

cd /client
npm run dev
Your application should now be running at http://localhost:3000 (for the client) and the backend will run at http://localhost:5000.

5. Testing the App
Open multiple browser tabs (or different browsers) and test the chat functionality. Users in different tabs should be able to send and receive messages in real-time.

How It Works
Backend (Express + Socket.io)
Socket.io Integration: We use Socket.io to establish a WebSocket connection between the client and server. This allows for real-time communication without needing to refresh the page.
Rooms: Socket.io supports creating rooms where clients can join specific groups. Each room is dedicated to a chat session.
Message Handling: The server listens for messages from clients and broadcasts them to all users in the same room.
Frontend (Next.js)
Socket.io Client: On the client side, Socket.io is integrated with React to send and receive messages in real-time.
User Interface: The UI is built with React components and styled with Tailwind CSS to ensure responsiveness and ease of customization.
Contributing
Feel free to fork and submit issues or pull requests. Contributions are always welcome!

Steps to contribute:
Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Commit your changes (git commit -am 'Add new feature').
Push to your branch (git push origin feature/your-feature-name).
Create a new Pull Request.
License
Distributed under the MIT License. See LICENSE for more information.

Note: Replace the repository URL and other placeholders with your actual project details.

scss


This README gives an overview of the project, installation steps, and how the app works, with a focus on both the backend (Express + Socket.io) and frontend (Next.js) components.
