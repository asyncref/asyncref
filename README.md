# AsyncRef for Vue

Express your async state with ease and in **one variable**.

## Features

- Simple and easy to use
- Comes with a set of utilities for mapping and composition
- Typesafe with the magic of TypeScript

## Usage
An asyncRef can be in state of `loading`, `resolved` or `rejected`.
```ts
type LoadingState = { isLoading: true }
type ResolvedState<TData> = { isLoading: false, data: TData }
type RejectedState<TError> = { isLoading: false, error: TError }

type AsyncState<TData, TError> =
  | LoadingState
  | ResolvedState<TData>
  | RejectedState<TError>

type AsyncRef<TData, TError = Error> = Ref<AsyncState<TData, TError>>
```

The underlying value of an asyncRef can only be accessed with proper inspection of `isLoading` flag 
that helps the type safety. The library provides a set of utilities that helps with creation, 
mapping and composition of `asyncRef` variables.

### asyncRef

Allows the creation of asyncRef with optional initial value. The result will allow you to resolve, reject or reset the state of the variable.

```ts
const willBeInLoadingState = asyncRef()
const willBeInResolvedState = asyncRef('some data')

willBeInLoadingState.resolve('now it will be resolved')
willBeInLoadingState.reject('now it will be rejected')
willBeInLoadingState.reset() // and now is again in loading state
```

### fromPromise
Allows you to convert a promise into an asyncRef. The result will be in resolved state if the promise resolves, or in rejected state if the promise rejects.
You need to pass a function that returns a promise - this function will also receive an abort signal that you can use to abort the promise.

```ts
const asyncRef = fromPromise(() => fetch('https://example.com'))
```

### fromRefs
Allows you to convert a set of refs into an asyncRef. The result will be
- in loading state when `isLoading` ref is true
- in rejected state when `isLoading` ref is false and `isError` is true with an error from `error` ref
- in resolved state when `isLoading` ref is false and `isError` is false with a value from `data` ref

### useCompose
Allows you to compose multiple asyncRefs into a single one. The result will be in resolved state when all of the asyncRefs are in resolved state, or in rejected state when at least one of the asyncRefs is in rejected state.

```ts
const a = asyncRef('Hello')
const b = asyncRef('World')

const composed = useCompose([a, b], ([aValue, bValue]) => {
  // types of aValue and bValue are inferred from the asyncRefs
  return `${aValue} ${bValue}`
})
```
### useMap
Allows you to map an asyncRef into another one. The result will be in resolved state when the source asyncRef is in resolved state, or in rejected state when the source asyncRef is in rejected state.

```ts
const a = asyncRef('Hello')
const b = useMap(a, (aValue) => {
  // type of aValue is inferred from the asyncRef
  return `${aValue} World`
})
```

### useMapError
Allows you to map an error of an asyncRef into another one. The result will be in resolved state when the source asyncRef is in resolved state, or in rejected state when the source asyncRef is in rejected state.

```ts
const a = asyncRef('Hello')
  
const b = useMapError(a, (aError) => {
  // type of aError is inferred from the asyncRef
  return new Error(`Error: ${aError.message}`)
})
```

### useMatch
The asyncRef finalizer that allows you to return a value based on matched state.

```ts
const a = asyncRef('Hello')
const b = useMatch(a, {
  loading: () => 'Loading...',
  data: (aValue) => {
    // type of aValue is inferred from the asyncRef
    return `${aValue} World`
  },
  error: (aError) => {
    // type of aError is inferred from the asyncRef
    return new Error(`Error: ${aError.message}`)
  }
})
```

### UseMatch
The Vue component that reduces the boilerplate of using useMatch with components

```vue
<template>
  <UseMatch :asyncRef="asyncRef">
    <template #loading>
      Loading...
    </template>
    <template #default="{ data }">
      {{ data }}
    </template>
    <template #error="{ error }">
      {{ error.message }}
    </template>
  </UseMatch>
</template>
```

### useValue
The asyncRef finalizer that returns either a value or undefined based on the state of the asyncRef.

```ts
const a = asyncRef('Hello')
const aValue = useValue(a) // 'Hello'

const b = asyncRef()
const bValue = useValue(b) // undefined
```

## Installation

```sh
npm install @asyncref/vue
```
