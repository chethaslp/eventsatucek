"use client";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import React from "react";

function Page() {
  return (
    <>
      <Navbar />
      <div className="px-16 py-20   md:px-32 md:py-28 dark:bg-[#0a0a0a]">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Terms and Conditions
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Welcome to Events@UCEK. By using our web application, you agree to
            comply with and be bound by the following terms and conditions.
            Please review the following terms carefully.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Introduction
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Events@UCEK provides a platform for college students to register for
            events happening within the college. We utilize Google
            Authentication for user login and collect necessary personal
            information to facilitate our services.
          </p>

          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Use of Personal Data
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            We use your Personal Data exclusively for the following purposes:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li> Managing and updating college event programs</li>
            <li>Communicating important event-related information to you</li>
          </ul>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Data Privacy and Security
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            We are committed to ensuring the security of your Personal Data. We
            have implemented appropriate technical and organizational measures
            to protect your data from unauthorized access, disclosure,
            alteration, or destruction.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            User Responsibilities
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account or any other breach of security.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Changes to Terms
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account or any other breach of security.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Acceptance of Terms
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account or any other breach of security.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Contact Information
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            If you have any questions about these Terms or our privacy
            practices, please contact us at:{" "}
            <a
              href="mailto:eventsatucek@gmail.com"
              className="text-blue-400 underline"
            >
              eventsatucek@gmail.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Page;
