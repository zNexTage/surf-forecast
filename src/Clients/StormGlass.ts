import InternalError from '@src/Util/Errors/InternalErrors';
import { AxiosStatic } from 'axios';

interface IStormGlassPointSource {
    [key: string]: number;
}

interface IStormGlassPoint {
    readonly time: string;
    readonly swellDirection: IStormGlassPointSource
    readonly swellHeight: IStormGlassPointSource
    readonly swellPeriod: IStormGlassPointSource
    readonly waveDirection: IStormGlassPointSource
    readonly waveHeight: IStormGlassPointSource
    readonly windDirection: IStormGlassPointSource
    readonly windSpeed: IStormGlassPointSource
}

interface IStormGlassForecastResponse {
    hours: Array<IStormGlassPoint>
}

interface IForecastPoint {
    time: string;
    swellDirection: number
    swellHeight: number
    swellPeriod: number
    waveDirection: number
    waveHeight: number
    windDirection: number
    windSpeed: number
}

class ClientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage = `Unexpected error when trying to communicate to StormGlass`;

        super(`${internalMessage}: ${message}`);
    }
}

class StormGlassResponseError extends InternalError {
    constructor(message: string) {
        const internalMessage = 'Unexpected error returned by the StormGlass service';

        super(`${internalMessage}: ${message}`);
    }
}

class StormGlass {
    private readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    private readonly stormGlassApiSource = 'noaa';


    constructor(
        protected request: AxiosStatic
    ) { }

    public async fetchPoints(lat: number, long: number): Promise<Array<IForecastPoint>> {
        try {
            const response = await this.request.get<IStormGlassForecastResponse>(`
        https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${long}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}, 
        {
            headers: {
                Authorization: 'fake token'
            }
        }
        `);
            return this.normalizeResponse(response.data);
        }
        catch (err: any) {
            if (err.response && err.response.status) {
                throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`);
            }
            throw new ClientRequestError(err.message);
        }
    }

    private normalizeResponse(points: IStormGlassForecastResponse): Array<IForecastPoint> {
        return points.hours.filter(this.isValidPoint.bind(this))
            .map((point) => ({
                swellDirection: point.swellDirection[this.stormGlassApiSource],
                swellHeight: point.swellHeight[this.stormGlassApiSource],
                swellPeriod: point.swellPeriod[this.stormGlassApiSource],
                time: point.time,
                waveDirection: point.waveDirection[this.stormGlassApiSource],
                waveHeight: point.waveHeight[this.stormGlassApiSource],
                windDirection: point.windDirection[this.stormGlassApiSource],
                windSpeed: point.windSpeed[this.stormGlassApiSource],
            }))
    }

    private isValidPoint(point: Partial<IStormGlassPoint>): boolean {
        return !!(
            point.time &&
            point.swellDirection?.[this.stormGlassApiSource] &&
            point.swellHeight?.[this.stormGlassApiSource] &&
            point.swellPeriod?.[this.stormGlassApiSource] &&
            point.waveDirection?.[this.stormGlassApiSource] &&
            point.waveHeight?.[this.stormGlassApiSource] &&
            point.windDirection?.[this.stormGlassApiSource] &&
            point.windSpeed?.[this.stormGlassApiSource]
        );
    }
}

export { IStormGlassForecastResponse, ClientRequestError };
export default StormGlass;