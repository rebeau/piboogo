//TOKEN
/*
function onResultFcmToken(result) {
  if (true) alert('onResultFcmToken: ' + JSON.stringify(result));
  // window.onResultFcmToken(result);
}
*/
function onResultVoipToken(result) {
  // if (true) alert('onResultVoipToken: ' + JSON.stringify(result));
  // window.onResultVoipToken(result);
}

//PUSH
function onResultForeGroundPush(result) {
  // if (true) alert('onResultForeGroundPush: ' + JSON.stringify(result));
  // window.onResultForeGroundPush(result);
}
function onResultForeGroundPushClick(result) {
  // if (true) alert('onResultForeGroundPushClick: ' + JSON.stringify(result));
  // window.onResultForeGroundPushClick(result);
}
function onResultCallKitAction(result) {
  // if (true) alert('onResultCallKitAction: ' + JSON.stringify(result));
  // window.onResultCallKitAction(result);
}

//PERMISSION
function onResultLocationPermission(result) {
  // if (true) alert('onResultLocationPermission: ' + JSON.stringify(result));
  // window.onResultLocationPermission(result);
}
function onResultCameraPermission(result) {
  // if (true) alert('onResultCameraPermission: ' + JSON.stringify(result));
  // window.onResultCameraPermission(result);
}
function onResultRecordAudioPermission(result) {
  // if (true) alert('onResultRecordAudioPermission: ' + JSON.stringify(result));
  // window.onResultRecordAudioPermission(result);
}
function onResultOverlayPermission(result) {
  // if (true) alert('onResultOverlayPermission: ' + JSON.stringify(result));
  // window.onResultOverlayPermission(result);
}

//SNS
function onResultKakao(result) {
  // if (true) alert('onResultKakao: ' + JSON.stringify(result));
  // window.onResultKakao(result);
}
/*
function onResultGoogle(result) {
  // if (true) alert('onResultGoogle: ' + JSON.stringify(result));
  window.parent.postMessage(
    {
      name: 'webview',
      func: 'onResultGoogle',
      data: result,
    },
    '*',
  );
}
*/
function onResultApple(result) {
  // if (true) alert('onResultApple: ' + JSON.stringify(result));
  // window.onResultApple(result);
}
function onResultKakaoLogout(result) {
  // if (true) alert('onResultKakaoLogout: ' + JSON.stringify(result));
  // window.onResultSnsLogout(result);
}
function onResultGoogleLogout(result) {
  // if (true) alert('onResultGoogleLogout: ' + JSON.stringify(result));
  // window.onResultSnsLogout(result);
}
function onResultAppleLogout(result) {
  // if (true) alert('onResultAppleLogout: ' + JSON.stringify(result));
  // window.onResultSnsLogout(result);
}
function onResultNaverLogout(result) {
  // if (true) alert('onResultNaverLogout: ' + JSON.stringify(result));
  // window.onResultSnsLogout(result);
}
function onResultFacebookLogout(result) {
  // if (true) alert('onResultFacebookLogout: ' + JSON.stringify(result));
  // window.onResultSnsLogout(result);
}

// 안드로이드
function onNativeBackClick(result) {
  // if (true) alert('onNativeBackClick  : ' + JSON.stringify(result));
  // window.onNativeBackClick(result);
}
