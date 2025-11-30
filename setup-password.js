// setup-password.js - Run this once to generate hashed password
const bcrypt = require('bcryptjs');

async function generateHashedPassword() {
    // You can change this password for production
    const plainPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('====================================');
    console.log('PASSWORD SETUP UTILITY');
    console.log('====================================');
    console.log('Plain password:', plainPassword);
    console.log('Hashed password:', hashedPassword);
    console.log('');
    console.log('ADD THIS TO YOUR RAILWAY ENVIRONMENT VARIABLES:');
    console.log('ADMIN_PASSWORD_HASH=' + hashedPassword);
    console.log('');
    console.log('Or update directly in auth.js for development:');
    console.log('ADMIN_CREDENTIALS: {');
    console.log('  username: "admin",');
    console.log('  password: "' + hashedPassword + '"');
    console.log('}');
    console.log('====================================');
}

// Only run if this file is executed directly
if (require.main === module) {
    generateHashedPassword();
}

module.exports = { generateHashedPassword };
