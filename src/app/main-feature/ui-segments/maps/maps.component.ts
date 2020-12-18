import { Component, OnInit } from '@angular/core';
import {AgmCoreModule} from '@agm/core';


@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.scss"],
})
export class MapsComponent implements OnInit {
  latitudeDeparture = 51.678418;
  longitudeDeparture = 7.809007;

  latitudeArrival =41.678418;
  longitudeArrival = 6.809007;
  constructor() {}

  ngOnInit(): void {}
}
