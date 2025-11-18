import { Customer } from "../../domain/entities/Customer";
import { DatabaseConnection } from "../database/PgPromiseAdapter";

interface CustomerRepository {
  saveCustomer(
    customerId: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    cancellCount: number
  ): Promise<void>;
  getByEmail(email: string): Promise<Customer | null>;
  customerDetail(customerId: string): Promise<Customer>;
}

class CustomerRepositoryDatabase implements CustomerRepository {

  constructor(readonly connection: DatabaseConnection) { }

  async saveCustomer(
    customerId: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    cancellCount: number
  ): Promise<void> {
    await this.connection.query(`INSERT INTO simplehour.customers
    (customer_id, name, email, password, phone, cancell_count)
    VALUES($1, $2, $3, $4, $5, $6)`, [
      customerId, name, email, password, phone, cancellCount
    ]);
  }

  async getByEmail(email: string): Promise<Customer | null> {
    const [customerData] = await this.connection.query(`SELECT * FROM simplehour.customers 
    WHERE email = $1`, [email]);
    if (customerData) {
      return new Customer(customerData.customer_id, customerData.name,
        customerData.email, customerData.password, customerData.phone,
        customerData.cancell_count
      )
    }

    return null;
  }

  async customerDetail(customerId: string): Promise<Customer> {
    const [customer] = await this.connection.query(`SELECT * FROM simplehour.customers
    WHERE customer_id = $1`, [customerId]);

    return new Customer(
      customer.customerId,
      customer.name,
      customer.email,
      customer.password,
      customer.phone,
      customer.cancell_count,
    );
  }

}

export {
  CustomerRepository,
  CustomerRepositoryDatabase
}

