// @flow
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Helmet from "react-helmet";

import { appName } from "common/config";
import * as urls from "common/urls";

import {
  WelcomePage,
  PagesListPage,
  SearchPage,
  FourOhFourPage,
} from "./content";

const CollectionBrowser = () => (
  <Router basename="/html/">
    <div>
      <Helmet defaultTitle={appName}>
        <body className="has-background-white" />
      </Helmet>
      <Switch>
        <Route exact path={urls.welcomeUrl} component={WelcomePage} />
        <Route exact path={urls.allPagesUrl} component={PagesListPage} />
        <Route path={urls.searchUrl()} component={SearchPage} />
        <Route component={FourOhFourPage} />
      </Switch>
    </div>
  </Router>
);

export default CollectionBrowser;
