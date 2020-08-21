import joi from "@hapi/joi"

export const jobValidator = joi.object({
  company: joi
    .string()
    .min(0)
    .max(100)
    .messages({
      "string.min": "Tên đơn vị tuyển dụng phải có ít nhất {#limit} kí tự.",
      "string.base": "Tên đơn vị tuyển dụng không được để trống.",
      "string.max":
        "Tên đơn vị tuyển dụng không được nhiều hơn {#limit} kí tự.",
      "string.empty": "Tên đơn vị tuyển dụng không được để trống.",
    }),
  languages: joi.array().items(
    joi.object({
      languages: joi.array().items(
        joi.string().required()
      ).messages({
        'array.includesRequiredUnknowns': 'Thiếu ngôn ngữ.'
      }),
      quantity: joi.number().min(1),
      position: joi.string()
    }).messages({
      'number.base': 'Số lượng phải ở dạng số.',
      'number.min': 'Số lượng phải lớn hơn hoặc bằng {#limit}.'
    })
  ),
  posted_date: joi.optional(),
  post_link: joi.optional(),
  auto: joi.boolean(),
  content: joi.optional()
})
