/**
 * 认证相关API
 */

import { post } from './request';

/**
 * 微信登录
 */
export function wxLogin(data: { code: string }) {
  return post('/auth/wx/login', data);
}

/**
 * 账号密码登录
 */
export function passwordLogin(data: { username: string; password: string }) {
  return post('/auth/login', data);
}

/**
 * 企业微信登录
 */
export function wxWorkLogin(data: { code: string }) {
  return post('/auth/wxwork/login', data);
}

/**
 * 退出登录
 */
export function logout() {
  return post('/auth/logout');
}

/**
 * 刷新Token
 */
export function refreshToken(data: { refreshToken: string }) {
  return post('/auth/refresh', data);
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return post('/auth/userInfo');
}
