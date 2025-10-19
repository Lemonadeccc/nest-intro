import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersoin: process.env.API_VERSION,
}));
