# Family Organizer Web Application

A comprehensive browser-based application designed to streamline household management through a centralized digital hub. This tool helps with schedule coordination, task management, meal planning, and family communication.

## Features

- Calendar integration with Google Calendar
- Task and chore management
- Meal planning and grocery list coordination
- Family member profiles and management
- Offline functionality with data persistence

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Google account for calendar integration
- Web server to host the application files (or run locally)
- Python 3.7+ (for the authentication bridge)

### Google API Setup (IMPORTANT)

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Select "Web application" as the application type (NOT "Native Desktop")
   - Add "http://localhost:8000" to the authorized JavaScript origins
   - Add "http://localhost:8000/callback" to the authorized redirect URIs

### Running the Authentication Bridge

1. Install required Python packages:


## Usage

- Open the application in your preferred web browser.
- Sign in with your Google account to enable calendar integration.
- Explore the different sections of the application to manage your family's schedule, tasks, meals, and more.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.