import { VTCPlatformName } from './VTCPlatformNameenum';
import { Driver } from './Driver';
import { Vehicle } from './Vehicle';
import { Price } from './Price';
import { VTCLocation } from '../VTCLocation';

export class Offer {
  platformVTC: VTCPlatformName;
  driver:Driver ;
  vehicle:Vehicle;
  price:Price;
  waitingTime:number;
  VTCProvidedDepartureLocation: VTCLocation;
  VTCProvidedArrivalLocation:VTCLocation ;
  VTCProvidedEstimatedDistance:number ;
  VTCProvidedEstimatedTime:number ;
}
