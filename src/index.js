/**
 * Creates a Router object.
 */
export function Router() {
  let routes = []
  let map = {}
  let oldUrl

  class Route {
    /**
     * @param {string} path
     * @param {string} name
     */
    constructor(path, name) {
      this.name = name
      this.path = path
      this.keys = []
      this.fns = []
      this.params = {}
      this.pathToRegexp = (path, keys, sensitive, strict) => {
        if (path instanceof RegExp) return path
        if (path instanceof Array) path = '(' + path.join('|') + ')'
        path = path
          .concat(strict ? '' : '/?')
          .replace(/\/\(/g, '(?:/')
          .replace(/\+/g, '__plus__')
          .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(
            _,
            slash,
            format,
            key,
            capture,
            optional
          ) {
            keys.push({ name: key, optional: !!optional })
            slash = slash || ''
            return (
              '' +
              (optional ? '' : slash) +
              '(?:' +
              (optional ? slash : '') +
              (format || '') +
              (capture || (format && '([^/.]+?)') || '([^/]+?)') +
              ')' +
              (optional || '')
            )
          })
          .replace(/([/.])/g, '\\$1')
          .replace(/__plus__/g, '(.+)')
          .replace(/\*/g, '(.*)')
        return new RegExp('^' + path + '$', sensitive ? '' : 'i')
      }
      this.regex = this.pathToRegexp(this.path, this.keys, false, false)
    }

    /**
     * Adds a handler for "this" route.
     * @param {function} fn
     * @returns {void} undefined
     */
    addHandler(fn) {
      this.fns.push(fn)
    }

    /**
     * Removes specific handler for this route.
     * @param {function} fn
     * @returns {void} undefined
     */
    removeHandler(fn) {
      for (let i = 0, c = this.fns.length; i < c; i++) {
        let f = this.fns[i]
        if (fn == f) {
          this.fns.splice(i, 1)
          return
        }
      }
    }

    /**
     * Executes this route with specified params.
     *
     * @param {Object<string, any>} params
     * @returns {boolean} boolean
     */
    run(params) {
      for (let i = 0, c = this.fns.length; i < c; i++) {
        if (this.fns[i].apply(this, params) === false) return false
      }
      return true
    }

    /**
     * Tests a path of this route and runs if it's was successful.
     * @param {string} path
     * @param {Object<string, any>} params
     * @returns {boolean} boolean
     */
    match(path, params) {
      let m = this.regex.exec(path)
      if (!m) return false
      for (let i = 1, len = m.length; i < len; ++i) {
        let key = this.keys[i - 1]
        let val = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i]
        if (key) {
          this.params[key.name] = val
        }
        params.push(val)
      }
      return true
    }
  }
  /**
   * @typedef {Object} PathObject
   * @prop {string} path
   * @prop {(param?: any) => void} action
   */

  /**
   * This is the main constructor for router object.
   * Creates a route or navigates it if second parameter is empty.
   *
   * @param {PathObject[]} path The path to register or to navigate.
   * @returns {void} undefined
   */
  const router = (...path) => {
    let addHandler = (path, fn) => {
      if (!map[path]) {
        map[path] = new Route(path, name)
        routes.push(map[path])
      }
      map[path].addHandler(fn)
    }
    path.map(route => {
      addHandler(route.path, route.action)
    })
    router.reload()
  }

  /**
   * Removes specified handler for specified path.
   * Remeber that: one path can have multiple handlers/callbacks functions.
   * You should specify the exact object that refers to the handler.
   *
   * @param {string} path target path to remove.
   * @param {Function} fn handler function.
   * @returns {void} undefined
   */
  router.remove = (path, fn) => {
    let route = map[path]
    if (!route) return
    if (!fn) {
      delete map[path]
    } else {
      route.removeHandler(fn)
    }
  }

  /**
   * Removes all handlers and routes.
   *
   * @returns {void} undefined
   */
  router.removeAll = () => {
    map = {}
    routes = []
    oldUrl = ''
  }

  /**
   * Navigates current route to desired one
   *
   * @param  {string} path target path to navigate
   * @returns {void} undefined
   */
  router.navigate = path => {
    window.location.hash = path
  }

  /**
   * Get the location hash.
   * @returns {string} string
   */
  const getHash = () => window.location.hash.substring(1)

  /**
   * Checks to see if a hash matches a route.
   * @param {string} hash
   * @param {Object<string, any>} route
   */
  const checkRoute = (hash, route) => {
    let params = []
    if (route.match(hash, params)) {
      return route.run(params) !== false ? 1 : 0
    }
    return -1
  }

  /**
   * Check whether location hash has changes
   */
  const hashChanged = (router.reload = () => {
    let hash = getHash()
    for (let i = 0, c = routes.length; i < c; i++) {
      let route = routes[i]
      let state = checkRoute(hash, route)
      if (state === 1) {
        // route processed:
        oldUrl = hash
        break
      } else if (state === 0) {
        // route rejected:
        router.navigate(oldUrl)
        break
      }
    }
  })

  window.addEventListener('hashchange', hashChanged, false)
  oldUrl = getHash()

  window['router'] = router

  return router
}
