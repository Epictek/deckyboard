import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  findModuleChild,
  findInReactTree,
  beforePatch,
  unpatch
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip, FaMicrophone } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  return (
    <PanelSection title="Panel Section">
      <PanelSectionRow>
      </PanelSectionRow>
    </PanelSection>
  );
};


var settings = {
  FKeys: true,
  Dictation: true,
  CtrlKey: true
} 


export default definePlugin((serverApi: ServerAPI) => {
    const KeyboardManager = findModuleChild((m) => {
      if (typeof m !== "object") return undefined;
      for (let prop in m) {
        if (m[prop]?.VirtualKeyboardManager) return m[prop].VirtualKeyboardManager;
      }
  });
  
  var dictateListening = false;
  var hasInjectedButtons = false;
  var KeyboardRoot: any;


  const KeyboardOpen = (e: boolean) => {
    if (!e) return;

      let instance = findInReactTree(
        (document.getElementById('root') as any)._reactRootContainer._internalRoot.current,
        (x) => x?.memoizedProps?.className?.startsWith?.('virtualkeyboard_Keyboard'),
      );
      if (instance) {
        KeyboardRoot = instance.return;
        console.log(KeyboardRoot)
        beforePatch( KeyboardRoot.stateNode, 'TypeKeyInternal', (e: any[]) => {
          console.log(KeyboardRoot)

          const key = e[0];
          if (settings.Dictation){
            if (key.strKey == "SwitchKeys_Dicate") {
                if (!dictateListening) {
                  dictateListening = true;
                  serverApi.fetchNoCors('http://localhost:9000/hooks/start-dictate')
                    .then((data) => console.log(data));
                    KeyboardRoot.stateNode.state.standardLayout.rgLayout[5][1].label = <ActiveIcon/>;
                  serverApi.toaster.toast({
                    title: "Listening...",
                    body: "Dictation started!"
                  });
                } else {
                  dictateListening = false;
                  serverApi.fetchNoCors('http://localhost:9000/hooks/end-dictate')
                    .then((data) => console.log(data));
                    KeyboardRoot.stateNode.state.standardLayout.rgLayout[5][1].label = <FaMicrophone/>;
                  serverApi.toaster.toast({
                    title: "Finished Listening.",
                    body: "Dictation finished!"
                  });
                }
              }
          }

          return KeyboardRoot.stateNode;
        });
        console.log(KeyboardRoot)
        if (hasInjectedButtons) return;
	hasInjectedButtons = true
        if (settings.Dictation){
          KeyboardRoot.stateNode.state.standardLayout.rgLayout[4].unshift({key: "SwitchKeys_Dicate", label: <FaMicrophone/>, type: 4})
        }
        if (settings.CtrlKey){
          KeyboardRoot.stateNode.state.standardLayout.rgLayout[4].unshift({key: "Control", label: "#Key_Control",  type: 5})
        }
        if (settings.FKeys){
          KeyboardRoot.stateNode.state.standardLayout.rgLayout.unshift(["ESC", "F1","F2", "F3", "F4","F5", "F6","F7","F8", "F9","F10","F11", "F12"])
        }
        return;
      }
  };

  KeyboardManager.IsShowingVirtualKeyboard.m_callbacks.Register(KeyboardOpen)

  return {
    title: <div className={staticClasses.Title}>DeckyBoard</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
        console.log("unmount")
        unpatch(KeyboardRoot.stateNode, 'TypeKeyInternal')
    },
  };
});


const ActiveIcon = () =>  {
  //By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL
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
