import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { DatabaseConnection } from "../database/PgPromiseAdapter";
import { Login } from "../../domain/application/usecases/customer/Login";
import { CustomerRepositoryDatabase } from "../repository/CustomerRepository";
import { Signup } from "../../domain/application/usecases/customer/Signup";
import { customerMiddleware } from "../../middlewares/customerMiddleware";
import { BusinessRepositoryDatabase } from "../repository/BusinessRepository";

function routesCustomer(fastify: FastifyInstance, connection: DatabaseConnection) {

  const customerRepository = new CustomerRepositoryDatabase(connection);
  const businessRepository = new BusinessRepositoryDatabase(connection);
  const login = new Login(customerRepository);
  const signup = new Signup(customerRepository);

  fastify.post('/customer/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as { email: string, password: string };
      const { token, payload } = await login.execute(email, password);
      reply.code(200).send({
        token,
        payload,
        message: 'Login efetuado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/customer/signup', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        name,
        email,
        password,
        phone,
      } = request.body as {
        name: string, email: string, password: string,
        phone: string
      };
      const inputSignup = {
        name,
        email,
        password,
        phone
      }
      const { customerId, token } = await signup.execute(inputSignup);
      reply.code(201).send({
        customerId,
        token,
        message: 'Cliente cadastrado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.delete('/customer/:customer_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { service_id } = request.params as { service_id: string };
      reply.code(200).send({
        message: 'Serviço deletado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/customers', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit, offset } = request.query as {
        limit: number, offset: number
      }
      const customers = await getAllCustomers.execute(limit, offset);
      reply.code(200).send(customers);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/schedules/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const { limit, offset } = request.query as
        { limit: number, offset: number };
      const schedules = await allSchedulesByBusinessId.execute(business_id, limit, offset);
      reply.code(200).send(schedules);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });


}

export { routesCustomer }


