import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { RoomsComponent } from '../../components/rooms/rooms.component';
import { BookingComponent } from '../../components/booking/booking.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { EventoDemoComponent } from '../../components/evento-demo/evento-demo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, RoomsComponent, BookingComponent, TabsComponent, ChatComponent, EventoDemoComponent],
  template: `
    <!-- Banner de evento calendarizado (P6) -->
    <app-evento-demo />
    <!-- 1. Hero / Banner principal -->
    <app-hero />
    <!-- 2. Contenido principal: tarjetas de salas -->
    <app-rooms />
    <!-- 3. Formulario de reserva en línea -->
    <app-booking />
    <!-- 4. Navegación por pestañas (Equipo / Tarifas / Normas) -->
    <app-tabs />
    <!-- 5. Widget de chat / comunicación asíncrona -->
    <app-chat />
  `,
})
export class HomeComponent {}
