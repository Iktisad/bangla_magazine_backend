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

# Deprecated warnings

-   npm WARN deprecated crypto@1.0.1: This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in.
-   npm WARN deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
-   npm WARN deprecated npmlog@5.0.1: This package is no longer supported.
-   npm WARN deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
-   npm WARN deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
-   npm WARN deprecated are-we-there-yet@2.0.0: This package is no longer supported.
-   npm WARN deprecated gauge@3.0.2: This package is no longer supported.

# ROUTE TESTs

## ✈️ User routes

⏩ Signup route: <u>/api/users/signup</u>

-   signup with valid data :
-   signup with existing username/email
-   signup with invalid email format
-   signup with missing required fields
