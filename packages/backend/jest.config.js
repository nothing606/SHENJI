/**
 * Jest配置文件
 * 
 * @description Jest测试框架配置
 * 用于执行单元测试和生成覆盖率报告
 * 
 * @author SHENJI Team
 * @date 2025-12-04
 */

module.exports = {
  // 使用ts-jest预设，支持TypeScript
  preset: 'ts-jest',
  
  // 测试环境：Node.js
  testEnvironment: 'node',
  
  // 测试文件根目录
  roots: ['<rootDir>/src'],
  
  // 测试文件匹配模式
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // TypeScript转换配置
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        // 测试中允许使用ES模块
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },
  
  // 覆盖率收集范围
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/index.ts',
  ],
  
  // 覆盖率输出目录
  coverageDirectory: 'coverage',
  
  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // 测试超时时间（毫秒）
  testTimeout: 30000,
  
  // 是否显示详细输出
  verbose: true,
  
  // 测试完成后清理mock
  clearMocks: true,
  
  // 每个测试文件运行前的设置文件
  // setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
