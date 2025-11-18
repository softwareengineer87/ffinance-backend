import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';
import { PgPromiseAdapter } from '../database/PgPromiseAdapter';
import { routesCustomer } from './routesCustomer';
import createSql from '../database/create.sql';
import { BusinessRepositoryDatabase } from '../repository/BusinessRepository';
import { SavePhoto } from '../../domain/application/usecases/dashboard/SavePhoto';
import { File } from '../../types/File';
import { multerConfig } from './multerConfig';
import fastifyMultipart from '@fastify/multipart';
import { cloudinary } from './cloudinaryConfig';

const app = Fastify();

app.register(cors, {
  origin: [
    'http://localhost:3000'
  ],
  methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS']
});

const connection = new PgPromiseAdapter();
app.register(routes, connection);
app.register(routesCustomer, connection);
app.register(fastifyMultipart);
connection.executeScript('../database/create.sql');
//connection.query(createSql, []).catch(console.error);

const businessRepository = new BusinessRepositoryDatabase(connection);
const savePhoto = new SavePhoto(businessRepository);

app.post('/photo/:business_id', { preHandler: multerConfig.single('file') },

  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const photo = request.file as File;
      const { business_id } = request.params as { business_id: string };
      const result = await cloudinary.uploader.upload(photo.path, { folder: 'simplehour' }, async (err, result) => {
        if (err) {
          console.log('error cloud', err);
        }
      });
      const { photoId } = await savePhoto.execute(business_id, result.url);
      reply.code(201).send({
        result,
        photoId,
        message: 'Imagem salva com sucesso!'
      });
    } catch (error) {
      reply.code(500).send(error);
    }
  });

app.listen({
  port: Number(process.env.PORT) || 3333,
  //host: '0.0.0.0'
},
  (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`server running on http://localhost/3333`);
  });

