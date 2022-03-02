const Joi = require('joi');
const User = require("../../controllers/user")

const router = [ 
  //create
  {
    path: '/user-create',
    method : 'post',
    options:{
      handler : User.userCreation,
      description : 'User creation',
      notes : 'User creation',
      tags : ['api','user'],
      validate:{
        payload : Joi.object({
          first_name: Joi.string().required(),
          last_name : Joi.string().required(),
          email : Joi.string().required(),
          password : Joi.string().required(),
          mobile_no: Joi.string().required()
        })
      }
    }
  },
  //read
  {
    path: '/all-user-read',
    method : 'get',
    options:{
      handler : User.allUserRead,
      description : 'All User Read',
      notes : 'All User Read',
      tags : ['api','user'],
      validate:{
        query : Joi.object({
          limit : Joi.string(),
          page : Joi.number().integer()
        })
      }
    }
  },
  {
    path: '/user-read',
    method : 'get',
    options:{
      handler : User.userRead,
      description : 'User Read',
      notes : 'User Read',
      tags : ['api','user'],
      validate:{
        query : Joi.object({
          email : Joi.string().required(),
        })
      }
    }
  },
  //update
  {
    path: "/user-update",
    method : "post",
    options:{
      handler : User.userUpdate,
      description : 'User Update',
      notes : 'User Update',
      tags : ['api','user'],
      validate:{
        payload : Joi.object({
          id : Joi.number().integer().required(),
          first_name : Joi.string().required(),
          last_name : Joi.string().required(),
          email : Joi.string().required(),
          mobile_no : Joi.string().required()
        })
      }
    }
  },
  //delete
  {
    path: '/user-delete',
    method : 'post',
    options:{
      handler : User.userDelete,
      description : 'User Delete',
      notes : 'User Delete',
      tags : ['api','user'],
      validate:{
        payload : Joi.object({
          email : Joi.string().required(),
        })
      }
    }
  },

  //login
  {
    path: '/user-login',
    method : 'post',
    options:{
      handler : User.userLogin,
      description : 'User Login',
      notes : 'User Login',
      tags : ['api','user'],
      validate:{
        payload : Joi.object({
          email : Joi.string().required(),
          password : Joi.string().required(),
        })
      },
      
    }
  }
]

module.exports = router;