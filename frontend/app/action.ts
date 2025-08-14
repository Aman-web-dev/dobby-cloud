import { createSession } from "./lib/session";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { redirect, RedirectType } from "next/navigation";
import { deleteSession } from "./lib/session";
export const handleSignup = async (
  email: string,
  password: string,
  name: string
) => {
  const signupResp = await axios
    .post("http://localhost:9000/api/v1/auth/signup", {
      name,
      email,
      password,
    })
    .then(function (response) {
      alert("Signup Successfull proceed to login");
      console.log(response);
    })
    .catch(function (error) {
      alert("Signup UnSuccessfull Try Again");
      console.log(error);
    });
};

export const handleLogin = async (
  email: string,
  password: string,
  router: any
) => {
  const userLogin = axios
    .post("http://localhost:9000/api/v1/auth/login", {
      email,
      password,
    })
    .then(async (resp) => {
      const { id, email } = resp.data.data.user;
      const { token } = resp.data;
      createSession(id, email, token);
      console.log(id, email, token)
      router.push("/");
      return;
    })
    .catch((err) => {
      alert(err);
      return false;
    });
};

export const handleLogOut = (router:any) => {
  deleteSession();
  router.push('/auth')
};
