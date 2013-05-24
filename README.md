# jquery.css3animate.js

CSS3 アニメーションを動的に操作するための jQuery プラグインです。

## クイックスタート

1.jquery 読み込みの後に、jquery.css3animate.js を読み込んでください。

    <script type="text/javascript" src="js/jquery.css3animate.js"></script>

2.ドキュメントの読み込みが完了したら、アニメーションを適用したいオブジェクトにメソッドを適用してください。

    $(window).ready(function(){
    $(selector).css3animate ({top : '100px'}, {duration : 1000});
    });


## パラメーター

css3animate ([from,] to [,options] [,complete])

1. from  
Type : PlaneObject  
動作開始時のCSSプロパティを指定。  
省略した場合、現在のプロパティを利用します。  
ex) {top : '100px', left : '200px'}  

2. to  
Type :  PlaneObject  
動作完了時のCSSプロパティを指定。  
省略不可ですが、空のオブジェクト`{}`を指定することで、completeファンクションを実行させることができます。  
ex) {top : '200px', left : '500px', backgroundColor : '#00f'}  

3. options  
Type : PlaneObject  
CSS3 のAnimaionメソッドに定義されたの各種オプションを指定。  
省略した場合、デフォルト値を利用します。  
ex) {duration : 1000}  

4. complete  
Type : function()  
動作完了時に実行されるファンクション。引数としてイベントオブジェクトを取得可能です。  
省略可能です。  
ex) function(event){$(event.target)).hide();}  


### options
* duration (default: 400)  
Type : Number  
CSS3 アニメーションの animation-durationに相当。単位は ms。  

* fillMode (default: both)  
Type : String  
CSS3 アニメーションの animation-fill-modeに相当。  

* delay (default: 0)  
Type : Number  
CSS3 アニメーションの animation-delayに相当。単位は ms。  

* timingFunction (default: ease)  
Type : String  
CSS3 アニメーションの animation-timing-functionに相当。
独自プリセットあり。

* iterationCount (default: 1)  
Type : String, Number  
CSS3 アニメーションの animation-iteration-countに相当。  

* direction (default: normal)  
Type : String  
CSS3 アニメーションの animation-directionに相当。  


### timingFunction のプリセット
* ease
* ease-in
* ease-out
* ease-in-out
* linear
* expo-in
* expo-out
* expo-in-out
* circ-in
* circ-out
* circ-in-out
* sine-in
* sine-out
* sine-in-out
* quad-in
* quad-out
* quad-in-out
* cubic-in
* cubic-out
* cubic-in-out
* quart-in
* quart-out
* quart-in-out
* quint-in
* quint-out
* quint-in-out


## ライセンス

MIT ライセンスです。

