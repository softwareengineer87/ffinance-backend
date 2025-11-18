import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Customer } from "../../../entities/Customer";

class GetAllCustomers {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(
    limit: number,
    offset: number
  ): Promise<Customer[]> {
    const customers = await this.connection.query(`SELECT * FROM simplehour.customers
    LIMIT $1 OFFSET $2`, [limit, offset]);
    return customers;
  }

}

export { GetAllCustomers }

