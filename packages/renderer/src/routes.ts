export default [
  {path: '/', component: () => import('/@/pages/Index.vue'), meta: {title: 'route.title.home'}},
  {path: '/crypto/base64', component: () => import('/@/pages/crypto/Base64.vue'), meta: {title: 'route.title.crypto.base64'}},
  {path: '/crypto/hash', component: () => import('/@/pages/crypto/Hash.vue'), meta: {title: 'route.title.crypto.hash'}},
  {path: '/formatter/json', component: () => import('/@/pages/formatter/JSONFormatter.vue'), meta: {title: 'route.title.formatter.json'}},
  {path: '/formatter/html', component: () => import('/@/pages/formatter/HTMLFormatter.vue'), meta: {title: 'route.title.formatter.html'}},
  {path: '/formatter/js', component: () => import('/@/pages/formatter/JSFormatter.vue'), meta: {title: 'route.title.formatter.js'}},
  {path: '/formatter/css', component: () => import('/@/pages/formatter/CSSFormatter.vue'), meta: {title: 'route.title.formatter.css'}},
  {path: '/formatter/xml', component: () => import('/@/pages/formatter/XMLFormatter.vue'), meta: {title: 'route.title.formatter.xml'}},
  {path: '/formatter/sql', component: () => import('/@/pages/formatter/SQLFormatter.vue'), meta: {title: 'route.title.formatter.sql'}},
  {path: '/url-encoder', component: () => import('/@/pages/UrlEncoder.vue'), meta: {title: 'route.title.url-encoder'}},
  {path: '/qrcode', component: () => import('/@/pages/QRCode.vue'), meta: {title: 'route.title.qrcode'}},
];
