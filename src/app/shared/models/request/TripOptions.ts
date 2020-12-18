export class TripOptions {
  carSeat: boolean;
  seatBooster: boolean;
  luggage: number;
  favoriteCarBrand: string;

  constructor(carSeat, seatBooster, luggage, favoriteCarBrand) {
    this.carSeat = carSeat;
    this.seatBooster = seatBooster;
    this.luggage = luggage;
    this.favoriteCarBrand = favoriteCarBrand;
  }
}
