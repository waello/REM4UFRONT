export class VTCLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  addressLine1: string;
  addressLine2: string;


  constructor(id: string, latitude: number, longitude: number, address: string, addressLine1: string, addressLine2: string) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
  }
}
