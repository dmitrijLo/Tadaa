import { SetMetadata } from '@nestjs/common';

export const DEV_BYPASS_KEY = 'devBypass';
export const DevBypass = () => SetMetadata(DEV_BYPASS_KEY, true);
