export interface RegistrationFields {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  password: string;
  confirmation: string;
  agreed: boolean;
}

export function validateRegistration(fields: RegistrationFields): Partial<Record<keyof RegistrationFields, string>> {
  const errors: Partial<Record<keyof RegistrationFields, string>> = {};
  if (!fields.lastName.trim()) errors.lastName = "Овгоо оруулна уу.";
  if (!fields.firstName.trim()) errors.firstName = "Нэрээ оруулна уу.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Зөв и-мэйл хаяг оруулна уу.";
  if (!/^(?:976)?\d{8}$/.test(fields.phone.replace(/[\s+()-]/g, ""))) errors.phone = "Утасны 8 оронтой дугаараа оруулна уу.";
  if (fields.password.length < 8 || !/\p{L}/u.test(fields.password) || !/\d/.test(fields.password)) errors.password = "Нууц үг 8-аас доошгүй тэмдэгттэй, үсэг болон тоо агуулсан байна.";
  if (!fields.confirmation || fields.password !== fields.confirmation) errors.confirmation = "Нууц үгээ ижил давтаж оруулна уу.";
  if (!fields.agreed) errors.agreed = "Үйлчилгээний нөхцөлийг зөвшөөрнө үү.";
  return errors;
}
