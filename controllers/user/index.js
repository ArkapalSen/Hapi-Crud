const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../../models").user;
const bcrypt = require("bcrypt");
const { success, error } = require("../../response/macros");
const { Op } = require('sequelize');

module.exports = {
  userCreation,
  allUserRead,
  userRead,
  userDelete,
  userUpdate,
  userLogin,
};

async function userCreation(req, res) {
  try {
    const rb = req.payload;

    const { first_name, last_name, email, password, mobile_no } = rb;

    let email_check = await User.findOne({
      where: {
        email: rb.email,
      },
      attributes: ["id", "first_name"],
    });

    if (email_check) {
      return success({ email_check }, "Email already exists")(res);
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      mobile_no,
    });

    return success({}, "User created successfully")(res);
  } catch (err) {
    console.log(err);
    return error(err.message)(res);
  }
}

async function allUserRead(req, res) {
  try {
    const rb = req.query;

    let pagination =
      rb.limit & (rb.limit !== "all") && rb.page >= 0
        ? {
            limit: parseInt(rb.limit),
            offset: parseInt(rb.limit) * (parseInt(rb.page) - 1),
          }
        : {};

    let allUser = await User.findAll({
      ...pagination,
      attributes: ["first_name", "last_name", "email", "mobile_no"],
      order: [["first_name", "ASC"]],
    });

    if (allUser.length > 0) {
      return success({ allUser }, "All Users Fetched Successfully")(res);
    } else {
      return success({ allUser }, "No User Found")(res);
    }
  } catch (err) {
    console.log(err);
    return error(err.message)(res);
  }
}

async function userRead(req, res) {
  const rb = req.params;

  let user = await User.findOne({
    where: {
      id: rb.id,
    },
    attributes: ["id", "first_name", "last_name", "email", "mobile_no"],
  });

  if (user) {
    return success({ user }, "User Fetched Successfully")(res);
  } else {
    return success({ user }, "No User Found")(res);
  }
}

async function userUpdate(req, res) {
  try {
    const { id, first_name, last_name, email, mobile_no } = req.payload;

    let user = await User.findOne({
      where: {
        id,
      },
      attributes: ["id", "email"],
    });

    // console.log(user);

    if (!user) {
      return success({}, "This user does not exist")(res);
    } else {
      let email_check = await User.findOne({
        where: {
          email: email,
          id: {
            [Op.ne]: id,
          },
        },
        attributes: ["id"],
      });

      if (email_check) {
        return success({}, "This email already exists")(res);
      }
      await User.update(
        {
          first_name,
          last_name,
          email,
          mobile_no,
        },
        {
          where: {
            id,
          },
        }
      );

      return success({}, "User updated successfully")(res);
    }
  } catch (e) {
    console.log(e);
  }
}

async function userDelete(req, res) {
  try {
    const rb = req.payload;

    let user = await User.findOne({
      where: {
        id: rb.id,
      },
    });

    if (!user) {
      return success({}, "This user does not exist")(res);
    }

    await User.destroy({
      where: {
        id: rb.id,
      },
    });

    return success({}, "This user deleted successfully")(res);
  } catch (e) {
    console.log(e);
  }
}

async function userLogin(req, res) {
  try {
    const rb = req.payload;

    const user = await User.findOne({
      where: { email: rb.email },
      attributes: { exclude: ["createdAt", "updatedAt", "tokens"] },
    });

    if (!user) {
      return success({}, "Wrong Email")(res);
    }

    // console.log(user)

    let password = user.dataValues.password;

    let checkPassword = await bcrypt.compare(rb.password, password);

    if (checkPassword) {
      delete user.dataValues.password;

      //jwt token
      token = jwt.sign({ id: rb.id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
    

      // //updating token
      // await User.update(
      //   {
      //     tokens: token,
      //   },
      //   {
      //     where: {
      //       email: rb.email,
      //     },
      //   }
      // );

      // //cookie
      // res.state("ApiCookie", token, {
      //   ttl: new Date(Date.now() + 60000),
      //   isSecure: true,
      //   isHttpOnly: true,
      //   encoding: "base64json",
      //   clearInvalid: true,
      //   strictHeader: true,
      // });

      return success({token ,  user }, "User Logged In successfully")(res);
    } else {
      return success({}, "Wrong Password")(res);
    }
  } catch (e) {
    console.log(e);
  }
}
