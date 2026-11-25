import { createContext, useContext, useState, useEffect, Children, type ReactNode, type ReactElement } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: window.location.pathname || '/',
  navigate: () => {},
});

export const BrowserRouter = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useLocation = () => {
  const { path } = useContext(RouterContext);
  return { pathname: path };
};

interface RouteProps {
  path: string;
  element: ReactNode;
}

export const Route = ({ element }: RouteProps) => {
  return <>{element}</>;
};

export const Routes = ({ children }: { children: ReactNode }) => {
  const { path } = useContext(RouterContext);
  const childrenArray = Children.toArray(children) as ReactElement<RouteProps>[];

  // Find exact match first
  for (const child of childrenArray) {
    if (child.props.path === path) {
      return child;
    }
  }

  // Find wildcard match '*'
  for (const child of childrenArray) {
    if (child.props.path === '*') {
      return child;
    }
  }

  return null;
};

export const Navigate = ({ to }: { to: string; replace?: boolean }) => {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to);
  }, [to, navigate]);
  return null;
};
