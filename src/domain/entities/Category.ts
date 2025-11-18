import { v4 as uuidv4 } from 'uuid';

class Category {

  categoryId: string;
  title: string;

  constructor(categoryId: string, title: string) {
    if (title === '') {
      throw new Error('O titulo é obrigatório.');
    }

    this.categoryId = categoryId;
    this.title = title;
  }

  static create(title: string) {
    const categoryId = uuidv4();
    return new Category(categoryId, title);
  }

}

export { Category }

