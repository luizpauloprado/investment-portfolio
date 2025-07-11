# Investment Portfolio Insights Application

This application provides a user-friendly interface for managing and visualizing investment portfolios. Users can upload their investment data in CSV format and receive insights and performance analysis.

## Features

- Upload investment data via CSV.
- Visualize portfolio allocation.
- Analyze investment performance over time.
- Receive AI-powered investment insights.

## Technologies Used

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Charting:** Chart.js
- **AI Integration:** Genkit
- **Deployment:** Firebase Hosting

## Getting Started

To run the application locally:

1. **Install dependencies:** `npm install`
2. **Run the development server:** `npm run dev`
3. **Access the application:** Open your browser to `http://localhost:3000`

## Project Structure

The project follows a standard Next.js application structure with additional directories for AI integration and documentation.

- `/`: The root directory of the project. Contains configuration files and the `README.md`.
- `/.idx`: Contains files related to the IDX development environment.
- `/.vscode`: Contains configuration files for Visual Studio Code.
- `/docs`: Contains project documentation, such as the blueprint.
- `/src`: Contains the main application source code.
    - `/src/ai`: Contains files related to the Genkit AI integration, including AI flows.
    - `/src/app`: Contains the Next.js application pages and layout.
    - `/src/components`: Contains reusable React components, including UI components.
        - `/src/components/ui`: Contains Shadcn UI components.
    - `/src/hooks`: Contains custom React hooks.
    - `/src/lib`: Contains utility functions, types, and the CSV parser.

