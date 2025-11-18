import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Business } from "../../../entities/Business";

class GetBusiness {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(): Promise<Business[]> {
    const business = await this.connection.query(`SELECT * FROM simplehour.business`, []);
    return business;
  }

}

export { GetBusiness }

