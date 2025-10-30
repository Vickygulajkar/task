import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cityName } = req.query;

  if (!cityName) {
    return res.status(400).json({ error: 'cityName is required' });
  }

  try {
    // MagicBricks commonly uses the pattern: new-projects-in-<city>
    const url = `https://www.magicbricks.com/new-projects-in-${cityName}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const projects = [];

    // Attempt primary selectors
    $('.mb-srp__card, .mb-srp__card--container').each((index, element) => {
      let projectName = $(element).find('.mb-srp__card--title, .projName, .project-title').text().trim();
      let location = $(element).find('.mb-srp__card__summary--location, .locName, .project-location').text().trim();
      let priceRange = $(element).find('.mb-srp__card__price--amount, .price, .project-price').text().trim();
      let builderName = $(element).find('.mb-srp__card__ads--name, .builder-name, .developer-name').text().trim();

      if (projectName && location) {
        projects.push({
          id: `${cityName}-${index}`,
          projectName,
          location,
          priceRange: priceRange || 'Price on request',
          builderName: builderName || 'Builder information not available',
        });
      }
    });

    if (projects.length === 0) {
      // Provide a minimal, clearly marked fallback dataset to ensure the demo works
      // without implying real scraped data when site structure changes.
      const demoCity = String(cityName).replace(/-/g, ' ');
      // Basic coordinates for popular cities
      const cityCoords = {
        mumbai: { lat: 19.076, lng: 72.8777 },
        delhi: { lat: 28.6139, lng: 77.209 },
        bangalore: { lat: 12.9716, lng: 77.5946 },
        bengaluru: { lat: 12.9716, lng: 77.5946 },
        hyderabad: { lat: 17.385, lng: 78.4867 },
        chennai: { lat: 13.0827, lng: 80.2707 },
        pune: { lat: 18.5204, lng: 73.8567 },
      };
      const key = String(cityName).toLowerCase();
      const base = cityCoords[key] || { lat: 20.5937, lng: 78.9629 }; // India centroid fallback
      const fallback = [
        {
          id: `${cityName}-demo-1`,
          projectName: `${demoCity} Heights`,
          location: `${demoCity} City Center`,
          priceRange: '₹75L - ₹1.2Cr',
          builderName: 'Demo Developers',
          lat: base.lat + 0.02,
          lng: base.lng + 0.02,
        },
        {
          id: `${cityName}-demo-2`,
          projectName: `${demoCity} Residency`,
          location: `${demoCity} West`,
          priceRange: '₹55L - ₹90L',
          builderName: 'Sample Constructions',
          lat: base.lat - 0.015,
          lng: base.lng - 0.01,
        },
        {
          id: `${cityName}-demo-3`,
          projectName: `${demoCity} Greens`,
          location: `${demoCity} East`,
          priceRange: 'Price on request',
          builderName: 'Example Builders',
          lat: base.lat + 0.008,
          lng: base.lng - 0.02,
        },
      ];
      return res.status(200).json({
        projects: fallback,
        message: 'Showing demo projects because no data was parsed (site structure may have changed).',
      });
    }

    return res.status(200).json({ projects });
  } catch (error) {
    console.error('Scraping error:', error.message);
    // Fall back to demo data on any error so the deployed app still shows content
    const demoCity = String(cityName).replace(/-/g, ' ');
    const cityCoords = {
      mumbai: { lat: 19.076, lng: 72.8777 },
      delhi: { lat: 28.6139, lng: 77.209 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      hyderabad: { lat: 17.385, lng: 78.4867 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      pune: { lat: 18.5204, lng: 73.8567 },
    };
    const key = String(cityName).toLowerCase();
    const base = cityCoords[key] || { lat: 20.5937, lng: 78.9629 };
    const fallback = [
      {
        id: `${cityName}-demo-1`,
        projectName: `${demoCity} Heights`,
        location: `${demoCity} City Center`,
        priceRange: '₹75L - ₹1.2Cr',
        builderName: 'Demo Developers',
        lat: base.lat + 0.02,
        lng: base.lng + 0.02,
      },
      {
        id: `${cityName}-demo-2`,
        projectName: `${demoCity} Residency`,
        location: `${demoCity} West`,
        priceRange: '₹55L - ₹90L',
        builderName: 'Sample Constructions',
        lat: base.lat - 0.015,
        lng: base.lng - 0.01,
      },
      {
        id: `${cityName}-demo-3`,
        projectName: `${demoCity} Greens`,
        location: `${demoCity} East`,
        priceRange: 'Price on request',
        builderName: 'Example Builders',
        lat: base.lat + 0.008,
        lng: base.lng - 0.02,
      },
    ];
    return res.status(200).json({
      projects: fallback,
      message: 'Showing demo projects due to scrape error (likely blocked in deployment).',
    });
  }
}

