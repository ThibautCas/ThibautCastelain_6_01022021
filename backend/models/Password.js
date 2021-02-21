const passwordValidator = require('password-validator');
 
// Create a schema
const passwordSchema = new passwordValidator();
 
// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digit
.has().symbols(1)                                  // Must have at least 1 symbol
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
 
module.exports = passwordSchema;