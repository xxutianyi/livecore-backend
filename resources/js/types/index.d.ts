import { LiveRoom, User, UserGroup } from '@/services/model';

export type SharedProps = {
  auth: {
    user?: User;
  };
  options: {
    rooms: Pick<LiveRoom, 'id' | 'name'>[];
    groups: Pick<UserGroup, 'id' | 'name'>[];
  };
  app: {
    APP_NAME: string;
    APP_LOGO: string;
    APP_IMAGE: string;
  };
  broadcast: {
    REVERB_APP_KEY: string;
    REVERB_HOST: string;
    REVERB_PORT: string;
    REVERB_SCHEME: string;
  };
};
