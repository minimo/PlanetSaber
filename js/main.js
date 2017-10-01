/*
 *  main.js
 *  2016/12/28
 *  @auther minimo  
 *  This Program is MIT license.
 */

//インスタンス
var app;

window.onload = function() {
    app = qft.Application();
    app.replaceScene(TitleScene());
    app.run();
};
