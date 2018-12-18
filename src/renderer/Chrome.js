// @flow
import * as React from "react";
import classnames from "classnames";
import { ipcRenderer } from "electron";

import {
  CHROME_MESSAGE,
  type ChromeMessageData,
  CHROME_READY,
  CHROME_RESIZE,
  TAB_UPDATE,
  TAB_FOCUS,
  TAB_NAVIGATE,
} from "../common/events";
import TabBar from "./common/TabBar";
import Tab from "./Tab";
import BrowserControls from "./BrowserControls";

import "./Chrome.css";

export default class Chrome extends React.Component<{}> {
  tabs: Array<Tab> = [];
  activeTab: ?Tab;

  componentDidMount() {
    ipcRenderer.on(CHROME_MESSAGE, this.handleChromeMessage);
    this.sendChromeMessage(CHROME_RESIZE, {
      top: (document.body: any).scrollHeight,
    });
    this.sendChromeMessage(CHROME_READY);
  }

  componentWillUnmont() {
    ipcRenderer.removeListener(CHROME_MESSAGE, this.handleChromeMessage);
  }

  render() {
    const activeTab = this.activeTab || new Tab("null");
    return (
      <div className="Chrome__controls">
        <BrowserControls
          url={activeTab.url}
          loading={activeTab.loadFraction < 1}
          canNavigateBack={activeTab.canNavigateBack}
          canNavigateForward={activeTab.canNavigateForward}
          onChangeUrl={this.handleChangeUrl}
          onNavigateBack={this.handleBack}
          onNavigateForward={this.handleForward}
          onRefresh={this.handleRefresh}
          onStop={this.handleStop}
        />
        <TabBar>
          {this.tabs.map(tab => (
            <TabBar.Tab key={tab.id} active={tab === this.activeTab}>
              {tab.title || "Loading..."}
            </TabBar.Tab>
          ))}
          <TabBar.Tab className="Chrome__newTabButton">+</TabBar.Tab>
        </TabBar>
      </div>
    );
  }

  sendChromeMessage(type: string, payload?: any) {
    ipcRenderer.send(CHROME_MESSAGE, { type, payload });
  }

  handleChangeUrl = (url: string) => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_UPDATE, { id: this.activeTab.id, url });
  };

  handleBack = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, offset: -1 });
  };

  handleForward = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, offset: 1 });
  };

  handleRefresh = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, offset: 0 });
  };

  handleStop = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, stop: true });
  };

  handleChromeMessage = (event: string, data: ChromeMessageData) => {
    if (data.type === TAB_UPDATE) {
      this.handleTabUpdate(data.payload);
    } else if (data.type === TAB_FOCUS) {
      this.handleTabFocus(data.payload);
    }
  };

  handleTabUpdate(data: any) {
    let tab = this.tabs.find(t => t.id === data.id);
    if (!tab) {
      tab = new Tab(data.id);
      this.tabs.push(tab);
    }
    tab.update(data);
    this.forceUpdate();
  }

  handleTabFocus(data: any) {
    this.activeTab = this.tabs.find(t => data.id === t.id);
    this.forceUpdate();
  }
}
