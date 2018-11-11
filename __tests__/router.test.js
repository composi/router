// @ts-nocheck
import { Router } from '../src'

test('Router should respond to location hash changes.', () => {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/",
      action: () => {
        testVar = 'home'
      }
    },
    {
      path: "/about",
      action: () => {
        testVar = 'about'
      }
    }
  ])
  window.location.hash = '/'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')

  window.location.hash = '/about'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('about')
})

test('Should be able to get parameter id from path.', () => {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/users/:name",
      action: (name) => {
        if (name === 'joe') testVar = 'This is Joe!'
        else testVar = `users: ${name}`
      }
    }
  ])

  window.location.hash = '/users/jane'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users: jane')

  window.location.hash = '/users/joe'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('This is Joe!')
})

test('Should be able to get parameter id from path or path itself when parameter is optional.', () => {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/users/:name?",
      action: (name) => {
        if (name === 'joe') testVar = `users: ${name}`
        else testVar = `No name was found.`
      }
    }
  ])

  window.location.hash = '/users/joe'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users: joe')

  window.location.hash = '/users'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('No name was found.')
})

test('router.navigate should update hash value and trigger navigation.', () => {
  window.location.hash = ''
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/",
      action: () => {
        testVar = 'home'
      }
    },
    {
      path: "/about",
      action: () => {
        testVar = 'about'
      }
    },
    {
      path: "/users/:name",
      action: (name) => {
        if (name === 'joe') testVar = 'This is Joe!'
        else testVar = `users: ${name}`
      }
    }
  ])
  router.navigate('/')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')

  router.navigate('/about')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('about')

  router.navigate('/users/jane')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users: jane')

  router.navigate('/users/joe')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('This is Joe!')
})

test('Should be able to get id from path when using router.navigate.', () => {
  window.location.hash = ''
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/users/:name",
      action: (name) => {
        if (name === 'joe') testVar = 'This is Joe!'
        else testVar = `users: ${name}`
      }
    }
  ])

  router.navigate('/users/jane')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users: jane')

  router.navigate('/users/joe')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('This is Joe!')
})


test('Should be able to get parameter id from path or path itself when parameter is optional when using router.navigate.', () => {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/users/:name?",
      action: (name) => {
        if (name === 'joe') testVar = `users: ${name}`
        else testVar = `No name was found.`
      }
    }
  ])

  router.navigate('/users/joe')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users: joe')

  router.navigate('/users')
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('No name was found.')
})

test('Should be able remove all routes and handlers.', function() {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/",
      action: () => {
        testVar = 'home'
      }
    },
    {
      path: "/about",
      action: () => {
        testVar = 'about'
      }
    }
  ])
  window.location.hash = '/'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')

  window.location.hash = '/about'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('about')

  router.removeAll()
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('about')
})


test('Should be able to remove a path.', () => {
  const router = new Router()
  let testVar = 0
  const fnToRemove = () => {
    testVar = 'users2'
  }
  router([
    {
      path: "/",
      action: () => {
        testVar = 'home'
      }
    },
    {
      path: "/about",
      action: () => {
        testVar = 'about'
      }
    },
    ,
    {
      path: "/users",
      action: () => {
        testVar = 'users1'
      }
    },
    {
      path: "/users",
      action: fnToRemove
    }

  ])
  window.location.hash = '/'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')

  window.location.hash = '/about'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('about')

  router.remove('/about')
  window.location.hash = '/'
  window.dispatchEvent(new CustomEvent('hashchange'))
  window.location.hash = '/about'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('about')

  window.location.hash = '/users'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users2')
  router.remove('/users', fnToRemove)
  window.location.hash = '/'
  window.dispatchEvent(new CustomEvent('hashchange'))
  window.location.hash = '/users'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('users1')
})

test('Should be able to use "*" as wild card for route.', () => {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/home",
      action: () => {
        testVar = 'home'
      }
    },
    {
      path: "/home/*",
      action: () => {
        testVar = 'wild card route'
      }
    }
  ])
  window.location.hash = '/home'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')

  window.location.hash = '/home/whatever'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('wild card route')
})

test('Should be able to block route by returning false.', () => {
  const router = new Router()
  let testVar = 0
  router([
    {
      path: "/",
      action: () => {
        testVar = 'home'
      }
    },
    {
      path: "/admin",
      action: () => {
        return false
      }
    },
    {
      path: "/admin",
      action: () => {
        testVar = 'admin'
      }
    }
  ])
  window.location.hash = '/'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')

  window.location.hash = '/admin'
  window.dispatchEvent(new CustomEvent('hashchange'))
  expect(testVar).toEqual('home')
})