import { DashboardRepository } from "../../../../infra/repository/DashboardRepository";
import { Payment } from "../../../entities/Payment";

class GetPayments {

  constructor(readonly dashboardRepository: DashboardRepository) { }

  async execute(
    businessId: string,
    limit: number,
    offset: number
  ): Promise<Payment[]> {
    const payments = await this.dashboardRepository.getPayments(
      businessId,
      limit,
      offset
    );

    return payments;
  }
}

export { GetPayments }

