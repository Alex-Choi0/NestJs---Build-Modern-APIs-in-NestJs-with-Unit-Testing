const nodeGeoCoder = require('node-geocoder');

export default class APIFeatures {
  static async getRestaurantLocation(address) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };

      const geocoder = nodeGeoCoder(options);

      const loc = await geocoder.geocode(address);

      return {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        countryCode: loc[0].countryCode,
        zipcode: loc[0].zipcode,
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}
