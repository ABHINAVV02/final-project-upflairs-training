const path = require("path");
const users = require(path.join(__dirname, "..", "data", "users.json"));

module.exports = function basicAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).send("Auth required");
  }

  const credentials = Buffer
    .from(authHeader.split(" ")[1], "base64")
    .toString("ascii");
  const [username, password] = credentials.split(":");

  // Env-admin option
  if (username === process.env.BASIC_USER && password === process.env.BASIC_PASS) {
    req.user = { id: "env-admin", username };
    return next();
  }

  // Match a real user from users.json
  const foundUser = users.find(
    u => u.email === username && u.password === password
  );

  if (foundUser) {
    req.user = { id: foundUser.id, username: foundUser.email, name: foundUser.name };
    return next();
  }

  return res.status(401).send("Invalid credentials");
};
