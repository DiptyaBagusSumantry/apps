<template />

<script>
import store from "@/store/index";
import { setCookie, preLogout, initSSO } from "@/auth/utils";
import { useRouter } from "@core/utils/utils";

export default {
  setup() {
    const { router } = useRouter();
    const {
      session_token: sessionToken,
      session_expiry: sessionExpiry,
      to,
    } = router.currentRoute.query;
    console.log(router.currentRoute.query)
    store
      .dispatch("auth/loginSSO", sessionToken)
      .then(async (data) => {
        setCookie("loginstatus", "loggedin", sessionExpiry);

        await store.dispatch("auth/updateUserAbility");

        // Navigate User to homepage
        router.push(to || "/");
      })
      .catch(async (error) => {
        console.log("error LOGIN", error);
        if (error.response) {
          await preLogout();

          // Redirect to Single-Sign-On page
          initSSO({ action: "login" });
        }
      });
  },
};
</script>
