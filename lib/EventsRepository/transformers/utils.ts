interface IDeprecated {
  subscriber: any;
  mod: any;
  turbo: any;
  userType: any;
}

export function removeDeprecatedData<Obj extends IDeprecated>(
  data: Obj,
): Omit<Obj, keyof IDeprecated> {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {subscriber, mod, turbo, userType, ...rest} = data;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return rest;
}