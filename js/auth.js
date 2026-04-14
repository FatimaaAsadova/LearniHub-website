/**
 * Authentication Module
 * Handles user registration, login, logout, and session management using LocalStorage
 */

// LocalStorage keys
const USERS_STORAGE_KEY = 'learni_users';
const SESSION_STORAGE_KEY = 'loggedInUser';

/**
 * Get all registered users from LocalStorage
 * @returns {Object} Object with email as key and password as value
 */
function getUsers() {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : {};
}

/**
 * Save users to LocalStorage
 * @param {Object} users - Users object to save
 */
function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Register a new user
 * Validates email uniqueness and saves to LocalStorage
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Object} Result object with success flag and message
 */
function register(email, password) {
  // Trim and lowercase email
  email = email.trim().toLowerCase();

  // Validate input
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  if (email.length < 5 || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }

  // Check if email already exists
  const users = getUsers();
  if (users[email]) {
    return { success: false, message: 'This email is already registered.' };
  }

  // Save new user
  users[email] = password;
  saveUsers(users);

  return { success: true, message: 'Registration successful! Redirecting to login...' };
}

/**
 * Login user
 * Validates credentials against LocalStorage and creates session
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Object} Result object with success flag and message
 */
function login(email, password) {
  // Trim and lowercase email
  email = email.trim().toLowerCase();

  // Validate input
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  // Get users and check credentials
  const users = getUsers();
  if (users[email] && users[email] === password) {
    // Store logged-in user session
    localStorage.setItem(SESSION_STORAGE_KEY, email);
    return { success: true, message: 'Login successful!' };
  }

  return { success: false, message: 'Invalid email or password.' };
}

/**
 * Logout user
 * Clears session from LocalStorage
 */
function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Get currently logged-in user email
 * @returns {string|null} Email of logged-in user or null if not logged in
 */
function getLoggedInUser() {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
function isAuthenticated() {
  return getLoggedInUser() !== null;
}

/**
 * Check authentication and redirect if not authenticated
 * Use this on protected pages (like courses.html)
 * @param {string} redirectUrl - URL to redirect to if not authenticated (default: login.html)
 */
function checkAuth(redirectUrl = 'login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectUrl;
  }
}
