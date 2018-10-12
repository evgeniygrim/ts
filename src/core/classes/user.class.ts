import { Mappable } from '@core/shared/classes/mappable.class';

export class User extends Mappable {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _middleName: string;
  private _sessionId: string;

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set middleName(value: string) {
    this._middleName = value;
  }

  get middleName(): string {
    return this._middleName;
  }

  set sessionId(value: string) {
    this._sessionId = value;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  constructor(data?) {
    super();

    this.init(data);
  }
}
