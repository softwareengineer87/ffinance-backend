import { DashboardRepository } from "../../../../infra/repository/DashboardRepository";
import { Transaction } from "../../../entities/Transaction";

class GetTransactions {

  constructor(readonly dashboardRepository: DashboardRepository) { }

  async execute(businessId: string, limit: number, offset: number): Promise<Transaction[]> {
    const transactions = await this.dashboardRepository.getTransactions(businessId, limit, offset);

    return transactions;
  }

}

export { GetTransactions }

