# 🛠️ User Functionality Implementations

## 📝 Todo

-   🔴 When a new account is created or during login, if the token is valid, the email must be verified, or a resend option should be provided. If the token has expired, a new token should automatically be generated and sent to the email during the login process.
-   🔴 Need to setup a frontend form for password reset in email service.

## 🔄 In Progress

-   🔵 Get a new verification link if the old link expires.
-   🔵 Handle and throw email service errors.
-   🔵 Github secrets setup
-   🔵 Implement singleton in DI Container

## ⚠️ Warnings

-   ⚠️ Email verification has to be turned on from the user's controller signup method.

## ✅ Done

-   🟢 Remove arrow wrappers from the routes and implement bind in controllers to keep the context
-   🟢 Implement a search user functionality by firstname, lastname, username, or email.
-   🟢 Fix DOB format in the user model.
-   🟢 Implement express validator.
-   🟢 Generate verification token.
-   🟢 Send verification email.
-   🟢 Create a test email or use a less secure email to test the verification links.
-   🟢 Check user exists function implemented as API.
-   🟢 Verify email.
-   🟢 Profile picture upload and location storage implemented.
-   🟢 Check for token expiry during validation of token.
-   🟢 Implemented logger.
-   🟢 Test environment setup
-   🟢 Refactor email service and import from config file
-   🟢 Implement index in the user model for faster search query.
-   🟢 **Password Reset:**

    -   🟩 **1.** Password change via reset link.
    -   🟩 **2.** Password change via account settings.

-   🟢 remove unsatized email from user.validator and user.service

# ❓ Questions

-   🔴 Do you want the signup email to be used for contact email, or do you want an option for a different email?
-   🔴 Do you want more than one contact email?

# 🧪 ROUTE TESTs

## ✈️ User Routes

-   ⏩ **Signup route:** <u>/api/users/signup</u>
    -   Signup with valid data.
    -   Signup with existing username/email.
    -   Signup with invalid email format.
    -   Signup with missing required fields.
