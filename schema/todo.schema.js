const Joi = require("joi");

const todoSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `"title" should be a type of 'text'`,
    "string.empty": `"title" cannot be an empty field`,
    "any.required": `"title" is a required field`,
  }),
  description: Joi.string().required().min(10).messages({
    "string.base": `"description" should be a type of 'text'`,
    "string.empty": `"description" cannot be an empty field`,
    "string.min": `"description" should have a minimum length of {#limit}`,
    "any.required": `"description" is a required field`,
  }),
  expiryDate: Joi.date().required().greater("now").optional().messages({
    "date.base": `"expiryDate" should be a type of 'date'`,
    "date.greater": `"expiryDate" must be greater than now`,
    "any.required": `"description" is a required field`,
  }),
  status: Joi.string()
    .valid("pending", "expired", "completed")
    .optional()
    .messages({
      "string.base": `"status" should be a type of 'text'`,
      "any.only": `"status" must be one of the following: pending, expired, completed`,
    }),
});

module.exports = todoSchema;
