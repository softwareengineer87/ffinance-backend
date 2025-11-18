import { Category } from "../../domain/entities/Category";
import { Payment } from "../../domain/entities/Payment";
import { Transaction } from "../../domain/entities/Transaction";
import { DatabaseConnection } from "../database/PgPromiseAdapter";

interface DashboardRepository {
  makeTransaction(transaction: Transaction): Promise<void>;
  createCategory(category: Category): Promise<void>;
  makePayment(payment: Payment): Promise<void>;
  updatePaymentStatus(status: string, paymentId: string): Promise<void>;
  getTransactions(
    businessId: string,
    limit: number,
    offset: number
  ): Promise<Transaction[]>;
  getPayments(
    businessId: string,
    limit: number,
    offset: number
  ): Promise<Payment[]>;
  paymentDetail(paymentId: string): Promise<Payment>;
}

class DashboardRepositoryDatabase implements DashboardRepository {

  constructor(readonly connection: DatabaseConnection) { }

  async makeTransaction(transaction: Transaction): Promise<void> {
    await this.connection.query(`INSERT INTO transactions 
      (transaction_id, value, description, type, category, date, business_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [transaction.transactionId, transaction.value, transaction.description,
      transaction.type, transaction.category, transaction.date, transaction.businessId]);
  }

  async createCategory(category: Category): Promise<void> {
    await this.connection.query(`INSERT INTO categories
      (category_id, title) VALUES($1, $2)`, [category.categoryId, category.title]);
  }

  async makePayment(payment: Payment): Promise<void> {
    await this.connection.query(`INSERT INTO payments
      (payment_id, value, payment_mode, status, start_date, end_date,
      created_at, business_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [payment.paymentId, payment.value, payment.paymentMode, payment.getStatus(),
      payment.startDate, payment.endDate, payment.createdAt, payment.businessId]);
  }

  async updatePaymentStatus(status: string, paymentId: string): Promise<void> {
    await this.connection.query(`UPDATE payments SET status = $1
    WHERE payment_id = $2`, [status, paymentId]);
  }

  async getTransactions(businessId: string, limit: number, offset: number): Promise<Transaction[]> {
    const transactions = await this.connection.query(`SELECT * FROM transactions
      WHERE business_id = $1 LIMIT $2 OFFSET $3`, [businessId, limit, offset]);

    return transactions;
  }

  async getPayments(businessId: string, limit: number, offset: number): Promise<Payment[]> {
    const payments = await this.connection.query(`SELECT * FROM payments
    WHERE business_id = $1 LIMIT $2 OFFSET $3`, [businessId, limit, offset]);

    return payments;
  }

  async paymentDetail(paymentId: string): Promise<Payment> {
    const [paymentData] = await this.connection.query(`SELECT * FROM payments
    WHERE payment_id = $1`, [paymentId]);
    return new Payment(
      paymentData.payment_id,
      paymentData.value,
      paymentData.payment_mode,
      paymentData.status,
      paymentData.start_date,
      paymentData.end_date,
      paymentData.created_at,
      paymentData.business_id
    );
  }

}

export {
  DashboardRepository,
  DashboardRepositoryDatabase
}

