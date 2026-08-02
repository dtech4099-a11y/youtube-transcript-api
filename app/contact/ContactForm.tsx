"use client";

import { useState, type FormEvent } from "react";

type SubmitState =
  | { status: "idle"; message: string }
  | { status: "loading"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function ContactForm() {
  const [state, setState] = useState<SubmitState>({
    status: "idle",
    message: ""
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "loading", message: "Sending message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company")
        })
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: { message?: string };
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message ?? "Message could not be sent");
      }

      form.reset();
      setState({
        status: "success",
        message: result.message ?? "Message sent successfully."
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Message could not be sent"
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" type="text" placeholder="Your name" required minLength={2} />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        Message
        <textarea name="message" placeholder="How can we help?" rows={6} required minLength={10} />
      </label>
      <label className="honeypot" aria-hidden="true">
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Sending..." : "Send message"}
      </button>
      {state.message ? (
        <p className={`form-status ${state.status}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
