export class AppError {
  name: string;

  message: string;

  statusCode: number;

  constructor(name: string, message: string, statusCode = 400) {
    Object.assign(this, { name, message, statusCode });
  }
}
