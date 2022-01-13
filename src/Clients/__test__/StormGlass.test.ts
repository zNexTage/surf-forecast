import StormGlass from '@src/Clients/StormGlass';
import stormGlassWeatherThreeHoursFixtures from '@test/Fixtures/StormGlassWeatherThreeHours.json';
import stormGlassWeatherNormalizedThreeHoursFixtures from '@test/Fixtures/StormGlassNormalizedResponseThreeHours.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass Client', () => {
    it('Should return the normalized forecast from the StormGlass service.', async () => {
        const lat = -33.792726;
        const long = 151.289824; 

        axios.get = jest.fn().mockResolvedValue(stormGlassWeatherThreeHoursFixtures);

        const stormGlass = new StormGlass(axios);
        const response = await stormGlass.fetchPoints(lat, long);

        expect(response).toEqual(stormGlassWeatherNormalizedThreeHoursFixtures);
    })
});