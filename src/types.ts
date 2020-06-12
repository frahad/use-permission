import { ReactElement } from 'react';

export interface Policy {
  [name: string]: (...resources: any[]) => boolean;
}

export interface PolicyInit {
  forUser: object;
}

export type Actions = string | string[];

export interface PermissionProps {
  denies?: Actions;
  allows?: Actions;
  on: object;
  children: ReactElement;
}
