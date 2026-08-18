import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";
import { AdminPage } from "@/admin/AdminPage";
import { CmsProvider } from "@/cms/CmsProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {window.location.pathname.replace(/\/$/, "") === "/admin" ? <AdminPage /> : <CmsProvider><App /></CmsProvider>}
    </QueryClientProvider>
  </React.StrictMode>,
);
