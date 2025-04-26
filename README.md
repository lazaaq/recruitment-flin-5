## Description :
This project implements a secure authentication system using JWT (JSON Web Tokens) and a database to store user accounts.
1. Database: MongoDB / MySQL / PostgreSQL (choose one based on setup)
2. Backend: Node.js with Express.js
3. Authentication: JWT-based authentication

Available Endpoints:
1. POST /register => Register a new user and save to database.
2. POST /login => Authenticate user and return JWT token.
3. GET /profile => Return user profile data (protected route).

## How to Install :
```bash
git clone https://github.com/lazaaq/recruitment-flin-5
cd recruitment-flin-5
npm install
npm run dev
```

## Test the Application according to the Question
1. Register
URL : http://44.204.71.228:3005/register
Method : POST
Body (JSON):
{ 
"username": "john", 
"password": "password123"
}
Example Response :
{ 
"message": "User registered successfully!"
}

2. Login
URL : http://44.204.71.228:3005/login
Method : POST
Body (JSON):
{ 
"username": "john", 
"password": "password123"
}
Example Response :
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwidXNlcm5hbWUiOiJqb2huIi wiaWF0IjoxNzQ1Njc5NDc3LCJleHAiOjE3NDU2ODMwNzd9.CG4BURMFdmtVngMwipSqTWkhg6zXbOm-1zx-yiLQxWw"}

Later the token will be inserted into the endpoint profile

3. Profile
URL : http://44.204.71.228:3005/profile
Method : GET
Header (Authorization) : Bearer Token, and put the previous token from login on the authorization field
Response
Example Response :
{ 
"id": 0, 
"username": "john"
}