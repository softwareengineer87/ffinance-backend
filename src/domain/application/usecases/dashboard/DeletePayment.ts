import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";

class DeletePayment {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(paymentId: string): Promise<Output> {
    await this.connection.query(`DELETE FROM payments
    WHERE payment_id = $1`, [paymentId]);

    return {
      paymentId
    };
  }

}

type Output = {
  paymentId: string;
}

export { DeletePayment }

