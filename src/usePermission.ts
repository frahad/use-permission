import { Policy, PolicyInit, Actions, PermissionProps } from './types';

function usePermission(policy: Policy, init?: PolicyInit) {
  const check = (actions: Actions, resource: object) => {
    const isAllowed = (action: string) => {
      const policyAction = policy[action];

      if (!policyAction) {
        throw new Error(`The [${action}] action could not be found.`);
      }

      if (init?.forUser) {
        return policyAction(init.forUser, resource);
      }

      return policyAction(resource);
    };

    if (Array.isArray(actions)) {
      return actions.every(isAllowed);
    }

    return isAllowed(actions);
  };

  const allows = (actions: Actions, resource: object) => {
    return check(actions, resource);
  };

  const denies = (actions: Actions, resource: object) => {
    return !allows(actions, resource);
  };

  const Permission = (props: PermissionProps) => {
    if (!props.allows && !props.denies) {
      throw new Error('Missing actions for Permission component.');
    }

    const shouldRender = props.allows
      ? allows(props.allows, props.on)
      : denies(props.denies, props.on);

    return shouldRender ? props.children : null;
  };

  return { allows, denies, Permission };
}

export default usePermission;
