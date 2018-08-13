const path = require("path");
const fastify = require("fastify")({
  logger: {
    prettyPrint: true
  }
});
const isOriginAllowed = require("./isOriginAllowed");

const MONGO_URL =
  "mongodb://pte:PMfjGLpxaupuFY5LXrJA7yxW@23.111.156.110:27017/pt_editor_data";

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "../../public"),
  prefix: "/public/" // optional: default '/'
});

fastify.register(require("fastify-mongodb"), {
  forceClose: true,
  url: MONGO_URL,
  useNewUrlParser: true
});

const opts = {
  schema: {
    body: {
      type: "object",
      properties: {
        clientId: { type: "string" }
      }
    }
  }
};

fastify.get("/", (request, reply) => {
  reply.sendFile("index.html");
});

fastify.post("/auth", opts, async (request, reply) => {
  try {
    const clientId = request.body.clientId;
    const { db, ObjectId } = fastify.mongo;
    if (!ObjectId.isValid(clientId)) {
      reply.code(401).send("Invalid ClientId");
      return;
    }
    const integrations = await db.collection("integrations");
    const integration = await integrations.findOne({
      _id: new ObjectId(clientId)
    });
    if (!integration) {
      fastify.log.error(`ClientId ${clientId} not in db`);
      reply.code(401).send("Invalid ClientId");
      return;
    } else if (
      !isOriginAllowed(
        `http://${request.raw.connection.remoteAddress}`,
        integration.allowedDomain
      )
    ) {
      fastify.log.error(`ClientId ${clientId} origin verification failed.`);
      reply.code(401).send("Origin Invalid");
      return;
    }
    // const authToken =
    reply.code(201).send({ token: integration._id });
  } catch (err) {
    fastify.log.error(err.message);
    reply.code(500).send(err.message);
  }
});

const start = async () => {
  try {
    await fastify.listen(8081);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
