const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": `"username" should be a type of 'text'`,
    "string.empty": `"username" cannot be an empty field`,
    "string.min": `"username" should have a minimum length of {#limit}`,
    "string.max": `"username" should have a maximum length of {#limit}`,
    "any.required": `"username" is a required field`,
  }),

  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be an empty field`,
    "any.required": `"email" is a required field`,
  }),

  password: Joi.string().min(8).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of {#limit}`,
    "any.required": `"password" is a required field`,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be an empty field`,
    "any.required": `"email" is a required field`,
  }),

  password: Joi.string().required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.empty": `"password" cannot be an empty field`,
    "any.required": `"password" is a required field`,
  }),
});
module.exports = { registerSchema, loginSchema };
