import { ReactElement } from 'react';

export type Resource = Record<string, any>;

export interface Policy {
  [name: string]: (...resources: Resource[]) => boolean;
}

export interface PolicyInit {
  forUser: Record<string, any>;
}

export type Actions = string | string[];

export interface PermissionProps {
  allows?: Actions;
  denies?: Actions;
  on: Resource;
  children: ReactElement;
}
