import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { BookingComponent } from './components/booking/booking.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    RoomsComponent,
    BookingComponent,
    TabsComponent,
    ChatComponent,
  ],
  template: `
    <app-hero />
    <app-rooms />
    <app-booking />
    <app-tabs />
    <app-chat />
  `,
})
export class HomeComponent {}
