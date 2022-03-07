const Joi = require("joi");
const Header = require("../../controllers/header");

const router = [
  //create
  {
    path: "/header-create",
    method: "post",
    options: {
      handler: Header.headerCreation,
      description: "Header creation",
      notes: "Header creation",
      tags: ["api", "Header"],
      auth: false,
      validate: {
        payload: Joi.object({
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
  {
    path: "/header-login",
    method: "post",
    options: {
      handler: Header.headerLogin,
      description: "Header Login",
      notes: "Header Login",
      tags: ["api", "Header"],
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
];

module.exports = router;
