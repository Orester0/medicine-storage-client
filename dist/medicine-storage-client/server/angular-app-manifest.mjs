
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "route": "/"
  },
  {
    "renderMode": 1,
    "route": "/medicines"
  },
  {
    "renderMode": 1,
    "route": "/tenders"
  },
  {
    "renderMode": 1,
    "route": "/tenders/*"
  },
  {
    "renderMode": 1,
    "route": "/audits"
  },
  {
    "renderMode": 1,
    "route": "/requests"
  },
  {
    "renderMode": 1,
    "route": "/user-profile"
  },
  {
    "renderMode": 1,
    "route": "/templates"
  },
  {
    "renderMode": 1,
    "redirectTo": "/admin/users",
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "route": "/admin/users"
  },
  {
    "renderMode": 1,
    "route": "/admin/supplies"
  },
  {
    "renderMode": 1,
    "route": "/admin/usages"
  },
  {
    "renderMode": 1,
    "route": "/not-found"
  },
  {
    "renderMode": 1,
    "route": "/internal-server-error"
  },
  {
    "renderMode": 1,
    "route": "/**"
  }
],
  assets: {
    'index.csr.html': {size: 28074, hash: 'fc6693ccb7090a4c7a61433f4f4c7fdebbf7f7089c74c5314fb205846a39ee66', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17217, hash: '89880ff0d5beab98600ac2e5d0486c54511cf587a01de88a4668c5b9b18f4f50', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-OUTGAEKK.css': {size: 358512, hash: 'WCbbtIquvBw', text: () => import('./assets-chunks/styles-OUTGAEKK_css.mjs').then(m => m.default)}
  },
};
