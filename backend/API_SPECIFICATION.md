# API Specification

## Prisma Database Models

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tokens          Token[]
}

model Token {
  id          Int       @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}

model Summary {
  id           String   @id @default(uuid())
  originalText String
  summaryText  String
  bulletPoints String[]
  wordCount    Int
  readingTime  Int
  title        String?
  userId       Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
}

model SlackMessage {
  id          String   @id @default(uuid())
  content     String
  channelId   String
  channelName String
  sentAt      DateTime
  summaryId   String
  createdAt   DateTime @default(now())
  summary     Summary  @relation(fields: [summaryId], references: [id])
}
```

## Authentication Endpoints

---

EP: POST /auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Email already exists", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T10:15:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-06T10:00:00Z"}}}

---

EP: POST /auth/login
DESC: Authenticate user with email and password.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"401":"Invalid email or password", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T10:15:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-06T10:00:00Z"}}}

---

EP: POST /auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"404":"Token not found", "401":"Invalid token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /auth/refresh-tokens
DESC: Refresh authentication tokens using refresh token.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"401":"Invalid or expired refresh token", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T10:15:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-06T10:00:00Z"}}

---

EP: POST /auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"404":"User not found", "422":"Invalid email format", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired token", "422":"Invalid password format", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/reset-password?token=reset_token_here -H "Content-Type: application/json" -d '{"password":"newpassword123"}'
EX_RES_204: {}

---

EP: POST /auth/send-verification-email
DESC: Send email verification to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: POST /auth/verify-email
DESC: Verify user email using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/verify-email?token=verify_token_here
EX_RES_204: {}

## User Management Endpoints

---

EP: POST /users
DESC: Create a new user (admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already exists", "401":"Unauthorized", "403":"Forbidden - Admin access required", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Smith","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Smith","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}

---

EP: GET /users
DESC: Get paginated list of users with optional filters.
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Forbidden - Admin access required", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?limit=10&page=1&sortBy=createdAt:desc" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /users/:userId
DESC: Get user by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Forbidden - Can only access own data", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}

---

EP: PATCH /users/:userId
DESC: Update user information.
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name:str, email:str, password:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already exists", "401":"Unauthorized", "403":"Forbidden - Can only update own data", "404":"User not found", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Updated"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Updated","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:30:00Z"}

---

EP: DELETE /users/:userId
DESC: Delete user by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "403":"Forbidden - Can only delete own account", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

## AI Summarization Endpoints

---

EP: POST /summarize
DESC: Generate AI summary and bullet points from text.
IN: headers:{Authorization:str!}, body:{text:str!, maxBulletPoints:int, tone:str, includeEmojis:bool}
OUT: 200:{summary:str, bulletPoints:arr[str], wordCount:int, readingTime:int}
ERR: {"400":"Text content is required", "401":"Unauthorized", "422":"Invalid input parameters", "500":"AI service error"}
EX_REQ: curl -X POST /summarize -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"text":"Q3 Marketing Strategy focuses on digital channels. Key initiatives: social media campaign, partnerships. Expected outcome: 15% increase in lead generation.","maxBulletPoints":5,"tone":"professional","includeEmojis":false}'
EX_RES_200: {"summary":"Q3 Marketing Strategy focuses on digital channels. Key initiatives: social media campaign, partnerships. Expected outcome: 15% increase in lead generation. Executed outcome by AI Slack Summarizer.","bulletPoints":["• Q3 Marketing Strategy focuses on digital channels.","• Key initiatives: social media campaign, partnerships.","• Expected outcome: 15% increase in lead generation.","• Executed outcome by AI Slack Summarizer."],"wordCount":24,"readingTime":1}

## Slack Integration Endpoints

---

EP: POST /slack/send-message
DESC: Send summary message to Slack channel.
IN: headers:{Authorization:str!}, body:{channelId:str!, message:str!, summaryId:str!}
OUT: 200:{success:bool, messageId:str, timestamp:str}
ERR: {"400":"Invalid channel or message", "401":"Unauthorized", "403":"Slack integration not configured", "500":"Slack API error"}
EX_REQ: curl -X POST /slack/send-message -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"channelId":"C1234567890","message":"Summary: Q3 Marketing Strategy...","summaryId":"summary_123"}'
EX_RES_200: {"success":true,"messageId":"1234567890.123456","timestamp":"2025-10-30T10:00:00Z"}

---

EP: GET /slack/channels
DESC: Get list of available Slack channels.
IN: headers:{Authorization:str!}
OUT: 200:arr[{id:str, name:str, isPrivate:bool, memberCount:int}]
ERR: {"401":"Unauthorized", "403":"Slack integration not configured", "500":"Slack API error"}
EX_REQ: curl -X GET /slack/channels -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: [{"id":"C1234567890","name":"general","isPrivate":false,"memberCount":25},{"id":"C0987654321","name":"marketing","isPrivate":false,"memberCount":10}]

---

EP: GET /slack/workspaces
DESC: Get list of connected Slack workspaces.
IN: headers:{Authorization:str!}
OUT: 200:arr[{id:str, name:str, domain:str}]
ERR: {"401":"Unauthorized", "403":"Slack integration not configured", "500":"Slack API error"}
EX_REQ: curl -X GET /slack/workspaces -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: [{"id":"T1234567890","name":"My Company","domain":"mycompany.slack.com"}]