"use client";
import LoginPage from "@/components/login";
import { MultiStepSignUp } from "@/components/multiStepSignUp/multiStepSignUp";
import SignUp from "@/components/sign-up";
import React from "react";

const RegisterPage = () => {
  return (
    <div className=" ">
      <MultiStepSignUp />
    </div>
  );
};

export default RegisterPage;
