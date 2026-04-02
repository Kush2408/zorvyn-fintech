import React, { createContext, useContext, useState } from 'react';

export type Role = 'viewer' | 'admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType>({ role: 'admin', setRole: () => {} });

export const useRole = () => useContext(RoleContext);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem('zorvyn-role');
    return (saved === 'viewer' || saved === 'admin') ? saved : 'admin';
  });

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem('zorvyn-role', r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
