import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";

class DeleteTransaction {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(transactionId: string): Promise<Output> {
    await this.connection.query(`DELETE FROM transactions
    WHERE transaction_id = $1`, [transactionId]);

    return {
      transactionId
    };
  }

}

type Output = {
  transactionId: string;
}

export { DeleteTransaction }

