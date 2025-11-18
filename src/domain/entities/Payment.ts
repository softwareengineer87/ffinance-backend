import { v4 as uuidv4 } from 'uuid';

class Payment {

  paymentId: string;
  value: number;
  paymentMode: string; // pay or receive
  private status: string; // pending or pay or receive
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  businessId: string;

  constructor(
    paymentId: string,
    value: number,
    paymentMode: string,
    status: string,
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    businessId: string
  ) {
    if (value <= 0) {
      throw new Error('O valor precisa ser positivo e é origatório.');
    }
    if (paymentMode === '') {
      throw new Error('O modo de pagamento é origatório.');
    }
    if (paymentMode !== 'pay' && paymentMode !== 'receive') {
      throw new Error('O modo de pagamento está incorreto..');
    }
    if (startDate === null) {
      throw new Error('A data inicio é origatória.');
    }
    if (endDate === null) {
      throw new Error('A data final é origatória.');
    }

    if (endDate < startDate) {
      throw new Error('A data final precisa ser maior que a inicial.');
    }

    this.paymentId = paymentId;
    this.value = value;
    this.paymentMode = paymentMode;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
    this.businessId = businessId;
  }

  static create(
    value: number,
    paymentMode: string,
    startDate: Date,
    endDate: Date,
    businessId: string
  ) {
    const paymentId = uuidv4();
    const createdAt = new Date();
    const status = 'pending';
    return new Payment(
      paymentId,
      value,
      paymentMode,
      status,
      startDate,
      endDate,
      createdAt,
      businessId
    );
  }

  changeStatus() {
    if (this.status === 'pending') {
      if (this.paymentMode === 'pay') {
        this.status = 'pay';
      } else if (this.paymentMode === 'receive') {
        this.status = 'receive';
      }
    } else {
      return;
    }
  }

  getStatus() {
    return this.status;
  }

}

export { Payment }

