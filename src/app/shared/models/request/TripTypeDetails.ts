import { TripType } from "./TripTypeenum";

export class TripTypeDetails {
  tripType: TripType;
  hour: number;
  tripNumber: number;
  tripProvenance: string;
  tripClass: string;
  pickup: string;

  constructor(tripType, hour, tripNumber, tripProvenance, tripClass, pickup) {
    this.tripClass = tripType;
    this.hour = hour;
    this.tripNumber = tripNumber;
    this.tripProvenance = tripProvenance;
    this.tripClass = tripClass;
    this.pickup = pickup;
  }
}
