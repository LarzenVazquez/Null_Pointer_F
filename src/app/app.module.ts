import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { BookingComponent } from './components/booking/booking.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ChatComponent } from './components/chat/chat.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventoDemoComponent } from './components/evento-demo/evento-demo.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    NavbarComponent,
    HeroComponent,
    RoomsComponent,
    BookingComponent,
    TabsComponent,
    ChatComponent,
    FooterComponent,
    EventoDemoComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
