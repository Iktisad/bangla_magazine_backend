# User functionality implementations

✅ Implement a search user functionality by firsname,lastname, username or email.\
✅ Fix DOB format in the user model.\
✅ Implement express validator.\
✅ Generate verification token.\
✅ Send Verification email.\
✅ Create a test email or use a less secure email to test the verification links. \
✅ Check user exists function implemented as api.\
✅ Verify email.\
✅ Profile picture upload and location storage needs to be implemented.\
✅ check for token expiary during validation of token.\
✅ Implemented logger. \
🔴When a new account is created or during login, if the token is valid, the email must be verified, or a resend option should be provided. If the token has expired, a new token should automatically be generated and sent to the email during the login process.\
🔴 Get a new verification link if the old link expires. \
🔴 handle and throw email service error. \
🔴 Implement index in the user model for faster search query.

⚠️ Email verfication has to be turned on from users contoller signup method

# Questions

🔴 Do you want sign up email to be used for contact email or want an option for a different email? \
🔴 DO you want more than one contact email?

# ROUTE TESTs

## ✈️ User routes

⏩ Signup route: <u>/api/users/signup</u>

-   signup with valid data :
-   signup with existing username/email
-   signup with invalid email format
-   signup with missing required fields
