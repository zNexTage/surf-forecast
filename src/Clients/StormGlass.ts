import { AxiosStatic } from 'axios';

class StormClass {
    private readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    private readonly stormGlassApiSource = 'noaa';


    constructor(
        protected request: AxiosStatic
    ) { }

    public async fetchPoints(lat: number, long: number): Promise<unknown> {
        return await this.request.get(`
        https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${long}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}
        `); 
    }
}


export default StormClass;