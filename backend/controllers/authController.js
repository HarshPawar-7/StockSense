const admin = require('firebase-admin');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // First check if email exists
    try {
      await admin.auth().getUserByEmail(email);
      return res.status(400).json({ error: 'Email already in use' });
    } catch (error) {
      // Only proceed if error is "user not found"
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }
    
    // Create new user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false
    });
    
    // Here you would typically create a user in your database
    res.status(201).json({ 
      message: 'User created successfully',
      uid: userRecord.uid 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};