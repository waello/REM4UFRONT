import { VTCLocation } from '../VTCLocation';
import { Offer } from './Offer';

export class VTCComparatorResponse {
  departureLocation: VTCLocation;
  arrivalLocation:VTCLocation ;
  date:Date ;
  estimatedDistance:number ;
  estimatedTime:number ;
  offers :Offer[] ;
}
