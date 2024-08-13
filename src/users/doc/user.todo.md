# 🛠️ User Functionality Implementations

## 📝 Todo

-   🔴 When a new account is created or during login, if the token is valid, the email must be verified, or a resend option should be provided. If the token has expired, a new token should automatically be generated and sent to the email during the login process.
-   🔴 Get a new verification link if the old link expires.
-   🔴 Handle and throw email service errors.
-   🔴 Implement index in the user model for faster search query.

## 🔃 In Progress

-   🔴 **Password Reset:**
    -   🟥 **1.** Password change via reset link.
    -   🟥 **2.** Password change via account settings.
-   ⚠️ `npm WARN deprecated crypto@1.0.1`: This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in.

## ⚠️ Warnings

-   ⚠️ Email verification has to be turned on from the user's controller signup method.

## ✅ Done

-   ✅ Implement a search user functionality by firstname, lastname, username, or email.
-   ✅ Fix DOB format in the user model.
-   ✅ Implement express validator.
-   ✅ Generate verification token.
-   ✅ Send verification email.
-   ✅ Create a test email or use a less secure email to test the verification links.
-   ✅ Check user exists function implemented as API.
-   ✅ Verify email.
-   ✅ Profile picture upload and location storage implemented.
-   ✅ Check for token expiry during validation of token.
-   ✅ Implemented logger.

# ❓ Questions

-   🔴 Do you want the signup email to be used for contact email, or do you want an option for a different email?
-   🔴 Do you want more than one contact email?

# ⚠️ Deprecated Warnings

-   ⚠️ `npm WARN deprecated inflight@1.0.6`: This module is not supported and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
-   ⚠️ `npm WARN deprecated npmlog@5.0.1`: This package is no longer supported.
-   ⚠️ `npm WARN deprecated rimraf@3.0.2`: Rimraf versions prior to v4 are no longer supported.
-   ⚠️ `npm WARN deprecated glob@7.2.3`: Glob versions prior to v9 are no longer supported.
-   ⚠️ `npm WARN deprecated are-we-there-yet@2.0.0`: This package is no longer supported.
-   ⚠️ `npm WARN deprecated gauge@3.0.2`: This package is no longer supported.

# 🧪 ROUTE TESTs

## ✈️ User Routes

-   ⏩ **Signup route:** <u>/api/users/signup</u>
    -   Signup with valid data.
    -   Signup with existing username/email.
    -   Signup with invalid email format.
    -   Signup with missing required fields.
