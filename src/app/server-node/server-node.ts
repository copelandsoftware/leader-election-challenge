import { Component, Input } from '@angular/core';
import { Message, MessageType } from '../message';
import { ServerNodeBase } from '../server-node-base';

@Component({
  selector: 'app-server-node',
  imports: [],
  templateUrl: './server-node.html',
  styleUrl: './server-node.scss'
})
export class ServerNode extends ServerNodeBase {

  @Input() name: string = "default";

  leader: string = "Unknown";
  color: string = "green";
  info: string = "Hello World!";

  private MAX_TRAFFIC_DELAY: number = 15000;

  receiveCast(message: Message) {
    if (message.message == MessageType.NewMember) {
      this.handleNewMember(message);
    } else {
      this.info = `${message.senderName} sent me a cast`;
    }
  }

  receiveCall(message: Message): Message {
    this.info = `${message.senderName} gave me a call`;
    const responseMessage = new Message(this.name, MessageType.CoolStoryBro);
    return responseMessage;
  }

  onOffline() {
    this.leader = "Unknown";
    this.color = "grey";
    this.info = "Went Offline";
  }

  onOnline() {
    this.leader = this.name;
    this.color = "green";
    this.info = "Back Online";
  }

  onInit() {
    this.leader = this.name;
    this.broadcast(new Message(this.name, MessageType.NewMember));
    this.generateSomeTraffic();
  }

  private generateSomeTraffic() {
    const delay = Math.floor(Math.random() * this.MAX_TRAFFIC_DELAY) + 1;
    const fun = (delay % 2) ? this.randomCall(this) : this.randomCast(this);
    setTimeout(fun, delay);
  }

  private randomCall(self: this) : Function {
    return () => {
      const response = self.sendCall(self.leader, new Message(self.name, MessageType.JustSayinHello)).then(response => {
        self.info = `Called ${self.leader} and they said ${MessageType[response.message]}`;
      });
      self.generateSomeTraffic();
    }
  }

  private randomCast(self: this): Function {
    return () => {
      self.sendCast(self.leader, new Message(self.name, MessageType.JustSayinHello));
      self.generateSomeTraffic();
    }
  }

  private handleNewMember(message: Message) {
    this.leader = message.senderName;
  }

}

