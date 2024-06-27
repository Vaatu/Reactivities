# Reactivities Demo

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Live Demo](#live-demo)

## Introduction

Reactivities is a demo project built as part of the Udemy course "Complete guide to building an app with .Net Core and React". This application is a full-stack project that showcases the integration of .NET Core for the backend and React for the frontend.

## Features

- User authentication and authorization
- CRUD operations for activities
- Integration with a real-time chat feature
- Responsive design
- Deployment to Azure Web Apps

## Technologies Used

- Frontend: React, MobX, TypeScript, Semantic UI
- Backend: .NET Core, Entity Framework Core
- Database: SQL Server
- Authentication: IdentityServer4
- Deployment: Azure Web Apps

## Prerequisites

- [.NET Core SDK](https://dotnet.microsoft.com/download) (version 8.x or higher)
- [Node.js](https://nodejs.org/) (version 20.x or higher)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (for local development)
- Azure account (for deployment)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/vaatu/Reactivities.git
    cd reacivities-demo
    ```

2. Set up the backend:
    ```bash
    cd API
    dotnet restore
    dotnet ef database update
    dotnet run
    ```

3. Set up the frontend:
    ```bash
    cd client-project
    npm install
    npm start
    ```

## Usage

- Visit `http://localhost:3000` to access the frontend.
- The backend API is accessible at `http://localhost:5000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact me at:

- Email: admin@vaatu.dev
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/muhammad-elarabi/)
- GitHub: [GitHub](https://github.com/vaatu)

## Live Demo

Check out the live demo of the application: [Reactivities Demo](https://reacivities-demo.azurewebsites.net/)
