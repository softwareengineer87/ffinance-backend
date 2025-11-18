import { DashboardRepository } from "../../../../infra/repository/DashboardRepository";
import { Category } from "../../../entities/Category";

class CreateCategory {

  constructor(readonly dashboardRepository: DashboardRepository) { }

  async execute(title: string): Promise<Output> {
    const category = Category.create(title);
    await this.dashboardRepository.createCategory(category);

    return {
      categoryId: category.categoryId
    }
  }

}

type Output = {
  categoryId: string;
}

export { CreateCategory }

