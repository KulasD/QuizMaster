/** @format */

//import {Navigation} from "react-native-navigation";
//import App from './App';

//
//Navigation.events().registerAppLaunchedListener(() => {
//  Navigation.setRoot({
//    root: {
//      component: {
//        name: "navigation.playground.WelcomeScreen"
//      }
//    }
//  });
//});

import {Navigation} from "react-native-navigation";
import {registerScreens} from './screens';
import {Dimensions} from "react-native"
const { width } = Dimensions.get('window');
registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setDefaultOptions({
      topBar: {
        elevation: 0,
        visible: true,
        drawBehind: false,
        animate: false,
        buttonColor: '#494949',
        title: {
          color: '#494949',
          alignment: 'center'
        },
        background: {
          color: 'transparent'
        }
      }
    });
    Navigation.setRoot({
      root: {
        sideMenu: {
          left: {
            component: {
              id: 'drawerId',
              name: 'Drawer',
              fixedWidth: width
            }
          },
          center: {
            stack: {
              id: 'MAIN_STACK',
              children: [
                {
                  component: {
                    name: 'MainScreen',
                    options: {
                      topBar: {
                        title: {
                          text: "MainScreen"
                        }
                      }
                    }
                  }
                },
              ]
            }
          }
        },
      }
    });
});



//  Navigation.setRoot({
//    root: {
//      stack: {
//        id: 'AppStack',
//        children: [
//          {
//            component: {
//              name: 'MainScreen',
//              options: {
//                topBar: {
//                  title:
//                  {
//                    text: "MainScreen"
//                  }
//                }
//              }
//            }
//          }
//        ]
//      }
//    }
//  });
//});
