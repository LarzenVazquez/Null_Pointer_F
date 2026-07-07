import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  inject,
  AfterViewChecked,
} from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '@services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgClass, FormsModule],
  template: `
    <section class="chat-section" id="contacto">
      <div class="np-section-title" style="margin-bottom: 21px">
        <span>//</span> Habla con nosotros
      </div>

      <div class="chat-container">
        <div class="chat-header">
          <div class="agent-avatar">NP</div>
          <div>
            <div class="agent-name">Null Pointer Studio</div>
            <div class="agent-status">
              <span class="online-dot"></span>En linea ahora
            </div>
          </div>
          <div class="resp-time">Resp. tipica: &lt; 2 min</div>
        </div>

        <div class="chat-messages" #messagesContainer>
          <div
            *ngFor="let msg of messages()"
            class="msg-bubble"
            [ngClass]="'msg-' + msg.type"
          >
            {{ msg.text }}
            <div class="msg-time">
              {{ msg.time }} — {{ msg.type === 'studio' ? 'Agente NP' : 'Tu' }}
            </div>
          </div>

          <div class="typing-indicator" [class.visible]="isTyping()">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="chat-input-row">
          <input
            class="chat-input"
            type="text"
            placeholder="Escribe tu mensaje aqui..."
            maxlength="200"
            [(ngModel)]="inputText"
            (keydown.enter)="sendMessage()"
          />
          <button class="chat-send" (click)="sendMessage()">Enviar</button>
        </div>
      </div>

      <p class="chat-note">
        Respuesta automatica activa · <span>Horario 24/7</span>
      </p>
    </section>
  `,
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef<HTMLDivElement>;

  private chatService = inject(ChatService);

  messages = signal<ChatMessage[]>([
    {
      text: 'Hola, bienvenido a Null Pointer Studio. Somos una sala de ensayos profesional en Queretaro. En que te podemos ayudar?',
      type: 'studio',
      time: this.chatService.getTimeStr(),
    },
  ]);

  isTyping = signal(false);
  inputText = '';

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.update((msgs) => [
      ...msgs,
      { text, type: 'user', time: this.chatService.getTimeStr() },
    ]);
    this.inputText = '';
    this.isTyping.set(true);

    const delay = 1200 + Math.random() * 1000;
    setTimeout(() => {
      this.isTyping.set(false);
      this.messages.update((msgs) => [
        ...msgs,
        {
          text: this.chatService.getReply(text),
          type: 'studio',
          time: this.chatService.getTimeStr(),
        },
      ]);
    }, delay);
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
