import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Photo } from "../../../entities/Photo";

class Getlogo {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(businessId: string): Promise<Photo> {
    const [photo] = await this.connection.query(`SELECT * FROM photos
      WHERE business_id = $1`, [businessId]);

    return new Photo(
      photo.photo_id,
      photo.business_id,
      photo.url
    );
  }

}

export { Getlogo }

