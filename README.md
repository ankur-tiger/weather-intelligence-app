# Weather Intelligence App

A fast, responsive Weather Intelligence single-page application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. The app delivers real-time weather metrics, a 7-day meteorological forecast, interactive data visualizers using **Recharts**, and an automated rule-based outdoor planning engine.

Powered exclusively by the free, keyless, open-source [Open-Meteo](https://open-meteo.com/) APIs.

---

## Features

1. **City Search & Smart Geocoding**
   - Search any global city by name with instant loading indicators.
   - Automatically defaults to **Chennai** on initial load.
   - Displays clickable chips when multiple geographic matches are found (e.g., London, UK vs. London, Canada) so users can pinpoint their location.
   - Comprehensive error handling:
     - Clear validation message when input is empty: *"Please enter a city name."*
     - Clear red alert for unmatched queries: *"City not found. Please check the spelling and try again."*
     - Network failure alert with a one-click Retry button: *"Weather service is unavailable right now. Please try again."*

2. **Current Meteorological Conditions Card**
   - City name, administrative region, country, and local date/time synchronized with the location's timezone.
   - Current temperature (°C) and apparent feels-like temperature (°C).
   - Relative humidity (%), wind speed (km/h), and current precipitation (mm).
   - Standardized WMO weather condition code mapping with human-readable description and Lucide icon.

3. **7-Day Daily Forecast**
   - Clean, responsive grid of daily cards for the week ahead.
   - Day label (*Today*, *Tomorrow*, weekday name) and formatted date.
   - WMO weather description and condition icon.
   - High and low temperature indicators.
   - Color-coded precipitation probability pill (%).

4. **Interactive Meteorological Charts (Recharts)**
   - **Temperature Trends**: Dual-line chart plotting daily maximum (orange) and minimum (sky blue) temperatures with custom tooltips.
   - **Precipitation Volume**: Bar chart illustrating expected daily rainfall volume in millimeters (mm).

5. **Rule-Based Planning & Advisory Engine**
   - Automated triggers for actionable outdoor recommendations:
     - **Rain**: Precipitation probability $\ge$ 60% $\rightarrow$ *"Carry an umbrella"*
     - **Heat Alert**: Max temperature $\ge$ 35°C $\rightarrow$ *"Heat alert: stay hydrated"*
     - **Cold Alert**: Min temperature $\le$ 5°C $\rightarrow$ *"Cold: wear warm layers"*
     - **Wind Alert**: Max wind speed $\ge$ 40 km/h $\rightarrow$ *"Windy: secure loose items"*
     - **UV Alert**: Peak UV index $\ge$ 8 $\rightarrow$ *"High UV: use sunscreen"*
     - **Favorable**: Otherwise $\rightarrow$ *"Good conditions for outdoor plans"*
   - **Best Day for Outdoor Activity**: Evaluates temperature comfort, rain probability, wind speed, and UV intensity to highlight the single best day this week with clear rationale.

6. **Cloudflare Pages Compatibility**
   - Standalone client-side SPA architecture with zero backend server or API key requirements.
   - Pre-configured `public/_redirects` file for seamless Single-Page App route resolution.

---

## Tech Stack

- **Framework**: React 19 (Functional Components & Hooks)
- **Language**: TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4
- **Charts & Data Visualization**: Recharts
- **Icons**: Lucide React
- **Data Source**: Open-Meteo Geocoding & Forecast Public APIs

---

## Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Steps

1. Clone or download the repository to your local machine:
   ```bash
   git clone <repo-url>
   cd weather-intelligence-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Deploy to Cloudflare Pages

This application is configured for direct zero-configuration deployment to **Cloudflare Pages**:

1. Push your code to your GitHub or GitLab repository.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository and configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.
5. Cloudflare Pages will build the static assets into `dist/` and automatically route all paths to `/index.html` via the included `public/_redirects` file (`/* /index.html 200`).

---

## Data Attribution

Weather forecast data and geographic coordinates are provided by [Open-Meteo.com](https://open-meteo.com/) under the Creative Commons Attribution 4.0 International (CC BY 4.0) license.
