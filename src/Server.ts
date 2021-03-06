import './Util/ModuleAlias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import ForecastController from './Controllers/ForecastController';
import { Application } from 'express';

class SetupServer extends Server {
  constructor(private port: number = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  public getApp(): Application {
    return this.app;
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();

    this.addControllers([forecastController]);
  }
}

export default SetupServer;
