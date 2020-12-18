import { MapsComponent } from './ui-segments/maps/maps.component';
import { FiltersComponent } from './ui-segments/filters/filters.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFeatureRoutingModule} from './main-feature-routing.module';
import { ComparatorFormComponent } from './pages/comparator-form/comparator-form.component';
import { ComparatorOffersComponent } from './pages/comparator-offers/comparator-offers.component';
import { ComparatorOfferDetailsComponent } from './pages/comparator-offer-details/comparator-offer-details.component';
import { OffersListComponent } from './ui-segments/offers-list/offers-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { SidebarModule } from 'ng-sidebar';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSpinnerModule } from "ngx-spinner";
import { TimePipe } from '../pipes/time.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { OffersFullListComponent } from './ui-segments/offers-full-list/offers-full-list.component';

@NgModule({
  declarations: [
    ComparatorFormComponent,
    ComparatorOffersComponent,
    ComparatorOfferDetailsComponent,
    OffersListComponent,
    FiltersComponent,
    MapsComponent,
    TimePipe,
    OffersFullListComponent
  ],
  imports: [
    CommonModule,
    MainFeatureRoutingModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDkJjmwF0PRX3IKKGwIn3v8j4uoHvjnWl0",
    }),
    NgxLoadingModule.forRoot({}),
    NgxSpinnerModule,
    NgxPaginationModule,
    SharedModule,
  ],
  exports: [OffersListComponent, FiltersComponent, MapsComponent],
  providers: []
})
export class MainFeatureModule {

}
