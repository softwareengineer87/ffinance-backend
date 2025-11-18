import { DashboardRepository } from "../../../../infra/repository/DashboardRepository";
import { Transaction } from "../../../entities/Transaction";

class MakeTransaction {

  constructor(readonly dashboardRepository: DashboardRepository) { }

  async execute(input: Input): Promise<Output> {
    const transaction = Transaction.create(
      input.value,
      input.description,
      input.type,
      input.category,
      input.date,
      input.businessId
    );
    console.log(transaction);

    await this.dashboardRepository.makeTransaction(transaction);

    return {
      transactionId: transaction.transactionId
    }
  }

}

type Input = {
  value: number;
  description: string;
  type: string;
  category: string;
  date: Date;
  businessId: string;
}

type Output = {
  transactionId: string;
}

export { MakeTransaction }

