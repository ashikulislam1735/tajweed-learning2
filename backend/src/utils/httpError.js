// নিজের তৈরি এরর: স্ট্যাটাস কোড + বাংলা মেসেজ
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
