import { DashboardRepository } from "../../../../infra/repository/DashboardRepository";

class ChangeStatus {

  constructor(readonly dashboardRepository: DashboardRepository) { }

  async execute(paymentId: string): Promise<Output> {
    const payment = await this.dashboardRepository.paymentDetail(paymentId);
    payment.changeStatus();
    await this.dashboardRepository.updatePaymentStatus(payment.getStatus(), paymentId);

    return {
      paymentId: payment.paymentId
    }
  }

}

type Output = {
  paymentId: string;
}

export { ChangeStatus }

