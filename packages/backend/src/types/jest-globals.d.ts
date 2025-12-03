/**
 * Jest全局类型定义（临时）
 * 
 * @description 在安装@types/jest之前的临时类型定义
 * 用于消除IDE的类型错误警告
 * 
 * @author SHENJI Team
 * @date 2025-12-03
 * @version 1.0.0
 * 
 * @remarks
 * 这是一个临时解决方案，正式环境应安装 @types/jest
 * 
 * @todo Week 2前安装完整的Jest类型定义
 * ```bash
 * cd packages/backend
 * npm install --save-dev @types/jest
 * ```
 */

declare global {
  /**
   * Jest测试套件定义
   * 
   * @param name - 测试套件名称
   * @param fn - 测试套件函数
   */
  function describe(name: string, fn: () => void): void;

  /**
   * Jest测试用例定义
   * 
   * @param name - 测试用例名称
   * @param fn - 测试函数
   * @param timeout - 超时时间（可选）
   */
  function it(name: string, fn: () => void | Promise<void>, timeout?: number): void;

  /**
   * Jest测试用例定义（别名）
   * 
   * @param name - 测试用例名称
   * @param fn - 测试函数
   * @param timeout - 超时时间（可选）
   */
  function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;

  /**
   * Jest beforeEach钩子
   * 
   * @param fn - 在每个测试前执行的函数
   * @param timeout - 超时时间（可选）
   */
  function beforeEach(fn: () => void | Promise<void>, timeout?: number): void;

  /**
   * Jest afterEach钩子
   * 
   * @param fn - 在每个测试后执行的函数
   * @param timeout - 超时时间（可选）
   */
  function afterEach(fn: () => void | Promise<void>, timeout?: number): void;

  /**
   * Jest beforeAll钩子
   * 
   * @param fn - 在所有测试前执行的函数
   * @param timeout - 超时时间（可选）
   */
  function beforeAll(fn: () => void | Promise<void>, timeout?: number): void;

  /**
   * Jest afterAll钩子
   * 
   * @param fn - 在所有测试后执行的函数
   * @param timeout - 超时时间（可选）
   */
  function afterAll(fn: () => void | Promise<void>, timeout?: number): void;

  /**
   * Jest expect断言
   * 
   * @param actual - 实际值
   * @returns 断言匹配器
   */
  function expect<T = any>(actual: T): jest.Matchers<T>;

  namespace jest {
    /**
     * Jest断言匹配器接口
     */
    interface Matchers<R = any> {
      /**
       * 断言值相等（使用===）
       */
      toBe(expected: any): R;

      /**
       * 断言对象或数组深度相等
       */
      toEqual(expected: any): R;

      /**
       * 断言值严格相等
       */
      toStrictEqual(expected: any): R;

      /**
       * 断言值已定义（不是undefined）
       */
      toBeDefined(): R;

      /**
       * 断言值未定义（是undefined）
       */
      toBeUndefined(): R;

      /**
       * 断言值为null
       */
      toBeNull(): R;

      /**
       * 断言值为真值（truthy）
       */
      toBeTruthy(): R;

      /**
       * 断言值为假值（falsy）
       */
      toBeFalsy(): R;

      /**
       * 断言数字大于期望值
       */
      toBeGreaterThan(expected: number): R;

      /**
       * 断言数字大于等于期望值
       */
      toBeGreaterThanOrEqual(expected: number): R;

      /**
       * 断言数字小于期望值
       */
      toBeLessThan(expected: number): R;

      /**
       * 断言数字小于等于期望值
       */
      toBeLessThanOrEqual(expected: number): R;

      /**
       * 断言浮点数接近期望值
       */
      toBeCloseTo(expected: number, numDigits?: number): R;

      /**
       * 断言数组或字符串包含某项
       */
      toContain(expected: any): R;

      /**
       * 断言数组包含满足条件的对象
       */
      toContainEqual(expected: any): R;

      /**
       * 断言数组长度
       */
      toHaveLength(expected: number): R;

      /**
       * 断言对象拥有某属性
       */
      toHaveProperty(keyPath: string | string[], value?: any): R;

      /**
       * 断言字符串匹配正则
       */
      toMatch(expected: string | RegExp): R;

      /**
       * 断言函数抛出异常
       */
      toThrow(expected?: string | RegExp | Error): R;

      /**
       * 断言函数抛出异常（别名）
       */
      toThrowError(expected?: string | RegExp | Error): R;

      /**
       * 断言Promise被resolve
       */
      resolves: Matchers<Promise<R>>;

      /**
       * 断言Promise被reject
       */
      rejects: Matchers<Promise<R>>;

      /**
       * 取反断言
       */
      not: Matchers<R>;
    }
  }
}

export {};
