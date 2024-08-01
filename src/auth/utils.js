import useJwt from "@/auth/jwt/useJwt";
import axios from "@axios";
import ability from "@/libs/acl/ability";
import { configureScope } from "@sentry/vue";
import {
  adminUserAbility,
  loggedInUserAbility,
  trialUserAbility,
  subscribedUserAbility,
  initialAbility,
} from "@/libs/acl/config";
import router from "@/router";

/**
 * This function is used for set auth cookie
 * @param {String} cname Cookie name
 * @param {String} cvalue Cookie value
 * @param {Number} exdays Cookie expiry in days
 */
export const setCookie = (cname, cvalue, exdays = 1) => {
  let cookie = `${cname}=${cvalue};`;
  if (exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    cookie = `${cookie + expires};`;
  }
  cookie += "path=/";
  document.cookie = cookie;
};

/**
 * This function is used for get auth cookie
 * @param {String} cname Cookie name
 */
export const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

/**
 * This function is used for delete auth cookie
 * @param {String} cname Cookie name
 */
export const deleteCookie = (cname) => {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * This function is used for intial logout
 */
export const preLogout = () =>
  new Promise((resolve) => {
    // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
    localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName);
    localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName);

    // Remove userData from localStorage
    localStorage.removeItem("userData");

    // Reset ability
    ability.update(initialAbility);

    // Remove cekBrandInfo from localStorage and sessionStorage
    localStorage.removeItem("cekBrandInfo");
    sessionStorage.removeItem("cekBrandInfo");

    // Remove cekBrand dashboard items
    localStorage.removeItem("dateFilter");
    localStorage.removeItem("competitorList");

    // Remove localStorage that are no longer relevant to the user
    localStorage.removeItem("existInstagramAccount");
    localStorage.removeItem("userConfirmation");
    localStorage.removeItem("userInfo");

    // Remove showSplashScreen from localStorage
    localStorage.removeItem("showSplashScreen");

    // Remove Authorization axios header
    delete axios.defaults.headers.common.Authorization;

    deleteCookie("loginstatus");

    // Remove user from sentry
    resolve(
      configureScope((scope) => {
        scope.clear();
        scope.setUser(null);
      })
    );
  });

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  return Boolean(
    localStorage.getItem("userData") &&
      localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
  );
};

/**
 * Return user data from localStorage
 */
export const getUserData = () =>
  JSON.parse(localStorage.getItem("userData")) || {};

/**
 * Return if user subsription active
 * @param {subscription} subscription Subscription of user
 */
export const isUserSubscribed = (subscription) => {
  if (subscription.status === "active" || subscription.status === "trialing")
    return true;
  return false;
};

/**
 * Return user role
 */
export const getUserRole = () => {
  const { subscriptions, isAdmin } = getUserData();

  if (isAdmin) return "super";

  let role = "public";
  subscriptions.forEach((subscription) => {
    if (subscription.product.id === 1 && isUserSubscribed(subscription)) {
      role = subscription.group.name;
    }
  });

  return role;
};

/**
 * Return if user is verified
 */
// eslint-disable-next-line arrow-body-style
export const isUserVerified = () => {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    const { isVerified } = getUserData();
    return Boolean(isVerified);
  }
  return false;
};

/**
 * Return user ability
 */
export const getUserAbility = () => {
  const userRole = getUserRole();
  const { subscriptions } = getUserData();

  if (userRole === "super") return adminUserAbility;
  if (isUserVerified()) {
    if (userRole !== "public") {
      if (userRole === "trial") return trialUserAbility;
      if (userRole === "paid") {
        for (let i = 0; i < subscriptions.length; i++) {
          // Add additional ability for user paid (6 month and 1 year)
          if (
            subscriptions[i].product.id === 1 &&
            [2, 3].includes(subscriptions[i].plan.id)
          ) {
            return [
              {
                action: "read",
                subject: "Post",
              },
              {
                action: "download",
                subject: "Dashboard",
              },
              ...subscribedUserAbility,
            ];
          }
        }
        return subscribedUserAbility;
      }
      return loggedInUserAbility;
    }
  } else if (isUserLoggedIn()) return loggedInUserAbility;
  return initialAbility;
};

/**
 * Return if user is admin
 */
// eslint-disable-next-line arrow-body-style
export const isUserAdmin = () => {
  const isLoggedIn = isUserLoggedIn();
  const userRole = getUserRole();
  if (isLoggedIn) {
    return userRole === "super";
  }
  return false;
};

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin") return "/";
  if (userRole === "client") return { name: "access-control" };
  return { name: "auth-login" };
};

/**
 * This function is used for intial Single-Sign-On
 * @param {Object} context Context for initial login
 * @param {String} context.action Action is 'login' or 'logout'
 * @param {Object} context.to The target route location in a normalized format being navigated to
 */
export const initSSO = ({ action = "login", to = null }) => {
  let { href } = router.resolve({ name: "auth-login-callback" });
  const redirectURI = encodeURIComponent(
    new URL(href, window.location.origin).href
  );
  href = `${process.env.VUE_APP_WAS_SITE_URL}/#/sso/${action}?redirect_uri=${redirectURI}`;

  if (to) {
    const { route: toRoute } = router.resolve(to);
    const toURI = encodeURIComponent(toRoute.fullPath);
    href = `${href}&to=${toURI}`;
  }

  window.location.replace(href);
};

/**
 * This function is used for logout
 * @param {Object} to The target route location in a normalized format being navigated to
 */
export const logoutSSO = async (to = null) => {
  await preLogout();

  // Redirect to Single-Sign-On page
  initSSO({ action: "logout", to });
};
