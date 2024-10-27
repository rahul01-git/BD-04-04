const Joi = require("joi");

const todoSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `"title" should be a type of 'text'`,
    "string.empty": `"title" cannot be an empty field`,
    "any.required": `"title" is a required field`,
  }),
  expiryDate: Joi.date().greater("now").optional().messages({
    "date.base": `"expiryDate" should be a type of 'date'`,
    "date.greater": `"expiryDate" must be greater than now`,
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
