import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { BookingComponent } from './components/booking/booking.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ChatComponent } from './components/chat/chat.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    RoomsComponent,
    BookingComponent,
    TabsComponent,
    ChatComponent,
    FooterComponent,
  ],
  template: `
    <div class="site">
      <app-navbar />
      <app-hero />
      <app-rooms />
      <app-booking />
      <app-tabs />
      <app-chat />
      <app-footer />
    </div>
  `,
  styles: [
    `
      .site {
        background: var(--np-black);
        color: var(--np-white);
        font-family: var(--font-mono);
        width: 100%;
      }
    `,
  ],
})
export class AppComponent {}
