import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {AirlineFlightInfoResult, FlightInfo} from "../shared/models/flightAPI/flightInfo";

import { from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FlightAPIService {
  url = "https://cors-anywhere.herokuapp.com/https://flightxml.flightaware.com/json/FlightXML2/";
  username = "mayssabenkahla7";
  password = "2cf3da27d2371ee185f62952cec08a51dd7543dc";
  constructor(private http: HttpClient) {}
  private reqHeader = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa(this.username + ":" + this.password),
  });

  getFlightInfo(ident: string, howMany: string) {
    return this.http.get<{
      error: string;
      FlightInfoResult: {
        flights: FlightInfo[];
      };
    }>(this.url + 'FlightInfo', {
      headers: this.reqHeader,
      params: new HttpParams().set('ident', ident).set('howMany', howMany),
    });
    // fetch(
    //   "https://cors-anywhere.herokuapp.com/https://flightxml.flightaware.com/json/FlightXML2/FlightInfo?ident=ddsdsdsdds&howMany=1https://flightxml.flightaware.com/json/FlightXML2/FlightInfo?ident=ddsdsdsdds&howMany=1",
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Basic " + btoa(this.username + ":" + this.password),
    //     },
    //   }
    // ).then((res) => {
    //   console.log(res);
    // });
  }
  getFlightGate(code: string, stmp: string) {
    return this.http.get<{
      error: string;
      AirlineFlightInfoResult: AirlineFlightInfoResult;
    }>(this.url + 'AirlineFlightInfo', {
      headers: this.reqHeader,
      params: new HttpParams().set('faFlightID', code + '@' + stmp),
    });
    // fetch(
    //   "https://cors-anywhere.herokuapp.com/https://flightxml.flightaware.com/json/FlightXML2/FlightInfo?ident=ddsdsdsdds&howMany=1https://flightxml.flightaware.com/json/FlightXML2/FlightInfo?ident=ddsdsdsdds&howMany=1",
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Basic " + btoa(this.username + ":" + this.password),
    //     },
    //   }
    // ).then((res) => {
    //   console.log(res);
    // });
  }
}
