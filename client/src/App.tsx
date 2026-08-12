import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";

const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const Directory = lazy(() => import("./pages/Directory"));
const Home = lazy(() => import("./pages/Home"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const Tracker = lazy(() => import("./pages/Tracker"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Switch>
      <Route path={"/programs/:slug"} component={ProgramDetails} />
      <Route>
        <DashboardLayout><Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/programs"} component={Directory} />
          <Route path={"/applications"} component={Tracker} />
          <Route path={"/calendar"} component={CalendarPage} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch></DashboardLayout>
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<div className="content-frame py-20 text-center text-sm font-medium text-slate-500">Loading workspace…</div>}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
