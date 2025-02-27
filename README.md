# Mock API Data Server

A RESTful API server for accessing and analyzing mock usage and conversation data.

## Features

- **RESTful API**: Access mock data through a well-designed API
- **Filtering**: Filter data by various parameters
- **Pagination**: Control the amount of data returned
- **Statistics**: Get summary statistics of the data
- **User-specific data**: Retrieve data for specific users or conversations

## Tech Stack

- **Backend**: Node.js, Express
- **Middleware**: Morgan (logging), Helmet (security), Express-session
- **Database**: File-based JSON data (with PostgreSQL support ready)
- **Testing**: Jest, SuperTest

## API Endpoints

### Usage Data Endpoints

#### Get All Usage Data

```
GET /api/usage
```

Query Parameters:
- `limit_reached` (boolean): Filter by whether users have reached their limit
- `min_api_calls` (number): Filter by minimum number of API calls
- `max_api_calls` (number): Filter by maximum number of API calls
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page

#### Get User by Email

```
GET /api/usage/:email
```

#### Get Users by Tier

```
GET /api/usage/tier/:tier
```

Valid tiers: `Free`, `Pro`, `Enterprise`

#### Get Usage Summary Statistics

```
GET /api/usage/stats/summary
```

### Conversation Data Endpoints

#### Get All Conversations

```
GET /api/conversations
```

Query Parameters:
- `author` (string): Filter by author (e.g., 'user1', 'chatbot')
- `search` (string): Search for conversations containing specific text
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page

#### Get Conversation by ID

```
GET /api/conversations/:id
```

Example: `GET /api/conversations/conv1`

#### Get Conversation Statistics

```
GET /api/conversations/stats/summary
```

Returns statistics including:
- Total number of conversations
- Total number of messages
- Messages by author type (user vs chatbot)
- Average messages per conversation
- Simple sentiment analysis

## Installation

1. Clone the repository
   ```
   git clone https://github.com/YFolla/mock_api_data.git
   cd mock_api_data
   ```

2. Install dependencies:
   ```
   cd backend
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## Environment Variables (Optional)

This demo application uses a hardcoded session secret for simplicity. However, you can still customize the following environment variables by creating a `.env` file:

- `PORT`: The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment mode (development, production, test)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database connection details (for future use)

## Deployment

### Local Deployment

For local deployment, simply:

1. Install dependencies: `npm install`
2. Start the server: `npm start`

The server will run on port 3000 by default, or you can specify a different port using the `PORT` environment variable.

### Deployment on Render

To deploy this API on [Render](https://render.com):

#### Option 1: Using the render.yaml file (Recommended)

1. Fork or clone this repository to your GitHub account
2. In Render dashboard, click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the render.yaml file and configure everything
5. Click "Apply" to deploy the service

#### Option 2: Manual Configuration

If you prefer to configure manually:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. Set the following environment variables in Render's dashboard:
   - `NODE_ENV`: Set to `production`
   - `PORT`: Render automatically assigns a port via `PORT` environment variable, so you don't need to set this manually

5. Optional environment variables (if you plan to use database features in the future):
   - `DB_HOST`: Your database host
   - `DB_PORT`: Your database port
   - `DB_NAME`: Your database name
   - `DB_USER`: Your database username
   - `DB_PASSWORD`: Your database password

6. Click "Create Web Service"

Render will automatically deploy your application and provide you with a URL to access your API.

**Note**: Render's free tier will spin down after periods of inactivity. The first request after inactivity may take a few seconds to respond as the service spins up again.

## Testing

Run the test suite:

```
npm test
```

## Example Usage

### Get all users with pagination

```
GET /api/usage?page=1&limit=10
```

### Get all Free tier users who have reached their limit

```
GET /api/usage?limit_reached=true
```

### Get usage summary statistics

```
GET /api/usage/stats/summary
```

### Get all conversations with a specific author

```
GET /api/conversations?author=user1
```

### Search for conversations containing specific text

```
GET /api/conversations?search=slack
```

### Get conversation statistics

```
GET /api/conversations/stats/summary
```

## License

ISC 