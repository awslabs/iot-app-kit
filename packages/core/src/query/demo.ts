import { Observer, PartialObserver, Subscriber, Unsubscribable } from "rxjs";
import { DataStream } from '../data-module/types';

// namespace for data modules
namespace DataModules {

}

/**
 * interface that returns a sessionized interface of a Data Module
 */
interface Sessionizable<T> {
  getSession(clients: Map<string, object>): T;
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
  build(clients: Map<string, object>, props?: Map<string, any>): Provider<T>;
}

type QueryBuilder<T> = {
  (): Query<T>;
}

// declare root namespace
namespace Query {
}

// Bananas IoT data module:
class BananasIotServiceClient {
  static CLIENT_NAME: string = "BananasIotServiceClient";
}

class BananasIotDataSession {
  private client:BananasIotServiceClient ;

  constructor(client: BananasIotServiceClient ) {
    this.client = client;
  }

  public fetchBananaData(variety: string, country: string): Promise<DataStream[]> {
    return new Promise(() => []);
  }
}

namespace DataModules {
  export class BananasIotData implements Sessionizable<BananasIotDataSession> {
    getSession(clients: Map<string, object>): BananasIotDataSession {
      return new BananasIotDataSession(clients.get(BananasIotServiceClient.CLIENT_NAME) as BananasIotServiceClient);
    }
  }
}

// meanwhile in module Bananas IoT
namespace Query {
  export function bananasIotQuery(bananaType: string, bananaCountry: string): Query<TimeSeriesChartData> {
    return {
      build: function(clients: Map<string, object>, props: Map<string, any>): Provider<TimeSeriesChartData> {
        // actualize a BananasIotDataSession from the client pool and the DataModules namespace
        const bananasIot: BananasIotDataSession = new DataModules.BananasIotData().getSession(clients);

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

<iot-line-chart>
  // a session is created for the component
  let session: ModuleSession = AppKit.getSession();  // namespaces are not instances, so we will have to work this out

  // get Query from the props on iot-line-chart
  let query: Query<TimeSeriesChartData> = Query.bananasIotQuery("Cavandish", "Equador");

  // inside the iot-line-chart, convert the query to a provider:
  let provider: Provider<TimeSeriesChartData> =  query.build(session);

  <base-line-chart>
    // inside the base-iot-line-chart, subscribe to the data once:
    provider.subscribe( {
      next: (data:TimeSeriesChartData) => {}
      // save data in props
      // re-render
    });
  </base-line-chart>

</iot-line-chart>
