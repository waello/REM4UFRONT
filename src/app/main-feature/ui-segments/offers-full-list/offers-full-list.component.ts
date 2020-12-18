import { Component, OnInit } from '@angular/core';
import { Offer } from '../../../shared/models/response/Offer';
import { Subscription } from 'rxjs';
import { ComparatorSortService } from '../../../services/comparatorSort.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VTCLocation } from 'src/app/shared/models/VTCLocation';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-offers-full-list',
  templateUrl: './offers-full-list.component.html',
  styleUrls: ['./offers-full-list.component.scss'],
})
export class OffersFullListComponent implements OnInit {
  offers: Offer[] = [];
  offersSub: Subscription;
  routerSubscription: Subscription;
  public loading = true;
  desc = false;
  arrivalLocation: VTCLocation;
  departureLocation: VTCLocation;
  date: Date;
  estimatedDistance: number;
  estimatedTime: number;
  immediate: boolean;
  page = 1;
  sort = 'Price';
  p: Date;

  constructor(
    private comparatorSortService: ComparatorSortService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    // this.routerSubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     const data = JSON.parse(localStorage.getItem('data'));
    //     this.arrivalLocation = data.arrivalLocation;
    //     this.departureLocation = data.departureLocation;
    //     this.date = new Date(data.date);
    //     this.estimatedDistance = data.estimatedDistance;
    //     this.estimatedTime = data.estimatedTime;
    //
    //     this.offers = data.offers;
    //   }
    // });
  }

  ngOnInit(): void {
    this.immediate = this.comparatorSortService.immediate;
    this.loading = true;
    this.spinner.show();
    setTimeout(() => {
      // wait 10 seconds, if no response cancel request
      console.log(this.offers);
      if (!this.offers.length) {
        this.spinner.hide();
        this.loading = false;
        const data = JSON.parse(localStorage.getItem('data'));
        console.log(data);
        this.arrivalLocation = data.arrivalLocation;
        this.departureLocation = data.departureLocation;
        this.date = new Date(data.date);
        this.estimatedDistance = data.estimatedDistance;
        this.estimatedTime = data.estimatedTime;

        this.offers = data.offers;
      }
    }, 10000);
    this.offersSub = this.comparatorSortService
      .getOffersUpdatedListener()
      .subscribe(
        (data: {
          arrivalLocation: VTCLocation;
          departureLocation: VTCLocation;
          date: Date;
          estimatedDistance: number;
          estimatedTime: number;
          offers: Offer[];
        }) => {
          this.arrivalLocation = data.arrivalLocation;
          this.departureLocation = data.departureLocation;
          this.date = new Date(data.date);
          this.estimatedDistance = data.estimatedDistance;
          this.estimatedTime = data.estimatedTime;

          this.offers = data.offers;
          this.spinner.hide();
          this.loading = false;
        },
        (err) => {
          console.error(err);
          this.spinner.hide();
          this.loading = false;
        }
      );
  }

  ngOnDestroy() {
    this.offersSub.unsubscribe();
  }

  orderByDelay() {
    this.sort = 'Delay';
    this.page = 1;
    this.comparatorSortService.sortByDelay(this.offers, this.desc);
  }

  orderByPrice() {
    this.sort = 'Price';
    this.page = 1;
    this.comparatorSortService.sortByPrice(this.offers, this.desc);
  }

  orderByComfort() {
    this.sort = 'Comfort';
    this.page = 1;
    this.comparatorSortService.sortByComfort(this.offers, this.desc);
  }

  orderByCO2Emission() {
    this.sort = 'CO2Emission';
    this.page = 1;
    this.comparatorSortService.sortByCo2Emission(this.offers, this.desc);
  }

  onChange(value: number) {
    if (value == 1) {
      this.desc = false;
    }
    if (value == 2) {
      this.desc = true;
    }
  }
  addDays(date: Date, minutes: number , o: Offer): Date {
    if (!this.immediate) {
      this.p = new  Date(date);
      this.p.setMinutes(date.getMinutes() + minutes);
    }

    if (this.immediate) {
      this.p = new  Date(date);
      this.p.setMinutes(date.getMinutes() + minutes + o.waitingTime);
    }
    return  this.p;
  }
  function(offer) {

    if ( offer.platformVTC === 'URBAN_DRIVER') {
  window.open(  'https://urbandriver.yusofleet.com/new_front?_ga=2.27177533.1674020554.1606942437-1153907020.1606942437#/', '_blank');
 }
    if ( offer.platformVTC === 'UBER') {
  // tslint:disable-next-line:max-line-length
  window.open(  'https://auth.uber.com/login/?uber_client_name=riderSignUp&amp;_ga=2.6157364.605494986.1606942139-370173496.1606851989&amp;uclick_id=207666ea-b367-4174-b81b-27079dd89f75', '_blank');
    }
    if ( offer.platformVTC === 'SNAPCAR') {
      window.open(  'https://www.snapcar.com', '_blank');
    }
    if ( offer.platformVTC === 'ALLOCAB') {
      window.open(  'https://www.allocab.com/booking/#/', '_blank');
    }
  }
  }
