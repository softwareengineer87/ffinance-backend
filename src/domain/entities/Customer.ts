import { v4 as uuidv4 } from 'uuid';
import { Password } from '../Password';
import { sign, verify } from 'jsonwebtoken';
import { Email } from '../Email';

class Customer {

  private email: Email;
  password: Password;
  private cancellCount: number;

  constructor(
    readonly customerId: string,
    readonly name: string,
    email: string,
    password: string,
    readonly phone: string,
    cancellCount: number
  ) {
    if (name === '') {
      throw new Error('O nome é obrigatório.');
    }
    if (phone === '') {
      throw new Error('O telefone é obrigatório.');
    }
    this.email = new Email(email);
    this.password = new Password(password);
    this.cancellCount = cancellCount;
  }

  static create(
    name: string,
    email: string,
    password: string,
    phone: string,
  ) {
    const businessId = uuidv4();
    const cancellCount: number = 0;
    return new Customer(
      businessId,
      name,
      email,
      password,
      phone,
      cancellCount
    );
  }

  generateToken() {
    const payload = {
      customerId: this.customerId,
      name: this.name,
      email: this.email.getValue(),
      phone: this.phone,
    }
    const token = sign(payload, 'webdesign', { algorithm: 'HS256', expiresIn: '48h' });
    return token;
  }

  verifyToken(token: string) {
    return verify(token, 'webdesign');
  }

  updateCount() {
    this.cancellCount++;
  }

  zeroCancellCount() {
    this.cancellCount = 0;
  }

  getEmail() {
    return this.email.getValue();
  }

  getPassword() {
    return this.password.getValue();
  }

  getCancellCount() {
    return this.cancellCount;
  }

}

export { Customer }

