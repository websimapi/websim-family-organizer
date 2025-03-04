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

### Google API Setup (IMPORTANT)

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Select "Web application" as the application type (NOT "Native Desktop" or other types)
   - Add your domain to the authorized JavaScript origins (e.g., http://localhost:8000)
   - Add your domain + "/callback" to the authorized redirect URIs (e.g., http://localhost:8000/callback)
5. Note your Client ID and API Key

### Redirect URI Configuration

It's critical that your redirect URI matches exactly with what's configured in Google Cloud Console:
- The application is setup to use: `[your-domain]/callback` as the redirect URI
- Ensure this exact URI is added to the authorized redirect URIs in Google Cloud Console
- Common errors like "redirect_uri_mismatch" occur when these don't match exactly

### Configuration

1. Update the configuration in `js/app.js` with your Google API credentials:
   ```javascript
   const config = {
     googleClientId: 'YOUR_CLIENT_ID',
     googleApiKey: 'YOUR_API_KEY',
     calendarScopes: 'https://www.googleapis.com/auth/calendar',
     // other config options...
   };
```

## Usage

- Open the application in your preferred web browser.
- Sign in with your Google account to enable calendar integration.
- Explore the different sections of the application to manage your family's schedule, tasks, meals, and more.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.