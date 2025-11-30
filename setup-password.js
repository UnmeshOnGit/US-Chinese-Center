// setup-password.js - Run this once to generate hashed password
const bcrypt = require('bcryptjs');

async function generateHashedPassword() {
    const plainPassword = 'admin123'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('Hashed password:', hashedPassword);
    console.log('Add this to your ADMIN_CREDENTIALS in auth.js');
}

generateHashedPassword();