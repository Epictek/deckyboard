import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  staticClasses,
  findModuleChild,
  findInReactTree,
  afterPatch
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip, FaMicrophone } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  return (
    <PanelSection title="Panel Section">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={(e) =>
            showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            )
          }
        >
          Server says yolo
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Router.CloseSideMenus();
            Router.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};




const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Router.NavigateToStore()}>
        Go to Store
      </DialogButton>
    </div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
    const KeyboardManager = findModuleChild((m) => {
      if (typeof m !== "object") return undefined;
      for (let prop in m) {
        if (m[prop]?.VirtualKeyboardManager) return m[prop].VirtualKeyboardManager;
      }
  });
  


  var dictateListening = false;
var state : any;
var injectedButtons = false;

  const KeyboardOpen = (e: boolean) => {

if (injectedButtons){
  console.log( state);

  state.standardLayout.rgLayout[5][1].label = <ActiveIcon/>
}

    if (!e || injectedButtons) return;

      console.log(KeyboardManager);
      let instance = findInReactTree(
        (document.getElementById('root') as any)._reactRootContainer._internalRoot.current,
        (x) => x?.memoizedProps?.className?.startsWith?.('virtualkeyboard_Keyboard'),
      );
      if (instance) {
        console.log(instance);
        console.log(instance.return);
        afterPatch( instance.return.stateNode, 'TypeKeyInternal', (e: any, ret: any) => {
          const key = e[0];
          console.log(key);

          if (key.strKey == "SwitchKeys_Dicate") {
              //start dicatate
              if (!dictateListening) {
                dictateListening = true;
                serverApi.callPluginMethod<any, boolean>("dictation", { "toggle": true });
              state.standardLayout.rgLayout[5][1].label = <ActiveIcon/>;
              serverApi.toaster.toast({
                title: "Listening...",
                body: "Dictation started!"
              });
              } else {
                dictateListening = false;
                serverApi.callPluginMethod<any, boolean>("dictation", { "toggle": false });

                state.standardLayout.rgLayout[5][1].label = <FaMicrophone/>;
                serverApi.toaster.toast({
                  title: "Finished Listening.",
                  body: "Dictation finished!"
                });
              }

          }

          return ret;
        });


        console.log('found', instance);
        state =  instance.return.stateNode.state;
        instance.return.stateNode.state.standardLayout.rgLayout[4].unshift({key: "SwitchKeys_Dicate", label: <FaMicrophone/>, type: 4})
        instance.return.stateNode.state.standardLayout.rgLayout[4].unshift({key: "Control", label: "#Key_Control",  type: 5})

        instance.return.stateNode.state.standardLayout.rgLayout.unshift(["ESC", "F1","F2", "F3", "F4","F5", "F6","F7","F8", "F9","F10","F11", "F12"])

        console.log( instance.return.stateNode.state);
        injectedButtons = true
        return;
      }
  };

  KeyboardManager.IsShowingVirtualKeyboard.m_callbacks.Register(KeyboardOpen)

  


  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
    },
  };
});


const ActiveIcon = () =>  {
  return (
<svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
    <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
        <circle cx="22" cy="22" r="6" stroke-opacity="0">
            <animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="22" cy="22" r="6" stroke-opacity="0">
            <animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="22" cy="22" r="8">
            <animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"/>
        </circle>
    </g>
</svg>
   );
  };