# 🌟 Bangla Web Magazine Backend 🌟

A backend service for managing the diverse content of the Bangla Web Magazine, including articles, artwork, photography, and podcasts. Built with Node.js and Express.js, this application uses REST APIs to provide a reliable and scalable solution for content management.

## 📚 Table of Contents

-   [⚙️ Installation](#⚙️-installation)
-   [🚀 Usage](#🚀-usage)
-   [📜 Route Document](#📜-route-document)
-   [✨ Features](#✨-features)
-   [🤝 Contributing](#🤝-contributing)
-   [📄 License](#📄-license)
-   [📬 Contact](#📬-contact)

## ⚙️ Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Iktisad/bangla_magazine_backend.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd bangla_magazine_backend
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Set up your environment variables:**

    **LOCAL DEVELOPMENT**

    ***

    Create a `.env.development.local` file in the root directory of the project with the following content:

    ```plaintext
        # .env.development.local

        # Application

        PORT=3001
        APP_HOST=http://localhost

        # Database

        ## Development

        DB_PORT=27017
        DB_NAME=bangla_web_magazine
        DB_HOST=localhost

        # JWT for authentication

        JWT_SECRET=SET_AS_YOU_LIKE
        JWT_EXPIRATION=4h

        # Nodemailer Configurations

        MAILER_EMAIL=example@example.com
        MAILER_PASSWORD=secret
        MAILER_SERVICE=Example
        MAILER_HOST=smtp.mail.example.com
        MAILER_PORT=465
        MAILER_SECURE=false
        MAILER_LOGGER=true
    ```

    ***

    Create a `.env` or `env.production.local` file in the root directory of the project with the following content:

    ```plaintext
    # .env

    # Application Port
    PORT=SET_PORT
    BASE_URL=http://HOST_LINK_EXAMPLE

    # Database Connection
    ## Development
    DB_HOST=REMOTE_LINK
    DB_PORT=PORT

    DB_NAME=bangla_web_magazine
    DB_HOST=REMOTE_HOST_NAME
    DB_PORT=REMOTE_PORT
    DB_USER=USER_NAME
    DB_PASS=PASSWORD

    # JWT Secret for Authentication
    JWT_SECRET=JWT_SECRET_KEY
    ```

## 🚀 Usage

To start the application, run:

```bash
npm start
```

For development mode with hot reloading, run:

```bash
npm run start:dev
```

## 📜 Route Document

### 🤵 Users

-   [User API Documentation](/doc/routes/user.http)
-   [User Progress KANBAN](/doc/kanban/user.todo.md)

### 📰 Magazine

-   [Coming Soon]()

### 📢 Podcast

-   [Coming soon]()

## ✨ Features

-   **🔒 User Authentication**: Secure login and registration system with **_JWT (JSON Web Tokens)_** to ensure user data privacy and protection.
-   **🔄 RESTful API**: A set of RESTful endpoints to manage resources, providing CRUD operations for entities like **_users_**, **_magazine_**, **_artwork_** and **_podcasts_**.
-   **🛡️ Role-Based Access Control**: Fine-grained access control with different user roles (admin, author, and contributor) to manage permissions and access to various parts of the application.
-   **✔️ Data Validation**: Robust data validation using `Express-Validator` to ensure that all incoming data is correctly formatted and prevents malicious inputs.
-   **📝 Logging**: Comprehensive logging system with `Winston` to track application behavior and errors for easier debugging and monitoring.
-   **📖 API Documentation**: Interactive API documentation created with `Rest Client` of VSCode extension, making it easy for developers to understand and use the API.
-   **⚠️ Error Handling**: Centralized error handling to manage application errors gracefully and provide meaningful feedback to users.
-   **🌐 Environment Configuration**: Flexible configuration management for different environments (development, staging, production) using dotenv.

## 🤝 Contributing

We welcome contributions! To get started:

1. **Fork the repository.**
2. **Create a new branch:**
    ```bash
    git checkout -b feature-branch
    ```
3. **Make your changes.**
4. **Commit your changes:**
    ```bash
    git commit -m 'Add new feature'
    ```
5. **Push to the branch:**
    ```bash
    git push origin feature-branch
    ```
6. **Open a Pull Request.**

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## 📬 Contact

For any inquiries, please contact [iktisad.rashid@gmail.com](mailto:iktisad.rashid@gmail.com).
