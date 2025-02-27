# Mock API Data Server

A RESTful API server for accessing and analyzing mock usage data.

## Features

- **RESTful API**: Access mock usage data through a well-designed API
- **Filtering**: Filter data by various parameters
- **Pagination**: Control the amount of data returned
- **Statistics**: Get summary statistics of the usage data
- **User-specific data**: Retrieve data for specific users

## Tech Stack

- **Backend**: Node.js, Express
- **Middleware**: Morgan (logging), Helmet (security), Express-session
- **Database**: File-based JSON data (with PostgreSQL support ready)
- **Testing**: Jest, SuperTest

## API Endpoints

### Get All Usage Data

```
GET /api/usage
```

Query Parameters:
- `limit_reached` (boolean): Filter by whether users have reached their limit
- `min_api_calls` (number): Filter by minimum number of API calls
- `max_api_calls` (number): Filter by maximum number of API calls
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page

### Get User by Email

```
GET /api/usage/:email
```

### Get Users by Tier

```
GET /api/usage/tier/:tier
```

Valid tiers: `Free`, `Pro`, `Enterprise`

### Get Usage Summary Statistics

```
GET /api/usage/stats/summary
```

## Installation

1. Clone the repository
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
GET /api/usage?tier=Free&limit_reached=true
```

### Get summary statistics

```
GET /api/usage/stats/summary
```

## License

ISC 