# Health Connect

Health Connect is a centralized digital platform designed to streamline real-time monitoring of doctor attendance, healthcare services, and absenteeism alerts for Public Health Centers (PHCs), Upgraded PHCs, and Sub Centres under the Deputy Director of Health Services (DDHS) in Tamil Nadu.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview
Health Connect aims to improve healthcare administration by providing a web dashboard for DDHS officials. The platform ensures seamless communication, real-time attendance tracking, and automated reports, enhancing efficiency in the healthcare system. By integrating real-time data and automated notifications, Health Connect ensures that healthcare services remain efficient and well-coordinated.

## Features
### Web Dashboard (Admin Panel)
- **Real-time Monitoring**: Displays all PHCs in Tamil Nadu along with available doctors based on attendance.
- **Doctor Attendance Tracking**: Summarizes daily attendance, including leaves and absences.
- **Patient Count Analytics**: Monitors daily patient visits at each center.
- **Automated Alerts**: Sends SMS notifications for absenteeism and other crucial updates.
- **Comprehensive Records**: Stores doctor and patient details for easy reference.
- **Medical Supply Reporting**: Allows doctors to report shortages and request necessary medical supplies.

## Tech Stack
- **Frontend:** React (Web)
- **Backend & Database:** Firebase
- **Hosting:** Firebase Hosting / AWS (TBD)
- **APIs:** Firebase Authentication, Twilio (for SMS alerts)

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js and npm
- Firebase CLI

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/health-connect.git
   ```
2. Navigate to the project directory:
   ```sh
   cd health-connect
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- **Admin Panel**: Open `http://localhost:5173` (or deployed URL) to access the dashboard.

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

---
For any queries, please contact **[your email/contact details]**.
