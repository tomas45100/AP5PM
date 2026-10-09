import { Component, inject, OnInit, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
  IonInput,
  IonSelect, 
  IonSelectOption
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
    IonInput,
    IonSelect,
    IonSelectOption,
    FormsModule,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  searchName = '';
  public alertButtons = [{text: 'Zrušit', role: 'cancel', handler: () => {},}, {text: 'Potvrdit', role: 'confirm', handler: () => this.clear()}];

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
  }

  async search(): Promise<void>{
    await this.counterService.search(this.searchName);
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
  }

  async sort(event: CustomEvent): Promise<void>{
    switch(event.detail.value){
      case "name_asc":
        await this.counterService.sortNameAsc();
        break;
      case "name_desc":
        await this.counterService.sortNameDesc();
        break;
      case "value_asc":
        await this.counterService.sortValueAsc();
        break;
      case "value_desc":
        await this.counterService.sortValueDesc();
        break;
    };
  }
}