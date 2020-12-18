import { Component, OnInit, OnDestroy } from "@angular/core";
import { Offer } from "../../../shared/models/response/Offer";
import { Subscription } from "rxjs";
import { ComparatorSortService } from "../../../services/comparatorSort.service";
import { NgxSpinnerService } from "ngx-spinner";
import { VTCLocation } from "src/app/shared/models/VTCLocation";

@Component({
  selector: "app-offers-list",
  templateUrl: "./offers-list.component.html",
  styleUrls: ["./offers-list.component.scss"],
})
export class OffersListComponent implements OnInit, OnDestroy {
  offers: Offer[] = [];
  offersSub: Subscription;
  public loading = true;
  desc: boolean = false;
  arrivalLocation: VTCLocation;
  departureLocation: VTCLocation;
  date: Date;
  estimatedDistance: number;
  estimatedTime: number;
  immediate : boolean;
  page: number = 1;

  constructor(
    private comparatorSortService: ComparatorSortService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.immediate = this.comparatorSortService.immediate;
    this.loading = true;
    this.spinner.show();
    setTimeout( () => {
      //wait 10 seconds, if no response cancel request
      console.log(this.offers)
      if (!this.offers.length) {
        this.spinner.hide();
        this.loading = false;
      }
    },10000)
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
          console.error(err)
          this.spinner.hide();
          this.loading = false;
        },
      );
  }

  ngOnDestroy() {
    this.offersSub.unsubscribe();
  }

  orderByDelay() {
    this.page = 1
    this.comparatorSortService.sortByDelay(this.offers, this.desc);
  }

  orderByPrice() {
    this.page = 1
    this.comparatorSortService.sortByPrice(this.offers, this.desc);
  }

  orderByComfort() {
    this.page = 1
    this.comparatorSortService.sortByComfort(this.offers, this.desc);
  }

  orderByCO2Emission() {
    this.page = 1
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

  // offersList = [
  //   {
  //     application: "uber",
  //     Nom: "Hassan Ettaher",
  //     societe: " Société Ettaher hassan",
  //     Typedevoiture: "Peugeot 508",
  //     Bagages: "4 Bagages",
  //     sieges: "4 sieges",
  //     option: "wifi",
  //     prix: "185$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "kapten",
  //     Nom: "THomas Trix",
  //     societe: " Société Ettaher Trix",
  //     Typedevoiture: "Peugeot 508",
  //     Bagages: "6 Bagages",
  //     sieges: "4 sieges",
  //     option: "wifi",
  //     prix: "345$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "snapcar",
  //     Nom: "Philippe KOEHL",
  //     societe: " Société VTC Philippe KOEHL",
  //     Typedevoiture: " TOYOTA PRO ACE",
  //     Bagages: "6 Bagages",
  //     sieges: "6 sieges",
  //     option: "wifi",
  //     prix: "239.60$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "uber",
  //     Nom: "Thibault Lainé",
  //     societe: " Société Ettaher Trix",
  //     Typedevoiture: " Peugeot 508",
  //     Bagages: "2 Bagages",
  //     sieges: "1 sieges",
  //     option: "wifi",
  //     prix: "70.0$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "allocab",
  //     Nom: "Sandra ",
  //     societe: " VTC à Les sables",
  //     Typedevoiture: "Renault talisman",
  //     Bagages: "6 Bagages",
  //     sieges: "3 sieges",
  //     option: "wifi",
  //     prix: "246.80$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "lecab",
  //     Nom: "Thibault Lainé",
  //     societe: " Société DRIVR",
  //     Typedevoiture: " OPEL INSIGNIA",
  //     Bagages: "4 Bagages",
  //     sieges: "3 sieges",
  //     option: "wifi",
  //     prix: "341$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "lecab",
  //     Nom: "Hassan Thambous",
  //     societe: " Société Ettaher hassan",
  //     Typedevoiture: "Peugeot 507",
  //     Bagages: "3 Bagages",
  //     sieges: "2 sieges",
  //     option: "wifi",
  //     prix: "299$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "kapten",
  //     Nom: "Ahmed Ettaher",
  //     societe: " Société Ettaher Ahmed",
  //     Typedevoiture: "Renault talisman",
  //     Bagages: "2 Bagages",
  //     sieges: "6 sieges",
  //     option: "wifi",
  //     prix: "250$",
  //     delay: "delay",
  //   },
  //   {
  //     application: "snapcar",
  //     Nom: "Ala Thomas",
  //     societe: " Société Ettaher Thomas",
  //     Typedevoiture: "Peugeot 508",
  //     Bagages: "2 Bagages",
  //     sieges: "4 sieges",
  //     option: "wifi",
  //     prix: "295$",
  //     delay: "delay",
  //   },
  // ];
}
