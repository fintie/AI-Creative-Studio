import { Children, cloneElement, createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext(null)

function getCurrentLocation() {
  return {
    pathname: window.location.pathname,
    hash: window.location.hash,
  }
}

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(getCurrentLocation)

  useEffect(() => {
    const syncLocation = () => setLocation(getCurrentLocation())
    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
    }
  }, [])

  const router = useMemo(() => ({
    location,
    navigate: (to) => {
      window.history.pushState(null, '', to)
      setLocation(getCurrentLocation())
    },
  }), [location])

  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
}

export function Routes({ children }) {
  const { location } = useRouter()
  const routes = Children.toArray(children)
  const exactMatch = routes.find((child) => child.props.path === location.pathname)
  const fallbackMatch = routes.find((child) => child.props.path === '*')

  return exactMatch ? cloneElement(exactMatch) : fallbackMatch ? cloneElement(fallbackMatch) : null
}

export function Route({ element }) {
  return element
}

export function Link({ to, onClick, children, ...props }) {
  const { navigate } = useRouter()

  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event)
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          props.target === '_blank' ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return
        }

        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

export function useLocation() {
  return useRouter().location
}

export function useNavigate() {
  return useRouter().navigate
}

function useRouter() {
  const value = useContext(RouterContext)
  if (!value) {
    throw new Error('Router components must be used within BrowserRouter.')
  }
  return value
}
