import { BusinessRepository } from "../../../../infra/repository/BusinessRepository";

class BusinessDetail {

  constructor(readonly businessRepository: BusinessRepository) { }

  async execute(businessId: string): Promise<Output> {
    const business = await this.businessRepository.businessDetail(businessId);
    return {
      businessId: business.businessId,
      name: business.name,
      email: business.getEmail(),
      password: business.password.getValue(),
      city: business.city,
      district: business.district,
      addressNumber: business.addressNumber,
      description: business.description,
      canSchedule: business.getCanSchedule(),
      plan: business.getPlan()
    }
  }

}

type Output = {
  businessId: string;
  name: string;
  email: string;
  password: string;
  city: string;
  district: string;
  addressNumber: number;
  description: string;
  canSchedule: boolean;
  plan: string;
}

export { BusinessDetail }

