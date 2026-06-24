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
import { ChatService, ChatMessage } from '../../services/chat.service';

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
  styles: [
    `
      .chat-section {
        padding: 49px 42px;
        border-bottom: 1px solid #1a1a1a;
      }

      .np-section-title {
        font-size: 19px;
        letter-spacing: 3.5px;
        color: var(--np-gray);
        text-transform: uppercase;
        span {
          color: var(--np-accent);
          margin-right: 10.5px;
        }
      }

      .chat-container {
        background: var(--np-surface);
        border: 1px solid #333;
        max-width: 680px;
      }

      /* Header */
      .chat-header {
        background: #0d0d0d;
        border-bottom: 1px solid #222;
        padding: 18px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .agent-avatar {
        width: 40px;
        height: 40px;
        background: var(--np-accent);
        color: var(--np-black);
        font-weight: 700;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .agent-name {
        font-size: 15px;
        color: var(--np-white);
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .agent-status {
        font-size: 13px;
        color: var(--np-gray);
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
      }

      .online-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--np-accent);
        display: inline-block;
      }

      .resp-time {
        margin-left: auto;
        font-size: 13px;
        color: var(--np-gray);
        letter-spacing: 0.5px;
      }

      /* Messages */
      .chat-messages {
        height: 300px;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .msg-bubble {
        max-width: 72%;
        padding: 12px 16px;
        font-size: 15.75px;
        line-height: 1.5;
        letter-spacing: 0.3px;
      }

      .msg-studio {
        background: #111;
        border: 1px solid #2a2a2a;
        border-left: 2px solid var(--np-accent);
        color: var(--np-light);
        align-self: flex-start;
      }

      .msg-user {
        background: #1a2800;
        border: 1px solid #2d4000;
        border-right: 2px solid var(--np-accent);
        color: #d8ff80;
        align-self: flex-end;
      }

      .msg-time {
        font-size: 12px;
        color: var(--np-gray);
        margin-top: 6px;
        letter-spacing: 0.5px;
      }

      /* Typing indicator */
      .typing-indicator {
        display: none;
        align-self: flex-start;
        padding: 12px 16px;
        background: #111;
        border: 1px solid #2a2a2a;
        border-left: 2px solid var(--np-accent);
        gap: 4px;
        margin-bottom: 4px;

        &.visible {
          display: flex;
        }

        span {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--np-gray);
          animation: blink 1.2s infinite;

          &:nth-child(2) {
            animation-delay: 0.2s;
          }
          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }

      @keyframes blink {
        0%,
        80%,
        100% {
          opacity: 0.2;
        }
        40% {
          opacity: 1;
        }
      }

      .chat-input-row {
        display: flex;
        border-top: 1px solid #222;
      }

      .chat-input {
        flex: 1;
        background: #0a0a0a;
        border: none;
        border-right: 1px solid #222;
        color: var(--np-white);
        font-family: var(--font-mono);
        font-size: 16px;
        padding: 16px 20px;
        outline: none;
        letter-spacing: 0.3px;

        &::placeholder {
          color: #444;
        }
      }

      .chat-send {
        background: var(--np-accent);
        color: var(--np-black);
        font-family: var(--font-mono);
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 16px 24px;
        border: none;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.85;
        }
      }

      .chat-note {
        font-size: 13px;
        color: var(--np-gray);
        margin-top: 10px;
        letter-spacing: 0.5px;
        span {
          color: var(--np-accent);
        }
      }
    `,
  ],
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
