# NoteVerse API Documentation

Base URL (local): `http://localhost:5000`

## Authentication
Protected endpoints require:

```http
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### 1) Register
**POST** `/api/auth/register`

Request body:
```json
{
  "name": "Tochukwu Sunday",
  "email": "tochukwusun24@gmail.com",
  "password": "password123"
}
```

Success (`201`):
```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Tochukwu Sunday",
    "email": "tochukwusun24@gmail.com",
    "bio": "",
    "profilePicture": "",
    "avatar": ""
  }
}
```

---

### 2) Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "tochukwusun24@gmail.com",
  "password": "password123"
}
```

Success (`200`): same shape as register.

---

### 3) Get My Profile
**GET** `/api/auth/me` (protected)

Success (`200`):
```json
{
  "user": {
    "_id": "...",
    "name": "Tochukwu Sunday",
    "email": "tochukwusun24@gmail.com",
    "bio": "...",
    "profilePicture": "...",
    "avatar": "..."
  }
}
```

---

### 4) Update My Profile
**PUT** `/api/auth/me` (protected)

Request body (all optional):
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "profilePicture": "https://..."
}
```

Success (`200`):
```json
{
  "user": {
    "id": "...",
    "name": "Updated Name",
    "email": "tochukwusun24@gmail.com",
    "bio": "Updated bio",
    "profilePicture": "https://...",
    "avatar": "https://..."
  }
}
```

---

### 5) Delete My Account
**DELETE** `/api/auth/me` (protected)

Success (`200`):
```json
{
  "message": "Account deleted successfully"
}
```

This also deletes all notes owned by the user.

---

## Notes Endpoints
All note routes are protected under `/api/notes`.

### Note Object
```json
{
  "_id": "...",
  "user": "...",
  "title": "My note",
  "content": "Details",
  "tags": ["work", "ideas"],
  "imageUrls": ["https://..."],
  "videoUrls": ["https://..."],
  "pinned": false,
  "archived": false,
  "createdAt": "2026-03-03T10:00:00.000Z",
  "updatedAt": "2026-03-03T10:00:00.000Z"
}
```

### 1) Get Notes
**GET** `/api/notes`

Query params:
- `q` = search keyword (title/content/tags)
- `sort=asc|desc` (default desc)
- `includeArchived=true|false` (default false)

Example:
```http
GET /api/notes?q=project&sort=desc&includeArchived=false
```

Success (`200`):
```json
{
  "notes": [
    {
      "_id": "...",
      "title": "Project ideas",
      "content": "...",
      "tags": ["project"],
      "imageUrls": [],
      "videoUrls": [],
      "pinned": true,
      "archived": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 2) Create Note
**POST** `/api/notes`

Request body:
```json
{
  "title": "Meeting Notes",
  "content": "Sprint backlog updates",
  "tags": ["work", "meeting"],
  "imageUrls": ["https://res.cloudinary.com/.../image/upload/..."],
  "videoUrls": ["https://res.cloudinary.com/.../video/upload/..."],
  "pinned": true
}
```

Success (`201`):
```json
{
  "message": "Note created successfully",
  "note": { "_id": "...", "title": "Meeting Notes", "content": "..." }
}
```

---

### 3) Get Note by ID
**GET** `/api/notes/:id`

Success (`200`):
```json
{
  "note": {
    "_id": "...",
    "title": "Meeting Notes",
    "content": "..."
  }
}
```

---

### 4) Update Note
**PUT** `/api/notes/:id`

Partial update is supported. Send only fields you want to change.

Request body example:
```json
{
  "title": "Updated title",
  "pinned": false,
  "tags": ["updated", "tag"]
}
```

Success (`200`):
```json
{
  "message": "Note updated successfully",
  "note": {
    "_id": "...",
    "title": "Updated title",
    "pinned": false
  }
}
```

---

### 5) Delete Note
**DELETE** `/api/notes/:id`

Success (`200`):
```json
{
  "message": "Note deleted successfully",
  "note": { "_id": "..." }
}
```

---

## Resources Endpoint

### Get Public Resource Links
**GET** `/api/resources`

Success (`200`):
```json
{
  "links": [
    {
      "_id": "...",
      "title": "Atomic Habits",
      "description": "Productivity and habits",
      "url": "https://...",
      "category": "book",
      "active": true,
      "order": 1
    }
  ]
}
```

Allowed categories in backend model:
- `book`
- `research`
- `ai`
- `sponsor`

---

## Common Error Responses

`400 Bad Request`
```json
{ "error": "title and content are required" }
```

`401 Unauthorized`
```json
{ "error": "Not authorized" }
```

`404 Not Found`
```json
{ "error": "Note not found" }
```

`409 Conflict`
```json
{ "error": "Email already in use" }
```

`429 Too Many Requests`
```json
{ "error": "Too many requests" }
```

`500 Server Error`
```json
{ "error": "<server message>" }
```
