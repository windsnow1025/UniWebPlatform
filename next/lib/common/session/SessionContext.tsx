import * as React from 'react';

export interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user?: SessionUser;
}

export interface Authentication {
  signIn: () => void;
  signOut: () => void;
}

const SessionContext = React.createContext<Session | null>(null);
const AuthenticationContext = React.createContext<Authentication | null>(null);

export function useSession(): Session | null {
  return React.useContext(SessionContext);
}

export function useAuthentication(): Authentication | null {
  return React.useContext(AuthenticationContext);
}

interface SessionProviderProps {
  session: Session | null;
  authentication: Authentication;
  children: React.ReactNode;
}

export function SessionProvider({ session, authentication, children }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      <AuthenticationContext.Provider value={authentication}>
        {children}
      </AuthenticationContext.Provider>
    </SessionContext.Provider>
  );
}
