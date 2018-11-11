# @composi/router

@composi/router is a client-side hash-based router for single page apps (SPA). This is for those occasions where you want to be able to conditionally render a set of sub components based on a url value. This is works properly with the browser's back button and you can use it with the History API. @composi/router is very simple with only a few options. If you need a more advanced router, check out [Universal Router](https://www.npmjs.com/package/universal-router). Or use whatever router you prefer. 

## Installation

```bash
npm i -D @composi/router
```

## Import and Use

Import `Router` into your `app.js` file:

```javascript
import { h, render } from '@composi/core'
import { Router } from '@composi/router'
```

To create routes you need to instatiate Router and provide it with an array of paths. The path object is an object literal with a path and action value.

## Adding Routes

The following example shows how to set up routes. What you do when the route happens is completely up to you:

```javascript
import { h, render } from '@composi/core'
import { Router } from '@composi/router'

// Create instance of Router:
const router = new Router()

// Define paths to use:
router([
  {
    path: "/",
    action: () => {
      // Do something when main page loads
    }
  },
  {
    path: "/about",
    action: () => {
      // load an "About" widget
    }
  },
  {
    // Capture a parameter id:
    path: "/users/:name",
    action: (name) => {
      if (name === 'joe') alert('Hi, Joe!')
      else console.log(name)
    }
  }
])
```

Normally you would use a route to handle loading a component. The easiest way to do this is to use a functional component:

```javascript
import { h, render } from '@composi/core'
import { Router } from '@composi/router'

const router = new Router()

const Home = <h1>This is Home</h1>
const FirstPage = <h1>Welcome to the First Page!</h1>
const SecondPage = <h1>Second Page Here.</h1>

function Menu(props, child) {
  return (
    <div>
      <ul class='menu'>
        <li><a href="#/">Home</a></li>
        <li><a href="#/first">First Page</a></li>
        <li><a href="#/second">Second Page</a></li>
      </ul>
      {
        child
      }
    </div>
  )
}

function renderPage(component) {
  render(<Menu>{component}</Menu>, 'section')
}

router([
  {
    path: '/',
    action: () => renderPage(Home)
  },
  {
    path: '/first',
    action: () => renderPage(FirstPage)
  },
  {
    path: '/second',
    action: () => renderPage(SecondPage)
  },
  {
    path: '/*',
    action: () => {
      console.log('Sorry, not a proper path.')
    }
  }
])


render(<Menu>{Home}</Menu>, 'section')
```

You could also use routes in conjuction with [@composi/datastore](https://composi.github.io/en/docs/datastore/data-store.html). The route would set a value on the dataStore, which would cause the component to update.

## Multiple Handlers for One Route

You can use more than one handler for a route. You might do this because you need to remove some functionality later. If that's the case, you want to use named handlers for any handler you will want to remove:

```javascript
// Handler to delete later:
const removableHandler = () => {
  console.log('This handler is temporary and subject to removal.')
}
router([
  {
    path: '/',
    action: () => console.log('You are home!')
  },
  {
    path: '/',
    action: () => console.log('This is another handler on the Home path.')
  }
])
```
To learn more about removing paths and handlers, see [Removing a Route](#Removing-a-Route)

## Optional Parameters

You can indicate that a parameter is optional by using the `?` character after it:

```javascript
router('users/:name?', function(name) {
  if (name) {
    console.log(name)
  } else {
    console.log('No name was provided.')
  }
})
router('users/') // logs `No name was provided.`
router('users/bob') // logs `'bob'`
```

## Wildcard

Using `*` will catch any routes that do not match previously defined routes. Use this as a catch all for any unexpected routes or for a 404:

```javascript
router('users/*', function() {
  console.log('Caught unexpected route!')
})
router('users/12312312')
```

## Block a Route

You can block a route by returning false:

```javascript
router('/admin', function() {
  return false
})
```

## Remove All Routes and Handlers

If you want to remove all current routes and handlers, you can invokde the following:

```javascript
router.removeAll()
```
After running that none of the paths will work.

## Removing a Route

You can remove a singular route as follows:

```javascript
// Handler to delete later:
const removableHandler = () => {
  console.log('This handler is temporary and subject to removal.')
}
router([
  {
    path: '/',
    action: () => console.log('You are home!')
  },
  {
    path: '/',
    action: () => removableHandler
  }
])

// Sometime later we remove the named handler:
router.remove('/', removableHandler)
```