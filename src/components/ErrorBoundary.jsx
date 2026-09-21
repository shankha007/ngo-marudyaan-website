import { Component } from "react";
import { site } from "../data/site";

/* Last line of defence: if any page throws while rendering, show a short
   bilingual message with a way home instead of a blank white screen. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Page crashed:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-oasis-900">
          Something went wrong
          <span className="mt-1 block text-2xl">কিছু একটা গোলমাল হয়েছে</span>
        </h1>
        <p className="mt-4 max-w-md text-oasis-800/70">
          Please go back to the home page. If this keeps happening, write to us at{" "}
          <a className="font-semibold text-oasis-700 underline" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
          .
        </p>
        <a
          href="/"
          className="mt-8 rounded-full bg-oasis-700 px-7 py-3.5 font-semibold text-white transition hover:bg-oasis-600"
        >
          Home / হোম
        </a>
      </div>
    );
  }
}
