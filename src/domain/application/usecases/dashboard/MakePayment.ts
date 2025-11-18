import { DashboardRepository } from "../../../../infra/repository/DashboardRepository";
import { Payment } from "../../../entities/Payment";

class MakePayment {

  constructor(readonly dashboardRepository: DashboardRepository) { }

  async execute(input: Input): Promise<Output> {
    const payment = Payment.create(
      input.value,
      input.paymentMode,
      input.startDate,
      input.endDate,
      input.businessId
    );

    await this.dashboardRepository.makePayment(payment);

    return {
      paymentId: payment.paymentId
    }
  }

}

type Input = {
  value: number,
  paymentMode: string,
  startDate: Date,
  endDate: Date,
  businessId: string
}

type Output = {
  paymentId: string;
}

export { MakePayment }

