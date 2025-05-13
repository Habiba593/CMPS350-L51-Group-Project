// index.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import fs from 'fs/promises';
import cookieParser from 'cookie-parser';

// Get the directory name correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(join(__dirname, '..', 'frontend')));
app.use(express.json());
app.use(cookieParser());

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple auth endpoints - direct implementation without router
app.post('/api/auth/callback/credentials', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}`);
    
    // Read users from JSON file
    let users = [];
    try {
      const usersPath = join(__dirname, '..', 'frontend', 'json-files', 'users.json');
      const usersData = await fs.readFile(usersPath, 'utf8');
      users = JSON.parse(usersData);
    } catch (e) {
      console.error('Error reading users file:', e);
      // Try alternate path
      try {
        const usersPath = join(__dirname, 'json-files', 'users.json');
        const usersData = await fs.readFile(usersPath, 'utf8');
        users = JSON.parse(usersData);
      } catch (e2) {
        console.error('Error reading from alternate users file path:', e2);
        
        // Hardcoded fallback users if file can't be read
        users = [
          {
            "id": "s1001",
            "username": "student1",
            "password": "pass123",
            "userType": "student",
            "name": "Sara Ali",
            "completedCourses": [{"courseId": "CMPS101", "grade": "A"}]
          },
          {
            "id": "i2001",
            "username": "instructor1",
            "password": "pass123",
            "userType": "instructor",
            "name": "Dr. Mahmoud Barhamgi"
          },
          {
            "id": "a3001",
            "username": "admin1",
            "password": "pass123",
            "userType": "administrator",
            "name": "Prof. Amr Mohamed"
          }
        ];
      }
    }
    
    // Find user
    const user = users.find(u => 
      u.username === username && 
      u.password === password
    );
    
    if (user) {
      // Create a user object to send back
      const userInfo = {
        id: user.id,
        name: user.name,
        username: user.username,
        userType: user.userType
      };
      
      // Store in cookie
      res.cookie('user', JSON.stringify(userInfo), { 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: false // Make it accessible to client JS
      });
      
      console.log(`Login successful for ${username}`);
      return res.status(200).json({ user: userInfo });
    }
    
    console.log(`Login failed for ${username}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
});

// Get session info
app.get('/api/auth/session', (req, res) => {
  // Get the user from cookie
  const userCookie = req.cookies?.user;
  
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return res.status(200).json({ user });
    } catch (e) {
      console.error('Error parsing user cookie:', e);
    }
  }
  
  // If no cookie or error, check localStorage through a workaround
  if (req.headers['x-user-info']) {
    try {
      const user = JSON.parse(req.headers['x-user-info']);
      return res.status(200).json({ user });
    } catch (e) {
      console.error('Error parsing user header:', e);
    }
  }
  
  return res.status(200).json({ user: null });
});

// Serve frontend HTML files directly
app.get('/*.html', (req, res) => {
  const filePath = join(__dirname, '..', 'frontend', req.path);
  console.log(`Serving HTML file: ${filePath}`);
  res.sendFile(filePath);
});

// Default route for the root path
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Create and start the server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Frontend files served from: ${join(__dirname, '..', 'frontend')}`);
});