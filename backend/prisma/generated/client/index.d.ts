
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ClothingItem
 * 
 */
export type ClothingItem = $Result.DefaultSelection<Prisma.$ClothingItemPayload>
/**
 * Model WashEvent
 * 
 */
export type WashEvent = $Result.DefaultSelection<Prisma.$WashEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ItemStatus: {
  CLEAN: 'CLEAN',
  READY_FOR_WASH: 'READY_FOR_WASH',
  WASHING: 'WASHING',
  DAMAGED: 'DAMAGED',
  OVERDUE: 'OVERDUE'
};

export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus]

}

export type ItemStatus = $Enums.ItemStatus

export const ItemStatus: typeof $Enums.ItemStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ClothingItems
 * const clothingItems = await prisma.clothingItem.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ClothingItems
   * const clothingItems = await prisma.clothingItem.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.clothingItem`: Exposes CRUD operations for the **ClothingItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClothingItems
    * const clothingItems = await prisma.clothingItem.findMany()
    * ```
    */
  get clothingItem(): Prisma.ClothingItemDelegate<ExtArgs>;

  /**
   * `prisma.washEvent`: Exposes CRUD operations for the **WashEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WashEvents
    * const washEvents = await prisma.washEvent.findMany()
    * ```
    */
  get washEvent(): Prisma.WashEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ClothingItem: 'ClothingItem',
    WashEvent: 'WashEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "clothingItem" | "washEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ClothingItem: {
        payload: Prisma.$ClothingItemPayload<ExtArgs>
        fields: Prisma.ClothingItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClothingItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClothingItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>
          }
          findFirst: {
            args: Prisma.ClothingItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClothingItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>
          }
          findMany: {
            args: Prisma.ClothingItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>[]
          }
          create: {
            args: Prisma.ClothingItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>
          }
          createMany: {
            args: Prisma.ClothingItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClothingItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>[]
          }
          delete: {
            args: Prisma.ClothingItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>
          }
          update: {
            args: Prisma.ClothingItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>
          }
          deleteMany: {
            args: Prisma.ClothingItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClothingItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClothingItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothingItemPayload>
          }
          aggregate: {
            args: Prisma.ClothingItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClothingItem>
          }
          groupBy: {
            args: Prisma.ClothingItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClothingItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClothingItemCountArgs<ExtArgs>
            result: $Utils.Optional<ClothingItemCountAggregateOutputType> | number
          }
        }
      }
      WashEvent: {
        payload: Prisma.$WashEventPayload<ExtArgs>
        fields: Prisma.WashEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WashEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WashEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>
          }
          findFirst: {
            args: Prisma.WashEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WashEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>
          }
          findMany: {
            args: Prisma.WashEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>[]
          }
          create: {
            args: Prisma.WashEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>
          }
          createMany: {
            args: Prisma.WashEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WashEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>[]
          }
          delete: {
            args: Prisma.WashEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>
          }
          update: {
            args: Prisma.WashEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>
          }
          deleteMany: {
            args: Prisma.WashEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WashEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WashEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WashEventPayload>
          }
          aggregate: {
            args: Prisma.WashEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWashEvent>
          }
          groupBy: {
            args: Prisma.WashEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<WashEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.WashEventCountArgs<ExtArgs>
            result: $Utils.Optional<WashEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClothingItemCountOutputType
   */

  export type ClothingItemCountOutputType = {
    washEvents: number
  }

  export type ClothingItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    washEvents?: boolean | ClothingItemCountOutputTypeCountWashEventsArgs
  }

  // Custom InputTypes
  /**
   * ClothingItemCountOutputType without action
   */
  export type ClothingItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItemCountOutputType
     */
    select?: ClothingItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClothingItemCountOutputType without action
   */
  export type ClothingItemCountOutputTypeCountWashEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WashEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ClothingItem
   */

  export type AggregateClothingItem = {
    _count: ClothingItemCountAggregateOutputType | null
    _min: ClothingItemMinAggregateOutputType | null
    _max: ClothingItemMaxAggregateOutputType | null
  }

  export type ClothingItemMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    itemType: string | null
    imageUrl: string | null
    currentStatus: $Enums.ItemStatus | null
    damageLog: string | null
    lastWashed: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClothingItemMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    itemType: string | null
    imageUrl: string | null
    currentStatus: $Enums.ItemStatus | null
    damageLog: string | null
    lastWashed: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClothingItemCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    itemType: number
    imageUrl: number
    currentStatus: number
    damageLog: number
    lastWashed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClothingItemMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    itemType?: true
    imageUrl?: true
    currentStatus?: true
    damageLog?: true
    lastWashed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClothingItemMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    itemType?: true
    imageUrl?: true
    currentStatus?: true
    damageLog?: true
    lastWashed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClothingItemCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    itemType?: true
    imageUrl?: true
    currentStatus?: true
    damageLog?: true
    lastWashed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClothingItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClothingItem to aggregate.
     */
    where?: ClothingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClothingItems to fetch.
     */
    orderBy?: ClothingItemOrderByWithRelationInput | ClothingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClothingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClothingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClothingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClothingItems
    **/
    _count?: true | ClothingItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClothingItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClothingItemMaxAggregateInputType
  }

  export type GetClothingItemAggregateType<T extends ClothingItemAggregateArgs> = {
        [P in keyof T & keyof AggregateClothingItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClothingItem[P]>
      : GetScalarType<T[P], AggregateClothingItem[P]>
  }




  export type ClothingItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClothingItemWhereInput
    orderBy?: ClothingItemOrderByWithAggregationInput | ClothingItemOrderByWithAggregationInput[]
    by: ClothingItemScalarFieldEnum[] | ClothingItemScalarFieldEnum
    having?: ClothingItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClothingItemCountAggregateInputType | true
    _min?: ClothingItemMinAggregateInputType
    _max?: ClothingItemMaxAggregateInputType
  }

  export type ClothingItemGroupByOutputType = {
    id: string
    userId: string
    name: string
    itemType: string
    imageUrl: string
    currentStatus: $Enums.ItemStatus
    damageLog: string | null
    lastWashed: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ClothingItemCountAggregateOutputType | null
    _min: ClothingItemMinAggregateOutputType | null
    _max: ClothingItemMaxAggregateOutputType | null
  }

  type GetClothingItemGroupByPayload<T extends ClothingItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClothingItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClothingItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClothingItemGroupByOutputType[P]>
            : GetScalarType<T[P], ClothingItemGroupByOutputType[P]>
        }
      >
    >


  export type ClothingItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    itemType?: boolean
    imageUrl?: boolean
    currentStatus?: boolean
    damageLog?: boolean
    lastWashed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    washEvents?: boolean | ClothingItem$washEventsArgs<ExtArgs>
    _count?: boolean | ClothingItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clothingItem"]>

  export type ClothingItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    itemType?: boolean
    imageUrl?: boolean
    currentStatus?: boolean
    damageLog?: boolean
    lastWashed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["clothingItem"]>

  export type ClothingItemSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    itemType?: boolean
    imageUrl?: boolean
    currentStatus?: boolean
    damageLog?: boolean
    lastWashed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClothingItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    washEvents?: boolean | ClothingItem$washEventsArgs<ExtArgs>
    _count?: boolean | ClothingItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClothingItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClothingItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClothingItem"
    objects: {
      washEvents: Prisma.$WashEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      itemType: string
      imageUrl: string
      currentStatus: $Enums.ItemStatus
      damageLog: string | null
      lastWashed: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clothingItem"]>
    composites: {}
  }

  type ClothingItemGetPayload<S extends boolean | null | undefined | ClothingItemDefaultArgs> = $Result.GetResult<Prisma.$ClothingItemPayload, S>

  type ClothingItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClothingItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClothingItemCountAggregateInputType | true
    }

  export interface ClothingItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClothingItem'], meta: { name: 'ClothingItem' } }
    /**
     * Find zero or one ClothingItem that matches the filter.
     * @param {ClothingItemFindUniqueArgs} args - Arguments to find a ClothingItem
     * @example
     * // Get one ClothingItem
     * const clothingItem = await prisma.clothingItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClothingItemFindUniqueArgs>(args: SelectSubset<T, ClothingItemFindUniqueArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClothingItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClothingItemFindUniqueOrThrowArgs} args - Arguments to find a ClothingItem
     * @example
     * // Get one ClothingItem
     * const clothingItem = await prisma.clothingItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClothingItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ClothingItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClothingItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemFindFirstArgs} args - Arguments to find a ClothingItem
     * @example
     * // Get one ClothingItem
     * const clothingItem = await prisma.clothingItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClothingItemFindFirstArgs>(args?: SelectSubset<T, ClothingItemFindFirstArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClothingItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemFindFirstOrThrowArgs} args - Arguments to find a ClothingItem
     * @example
     * // Get one ClothingItem
     * const clothingItem = await prisma.clothingItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClothingItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ClothingItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClothingItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClothingItems
     * const clothingItems = await prisma.clothingItem.findMany()
     * 
     * // Get first 10 ClothingItems
     * const clothingItems = await prisma.clothingItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clothingItemWithIdOnly = await prisma.clothingItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClothingItemFindManyArgs>(args?: SelectSubset<T, ClothingItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClothingItem.
     * @param {ClothingItemCreateArgs} args - Arguments to create a ClothingItem.
     * @example
     * // Create one ClothingItem
     * const ClothingItem = await prisma.clothingItem.create({
     *   data: {
     *     // ... data to create a ClothingItem
     *   }
     * })
     * 
     */
    create<T extends ClothingItemCreateArgs>(args: SelectSubset<T, ClothingItemCreateArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClothingItems.
     * @param {ClothingItemCreateManyArgs} args - Arguments to create many ClothingItems.
     * @example
     * // Create many ClothingItems
     * const clothingItem = await prisma.clothingItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClothingItemCreateManyArgs>(args?: SelectSubset<T, ClothingItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClothingItems and returns the data saved in the database.
     * @param {ClothingItemCreateManyAndReturnArgs} args - Arguments to create many ClothingItems.
     * @example
     * // Create many ClothingItems
     * const clothingItem = await prisma.clothingItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClothingItems and only return the `id`
     * const clothingItemWithIdOnly = await prisma.clothingItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClothingItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ClothingItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClothingItem.
     * @param {ClothingItemDeleteArgs} args - Arguments to delete one ClothingItem.
     * @example
     * // Delete one ClothingItem
     * const ClothingItem = await prisma.clothingItem.delete({
     *   where: {
     *     // ... filter to delete one ClothingItem
     *   }
     * })
     * 
     */
    delete<T extends ClothingItemDeleteArgs>(args: SelectSubset<T, ClothingItemDeleteArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClothingItem.
     * @param {ClothingItemUpdateArgs} args - Arguments to update one ClothingItem.
     * @example
     * // Update one ClothingItem
     * const clothingItem = await prisma.clothingItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClothingItemUpdateArgs>(args: SelectSubset<T, ClothingItemUpdateArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClothingItems.
     * @param {ClothingItemDeleteManyArgs} args - Arguments to filter ClothingItems to delete.
     * @example
     * // Delete a few ClothingItems
     * const { count } = await prisma.clothingItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClothingItemDeleteManyArgs>(args?: SelectSubset<T, ClothingItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClothingItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClothingItems
     * const clothingItem = await prisma.clothingItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClothingItemUpdateManyArgs>(args: SelectSubset<T, ClothingItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClothingItem.
     * @param {ClothingItemUpsertArgs} args - Arguments to update or create a ClothingItem.
     * @example
     * // Update or create a ClothingItem
     * const clothingItem = await prisma.clothingItem.upsert({
     *   create: {
     *     // ... data to create a ClothingItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClothingItem we want to update
     *   }
     * })
     */
    upsert<T extends ClothingItemUpsertArgs>(args: SelectSubset<T, ClothingItemUpsertArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClothingItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemCountArgs} args - Arguments to filter ClothingItems to count.
     * @example
     * // Count the number of ClothingItems
     * const count = await prisma.clothingItem.count({
     *   where: {
     *     // ... the filter for the ClothingItems we want to count
     *   }
     * })
    **/
    count<T extends ClothingItemCountArgs>(
      args?: Subset<T, ClothingItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClothingItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClothingItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClothingItemAggregateArgs>(args: Subset<T, ClothingItemAggregateArgs>): Prisma.PrismaPromise<GetClothingItemAggregateType<T>>

    /**
     * Group by ClothingItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothingItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClothingItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClothingItemGroupByArgs['orderBy'] }
        : { orderBy?: ClothingItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClothingItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClothingItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClothingItem model
   */
  readonly fields: ClothingItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClothingItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClothingItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    washEvents<T extends ClothingItem$washEventsArgs<ExtArgs> = {}>(args?: Subset<T, ClothingItem$washEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClothingItem model
   */ 
  interface ClothingItemFieldRefs {
    readonly id: FieldRef<"ClothingItem", 'String'>
    readonly userId: FieldRef<"ClothingItem", 'String'>
    readonly name: FieldRef<"ClothingItem", 'String'>
    readonly itemType: FieldRef<"ClothingItem", 'String'>
    readonly imageUrl: FieldRef<"ClothingItem", 'String'>
    readonly currentStatus: FieldRef<"ClothingItem", 'ItemStatus'>
    readonly damageLog: FieldRef<"ClothingItem", 'String'>
    readonly lastWashed: FieldRef<"ClothingItem", 'DateTime'>
    readonly createdAt: FieldRef<"ClothingItem", 'DateTime'>
    readonly updatedAt: FieldRef<"ClothingItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClothingItem findUnique
   */
  export type ClothingItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * Filter, which ClothingItem to fetch.
     */
    where: ClothingItemWhereUniqueInput
  }

  /**
   * ClothingItem findUniqueOrThrow
   */
  export type ClothingItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * Filter, which ClothingItem to fetch.
     */
    where: ClothingItemWhereUniqueInput
  }

  /**
   * ClothingItem findFirst
   */
  export type ClothingItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * Filter, which ClothingItem to fetch.
     */
    where?: ClothingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClothingItems to fetch.
     */
    orderBy?: ClothingItemOrderByWithRelationInput | ClothingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClothingItems.
     */
    cursor?: ClothingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClothingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClothingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClothingItems.
     */
    distinct?: ClothingItemScalarFieldEnum | ClothingItemScalarFieldEnum[]
  }

  /**
   * ClothingItem findFirstOrThrow
   */
  export type ClothingItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * Filter, which ClothingItem to fetch.
     */
    where?: ClothingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClothingItems to fetch.
     */
    orderBy?: ClothingItemOrderByWithRelationInput | ClothingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClothingItems.
     */
    cursor?: ClothingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClothingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClothingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClothingItems.
     */
    distinct?: ClothingItemScalarFieldEnum | ClothingItemScalarFieldEnum[]
  }

  /**
   * ClothingItem findMany
   */
  export type ClothingItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * Filter, which ClothingItems to fetch.
     */
    where?: ClothingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClothingItems to fetch.
     */
    orderBy?: ClothingItemOrderByWithRelationInput | ClothingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClothingItems.
     */
    cursor?: ClothingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClothingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClothingItems.
     */
    skip?: number
    distinct?: ClothingItemScalarFieldEnum | ClothingItemScalarFieldEnum[]
  }

  /**
   * ClothingItem create
   */
  export type ClothingItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ClothingItem.
     */
    data: XOR<ClothingItemCreateInput, ClothingItemUncheckedCreateInput>
  }

  /**
   * ClothingItem createMany
   */
  export type ClothingItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClothingItems.
     */
    data: ClothingItemCreateManyInput | ClothingItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClothingItem createManyAndReturn
   */
  export type ClothingItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClothingItems.
     */
    data: ClothingItemCreateManyInput | ClothingItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClothingItem update
   */
  export type ClothingItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ClothingItem.
     */
    data: XOR<ClothingItemUpdateInput, ClothingItemUncheckedUpdateInput>
    /**
     * Choose, which ClothingItem to update.
     */
    where: ClothingItemWhereUniqueInput
  }

  /**
   * ClothingItem updateMany
   */
  export type ClothingItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClothingItems.
     */
    data: XOR<ClothingItemUpdateManyMutationInput, ClothingItemUncheckedUpdateManyInput>
    /**
     * Filter which ClothingItems to update
     */
    where?: ClothingItemWhereInput
  }

  /**
   * ClothingItem upsert
   */
  export type ClothingItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ClothingItem to update in case it exists.
     */
    where: ClothingItemWhereUniqueInput
    /**
     * In case the ClothingItem found by the `where` argument doesn't exist, create a new ClothingItem with this data.
     */
    create: XOR<ClothingItemCreateInput, ClothingItemUncheckedCreateInput>
    /**
     * In case the ClothingItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClothingItemUpdateInput, ClothingItemUncheckedUpdateInput>
  }

  /**
   * ClothingItem delete
   */
  export type ClothingItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
    /**
     * Filter which ClothingItem to delete.
     */
    where: ClothingItemWhereUniqueInput
  }

  /**
   * ClothingItem deleteMany
   */
  export type ClothingItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClothingItems to delete
     */
    where?: ClothingItemWhereInput
  }

  /**
   * ClothingItem.washEvents
   */
  export type ClothingItem$washEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    where?: WashEventWhereInput
    orderBy?: WashEventOrderByWithRelationInput | WashEventOrderByWithRelationInput[]
    cursor?: WashEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WashEventScalarFieldEnum | WashEventScalarFieldEnum[]
  }

  /**
   * ClothingItem without action
   */
  export type ClothingItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothingItem
     */
    select?: ClothingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothingItemInclude<ExtArgs> | null
  }


  /**
   * Model WashEvent
   */

  export type AggregateWashEvent = {
    _count: WashEventCountAggregateOutputType | null
    _min: WashEventMinAggregateOutputType | null
    _max: WashEventMaxAggregateOutputType | null
  }

  export type WashEventMinAggregateOutputType = {
    id: string | null
    clothingItemId: string | null
    washDate: Date | null
    notes: string | null
    createdAt: Date | null
  }

  export type WashEventMaxAggregateOutputType = {
    id: string | null
    clothingItemId: string | null
    washDate: Date | null
    notes: string | null
    createdAt: Date | null
  }

  export type WashEventCountAggregateOutputType = {
    id: number
    clothingItemId: number
    washDate: number
    notes: number
    createdAt: number
    _all: number
  }


  export type WashEventMinAggregateInputType = {
    id?: true
    clothingItemId?: true
    washDate?: true
    notes?: true
    createdAt?: true
  }

  export type WashEventMaxAggregateInputType = {
    id?: true
    clothingItemId?: true
    washDate?: true
    notes?: true
    createdAt?: true
  }

  export type WashEventCountAggregateInputType = {
    id?: true
    clothingItemId?: true
    washDate?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type WashEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WashEvent to aggregate.
     */
    where?: WashEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WashEvents to fetch.
     */
    orderBy?: WashEventOrderByWithRelationInput | WashEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WashEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WashEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WashEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WashEvents
    **/
    _count?: true | WashEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WashEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WashEventMaxAggregateInputType
  }

  export type GetWashEventAggregateType<T extends WashEventAggregateArgs> = {
        [P in keyof T & keyof AggregateWashEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWashEvent[P]>
      : GetScalarType<T[P], AggregateWashEvent[P]>
  }




  export type WashEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WashEventWhereInput
    orderBy?: WashEventOrderByWithAggregationInput | WashEventOrderByWithAggregationInput[]
    by: WashEventScalarFieldEnum[] | WashEventScalarFieldEnum
    having?: WashEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WashEventCountAggregateInputType | true
    _min?: WashEventMinAggregateInputType
    _max?: WashEventMaxAggregateInputType
  }

  export type WashEventGroupByOutputType = {
    id: string
    clothingItemId: string
    washDate: Date
    notes: string | null
    createdAt: Date
    _count: WashEventCountAggregateOutputType | null
    _min: WashEventMinAggregateOutputType | null
    _max: WashEventMaxAggregateOutputType | null
  }

  type GetWashEventGroupByPayload<T extends WashEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WashEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WashEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WashEventGroupByOutputType[P]>
            : GetScalarType<T[P], WashEventGroupByOutputType[P]>
        }
      >
    >


  export type WashEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clothingItemId?: boolean
    washDate?: boolean
    notes?: boolean
    createdAt?: boolean
    clothingItem?: boolean | ClothingItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["washEvent"]>

  export type WashEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clothingItemId?: boolean
    washDate?: boolean
    notes?: boolean
    createdAt?: boolean
    clothingItem?: boolean | ClothingItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["washEvent"]>

  export type WashEventSelectScalar = {
    id?: boolean
    clothingItemId?: boolean
    washDate?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type WashEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clothingItem?: boolean | ClothingItemDefaultArgs<ExtArgs>
  }
  export type WashEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clothingItem?: boolean | ClothingItemDefaultArgs<ExtArgs>
  }

  export type $WashEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WashEvent"
    objects: {
      clothingItem: Prisma.$ClothingItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clothingItemId: string
      washDate: Date
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["washEvent"]>
    composites: {}
  }

  type WashEventGetPayload<S extends boolean | null | undefined | WashEventDefaultArgs> = $Result.GetResult<Prisma.$WashEventPayload, S>

  type WashEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WashEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WashEventCountAggregateInputType | true
    }

  export interface WashEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WashEvent'], meta: { name: 'WashEvent' } }
    /**
     * Find zero or one WashEvent that matches the filter.
     * @param {WashEventFindUniqueArgs} args - Arguments to find a WashEvent
     * @example
     * // Get one WashEvent
     * const washEvent = await prisma.washEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WashEventFindUniqueArgs>(args: SelectSubset<T, WashEventFindUniqueArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WashEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WashEventFindUniqueOrThrowArgs} args - Arguments to find a WashEvent
     * @example
     * // Get one WashEvent
     * const washEvent = await prisma.washEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WashEventFindUniqueOrThrowArgs>(args: SelectSubset<T, WashEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WashEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventFindFirstArgs} args - Arguments to find a WashEvent
     * @example
     * // Get one WashEvent
     * const washEvent = await prisma.washEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WashEventFindFirstArgs>(args?: SelectSubset<T, WashEventFindFirstArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WashEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventFindFirstOrThrowArgs} args - Arguments to find a WashEvent
     * @example
     * // Get one WashEvent
     * const washEvent = await prisma.washEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WashEventFindFirstOrThrowArgs>(args?: SelectSubset<T, WashEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WashEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WashEvents
     * const washEvents = await prisma.washEvent.findMany()
     * 
     * // Get first 10 WashEvents
     * const washEvents = await prisma.washEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const washEventWithIdOnly = await prisma.washEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WashEventFindManyArgs>(args?: SelectSubset<T, WashEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WashEvent.
     * @param {WashEventCreateArgs} args - Arguments to create a WashEvent.
     * @example
     * // Create one WashEvent
     * const WashEvent = await prisma.washEvent.create({
     *   data: {
     *     // ... data to create a WashEvent
     *   }
     * })
     * 
     */
    create<T extends WashEventCreateArgs>(args: SelectSubset<T, WashEventCreateArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WashEvents.
     * @param {WashEventCreateManyArgs} args - Arguments to create many WashEvents.
     * @example
     * // Create many WashEvents
     * const washEvent = await prisma.washEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WashEventCreateManyArgs>(args?: SelectSubset<T, WashEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WashEvents and returns the data saved in the database.
     * @param {WashEventCreateManyAndReturnArgs} args - Arguments to create many WashEvents.
     * @example
     * // Create many WashEvents
     * const washEvent = await prisma.washEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WashEvents and only return the `id`
     * const washEventWithIdOnly = await prisma.washEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WashEventCreateManyAndReturnArgs>(args?: SelectSubset<T, WashEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WashEvent.
     * @param {WashEventDeleteArgs} args - Arguments to delete one WashEvent.
     * @example
     * // Delete one WashEvent
     * const WashEvent = await prisma.washEvent.delete({
     *   where: {
     *     // ... filter to delete one WashEvent
     *   }
     * })
     * 
     */
    delete<T extends WashEventDeleteArgs>(args: SelectSubset<T, WashEventDeleteArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WashEvent.
     * @param {WashEventUpdateArgs} args - Arguments to update one WashEvent.
     * @example
     * // Update one WashEvent
     * const washEvent = await prisma.washEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WashEventUpdateArgs>(args: SelectSubset<T, WashEventUpdateArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WashEvents.
     * @param {WashEventDeleteManyArgs} args - Arguments to filter WashEvents to delete.
     * @example
     * // Delete a few WashEvents
     * const { count } = await prisma.washEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WashEventDeleteManyArgs>(args?: SelectSubset<T, WashEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WashEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WashEvents
     * const washEvent = await prisma.washEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WashEventUpdateManyArgs>(args: SelectSubset<T, WashEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WashEvent.
     * @param {WashEventUpsertArgs} args - Arguments to update or create a WashEvent.
     * @example
     * // Update or create a WashEvent
     * const washEvent = await prisma.washEvent.upsert({
     *   create: {
     *     // ... data to create a WashEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WashEvent we want to update
     *   }
     * })
     */
    upsert<T extends WashEventUpsertArgs>(args: SelectSubset<T, WashEventUpsertArgs<ExtArgs>>): Prisma__WashEventClient<$Result.GetResult<Prisma.$WashEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WashEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventCountArgs} args - Arguments to filter WashEvents to count.
     * @example
     * // Count the number of WashEvents
     * const count = await prisma.washEvent.count({
     *   where: {
     *     // ... the filter for the WashEvents we want to count
     *   }
     * })
    **/
    count<T extends WashEventCountArgs>(
      args?: Subset<T, WashEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WashEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WashEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WashEventAggregateArgs>(args: Subset<T, WashEventAggregateArgs>): Prisma.PrismaPromise<GetWashEventAggregateType<T>>

    /**
     * Group by WashEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WashEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WashEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WashEventGroupByArgs['orderBy'] }
        : { orderBy?: WashEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WashEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWashEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WashEvent model
   */
  readonly fields: WashEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WashEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WashEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clothingItem<T extends ClothingItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClothingItemDefaultArgs<ExtArgs>>): Prisma__ClothingItemClient<$Result.GetResult<Prisma.$ClothingItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WashEvent model
   */ 
  interface WashEventFieldRefs {
    readonly id: FieldRef<"WashEvent", 'String'>
    readonly clothingItemId: FieldRef<"WashEvent", 'String'>
    readonly washDate: FieldRef<"WashEvent", 'DateTime'>
    readonly notes: FieldRef<"WashEvent", 'String'>
    readonly createdAt: FieldRef<"WashEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WashEvent findUnique
   */
  export type WashEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * Filter, which WashEvent to fetch.
     */
    where: WashEventWhereUniqueInput
  }

  /**
   * WashEvent findUniqueOrThrow
   */
  export type WashEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * Filter, which WashEvent to fetch.
     */
    where: WashEventWhereUniqueInput
  }

  /**
   * WashEvent findFirst
   */
  export type WashEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * Filter, which WashEvent to fetch.
     */
    where?: WashEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WashEvents to fetch.
     */
    orderBy?: WashEventOrderByWithRelationInput | WashEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WashEvents.
     */
    cursor?: WashEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WashEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WashEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WashEvents.
     */
    distinct?: WashEventScalarFieldEnum | WashEventScalarFieldEnum[]
  }

  /**
   * WashEvent findFirstOrThrow
   */
  export type WashEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * Filter, which WashEvent to fetch.
     */
    where?: WashEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WashEvents to fetch.
     */
    orderBy?: WashEventOrderByWithRelationInput | WashEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WashEvents.
     */
    cursor?: WashEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WashEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WashEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WashEvents.
     */
    distinct?: WashEventScalarFieldEnum | WashEventScalarFieldEnum[]
  }

  /**
   * WashEvent findMany
   */
  export type WashEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * Filter, which WashEvents to fetch.
     */
    where?: WashEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WashEvents to fetch.
     */
    orderBy?: WashEventOrderByWithRelationInput | WashEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WashEvents.
     */
    cursor?: WashEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WashEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WashEvents.
     */
    skip?: number
    distinct?: WashEventScalarFieldEnum | WashEventScalarFieldEnum[]
  }

  /**
   * WashEvent create
   */
  export type WashEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * The data needed to create a WashEvent.
     */
    data: XOR<WashEventCreateInput, WashEventUncheckedCreateInput>
  }

  /**
   * WashEvent createMany
   */
  export type WashEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WashEvents.
     */
    data: WashEventCreateManyInput | WashEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WashEvent createManyAndReturn
   */
  export type WashEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WashEvents.
     */
    data: WashEventCreateManyInput | WashEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WashEvent update
   */
  export type WashEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * The data needed to update a WashEvent.
     */
    data: XOR<WashEventUpdateInput, WashEventUncheckedUpdateInput>
    /**
     * Choose, which WashEvent to update.
     */
    where: WashEventWhereUniqueInput
  }

  /**
   * WashEvent updateMany
   */
  export type WashEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WashEvents.
     */
    data: XOR<WashEventUpdateManyMutationInput, WashEventUncheckedUpdateManyInput>
    /**
     * Filter which WashEvents to update
     */
    where?: WashEventWhereInput
  }

  /**
   * WashEvent upsert
   */
  export type WashEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * The filter to search for the WashEvent to update in case it exists.
     */
    where: WashEventWhereUniqueInput
    /**
     * In case the WashEvent found by the `where` argument doesn't exist, create a new WashEvent with this data.
     */
    create: XOR<WashEventCreateInput, WashEventUncheckedCreateInput>
    /**
     * In case the WashEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WashEventUpdateInput, WashEventUncheckedUpdateInput>
  }

  /**
   * WashEvent delete
   */
  export type WashEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
    /**
     * Filter which WashEvent to delete.
     */
    where: WashEventWhereUniqueInput
  }

  /**
   * WashEvent deleteMany
   */
  export type WashEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WashEvents to delete
     */
    where?: WashEventWhereInput
  }

  /**
   * WashEvent without action
   */
  export type WashEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WashEvent
     */
    select?: WashEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WashEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ClothingItemScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    itemType: 'itemType',
    imageUrl: 'imageUrl',
    currentStatus: 'currentStatus',
    damageLog: 'damageLog',
    lastWashed: 'lastWashed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClothingItemScalarFieldEnum = (typeof ClothingItemScalarFieldEnum)[keyof typeof ClothingItemScalarFieldEnum]


  export const WashEventScalarFieldEnum: {
    id: 'id',
    clothingItemId: 'clothingItemId',
    washDate: 'washDate',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type WashEventScalarFieldEnum = (typeof WashEventScalarFieldEnum)[keyof typeof WashEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'ItemStatus'
   */
  export type EnumItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemStatus'>
    


  /**
   * Reference to a field of type 'ItemStatus[]'
   */
  export type ListEnumItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ClothingItemWhereInput = {
    AND?: ClothingItemWhereInput | ClothingItemWhereInput[]
    OR?: ClothingItemWhereInput[]
    NOT?: ClothingItemWhereInput | ClothingItemWhereInput[]
    id?: StringFilter<"ClothingItem"> | string
    userId?: StringFilter<"ClothingItem"> | string
    name?: StringFilter<"ClothingItem"> | string
    itemType?: StringFilter<"ClothingItem"> | string
    imageUrl?: StringFilter<"ClothingItem"> | string
    currentStatus?: EnumItemStatusFilter<"ClothingItem"> | $Enums.ItemStatus
    damageLog?: StringNullableFilter<"ClothingItem"> | string | null
    lastWashed?: DateTimeNullableFilter<"ClothingItem"> | Date | string | null
    createdAt?: DateTimeFilter<"ClothingItem"> | Date | string
    updatedAt?: DateTimeFilter<"ClothingItem"> | Date | string
    washEvents?: WashEventListRelationFilter
  }

  export type ClothingItemOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    itemType?: SortOrder
    imageUrl?: SortOrder
    currentStatus?: SortOrder
    damageLog?: SortOrderInput | SortOrder
    lastWashed?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    washEvents?: WashEventOrderByRelationAggregateInput
  }

  export type ClothingItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClothingItemWhereInput | ClothingItemWhereInput[]
    OR?: ClothingItemWhereInput[]
    NOT?: ClothingItemWhereInput | ClothingItemWhereInput[]
    userId?: StringFilter<"ClothingItem"> | string
    name?: StringFilter<"ClothingItem"> | string
    itemType?: StringFilter<"ClothingItem"> | string
    imageUrl?: StringFilter<"ClothingItem"> | string
    currentStatus?: EnumItemStatusFilter<"ClothingItem"> | $Enums.ItemStatus
    damageLog?: StringNullableFilter<"ClothingItem"> | string | null
    lastWashed?: DateTimeNullableFilter<"ClothingItem"> | Date | string | null
    createdAt?: DateTimeFilter<"ClothingItem"> | Date | string
    updatedAt?: DateTimeFilter<"ClothingItem"> | Date | string
    washEvents?: WashEventListRelationFilter
  }, "id">

  export type ClothingItemOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    itemType?: SortOrder
    imageUrl?: SortOrder
    currentStatus?: SortOrder
    damageLog?: SortOrderInput | SortOrder
    lastWashed?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClothingItemCountOrderByAggregateInput
    _max?: ClothingItemMaxOrderByAggregateInput
    _min?: ClothingItemMinOrderByAggregateInput
  }

  export type ClothingItemScalarWhereWithAggregatesInput = {
    AND?: ClothingItemScalarWhereWithAggregatesInput | ClothingItemScalarWhereWithAggregatesInput[]
    OR?: ClothingItemScalarWhereWithAggregatesInput[]
    NOT?: ClothingItemScalarWhereWithAggregatesInput | ClothingItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClothingItem"> | string
    userId?: StringWithAggregatesFilter<"ClothingItem"> | string
    name?: StringWithAggregatesFilter<"ClothingItem"> | string
    itemType?: StringWithAggregatesFilter<"ClothingItem"> | string
    imageUrl?: StringWithAggregatesFilter<"ClothingItem"> | string
    currentStatus?: EnumItemStatusWithAggregatesFilter<"ClothingItem"> | $Enums.ItemStatus
    damageLog?: StringNullableWithAggregatesFilter<"ClothingItem"> | string | null
    lastWashed?: DateTimeNullableWithAggregatesFilter<"ClothingItem"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ClothingItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClothingItem"> | Date | string
  }

  export type WashEventWhereInput = {
    AND?: WashEventWhereInput | WashEventWhereInput[]
    OR?: WashEventWhereInput[]
    NOT?: WashEventWhereInput | WashEventWhereInput[]
    id?: StringFilter<"WashEvent"> | string
    clothingItemId?: StringFilter<"WashEvent"> | string
    washDate?: DateTimeFilter<"WashEvent"> | Date | string
    notes?: StringNullableFilter<"WashEvent"> | string | null
    createdAt?: DateTimeFilter<"WashEvent"> | Date | string
    clothingItem?: XOR<ClothingItemRelationFilter, ClothingItemWhereInput>
  }

  export type WashEventOrderByWithRelationInput = {
    id?: SortOrder
    clothingItemId?: SortOrder
    washDate?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    clothingItem?: ClothingItemOrderByWithRelationInput
  }

  export type WashEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WashEventWhereInput | WashEventWhereInput[]
    OR?: WashEventWhereInput[]
    NOT?: WashEventWhereInput | WashEventWhereInput[]
    clothingItemId?: StringFilter<"WashEvent"> | string
    washDate?: DateTimeFilter<"WashEvent"> | Date | string
    notes?: StringNullableFilter<"WashEvent"> | string | null
    createdAt?: DateTimeFilter<"WashEvent"> | Date | string
    clothingItem?: XOR<ClothingItemRelationFilter, ClothingItemWhereInput>
  }, "id">

  export type WashEventOrderByWithAggregationInput = {
    id?: SortOrder
    clothingItemId?: SortOrder
    washDate?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WashEventCountOrderByAggregateInput
    _max?: WashEventMaxOrderByAggregateInput
    _min?: WashEventMinOrderByAggregateInput
  }

  export type WashEventScalarWhereWithAggregatesInput = {
    AND?: WashEventScalarWhereWithAggregatesInput | WashEventScalarWhereWithAggregatesInput[]
    OR?: WashEventScalarWhereWithAggregatesInput[]
    NOT?: WashEventScalarWhereWithAggregatesInput | WashEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WashEvent"> | string
    clothingItemId?: StringWithAggregatesFilter<"WashEvent"> | string
    washDate?: DateTimeWithAggregatesFilter<"WashEvent"> | Date | string
    notes?: StringNullableWithAggregatesFilter<"WashEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WashEvent"> | Date | string
  }

  export type ClothingItemCreateInput = {
    id?: string
    userId: string
    name: string
    itemType: string
    imageUrl: string
    currentStatus?: $Enums.ItemStatus
    damageLog?: string | null
    lastWashed?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    washEvents?: WashEventCreateNestedManyWithoutClothingItemInput
  }

  export type ClothingItemUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    itemType: string
    imageUrl: string
    currentStatus?: $Enums.ItemStatus
    damageLog?: string | null
    lastWashed?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    washEvents?: WashEventUncheckedCreateNestedManyWithoutClothingItemInput
  }

  export type ClothingItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    itemType?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    currentStatus?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    damageLog?: NullableStringFieldUpdateOperationsInput | string | null
    lastWashed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    washEvents?: WashEventUpdateManyWithoutClothingItemNestedInput
  }

  export type ClothingItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    itemType?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    currentStatus?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    damageLog?: NullableStringFieldUpdateOperationsInput | string | null
    lastWashed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    washEvents?: WashEventUncheckedUpdateManyWithoutClothingItemNestedInput
  }

  export type ClothingItemCreateManyInput = {
    id?: string
    userId: string
    name: string
    itemType: string
    imageUrl: string
    currentStatus?: $Enums.ItemStatus
    damageLog?: string | null
    lastWashed?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClothingItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    itemType?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    currentStatus?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    damageLog?: NullableStringFieldUpdateOperationsInput | string | null
    lastWashed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClothingItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    itemType?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    currentStatus?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    damageLog?: NullableStringFieldUpdateOperationsInput | string | null
    lastWashed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WashEventCreateInput = {
    id?: string
    washDate?: Date | string
    notes?: string | null
    createdAt?: Date | string
    clothingItem: ClothingItemCreateNestedOneWithoutWashEventsInput
  }

  export type WashEventUncheckedCreateInput = {
    id?: string
    clothingItemId: string
    washDate?: Date | string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WashEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clothingItem?: ClothingItemUpdateOneRequiredWithoutWashEventsNestedInput
  }

  export type WashEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clothingItemId?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WashEventCreateManyInput = {
    id?: string
    clothingItemId: string
    washDate?: Date | string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WashEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WashEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clothingItemId?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItemStatusFilter<$PrismaModel> | $Enums.ItemStatus
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type WashEventListRelationFilter = {
    every?: WashEventWhereInput
    some?: WashEventWhereInput
    none?: WashEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WashEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClothingItemCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    itemType?: SortOrder
    imageUrl?: SortOrder
    currentStatus?: SortOrder
    damageLog?: SortOrder
    lastWashed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClothingItemMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    itemType?: SortOrder
    imageUrl?: SortOrder
    currentStatus?: SortOrder
    damageLog?: SortOrder
    lastWashed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClothingItemMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    itemType?: SortOrder
    imageUrl?: SortOrder
    currentStatus?: SortOrder
    damageLog?: SortOrder
    lastWashed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItemStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemStatusFilter<$PrismaModel>
    _max?: NestedEnumItemStatusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ClothingItemRelationFilter = {
    is?: ClothingItemWhereInput
    isNot?: ClothingItemWhereInput
  }

  export type WashEventCountOrderByAggregateInput = {
    id?: SortOrder
    clothingItemId?: SortOrder
    washDate?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type WashEventMaxOrderByAggregateInput = {
    id?: SortOrder
    clothingItemId?: SortOrder
    washDate?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type WashEventMinOrderByAggregateInput = {
    id?: SortOrder
    clothingItemId?: SortOrder
    washDate?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type WashEventCreateNestedManyWithoutClothingItemInput = {
    create?: XOR<WashEventCreateWithoutClothingItemInput, WashEventUncheckedCreateWithoutClothingItemInput> | WashEventCreateWithoutClothingItemInput[] | WashEventUncheckedCreateWithoutClothingItemInput[]
    connectOrCreate?: WashEventCreateOrConnectWithoutClothingItemInput | WashEventCreateOrConnectWithoutClothingItemInput[]
    createMany?: WashEventCreateManyClothingItemInputEnvelope
    connect?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
  }

  export type WashEventUncheckedCreateNestedManyWithoutClothingItemInput = {
    create?: XOR<WashEventCreateWithoutClothingItemInput, WashEventUncheckedCreateWithoutClothingItemInput> | WashEventCreateWithoutClothingItemInput[] | WashEventUncheckedCreateWithoutClothingItemInput[]
    connectOrCreate?: WashEventCreateOrConnectWithoutClothingItemInput | WashEventCreateOrConnectWithoutClothingItemInput[]
    createMany?: WashEventCreateManyClothingItemInputEnvelope
    connect?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumItemStatusFieldUpdateOperationsInput = {
    set?: $Enums.ItemStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WashEventUpdateManyWithoutClothingItemNestedInput = {
    create?: XOR<WashEventCreateWithoutClothingItemInput, WashEventUncheckedCreateWithoutClothingItemInput> | WashEventCreateWithoutClothingItemInput[] | WashEventUncheckedCreateWithoutClothingItemInput[]
    connectOrCreate?: WashEventCreateOrConnectWithoutClothingItemInput | WashEventCreateOrConnectWithoutClothingItemInput[]
    upsert?: WashEventUpsertWithWhereUniqueWithoutClothingItemInput | WashEventUpsertWithWhereUniqueWithoutClothingItemInput[]
    createMany?: WashEventCreateManyClothingItemInputEnvelope
    set?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    disconnect?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    delete?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    connect?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    update?: WashEventUpdateWithWhereUniqueWithoutClothingItemInput | WashEventUpdateWithWhereUniqueWithoutClothingItemInput[]
    updateMany?: WashEventUpdateManyWithWhereWithoutClothingItemInput | WashEventUpdateManyWithWhereWithoutClothingItemInput[]
    deleteMany?: WashEventScalarWhereInput | WashEventScalarWhereInput[]
  }

  export type WashEventUncheckedUpdateManyWithoutClothingItemNestedInput = {
    create?: XOR<WashEventCreateWithoutClothingItemInput, WashEventUncheckedCreateWithoutClothingItemInput> | WashEventCreateWithoutClothingItemInput[] | WashEventUncheckedCreateWithoutClothingItemInput[]
    connectOrCreate?: WashEventCreateOrConnectWithoutClothingItemInput | WashEventCreateOrConnectWithoutClothingItemInput[]
    upsert?: WashEventUpsertWithWhereUniqueWithoutClothingItemInput | WashEventUpsertWithWhereUniqueWithoutClothingItemInput[]
    createMany?: WashEventCreateManyClothingItemInputEnvelope
    set?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    disconnect?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    delete?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    connect?: WashEventWhereUniqueInput | WashEventWhereUniqueInput[]
    update?: WashEventUpdateWithWhereUniqueWithoutClothingItemInput | WashEventUpdateWithWhereUniqueWithoutClothingItemInput[]
    updateMany?: WashEventUpdateManyWithWhereWithoutClothingItemInput | WashEventUpdateManyWithWhereWithoutClothingItemInput[]
    deleteMany?: WashEventScalarWhereInput | WashEventScalarWhereInput[]
  }

  export type ClothingItemCreateNestedOneWithoutWashEventsInput = {
    create?: XOR<ClothingItemCreateWithoutWashEventsInput, ClothingItemUncheckedCreateWithoutWashEventsInput>
    connectOrCreate?: ClothingItemCreateOrConnectWithoutWashEventsInput
    connect?: ClothingItemWhereUniqueInput
  }

  export type ClothingItemUpdateOneRequiredWithoutWashEventsNestedInput = {
    create?: XOR<ClothingItemCreateWithoutWashEventsInput, ClothingItemUncheckedCreateWithoutWashEventsInput>
    connectOrCreate?: ClothingItemCreateOrConnectWithoutWashEventsInput
    upsert?: ClothingItemUpsertWithoutWashEventsInput
    connect?: ClothingItemWhereUniqueInput
    update?: XOR<XOR<ClothingItemUpdateToOneWithWhereWithoutWashEventsInput, ClothingItemUpdateWithoutWashEventsInput>, ClothingItemUncheckedUpdateWithoutWashEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItemStatusFilter<$PrismaModel> | $Enums.ItemStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemStatus[] | ListEnumItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItemStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemStatusFilter<$PrismaModel>
    _max?: NestedEnumItemStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type WashEventCreateWithoutClothingItemInput = {
    id?: string
    washDate?: Date | string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WashEventUncheckedCreateWithoutClothingItemInput = {
    id?: string
    washDate?: Date | string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WashEventCreateOrConnectWithoutClothingItemInput = {
    where: WashEventWhereUniqueInput
    create: XOR<WashEventCreateWithoutClothingItemInput, WashEventUncheckedCreateWithoutClothingItemInput>
  }

  export type WashEventCreateManyClothingItemInputEnvelope = {
    data: WashEventCreateManyClothingItemInput | WashEventCreateManyClothingItemInput[]
    skipDuplicates?: boolean
  }

  export type WashEventUpsertWithWhereUniqueWithoutClothingItemInput = {
    where: WashEventWhereUniqueInput
    update: XOR<WashEventUpdateWithoutClothingItemInput, WashEventUncheckedUpdateWithoutClothingItemInput>
    create: XOR<WashEventCreateWithoutClothingItemInput, WashEventUncheckedCreateWithoutClothingItemInput>
  }

  export type WashEventUpdateWithWhereUniqueWithoutClothingItemInput = {
    where: WashEventWhereUniqueInput
    data: XOR<WashEventUpdateWithoutClothingItemInput, WashEventUncheckedUpdateWithoutClothingItemInput>
  }

  export type WashEventUpdateManyWithWhereWithoutClothingItemInput = {
    where: WashEventScalarWhereInput
    data: XOR<WashEventUpdateManyMutationInput, WashEventUncheckedUpdateManyWithoutClothingItemInput>
  }

  export type WashEventScalarWhereInput = {
    AND?: WashEventScalarWhereInput | WashEventScalarWhereInput[]
    OR?: WashEventScalarWhereInput[]
    NOT?: WashEventScalarWhereInput | WashEventScalarWhereInput[]
    id?: StringFilter<"WashEvent"> | string
    clothingItemId?: StringFilter<"WashEvent"> | string
    washDate?: DateTimeFilter<"WashEvent"> | Date | string
    notes?: StringNullableFilter<"WashEvent"> | string | null
    createdAt?: DateTimeFilter<"WashEvent"> | Date | string
  }

  export type ClothingItemCreateWithoutWashEventsInput = {
    id?: string
    userId: string
    name: string
    itemType: string
    imageUrl: string
    currentStatus?: $Enums.ItemStatus
    damageLog?: string | null
    lastWashed?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClothingItemUncheckedCreateWithoutWashEventsInput = {
    id?: string
    userId: string
    name: string
    itemType: string
    imageUrl: string
    currentStatus?: $Enums.ItemStatus
    damageLog?: string | null
    lastWashed?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClothingItemCreateOrConnectWithoutWashEventsInput = {
    where: ClothingItemWhereUniqueInput
    create: XOR<ClothingItemCreateWithoutWashEventsInput, ClothingItemUncheckedCreateWithoutWashEventsInput>
  }

  export type ClothingItemUpsertWithoutWashEventsInput = {
    update: XOR<ClothingItemUpdateWithoutWashEventsInput, ClothingItemUncheckedUpdateWithoutWashEventsInput>
    create: XOR<ClothingItemCreateWithoutWashEventsInput, ClothingItemUncheckedCreateWithoutWashEventsInput>
    where?: ClothingItemWhereInput
  }

  export type ClothingItemUpdateToOneWithWhereWithoutWashEventsInput = {
    where?: ClothingItemWhereInput
    data: XOR<ClothingItemUpdateWithoutWashEventsInput, ClothingItemUncheckedUpdateWithoutWashEventsInput>
  }

  export type ClothingItemUpdateWithoutWashEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    itemType?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    currentStatus?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    damageLog?: NullableStringFieldUpdateOperationsInput | string | null
    lastWashed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClothingItemUncheckedUpdateWithoutWashEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    itemType?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    currentStatus?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    damageLog?: NullableStringFieldUpdateOperationsInput | string | null
    lastWashed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WashEventCreateManyClothingItemInput = {
    id?: string
    washDate?: Date | string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WashEventUpdateWithoutClothingItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WashEventUncheckedUpdateWithoutClothingItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WashEventUncheckedUpdateManyWithoutClothingItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    washDate?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ClothingItemCountOutputTypeDefaultArgs instead
     */
    export type ClothingItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClothingItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClothingItemDefaultArgs instead
     */
    export type ClothingItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClothingItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WashEventDefaultArgs instead
     */
    export type WashEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WashEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}