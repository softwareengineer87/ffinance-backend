import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Business } from "../../../entities/Business";

class UpdateBusiness {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(
    businessId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    city: string,
    district: string,
    addressNumber: number,
    description: string
  ): Promise<Output> {
    const business = Business.create(
      name, email, cpf, password, city, district,
      addressNumber, description
    );
    const hashPass = await business.password.emcryptPassword(password);

    await this.connection.query(`UPDATE simplehour.business SET
    name = $1, email = $2, cpf = $3, password = $4, city = $5, district = $6, 
    address_number = $7, description = $8
    WHERE business_id = $9`, [business.name, business.getEmail(),
    business.cpf, hashPass, business.city, business.district,
    business.addressNumber, business.description,
      businessId]);

    return {
      businessId: business.businessId
    }
  }

}

type Output = {
  businessId: string;
}

export { UpdateBusiness }

