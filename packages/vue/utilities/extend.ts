type ExtendFn = <TTarget, TFunctions extends Record<string, unknown>>(
  target: TTarget,
  functions: TFunctions
) => asserts target is TTarget & TFunctions

export const extend: ExtendFn = (target, properties) => {
  const propertyEntries = Object
    .entries(properties)
    .map(([name, fn]) => [name, { value: fn }])

  Object.defineProperties(target, Object.fromEntries(propertyEntries))
}
