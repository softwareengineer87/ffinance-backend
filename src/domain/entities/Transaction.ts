import { v4 as uuidv4 } from 'uuid';
class Transaction {

  transactionId: string;
  value: number;
  description: string;
  type: string;
  category?: string;
  date: Date;
  businessId: string;

  constructor(
    transactionId: string,
    value: number,
    description: string,
    type: string,
    category: string,
    date: Date,
    businessId: string,
  ) {
    if (value <= 0) {
      throw new Error('O valor precisa ser positivo.');
    }
    console.log(value);

    if (type === '') {
      throw new Error('O tipo é obrigatório.');
    }

    if (description === '') {
      throw new Error('A descricao e obrigatoria');
    }

    if (date === null) {
      throw new Error('A data e obrigatoria.');
    }

    this.transactionId = transactionId;
    this.value = value;
    this.description = description;
    this.type = type;
    this.category = category;
    this.date = date;
    this.businessId = businessId;
  }

  static create(
    value: number,
    description: string,
    type: string,
    category: string,
    date: Date,
    businessId: string,
  ) {
    const transactionId = uuidv4();
    return new Transaction(
      transactionId,
      value,
      description,
      type,
      category,
      date,
      businessId
    );
  }

}

export { Transaction }

