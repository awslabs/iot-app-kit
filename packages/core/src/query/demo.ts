import { Observer, PartialObserver, Subscriber, Unsubscribable } from "rxjs";
import { DataStream } from '../data-module/types';
import { Component, Prop } from '@stencil/core';
import { DataModule } from '../../dist/types/data-module/types';

// namespace for "Data Modules" - the functions that produce sessions on a Data Module
namespace DataModules {

}

// namespace for holding queries
namespace Query {

}

interface CloseableSession {
  close(): void;
}

interface DataModuleSession extends CloseableSession {
}

interface SessionMetrics {
  startRequest(requestId: string): void
  endRequest(requestId: string, wasCached?: boolean): void
  errorRequest(requestId: string, error: string): void
  cancelRequest(requestId: string, error: string): void
  // Return statistics on the session, time taken by each request, total time etc
  statistics(): SessionStatistics;
}

type SessionStatistics = {
  // we should look at how other frameworks handle this, e.g. the browsers network tab.
  // entry for each request
    // requestId
    // start and end time
    // total time taken
    // result: error, cached, success, canceled
    // any error message that was captured
  // total requests
  // total wall clock time used
}

/**
 *
 */
interface AppKitComponentSession extends CloseableSession {
  attachDataModuleSession(session: DataModuleSession): void;
  getSessionMetrics(dataModuleName: string): SessionMetrics;
}

type TimeSeriesSettings = {
  //...
}

type TimeSeriesStyleSettings = {};

type TimeSeriesChartData = {
  streams: DataStream[],
  settings: TimeSeriesSettings,
  styleSettings: TimeSeriesStyleSettings
}

/**
 * This interface allows a Component to subscribe() to data. From then on changes to the data, errors etc. are delivered
 * to the observer.
 */
interface Provider<T> {
  // TODO: expand this interface so it can be an observer or just function
  subscribe(observer: PartialObserver<T>): Unsubscribable;
}

interface Query<T> {
  /**
   * The only required function of a Query, turns the Query into a Provider using a Session
   * @param session
   * @param props any additional parameters you want to pass into the build method
   */
  build(session: AppKitComponentSession, props?: Map<string, any>): Provider<T>;
}

type QueryBuilder<T> = {
  (): Query<T>;
}

// Bananas IoT data module:
class BananasIotServiceClient {
  static CLIENT_NAME: string = "BananasIotServiceClient";
  getSession(session: AppKitComponentSession): BananasIotDataSession {
    // get a metrics object for logging
    let bananaSession = new BananasIotDataSession(this, session.getSessionMetrics("BananasIoTDataModule"));
    // attach the session to the component scoped session so it gets close() calls
    session.attachDataModuleSession(bananaSession);
    return bananaSession;
  }
}

class BananasIotDataSession implements DataModuleSession {
  private client: BananasIotServiceClient;
  private metrics: SessionMetrics;

  constructor(client: BananasIotServiceClient, metrics: SessionMetrics) {
    this.client = client;
    this.metrics = metrics;
  }

  public fetchBananaData(variety: string, country: string): Promise<DataStream[]> {
    // do metrics logging:
    this.metrics.startRequest("r1");
    this.metrics.endRequest("r1");
    return new Promise(() => []);
  }

  close(): void {
    // terminate all requests in session
  }
}

namespace DataModules {
  export function BananasIotData(session: AppKitComponentSession): BananasIotDataSession {
    /** TK: how this function gets the data module is not described. It could do that a number of ways. **/
    return new BananasIotServiceClient().getSession(session);
  }
}

// meanwhile in module Bananas IoT
namespace Query {
  export function bananasIotQuery(bananaType: string, bananaCountry: string): Query<TimeSeriesChartData> {
    return {
      build: function(session: AppKitComponentSession): Provider<TimeSeriesChartData> {
        // actualize a BananasIotDataSession from the client pool and the DataModules namespace
        const bananasIot: BananasIotDataSession = DataModules.BananasIotData(session);

        return {
          subscribe: function (subscriber: PartialObserver<TimeSeriesChartData>) {
              bananasIot.fetchBananaData(bananaType, bananaCountry).then(bananaData => {
                if (subscriber && subscriber.next) {
                  subscriber.next({
                    streams: bananaData, settings: {}, styleSettings: {}
                  });
                }
              });

            return {unsubscribe() {}};
          }
        }
      }
    }
  }
}


/**
 *  In the components layer
 */

@Component({
  tag: 'base-iot-line-chart',
  shadow: false,
})
export class BaseLineChart {
  // inside the iot-line-chart, convert the query to a provider:
  @Prop() provider: Provider<TimeSeriesChartData>;

  private latestValue: TimeSeriesChartData;

  onWillMount(): void {
    let subscription = this.provider.subscribe({next: value => {
        this.latestValue = value;
    }});
  }

  render() {
    // render data from latestValue
  }
}

@Component({
  tag: 'iot-line-chart',
  shadow: false,
})
export class IotLineChart {
  @Prop() appKit: AppKit = appKit;

  @Prop() session: AppKitComponentSession = this.appKit.newSession();

  @Prop() query: Query<TimeSeriesChartData> = Query.bananasIotQuery("Cavandish", "Equador");

  render() {
    <base-line-chart
      provider=query.build(session)
    />
  }
}
