import { v4 as uuidv4 } from 'uuid';
import { Password } from '../Password';
import { sign, verify } from 'jsonwebtoken';
import { Email } from '../Email';

class Business {

  private email: Email;
  password: Password;

  constructor(
    readonly businessId: string,
    readonly name: string,
    email: string,
    password: string,
    readonly cnpj: string,
  ) {
    if (name === '') {
      throw new Error('O nome é obrigatório.');
    }
    if (email === '') {
      throw new Error('O e-mail é obrigatório.');
    }
    if (cnpj === '') {
      throw new Error('O cpf é obrigatório.');
    }
    if (password === '') {
      throw new Error('A senha é obrigatória.');
    }
    this.email = new Email(email);
    this.password = new Password(password);
  }

  static create(
    name: string,
    email: string,
    password: string,
    cnpj: string,
  ) {
    const businessId = uuidv4();
    return new Business(
      businessId,
      name,
      email,
      password,
      cnpj
    );
  }

  generateToken() {
    const payload = {
      businessId: this.businessId,
      name: this.name,
      email: this.email,
      cnpj: this.cnpj,
    }
    const token = sign(payload, 'webdesign', { algorithm: 'HS256', expiresIn: '24h' });
    return token;
  }

  verifyToken(token: string) {
    return verify(token, 'webdesign');
  }

  validateToken(token: string) {
    const payload = this.verifyToken(token);
    if (typeof payload === 'string') {
      throw new Error('Token inválido, faça login novamente.');
    }
  }

  getEmail() {
    return this.email.getValue();
  }

  getPassword() {
    return this.password.getValue();
  }

}

export { Business }

