# Expense Tracker Frontend

React-based frontend for the Expense Tracker application.

## Step 10: Setup Complete ✓

### Created
- React application using Create React App
- Project structure in `frontend/` directory

### Installed Dependencies
- **react** - Core React library
- **react-dom** - React DOM rendering
- **react-scripts** - Build scripts and configuration
- **axios** - HTTP client for API calls
- **chart.js** - Charting library
- **react-chartjs-2** - React wrapper for Chart.js

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── ...
├── package.json
└── README.md
```

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Dependencies

### Production Dependencies
- **axios** (^1.x.x) - Promise-based HTTP client
  - Used for making API calls to backend
  - Supports request/response interceptors
  - Automatic JSON transformation

- **chart.js** (^4.x.x) - JavaScript charting library
  - Create beautiful charts and graphs
  - Responsive and interactive
  - Multiple chart types (pie, bar, line)

- **react-chartjs-2** (^5.x.x) - React components for Chart.js
  - React wrapper for Chart.js
  - Easy integration with React components
  - TypeScript support

## Configuration

### API Base URL
The frontend will connect to the backend API at:
```
http://localhost:8080/api
```

Configure this in your API service file.

## Next Steps

1. Create API service for backend communication
2. Build authentication components (Login, Register)
3. Create transaction management components
4. Add dashboard with charts
5. Implement budget tracking
6. Add routing with React Router

## Development

### Start Development Server
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

### Backend Connection
Ensure the backend is running on `http://localhost:8080` before starting the frontend.

## Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
- Stop the other process using port 3000
- Or set a different port: `PORT=3001 npm start`

### CORS Issues
If you encounter CORS errors:
- Ensure backend has `@CrossOrigin(origins = "*")` on controllers
- Or configure CORS properly in Spring Boot

### Module Not Found
If dependencies are missing:
```bash
npm install
```

## Summary

✅ Step 10 COMPLETE
- React app created successfully
- All required dependencies installed
- Ready for component development
