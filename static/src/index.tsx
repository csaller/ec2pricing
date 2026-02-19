import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import Layout from "./Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import InstanceView from "./pages/InstanceView";
import FamilyView from "./pages/FamilyView";
import "./styles/global.css";

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/:region/:family/:size" component={InstanceView} />
      <Route path="/:region/:family" component={FamilyView} />
      <Route path="*404" component={NotFound} />
    </Router>
  ),
  document.getElementById("app")!
);
