import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Offer } from "../shared/models/response/Offer";
import { Subject } from "rxjs";
import { VTCComparatorResponse } from "../shared/models/response/VTCComparatorResponse";
import { ComparatorSorter } from '../shared/models/ComparatorSorter.enum';
import { SortByComparatorSorterChain } from '../shared/models/sortByComparatorSorterChain.enum';
import { VTCLocation } from "../shared/models/VTCLocation";

@Injectable({
  providedIn: "root",
})
export class ComparatorSortService {
  private APIEndpoint = environment.API_END_POINT;

  immediate : boolean;

  private arrivalLocation: VTCLocation;
  private departureLocation: VTCLocation;
  private date: Date;
  private estimatedDistance: Number;
  private estimatedTime: Number;


  private offers: Offer[] = [];
  public offersUpdated = new Subject<{
    arrivalLocation: VTCLocation;
    departureLocation: VTCLocation;
    date: Date;
    estimatedDistance: Number;
    estimatedTime: Number;
    offers: Offer[];
  }>();
  constructor(private http: HttpClient) {}

  getOffersUpdatedListener() {
    return this.offersUpdated.asObservable();
  }

  getVTCResponseAsync(requestBody) {
    this.immediate = requestBody.immediate;
    this.http
      .post<{ header: any; body: { result: VTCComparatorResponse } }>(
        this.APIEndpoint + 'vtc/vtc-list-async',
        requestBody
      )
      .subscribe((res) => {
        console.log(res.body);
        this.offers = res.body.result.offers;
        this.arrivalLocation = res.body.result.arrivalLocation;
        this.departureLocation = res.body.result.departureLocation;
        this.date = res.body.result.date;
        this.estimatedDistance =  res.body.result.estimatedDistance;
        this.estimatedTime = res.body.result.estimatedTime;

        this.offersUpdated.next({
          arrivalLocation: res.body.result.arrivalLocation,
          departureLocation: res.body.result.departureLocation,
          date: res.body.result.date,
          estimatedDistance: res.body.result.estimatedDistance,
          estimatedTime: res.body.result.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  getVTCResponseSync(requestBody) {
    this.immediate = requestBody.immediate;
    this.http
      .post<{ header: any; body: { result: VTCComparatorResponse } }>(
        this.APIEndpoint + "vtc/vtc-list",
        requestBody
      )
      .subscribe((res) => {
        console.log(res.body);
        this.offers = res.body.result.offers;
        this.arrivalLocation = res.body.result.arrivalLocation;
        this.departureLocation = res.body.result.departureLocation;
        this.date = res.body.result.date;
        this.estimatedDistance =  res.body.result.estimatedDistance;
        this.estimatedTime = res.body.result.estimatedTime;

        this.offersUpdated.next({
          arrivalLocation: res.body.result.arrivalLocation,
          departureLocation: res.body.result.departureLocation,
          date: res.body.result.date,
          estimatedDistance: res.body.result.estimatedDistance,
          estimatedTime: res.body.result.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  getVTCResponseMock(requestBody) {
    this.immediate = requestBody.immediate;
    this.http
      .post<{ header: any; body: { result: VTCComparatorResponse } }>(
        this.APIEndpoint + "vtc/vtc-list-mock",
        requestBody
      )
      .subscribe((res) => {
        console.log(res.body);
        this.offers = res.body.result.offers;
        this.arrivalLocation = res.body.result.arrivalLocation;
        this.departureLocation = res.body.result.departureLocation;
        this.date = res.body.result.date;
        this.estimatedDistance =  res.body.result.estimatedDistance;
        this.estimatedTime = res.body.result.estimatedTime;

        this.offersUpdated.next({
          arrivalLocation: res.body.result.arrivalLocation,
          departureLocation: res.body.result.departureLocation,
          date: res.body.result.date,
          estimatedDistance: res.body.result.estimatedDistance,
          estimatedTime: res.body.result.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  getVTCResponseEureCab(requestBody) {
    this.immediate = requestBody.immediate;
    this.http
      .post<{ header: any; body: { result: VTCComparatorResponse } }>(
        this.APIEndpoint + "vtc/vtc-list-eurecab",
        requestBody
      )
      .subscribe((res) => {
        console.log(res.body);

        this.offers = res.body.result.offers;
        this.arrivalLocation = res.body.result.arrivalLocation;
        this.departureLocation = res.body.result.departureLocation;
        this.date = res.body.result.date;
        this.estimatedDistance =  res.body.result.estimatedDistance;
        this.estimatedTime = res.body.result.estimatedTime;

        this.offersUpdated.next({
          arrivalLocation: res.body.result.arrivalLocation,
          departureLocation: res.body.result.departureLocation,
          date: res.body.result.date,
          estimatedDistance: res.body.result.estimatedDistance,
          estimatedTime: res.body.result.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  sortByPrice(offers: Offer[], desc: boolean) {
    const params = new HttpParams()
      .set("desc", String(desc))
      .set("immediate", String(true));
    this.http
      .post<{ header: any; body: { result: Offer[] } }>(
        this.APIEndpoint + "comparatorSort/sortByPrice",
        offers,
        { params }
      )
      .subscribe(
        (res) => {
          console.log(res.body.result);
          this.offers = res.body.result;
          console.log(this.offers);
          this.offersUpdated.next({
            arrivalLocation: this.arrivalLocation,
            departureLocation: this.departureLocation,
            date: this.date,
            estimatedDistance: this.estimatedDistance,
            estimatedTime: this.estimatedTime,
            offers: [...this.offers],
          });
          localStorage.setItem('data', JSON.stringify(res.body.result));
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sortByCo2Emission(offers: Offer[], desc: boolean) {
    const params = new HttpParams()
      .set("desc", String(desc))
      .set("immediate", String(true));
    this.http
      .post<{ header: any; body: { result:  Offer[]  } }>(
        this.APIEndpoint + "comparatorSort/sortByCo2Emission",
        offers,
        { params }
      )
      .subscribe((res) => {
        this.offers = res.body.result;
        this.offersUpdated.next({
          arrivalLocation: this.arrivalLocation,
          departureLocation: this.departureLocation,
          date: this.date,
          estimatedDistance: this.estimatedDistance,
          estimatedTime: this.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  sortByComfort(offers: Offer[], desc: boolean) {
    const params = new HttpParams()
      .set("desc", String(desc))
      .set("immediate", String(true));
    this.http
      .post<{ header: any; body: { result: Offer[]  } }>(
        this.APIEndpoint + "comparatorSort/sortByComfort",
        offers,
        { params }
      )
      .subscribe((res) => {
        this.offers = res.body.result;
        this.offersUpdated.next({
          arrivalLocation: this.arrivalLocation,
          departureLocation: this.departureLocation,
          date: this.date,
          estimatedDistance: this.estimatedDistance,
          estimatedTime: this.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  sortByDelay(offers: Offer[], desc: boolean) {
//    const params = new HttpParams().set("desc", String(this.descendant));
    console.log("delay : ");
    console.log(desc) ;
    const params = new HttpParams().set("desc", String(desc));
    this.http
      .post<{ header: any; body: { result:  Offer[]  } }>(
        this.APIEndpoint + "comparatorSort/sortByDelay",
        offers,
        { params }
      )
      .subscribe((res) => {
        this.offers = res.body.result;
        this.offersUpdated.next({
          arrivalLocation: this.arrivalLocation,
          departureLocation: this.departureLocation,
          date: this.date,
          estimatedDistance: this.estimatedDistance,
          estimatedTime: this.estimatedTime,
          offers: [...this.offers],
        });
        localStorage.setItem('data', JSON.stringify(res.body.result));
      });
  }

  sortByGivenchainOrder(requestBody, comparatorsChainOrder: ComparatorSorter[], desc: boolean) {
    const params = new HttpParams()
      .set("comparatorsChainOrder", comparatorsChainOrder.join(', '))
      .set("desc", String(desc));

    this.http
      .post<{ header: any; body: { result:  Offer[]  } }>(
        this.APIEndpoint + "comparatorSort/sortByGivenchainOrder",
        requestBody,
        { params }
      )
      .subscribe((res) => {
        this.offers = res.body.result;
        this.offersUpdated.next({
          arrivalLocation: this.arrivalLocation,
          departureLocation: this.departureLocation,
          date: this.date,
          estimatedDistance: this.estimatedDistance,
          estimatedTime: this.estimatedTime,
          offers: [...this.offers],
        });
      });
  }

  sortByPriorities(requestBody, comparatorsChainOrder: ComparatorSorter[], desc: boolean) {
    const params = new HttpParams()
      .set("comparatorsChainOrder", comparatorsChainOrder.join(', '))
      .set("desc", String(desc));
    this.http
      .post<{ header: any; body: { result: Offer[]  } }>(
        this.APIEndpoint + "comparatorSort/sortByPriorities",
        requestBody
      )
      .subscribe((res) => {
        this.offers = res.body.result;
        this.offersUpdated.next({
          arrivalLocation: this.arrivalLocation,
          departureLocation: this.departureLocation,
          date: this.date,
          estimatedDistance: this.estimatedDistance,
          estimatedTime: this.estimatedTime,
          offers: [...this.offers],
        });
      });
  }

  sorter(requestBody, sorter: SortByComparatorSorterChain, desc: boolean) {
    const params = new HttpParams()
      .set("desc", String(desc));
    this.http
      .post<{ header: any; body: { result:  Offer[]  } }>(
        this.APIEndpoint + "comparatorSort/sort/"+sorter,
        requestBody
      )
      .subscribe((res) => {
        this.offers = res.body.result;
        this.offersUpdated.next({
          arrivalLocation: this.arrivalLocation,
          departureLocation: this.departureLocation,
          date: this.date,
          estimatedDistance: this.estimatedDistance,
          estimatedTime: this.estimatedTime,
          offers: [...this.offers],
        });
      });
  }
}
