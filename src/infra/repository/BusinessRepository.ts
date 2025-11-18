import { Business } from "../../domain/entities/Business";
import { DatabaseConnection } from "../database/PgPromiseAdapter";

interface BusinessRepository {
  saveBusiness(
    businessId: string,
    name: string,
    email: string,
    password: string,
    cnpj: string,
  ): Promise<void>;
  getByEmail(email: string): Promise<Business | null>;
  businessDetail(businessId: string): Promise<Business>;
  savePhoto(photoId: string, businessId: string, url: string): Promise<void>;
}

class BusinessRepositoryDatabase implements BusinessRepository {

  constructor(readonly connection: DatabaseConnection) { }

  async saveBusiness(
    businessId: string,
    name: string,
    email: string,
    password: string,
    cnpj: string,
  ): Promise<void> {
    await this.connection.query(`INSERT INTO business
    (business_id, name, email, password, cnpj)
    VALUES($1, $2, $3, $4, $5)`, [
      businessId, name, email, password, cnpj
    ]);
  }

  async getByEmail(email: string): Promise<Business | null> {
    const [businessData] = await this.connection.query(`SELECT * FROM business 
    WHERE email = $1`, [email]);
    if (businessData) {
      return new Business(businessData.business_id, businessData.name,
        businessData.email, businessData.password, businessData.cnpj);
    }

    return null;
  }

  async businessDetail(businessId: string): Promise<Business> {
    const [businessData] = await this.connection.query(`SELECT * FROM business
    WHERE business_id = $1`, [businessId]);

    return new Business(businessData.business_id, businessData.name,
      businessData.email, businessData.password, businessData.cnpj);
  }

  async savePhoto(photoId: string, businessId: string, url: string): Promise<void> {
    await this.connection.query(`INSERT INTO photos
    (photo_id, business_id, url) VALUES ($1, $2, $3)`, [photoId, businessId, url]);
  }

}

export {
  BusinessRepository,
  BusinessRepositoryDatabase
}

