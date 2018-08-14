const path = require("path");
const jwt = require("jsonwebtoken");
const fastify = require("fastify")({
  logger: {
    prettyPrint: true
  }
});
const isOriginAllowed = require("./isOriginAllowed");

const https = false;
const AUTHKEY = "some very long obscure secret server auth key";

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

fastify.decorateRequest("authToken", null);

fastify.addHook("preHandler", async (request, reply, next) => {
  const remoteAddress = request.raw.connection.remoteAddress;
  try {
    const { db, ObjectId } = fastify.mongo;
    const { clientId } = request.body || {};
    if (!ObjectId.isValid(clientId)) {
      fastify.log.warn("401 Invalid ClientId.");
      return next();
    }
    const integrations = await db.collection("integrations");
    const integration = await integrations.findOne({
      _id: new ObjectId(clientId)
    });
    if (!integration) {
      fastify.log.warn("401 ClientId Not Found");
      return next();
    }
    const protocol = https ? "https://" : "http://";
    const validOrigin = isOriginAllowed(
      `${protocol}${remoteAddress}`,
      integration.allowedDomain
    );
    if (!validOrigin) {
      fastify.log.warn("401 Origin Not Verified");
      return next();
    }
    const payload = {
      _id: integration._id,
      scope: integration.scope,
      charLimit: integration.charLimit
    };
    request.authToken = jwt.sign(payload, AUTHKEY, {
      audience: request.raw.connection.remoteAddress,
      expiresIn: "20s",
      subject: "kashyap-develop-1",
      issuer: "some unique server identifier to be cloud-ready",
      jwtid: "generate new and save with editor/textarea entity"
    });
  } catch (error) {
    fastify.log.error(error.message);
    throw new Error(`Some unexpected error: ${error.message}`);
  }
});

fastify.get("/", (request, reply) => {
  reply.sendFile("index.html");
});

fastify.post("/auth", (request, reply) => {
  const { authToken } = request;
  if (authToken === null) {
    reply.code(401).send("Auth Error");
    return;
  }
  reply.code(201).send({ authToken });
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
