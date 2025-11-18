import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

async function dashboardMiddleware(request: FastifyRequest, reply: FastifyReply, next: any) {
  const bearerToken = request.headers.authorization;
  const token = bearerToken?.split(' ')[1];

  try {
    if (token) {
      jwt.verify(token, 'webdesign', (error, decoded) => {
        if (error) {
          console.log('nao conseguiu decodificar');
          reply.code(401).send({
            message: 'Token inválido, faça login novamente'
          });
        }

        if (!token) {
          reply.code(401).send({
            message: 'Sem credenciais, faça login novamente'
          });
        }
        next();
      });

    }

  } catch (error) {
    console.error('token invalido');
    reply.code(401).send(error);
  }



}

export { dashboardMiddleware }

