import StormGlass from '@src/Clients/StormGlass';
import stormGlassWeatherThreeHoursFixtures from '@test/Fixtures/StormGlassWeatherThreeHours.json';
import stormGlassWeatherNormalizedThreeHoursFixtures from '@test/Fixtures/StormGlassNormalizedResponseThreeHours.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass Client', () => {
    const mockedAxios = axios as jest.MockedObject<typeof axios>;

    it('Should return the normalized forecast from the StormGlass service.', async () => {
        const lat = -33.792726;
        const long = 151.289824;

        mockedAxios.get.mockResolvedValue({ data: stormGlassWeatherThreeHoursFixtures });

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, long);

        expect(response).toEqual(stormGlassWeatherNormalizedThreeHoursFixtures);
    })

    it('should exclude incomplete data points', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        const incompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2020-04-26T00:00:00+00:00',
                },
            ],
        };
        mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    });

    it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

        const stormGlass = new StormGlass(mockedAxios);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        );
    });

    it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        class FakeAxiosError extends Error {
            constructor(public response: object) {
                super();
            }
        }

        mockedAxios.get.mockRejectedValue(
            new FakeAxiosError({
                status: 429,
                data: { errors: ['Rate Limit reached'] },
            })
        );

        const stormGlass = new StormGlass(mockedAxios);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
        );
    });
});