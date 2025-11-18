import { BusinessRepository } from "../../../../infra/repository/BusinessRepository";
import { Business } from "../../../entities/Business";

class CreateBusiness {

  constructor(readonly businessRepository: BusinessRepository) { }

  async execute(input: Input): Promise<Output> {
    const businessData = await this.businessRepository.getByEmail(input.email);
    if (businessData) {
      throw new Error('Este email já está cadastrado no sistema.');
    }
    const business = Business.create(
      input.name,
      input.email,
      input.password,
      input.cnpj
    );

    const hashPass = await business.password.emcryptPassword(input.password);
    const token = business.generateToken();
    await this.businessRepository.saveBusiness(
      business.businessId, business.name, business.getEmail(),
      hashPass, business.cnpj
    );

    return {
      businessId: business.businessId,
      token
    }
  }

}

type Input = {
  name: string;
  email: string;
  password: string;
  cnpj: string;
}

type Output = {
  businessId: string;
  token: string;
}

export { CreateBusiness }

