import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ComparatorSortService} from '../../../services/comparatorSort.service';
import {FlightAPIService} from '../../../services/flight-api.service';
import {AirlineFlightInfoResult, FlightInfo} from '../../../shared/models/flightAPI/flightInfo';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VTCComparatorRequest} from '../../../shared/models/request/VTCComparatorRequest';
import {VTCLocation} from '../../../shared/models/VTCLocation';
import {Passengers} from '../../../shared/models/request/Passengers';
import {TripTypeDetails} from '../../../shared/models/request/TripTypeDetails';
import {TripType} from '../../../shared/models/request/TripTypeenum';
import {TripOptions} from '../../../shared/models/request/TripOptions';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-comparator-form',
  templateUrl: './comparator-form.component.html',
  styleUrls: ['./comparator-form.component.scss']
})
export class ComparatorFormComponent implements OnInit {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private comparatorSortService: ComparatorSortService,
    private flightAPIService: FlightAPIService
  ) {}
  private geoCoder = new google.maps.Geocoder();
  flightRegex = /^([A-Z]{2}|[A-Z]\d|\d[A-Z])[1-9](\d{1,3})?$/;
  selectedDeparture = 0; /* to dynamically show inputs */
  selectedArrival = 0; /* to dynamically show inputs */
  // to toggle the button
  isImmediate = false;

  // used to interact with the tabs(etape 2-3) after validation
  @ViewChild('etape2', { static: true }) step2: ElementRef;
  @ViewChild('etape3', { static: true }) step3: ElementRef;

  // used to update automatically the selected address by the autocomplete feature
  @ViewChild('addressDepartureInput', { static: true })
  addressDepartureInput: ElementRef;
  @ViewChild('addressArrivalInput', { static: true })
  addressArrivalInput: ElementRef;

  arrivalTabEnabled = false;
  passengersTabEnabled = false;
  flightInfo: FlightInfo;
  b: boolean;
  airlineFlightInfoResult: AirlineFlightInfoResult;

  searchForm : FormGroup;

  options = {
    types: [],
    componentRestrictions: { country: 'FR' },
  };

  ngOnInit(): void {
    // Geolocation : returns latitude and longitude
    // then using the reverse geocoding to extract address(human readable)
    if (navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.geocodeLatLng(pos.coords.latitude, pos.coords.longitude);
      });
    }

    this.searchForm = new FormGroup({
      // etape 1
      isImmediate: new FormControl(/*localStorage.getItem('isImmediate') ? localStorage.getItem('isImmediate') : */false),
      volInfoKnownDeparture: new FormControl(false),
      volNumDeparture: new FormControl(),
      // trainInfoKnownDeparture: new FormControl(),
      // busInfoKnownDeparture: new FormControl(),
      // portInfoKnownDeparture: new FormControl(),
      addressDeparture: new FormControl(localStorage.getItem('addressDeparture') ? localStorage.getItem('addressDeparture') : '', [
        Validators.required,
        Validators.minLength(3),
      ]),

      // etape 2
      volInfoKnownArrival: new FormControl(false),
      addressArrival: new FormControl(localStorage.getItem('addressArrival') ? localStorage.getItem('addressArrival') : '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      // trainInfoKnownArrival: new FormControl(),
      // busInfoKnownArrival: new FormControl(),
      // portInfoKnownArrival: new FormControl(),

      // etape 3
      dateDeparture: new FormControl(localStorage.getItem('dateDeparture') ? localStorage.getItem('dateDeparture') : '', Validators.required),
      timeDeparture: new FormControl(localStorage.getItem('timeDeparture') ? localStorage.getItem('timeDeparture') : '', Validators.required),
      numberAdults: new FormControl( localStorage.getItem('numberAdults') ? localStorage.getItem('numberAdults') : 1, Validators.required),
      numberKids: new FormControl(localStorage.getItem('numberKids') ? localStorage.getItem('numberKids') : 0, Validators.required),
      numberBabies: new FormControl(localStorage.getItem('numberBabies') ? localStorage.getItem('numberBabies') : 0, Validators.required),
    });
    // initializing the geocoder of AGM
  }

  showInfo() {
    console.log(this.searchForm.value);
  }

  // validating step 1, if ok pass to step 2
  checkStep1() {
    this.searchForm.patchValue({
      addressDeparture: this.addressDepartureInput.nativeElement.value,
    });

    if (
      this.addressArrivalInput.nativeElement.value ==
      this.addressDepartureInput.nativeElement.value
    ) {
      this.toastr.error(
        'The arrival and departure locations are the same !',
        'Arrival & Departure location'
      );
      this.arrivalTabEnabled = false;
    } else if (this.searchForm.get('dateDeparture').invalid) {
      this.toastr.error('Departure date is invalid', 'departure date');
      this.arrivalTabEnabled = false;
    } else if (this.searchForm.get('timeDeparture').invalid) {
      this.toastr.error('Departure Time is invalid', 'departure time');
      this.arrivalTabEnabled = false;
    } else if (this.searchForm.get('addressDeparture').invalid) {
      this.toastr.error(
        'please verify the departure location',
        'Departure location'
      );
      this.arrivalTabEnabled = false;
    } else {
      this.arrivalTabEnabled = true;
      this.step2.nativeElement.click();
    }
  }

  // validating step 2, if ok pass to step 3
  checkStep2() {
    this.searchForm.patchValue({
      addressArrival: this.addressArrivalInput.nativeElement.value,
    });
    if (
      this.addressArrivalInput.nativeElement.value ==
      this.addressDepartureInput.nativeElement.value
    ) {
      this.passengersTabEnabled = false;
      this.toastr.error(
        'The arrival and departure locations are the same !',
        'Arrival & Departure location'
      );
    } else if (this.searchForm.get('addressArrival').invalid) {
      this.toastr.error(
        'please verify the Arrival location',
        'Arrival location'
      );
      this.passengersTabEnabled = false;
    } else {
      this.passengersTabEnabled = true;
      this.step3.nativeElement.click();
    }
  }

  // get the latitude, longitude and place_id of an address
  geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number; place_id: string }> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        {
          address,
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const latLngId = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
              place_id: results[0].place_id,
            };

            resolve(latLngId);
          } else {
            reject(new Error(status));
          }
        }
      );
    });
  }

  // convert location(latitude,longitude) to human readable address
  // store result in departure
  public geocodeLatLng(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: {
          lat,
          lng,
        },
      },
      (
        results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus
      ) => {
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0]);

            this.searchForm.patchValue({
              addressDeparture: results[0].formatted_address,
            });
            // this.searchForm.value.addressDeparture = results[0].formatted_address ;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }
  beforeSearch(){
    localStorage.setItem('addressDeparture', this.searchForm.value.addressDeparture);
    localStorage.setItem('addressArrival', this.searchForm.value.addressArrival);
    localStorage.setItem('isImmediate', this.searchForm.get('isImmediate').value);
    localStorage.setItem('dateDeparture', this.searchForm.get('dateDeparture').value);
    localStorage.setItem('timeDeparture', this.searchForm.get('timeDeparture').value);
    localStorage.setItem('numberAdults', this.searchForm.get('numberAdults').value);
    localStorage.setItem('numberKids', this.searchForm.get('numberKids').value);
    localStorage.setItem('numberBabies', this.searchForm.get('numberBabies').value);
  }
  async search() {
    this.beforeSearch();
    if (this.searchForm.valid) {
      console.log(this.searchForm.value.addressDeparture);

      const vtcComparatorRequest = new VTCComparatorRequest(
        false, // goingsComings

        // departureLocation
        new VTCLocation(
          (
            await this.geocodeAddress(this.searchForm.value.addressDeparture)
          ).place_id,
          (
            await this.geocodeAddress(this.searchForm.value.addressDeparture)
          ).lat,
          (
            await this.geocodeAddress(this.searchForm.value.addressDeparture)
          ).lng,

          this.searchForm.value.addressDeparture,
          this.searchForm.value.addressDeparture,
          this.searchForm.value.addressDeparture
        ),

        // arrivalLocation
        new VTCLocation(
          (
            await this.geocodeAddress(this.searchForm.value.addressArrival)
          ).place_id,
          (await this.geocodeAddress(this.searchForm.value.addressArrival)).lat,
          (await this.geocodeAddress(this.searchForm.value.addressArrival)).lng,
          this.searchForm.value.addressArrival,
          this.searchForm.value.addressArrival,
          this.searchForm.value.addressArrival
        ),

        // immediate
        this.searchForm.get('isImmediate').value,
        // date
        new Date(
          this.searchForm.get('dateDeparture').value.slice(0, 4),
          this.searchForm.get('dateDeparture').value.slice(5, 7) - 1,
          this.searchForm.get('dateDeparture').value.slice(8, 11),
          this.searchForm.get('timeDeparture').value.slice(0, 2),
          this.searchForm.get('timeDeparture').value.slice(3, 5),
          0
        ).toISOString(),

        // passengers
        new Passengers(
          this.searchForm.get('numberAdults').value,
          this.searchForm.get('numberKids').value,
          this.searchForm.get('numberBabies').value,
          this.searchForm.get('numberAdults').value +
          this.searchForm.get('numberKids').value +
          this.searchForm.get('numberBabies').value
        ),

        // tripType
        new TripTypeDetails(TripType.DEFAULT, 0, null, null, null, null),

        // options
        new TripOptions(null, null, null, null)
      );
      console.log(vtcComparatorRequest);
      // this.comparatorSortService.getVTCResponseMock(vtcComparatorRequest);
      // this.comparatorSortService.getVTCResponseEureCab(vtcComparatorRequest);
      // this.comparatorSortService.getVTCResponseSync(vtcComparatorRequest);
      this.comparatorSortService.getVTCResponseAsync(vtcComparatorRequest);
      // this.router.navigate(["offers"]);
      this.router.navigate(['offers']);
    } else {
      this.toastr.show('verify the form', 'error');
    }
  }

  timeNow() {
    return new Date().getUTCHours() + ':' + new Date().getMinutes();
  }

  // minimum date : date of today - 1 day
  minDate() {
    const n = new Date();
    const y = n.getFullYear();
    const m =
      (n.getMonth() + 1).toString().length == 1
        ? '0' + (n.getMonth() + 1)
        : n.getMonth() + 1;
    const d =
      (n.getDate() + 1).toString().length == 1
        ? '0' + n.getDate()
        : n.getDate();
    return y + '-' + m + '-' + d;
  }

  public immediate() {
    this.isImmediate = !this.isImmediate;
    this.searchForm.patchValue({
      isImmediate: !this.searchForm.get('isImmediate').value,
    });
    if (this.searchForm.get('isImmediate').value) {
      const n = new Date();
      const y = n.getFullYear();
      const m =
        (n.getMonth() + 1).toString().length == 1
          ? '0' + (n.getMonth() + 1)
          : n.getMonth() + 1;
      const d = (n.getDate()).toString().length == 1
          ? "0" + (n.getDate())
          : n.getDate();
      console.log(m);

      this.searchForm.patchValue({
        timeDeparture:
          (new Date().getHours() < 10 ? "0" + new Date().getHours().toString() : new Date().getHours().toString()) +
          ":" +
          (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes().toString() : new Date().getMinutes().toString()),
        dateDeparture: y + "-" + m + "-" + d,
      });
    } else {
      this.searchForm.patchValue({
        timeDeparture: null,
        dateDeparture: null,
      });
    }
  }

  public setSelectedDeparture(address: any) {
    if (address.types[0] == 'airport') {
      this.selectedDeparture = 1;
    } else {
      this.selectedDeparture = 0;
    }
  }

  public setSelectedArrival(address: any) {
    if (address.types[0] == 'airport') {
      this.selectedArrival = 1;
    } else {
      this.selectedArrival = 0;
    }
  }
  checkVolNum1(code: string, stmp: string) {
    this.flightAPIService.getFlightGate(code, stmp).subscribe(
      (res) => {
        if (res.error) {
          // this.toastr.error("", "Le format du numéro de vol n'est pas valide", {
          //   closeButton: true,
          //   disableTimeOut: true,
          // });
        } else {
          this.airlineFlightInfoResult = res.AirlineFlightInfoResult;
          console.log('reeeeee');
          console.log(this.airlineFlightInfoResult);
        }
      },
      (err) => {
        console.error(err);
        this.toastr.error(
          'Flight info error',
          'we are unable to get infomations about the flight, please try again'
        );
      }
    );
  }
  checkVolNum(code: string) {
    this.flightAPIService.getFlightInfo(code, '1').subscribe(
      (res) => {
        if (res.error) {
          // this.toastr.error("", "Le format du numéro de vol n'est pas valide", {
          //   closeButton: true,
          //   disableTimeOut: true,
          // });
        } else {
          this.flightInfo = res.FlightInfoResult.flights[0];
          console.log(this.flightInfo);
        }
        this.checkVolNum1(code, String(this.flightInfo.filed_departuretime));
        console.log(this.airlineFlightInfoResult);
      },
      (err) => {
        console.error(err);
        this.toastr.error(
          'Flight info error',
          'we are unable to get infomations about the flight, please try again'
        );
      }
    );
  }

  getMaxPlacesAdults(): number {
    return (
      7 -
      (this.searchForm.get('numberKids').value +
        this.searchForm.get('numberBabies').value)
    );
  }

  getMaxPlacesBabies(): number {
    return (
      7 -
      (this.searchForm.get('numberAdults').value +
        this.searchForm.get('numberKids').value)
    );
  }

  getMaxPlacesKids(): number {
    return (
      7 -
      (this.searchForm.get('numberAdults').value +
        this.searchForm.get('numberBabies').value)
    );
  }

}
