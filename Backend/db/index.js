const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local if available
const envPath = fs.existsSync(path.join(__dirname, '..', '.env.local')) 
  ? path.join(__dirname, '..', '.env.local') 
  : path.join(__dirname, '..', '.env');

require('dotenv').config({ path: envPath });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initDB = async () => {
  try {
    // Check if we already have data
    const blogCount = await prisma.blog.count();
    
    if (blogCount === 0) {
      console.log('Seeding initial data...');
      
      await prisma.blog.createMany({
        data: [
          {
            title: 'What is SQL Injection?',
            content: 'SQL Injection is one of the most dangerous vulnerabilities in web applications. It occurs when an attacker is able to insert or "inject" malicious SQL code into a query that an application sends to its database.\n\nFor example, a vulnerable login query might look like:\nSELECT * FROM users WHERE username = \'\' + input + \'\'\n\nAn attacker could type: admin\' OR \'1\'=\'1 as the username, which makes the query always return true, bypassing authentication entirely.\n\nPrevention methods include:\n• Using parameterized queries (prepared statements)\n• Input validation and sanitization\n• Principle of least privilege for DB accounts\n• Web Application Firewalls (WAF)',
            category: 'SQL Injection',
          },
          {
            title: 'Broken Authentication Explained',
            content: 'Broken Authentication is ranked #2 in the OWASP Top 10. It refers to weaknesses in the way a web application manages user sessions and credentials.\n\nCommon broken authentication issues include:\n• Weak passwords allowed (e.g., "123456")\n• Credentials transmitted over HTTP (not HTTPS)\n• Session tokens that do not expire\n• Passwords stored in plain text\n\nIn our project, we address these by:\n• Hashing passwords with bcrypt before storing\n• Using JWT tokens with expiration\n• Validating all inputs before processing\n• Returning generic error messages (not revealing if username or password was wrong)',
            category: 'Broken Authentication',
          },
          {
            title: 'Why Password Hashing Matters',
            content: 'Storing passwords in plain text is one of the most critical mistakes a developer can make. If your database is ever compromised, attackers immediately have access to every user\'s password.\n\nPassword hashing solves this by converting the password into an irreversible string. We use bcrypt, which also adds a "salt" — a random value that ensures two identical passwords produce different hashes.\n\nExample:\nPlain: password123\nbcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy\n\nEven if an attacker gets the hash, they cannot reverse it back to the original password without brute-forcing billions of combinations.',
            category: 'Security Concepts',
          },
          {
            title: 'Understanding JWT Authentication',
            content: 'JSON Web Tokens (JWT) are a compact, URL-safe way to represent claims between two parties. In our app, we use JWTs to keep users logged in after authentication.\n\nHow it works:\n1. User logs in with correct credentials\n2. Server creates a signed JWT containing user ID and expiration\n3. Frontend stores this token\n4. Every protected request sends the token in the Authorization header\n5. Server verifies the token signature before granting access\n\nJWTs are stateless — the server does not need to store session data, making the app scalable.',
            category: 'Authentication',
          },
          {
            title: 'Input Validation: Your First Line of Defense',
            content: 'Input validation means checking that data submitted by users meets expected formats before processing it. Without validation, attackers can submit unexpected data that breaks your application or exploits vulnerabilities.\n\nTypes of validation:\n• Type checking (is this a number or a string?)\n• Length limits (username max 50 characters)\n• Pattern matching (is this a valid email format?)\n• Whitelist validation (only allow known-safe characters)\n\nIn our login form, we validate that username and password fields are not empty, have a minimum length, and contain no special SQL characters before passing them to the database.',
            category: 'Security Concepts',
          }
        ]
      });

      await prisma.flashcard.createMany({
        data: [
          { question: 'What is SQL Injection?', answer: 'SQL Injection is an attack where malicious SQL code is inserted into a query. It can allow attackers to read, modify, or delete database data, and even bypass authentication.', category: 'SQL Injection' },
          { question: 'How do you prevent SQL Injection?', answer: 'Use parameterized queries (prepared statements), input validation, least-privilege DB accounts, and Web Application Firewalls. Never concatenate user input directly into SQL strings.', category: 'SQL Injection' },
          { question: 'What is bcrypt and why use it?', answer: 'bcrypt is a password hashing algorithm that includes a salt and is intentionally slow to compute, making brute-force attacks much harder. It converts plain passwords into irreversible hashes for safe storage.', category: 'Password Security' },
          { question: 'What is a JWT?', answer: 'A JSON Web Token is a signed, encoded token used to securely transmit information between parties. It contains a header, payload (user data), and signature — allowing stateless authentication.', category: 'Authentication' },
          { question: 'What is Broken Authentication?', answer: 'Broken Authentication refers to flaws in how an app manages user sessions and credentials — such as weak passwords, exposed tokens, missing HTTPS, or sessions that never expire.', category: 'Broken Authentication' },
          { question: 'What is a Salt in password hashing?', answer: 'A salt is a random value added to a password before hashing. It ensures that two users with the same password get different hashes, preventing rainbow table attacks.', category: 'Password Security' },
          { question: 'What does OWASP stand for?', answer: 'Open Web Application Security Project — a nonprofit foundation that works to improve software security. They publish the OWASP Top 10, a widely referenced list of the most critical web vulnerabilities.', category: 'General Security' },
          { question: 'What is input validation?', answer: 'The process of checking that user-supplied data conforms to expected formats, types, and lengths before processing. It helps prevent injection attacks, crashes, and unexpected behavior.', category: 'Security Concepts' },
          { question: 'What is the principle of least privilege?', answer: 'A security concept where users, systems, and programs are given only the minimum permissions they need to perform their function — reducing the damage potential if a component is compromised.', category: 'Security Concepts' },
          { question: 'What happens if passwords are stored in plain text?', answer: 'If the database is breached, all user passwords are immediately exposed. Attackers can use them to log into the app and potentially other services where users reused the same password.', category: 'Password Security' }
        ]
      });

      await prisma.quiz.createMany({
        data: [
          { question: 'What type of attack allows an attacker to manipulate database queries through user input?', option_a: 'Cross-Site Scripting (XSS)', option_b: 'SQL Injection', option_c: 'Buffer Overflow', option_d: 'CSRF', correct_answer: 'B', explanation: 'SQL Injection occurs when user input is directly inserted into SQL queries without sanitization, allowing attackers to manipulate query logic.', category: 'SQL Injection' },
          { question: 'Which of the following is the BEST way to store user passwords?', option_a: 'Store them in plain text for easy retrieval', option_b: 'Encrypt them with AES', option_c: 'Hash them using bcrypt with a salt', option_d: 'Store them in a separate table', correct_answer: 'C', explanation: 'bcrypt with a salt is the best practice — it is slow by design (resists brute force) and the salt prevents rainbow table attacks.', category: 'Password Security' },
          { question: 'What does a parameterized query do?', option_a: 'Speeds up database queries', option_b: 'Separates SQL code from user data, preventing injection', option_c: 'Encrypts the database connection', option_d: 'Validates email addresses automatically', correct_answer: 'B', explanation: 'Parameterized queries (prepared statements) treat user input as data, not as executable SQL code, effectively preventing SQL Injection.', category: 'SQL Injection' },
          { question: 'Which HTTP header is used to send a JWT token to the server?', option_a: 'Content-Type', option_b: 'X-Auth-Token', option_c: 'Authorization', option_d: 'Cookie-Token', correct_answer: 'C', explanation: 'The standard practice is to send JWTs in the Authorization header using the Bearer scheme: Authorization: Bearer <token>', category: 'Authentication' },
          { question: 'What is the purpose of a "salt" in password hashing?', option_a: 'To make the password longer', option_b: 'To encrypt the hash', option_c: 'To ensure identical passwords produce different hashes', option_d: 'To speed up login', correct_answer: 'C', explanation: 'A salt is a random value added to each password before hashing. This ensures two users with identical passwords have completely different hashes.', category: 'Password Security' },
          { question: 'What is Broken Authentication (OWASP)?', option_a: 'When the app crashes during login', option_b: 'When authentication mechanisms are implemented incorrectly, exposing accounts to attackers', option_c: 'When users forget their passwords', option_d: 'When the database connection fails', correct_answer: 'B', explanation: 'Broken Authentication refers to flaws like weak passwords, session tokens that do not expire, plain text credential storage, or missing HTTPS.', category: 'Broken Authentication' },
          { question: 'Which of the following is an example of input validation?', option_a: 'Displaying user input on screen', option_b: 'Checking that a username is not longer than 50 characters', option_c: 'Storing passwords in plain text', option_d: 'Allowing any characters in a search field', correct_answer: 'B', explanation: 'Input validation checks that data meets expected criteria (format, length, type) before processing, protecting against injection and unexpected behavior.', category: 'Security Concepts' },
          { question: 'What is the main goal of the principle of least privilege?', option_a: 'To make applications run faster', option_b: 'To limit damage by giving components only the permissions they need', option_c: 'To prevent users from logging in', option_d: 'To encrypt all database fields', correct_answer: 'B', explanation: 'Least privilege limits the access rights of users, programs, and processes to only what is strictly required, minimizing the impact of a security breach.', category: 'Security Concepts' }
        ]
      });

      console.log('Initial data seeded successfully');
    }

    console.log('Prisma database connection established');
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  }
};

module.exports = { prisma, initDB };
og('Prisma database connection established');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
};

module.exports = { prisma, initDB };
