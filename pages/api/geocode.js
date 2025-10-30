import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  const apiKey = process.env.POSITIONSTACK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'PositionStack API key not configured' });
  }

  try {
    const response = await axios.get('http://api.positionstack.com/v1/forward', {
      params: {
        access_key: apiKey,
        query: location,
        limit: 1,
      },
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const { latitude, longitude } = response.data.data[0];
      return res.status(200).json({ lat: latitude, lng: longitude });
    } else {
      return res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return res.status(500).json({ error: 'Failed to geocode location' });
  }
}
