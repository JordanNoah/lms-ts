export class DomainEvent {
    readonly occurredOn: Date;
  
    constructor(
      public readonly name: string,
      public readonly data: Record<string, any>
    ) {
      this.occurredOn = new Date();
    }
  }
  