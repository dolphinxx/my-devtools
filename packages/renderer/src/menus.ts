export default [
  {
    name: 'route.title.home',
    route: {path: '/'},
    icon: 'IconHomeFilled',
  },
  {
    name: 'route.title.article',
    route: {path: '/article'},
    icon: 'IconDocument',
  },
  {
    name: 'route.title.tools',
    icon: 'IconMenu',
    children: [
      {
        name: 'route.title.cryptos',
        children: [
          {
            name: 'route.title.crypto.base64',
            route: {path: '/crypto/base64'},
          },
          {
            name: 'route.title.crypto.hash',
            route: {path: '/crypto/hash'},
          },
        ],
      },
      {
        name: 'route.title.url-encoder',
        route: {path: '/url-encoder'},
      },
      {
        name: 'route.title.qrcode',
        route: {path: '/qrcode'},
      },
      {
        name: 'route.title.textDiff',
        route: {path: '/text-diff'},
      },
      {
        name: 'route.title.formatters',
        children: [
          {
            name: 'JSON',
            route: {path: '/formatter/json'},
          },
          {
            name: 'HTML',
            route: {path: '/formatter/html'},
          },
          {
            name: 'JS',
            route: {path: '/formatter/js'},
          },
          {
            name: 'CSS',
            route: {path: '/formatter/css'},
          },
          {
            name: 'XML',
            route: {path: '/formatter/xml'},
          },
          {
            name: 'SQL',
            route: {path: '/formatter/sql'},
          },
        ],
      },
    ],
  },
  {
    name: 'route.title.appConfig',
    route: {path: '/app_config'},
  },
] as MenuDefinition[];
