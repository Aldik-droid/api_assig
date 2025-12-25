Assignment 2: Multi-API User & Country Data Explorer

Project Description
This application is a Node.js-based web service that integrates four different external APIs to create a comprehensive profile for a random user. The project follows a Client-Server architecture, where all sensitive logic and API communications happen on the backend (Node.js) to ensure security and clean code practices

Features
- Random User Data: Fetches personal details (Name, Photo, Address, Age, etc.)
- Country Intelligence: Automatically retrieves capital city, languages, and currency based on the user's nationality
- Financial Integration: Converts the user's local currency to USD and KZT in real-time
- Contextual News: Displays the top 5 latest news headlines related to the user's country

Technologies Used
- Backend: Node.js, Express.js
- API Handling: Axios
- Environment Management: Dotenv (Security for API Keys)
- Frontend: HTML5, CSS3, Vanilla JavaScript (Fetch API)

APIs Integrated
1. [Random User Generator API](https://randomuser.me/) - Primary user data
2. [CountryLayer API](https://countrylayer.com/) - Geographical and cultural data
3. [ExchangeRate-API](https://www.exchangerate-api.com/) - Currency conversion
4. [NewsAPI](https://newsapi.org/) - Country-specific headlines

Setup Instructions

1. Clone or unzip the project:
   cd api-assignment
   
2. Install dependencies:
   npm install

3. Configure Environment Variables:
Create a `.env` file in the root directory and add your keys:
PORT=3000
COUNTRY_API_KEY=your_key_here
EXCHANGE_API_KEY=your_key_here
NEWS_API_KEY=your_key_here

4. Run the server:
node index.js

5. Access the app:
Open [http://localhost:3000] in your browser

Design Decisions
Security: API keys are never exposed to the frontend
Robustness: Implemented `try-catch` blocks for each API call to ensure that if one service (e.g., News) is down, the rest of the application still functions
UX: Added a loading state and responsive design to ensure the app works on various screen sizes.
