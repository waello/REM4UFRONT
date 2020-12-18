import { VTCLocation } from "../VTCLocation";
import { Passengers } from "./Passengers";
import { TripTypeDetails } from "./TripTypeDetails";
import { TripOptions } from "./TripOptions";

export class VTCComparatorRequest {
  goingsComings: boolean;
  departureLocation: VTCLocation;
  arrivalLocation: VTCLocation;
  immediate: boolean;
  date: String;
  passengers: Passengers;
  tripType: TripTypeDetails;
  tripOptions: TripOptions;

  constructor(
    goingsComings,
    departureLocation,
    arrivalLocation,
    immediate,
    date,
    passengers,
    tripType,
    tripOptions
  ) {
    this.goingsComings = goingsComings
    this.departureLocation = departureLocation
    this.arrivalLocation = arrivalLocation
    this.immediate = immediate
    this.date = date
    this.passengers = passengers
    this.tripType = tripType
    this.tripOptions = tripOptions
  }
}
