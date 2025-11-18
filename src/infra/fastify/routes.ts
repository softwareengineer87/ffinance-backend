import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BusinessRepositoryDatabase } from "../repository/BusinessRepository";
import { DatabaseConnection, PgPromiseAdapter } from "../database/PgPromiseAdapter";
import { CreateBusiness } from "../../domain/application/usecases/dashboard/CreateBusiness";
import { Login } from "../../domain/application/usecases/dashboard/Login";
import { GetBusiness } from "../../domain/application/usecases/dashboard/GetBusiness";
import { BusinessDetail } from "../../domain/application/usecases/dashboard/BusinessDetail";
import { UpdateBusiness } from "../../domain/application/usecases/dashboard/UpdateBusiness";
import { CustomerRepositoryDatabase } from "../repository/CustomerRepository";
import { Getlogo } from "../../domain/application/usecases/dashboard/GetLogo";
import { dashboardMiddleware } from "../../middlewares/dashboardMiddleware";
import { MakeTransaction } from "../../domain/application/usecases/dashboard/MakeTransaction";
import { DashboardRepositoryDatabase } from "../repository/DashboardRepository";
import { CreateCategory } from "../../domain/application/usecases/dashboard/CreateCategory";
import { MakePayment } from "../../domain/application/usecases/dashboard/MakePayment";
import { GetTransactions } from "../../domain/application/usecases/dashboard/GetTransactions";
import { GetPayments } from "../../domain/application/usecases/dashboard/GetPayments";
import { DeleteTransaction } from "../../domain/application/usecases/dashboard/DeleteTransaction";
import { DeletePayment } from "../../domain/application/usecases/dashboard/DeletePayment";
import { ChangeStatus } from "../../domain/application/usecases/dashboard/ChangeStatus";

function routes(fastify: FastifyInstance, connection: DatabaseConnection) {

  const businessRepository = new BusinessRepositoryDatabase(connection);
  const customerRepository = new CustomerRepositoryDatabase(connection);
  const dashoardRepository = new DashboardRepositoryDatabase(connection);
  const createBusiness = new CreateBusiness(businessRepository);
  const businessLogin = new Login(businessRepository);
  const getBusiness = new GetBusiness(connection);
  const businessDetail = new BusinessDetail(businessRepository);
  const updateBusiness = new UpdateBusiness(connection);
  const getPhotos = new Getlogo(connection);
  const makeTransaction = new MakeTransaction(dashoardRepository);
  const createCategory = new CreateCategory(dashoardRepository);
  const makePayment = new MakePayment(dashoardRepository);
  const getTransactions = new GetTransactions(dashoardRepository);
  const getPayments = new GetPayments(dashoardRepository);
  const deleteTransaction = new DeleteTransaction(connection);
  const deletePayment = new DeletePayment(connection);
  const changeStatus = new ChangeStatus(dashoardRepository);

  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    try {
      reply.code(200).send({ ok: true, test: 'ok' });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/business', async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const { name, email, password, cnpj
      } = request.body as {
        name: string,
        email: string,
        password: string,
        cnpj: string,
      };
      const inputBusiness = {
        name,
        email,
        password,
        cnpj
      }
      const { businessId, token } = await createBusiness.execute(inputBusiness);

      reply.code(201).send({
        businessId,
        token,
        message: 'Empresa cadastrada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const business = await getBusiness.execute();
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business/:business_id', { preHandler: dashboardMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const business = await businessDetail.execute(business_id);
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.put('/business/:business_id', { preHandler: dashboardMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        name,
        email,
        cpf,
        password,
        city,
        district,
        address_number,
        description,
      } = request.body as {
        name: string,
        email: string,
        cpf: string,
        password: string,
        city: string,
        district: string,
        address_number: number,
        description: string,
      }

      const addressNumber = address_number;
      const { business_id } = request.params as { business_id: string };
      const { businessId } = await updateBusiness.execute(
        business_id,
        name,
        email,
        cpf,
        password,
        city,
        district,
        addressNumber,
        description,
      );

      reply.code(201).send({
        businessId,
        message: 'Empresa atualizada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/business/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as { email: string, password: string };
      const { token, payload } = await businessLogin.execute(email, password);
      reply.code(201).send({
        token,
        payload,
        message: 'Login efetuado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business/photos/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const photo = await getPhotos.execute(business_id);
      reply.code(200).send(photo);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/make-transaction/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      console.log('make transaction');
      const {
        value,
        description,
        type,
        category,
        date
      } = request.body as {
        value: number,
        description: string,
        type: string,
        category: string
        date: Date,
      }
      const { business_id } = request.params as { business_id: string };
      const inputTransaction = {
        value,
        description,
        type,
        category,
        date,
        businessId: business_id
      }
      const { transactionId } = await makeTransaction.execute(inputTransaction);
      reply.code(201).send({
        transactionId,
        message: 'Transação criada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/create-category', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { title } = request.body as { title: string }
      const { categoryId } = await createCategory.execute(title);
      reply.code(201).send({
        categoryId,
        message: 'Categoria criada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/make-payment/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        value,
        payment_mode,
        start_date,
        end_date
      } = request.body as {
        value: number,
        payment_mode: string,
        start_date: Date,
        end_date: Date
      }
      const { business_id } = request.params as { business_id: string };
      const inputPayment = {
        value,
        paymentMode: payment_mode,
        startDate: start_date,
        endDate: end_date,
        businessId: business_id
      }
      const { paymentId } = await makePayment.execute(inputPayment);

      reply.code(201).send({
        paymentId,
        message: 'Pagamento criado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/transactions/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const { limit, offset } = request.query as { limit: number, offset: number };
      const transactions = await getTransactions.execute(business_id, limit, offset);
      reply.code(200).send(transactions);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/payments/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const { limit, offset } = request.query as { limit: number, offset: number };
      const payments = await getPayments.execute(business_id, limit, offset);
      reply.code(200).send(payments);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.delete('/transaction/:transaction_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { transaction_id } = request.params as { transaction_id: string };
      const { transactionId } = await deleteTransaction.execute(transaction_id);
      reply.code(200).send({
        transactionId,
        message: 'Transação deletada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.delete('/payment/:payment_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { payment_id } = request.params as { payment_id: string };
      const { paymentId } = await deletePayment.execute(payment_id);
      reply.code(200).send({
        paymentId,
        message: 'Pagamento deletado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.put('/change-payment-status/:payment_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { payment_id } = request.params as { payment_id: string };
      const { paymentId } = await changeStatus.execute(payment_id);
      reply.code(200).send({
        paymentId,
        message: 'Status alterado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });



}

export { routes }


