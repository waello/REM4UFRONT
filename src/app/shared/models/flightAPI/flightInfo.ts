import {Timestamp} from 'rxjs';
import Table = WebAssembly.Table;

export class FlightInfo {
  actualarrivaltime: number;
  actualdeparturetime: Timestamp<number>;
  aircrafttype: string;
  destination: string;
  destinationCity: string;
  destinationName: string;
  diverted: string;
  estimatedarrivaltime: Timestamp<number>;
  filed_airspeed_kts: number;
  filed_airspeed_mach: string;
  filed_altitude: number;
  filed_departuretime: number;
  filed_ete: string;
  filed_time: number;
  ident: string;
  origin: string;
  originCity: string;
  originName: string;
  constructor(
    filed_departuretime,
    estimatedarrivaltime,
    ident,
    originName,
    destinationName
  ) {
    this.filed_departuretime = filed_departuretime;
    this.estimatedarrivaltime = estimatedarrivaltime;
    this.ident = ident;
    this.originName = originName;
    this.destinationName = destinationName;
  }
}
export class AirlineFlightInfoResult {
  faFlightID: string;
  ident: string;
  codeshares: string;
  tailnumber: string;
  meal_service: string;
  gate_orig: string;
  gate_dest: string;
  terminal_orig: string;
  terminal_dest: string;
  bag_claim: string;
  seats_cabin_first: string;
  seats_cabin_business: string;
  seats_cabin_coach: string;

}
