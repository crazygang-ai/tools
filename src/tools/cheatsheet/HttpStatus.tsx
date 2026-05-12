import { CheatsheetTable } from './CheatsheetTable';

const sections = [
  {
    key: '1xx',
    rows: [
      { cmd: '100 Continue', zh: '继续发送请求体', en: 'Continue sending request body' },
      { cmd: '101 Switching Protocols', zh: '切换协议（如 WebSocket）', en: 'Switching protocols (e.g. WebSocket)' },
      { cmd: '103 Early Hints', zh: '提前提示，可预加载资源', en: 'Early hints for resource preload' },
    ],
  },
  {
    key: '2xx',
    rows: [
      { cmd: '200 OK', zh: '请求成功', en: 'Request succeeded' },
      { cmd: '201 Created', zh: '资源已创建', en: 'Resource created' },
      { cmd: '202 Accepted', zh: '已接受，处理中', en: 'Accepted, processing async' },
      { cmd: '204 No Content', zh: '成功但无返回体', en: 'Success with no body' },
      { cmd: '206 Partial Content', zh: '部分内容（Range）', en: 'Partial content (Range)' },
    ],
  },
  {
    key: '3xx',
    rows: [
      { cmd: '301 Moved Permanently', zh: '永久重定向', en: 'Permanent redirect' },
      { cmd: '302 Found', zh: '临时重定向', en: 'Temporary redirect' },
      { cmd: '304 Not Modified', zh: '未修改（缓存命中）', en: 'Not modified (cache hit)' },
      { cmd: '307 Temporary Redirect', zh: '临时重定向，保留方法', en: 'Temp redirect, preserve method' },
      { cmd: '308 Permanent Redirect', zh: '永久重定向，保留方法', en: 'Permanent redirect, preserve method' },
    ],
  },
  {
    key: '4xx',
    rows: [
      { cmd: '400 Bad Request', zh: '请求格式错误', en: 'Malformed request' },
      { cmd: '401 Unauthorized', zh: '未认证', en: 'Authentication required' },
      { cmd: '403 Forbidden', zh: '无权限', en: 'Authenticated but forbidden' },
      { cmd: '404 Not Found', zh: '资源不存在', en: 'Resource not found' },
      { cmd: '405 Method Not Allowed', zh: '方法不允许', en: 'HTTP method not allowed' },
      { cmd: '409 Conflict', zh: '资源冲突', en: 'Conflict with current state' },
      { cmd: '422 Unprocessable Entity', zh: '语义错误', en: 'Validation failed' },
      { cmd: '429 Too Many Requests', zh: '限流', en: 'Rate limited' },
    ],
  },
  {
    key: '5xx',
    rows: [
      { cmd: '500 Internal Server Error', zh: '服务端异常', en: 'Generic server error' },
      { cmd: '501 Not Implemented', zh: '功能未实现', en: 'Not implemented' },
      { cmd: '502 Bad Gateway', zh: '上游响应错误', en: 'Bad upstream response' },
      { cmd: '503 Service Unavailable', zh: '服务不可用', en: 'Service unavailable' },
      { cmd: '504 Gateway Timeout', zh: '上游超时', en: 'Upstream timeout' },
    ],
  },
];

export default function HttpStatus() {
  return <CheatsheetTable ns="http-status" sections={sections} />;
}
