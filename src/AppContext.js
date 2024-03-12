import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [activeUsers, setActiveUsers] = useState(0);
    const [activeScouts, setActiveScouts] = useState(0);

    // Any other shared state could go here

    const value = {
        activeUsers,
        setActiveUsers,
        activeScouts,
        setActiveScouts,
        // Any other shared values or functions
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
