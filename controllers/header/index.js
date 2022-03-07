const jwt = require("jsonwebtoken");
const hapiJwt = require('@hapi/jwt');
require("dotenv").config();
const Header = require("../../models").header;
const bcrypt = require("bcrypt");
const { success, error } = require("../../response/macros");
const { Op } = require("sequelize");

module.exports = {
  headerCreation,
  headerLogin,
};

async function headerCreation(req, res) {
  try {
    const rb = req.payload;

    const { first_name, last_name, email, password } = rb;

    let email_check = await Header.findOne({
      where: {
        email: rb.email,
      },
      attributes: ["id", "first_name"],
    });

    if (email_check) {
      return success({ email_check }, "Email already exists")(res);
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    await Header.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    return success({}, "Header created successfully")(res);
  } catch (err) {
    console.log(err);
    return error(err.message)(res);
  }
}

async function headerLogin(req, res) {
  try {
    const rb = req.payload;

    const head = await Header.findOne({
      where: { email: rb.email },
      attributes: { exclude: ["createdAt", "updatedAt", "tokens"] },
    });

    if (!head) {
      return success({}, "Wrong Email")(res);
    }

    let password = head.dataValues.password;

    let checkPassword = await bcrypt.compare(rb.password, password);

    if (checkPassword) {
      delete head.dataValues.password;

      token = hapiJwt.token.generate(
        {
          expiresIn: 36000,
          aud: "urn:audience:test",
          iss: "urn:issuer:test",
          sub: false,
          maxAgeSec: 14400,
          timeSkewSec: 15,
          user: head,
        },
        process.env.SECRET_KEY
      );

      return success({token})(res);
    }
    else{
      return success({},'Wrong password')(res);
    }
  } catch (err) {
    console.log(err);
    return error(err.message)(res);
  }
}
