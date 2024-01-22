import {createContext, useContext, useEffect, useState} from "react";

const LdAppContext = createContext();

const LdAppProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dialogNotifications, setDialogNotifications] = useState([]);

  useEffect(() => {
    const user = getUser();
    setIsLoggedIn(user != null && user.id != null && user.login != null && user.email != null && user.token != null);
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  }

  const setUser = (user) => {
    return localStorage.setItem('user', JSON.stringify(user));
  }

  const addNotification = (text) => {
    const notification = {id: Date.now(), text: text};
    setNotifications([...notifications, notification]);
    // setTimeout(() => {
    //   setNotifications(notifications.filter(notification => notification.id !== notification.id));
    // }, 5000);
  };

  const addDialogNotification = (text) => {
    const dialogNotification = {id: Date.now(), text: text};
    setDialogNotifications([...dialogNotifications, dialogNotification]);
    // setTimeout(() => {
    //   setNotifications(notifications.filter(notification => notification.id !== notification.id));
    // }, 5000);
  };

  return (
    <LdAppContext.Provider value={{isLoggedIn, notifications, dialogNotifications,
      handleLogin, handleLogout, getUser, addNotification, addDialogNotification}}>
      {children}
    </LdAppContext.Provider>
  );
};

const useLdAppContext = () => {
  return useContext(LdAppContext);
};

export {LdAppProvider, useLdAppContext};