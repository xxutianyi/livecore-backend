import { LiveRoom, User, UserGroup } from '@/services/model';

export type SharedProps = {
  auth: {
    user?: User;
  };
  options: {
    rooms: Pick<LiveRoom, 'id' | 'name'>[];
    groups: Pick<UserGroup, 'id' | 'name'>[];
  };
};
