/**
 * css3animate ([from,] to [,options] [,complete])
 *  from
 *    Type : PlaneObject
 *    動作開始時のCSSプロパティ
 *  to
 *    Type :  PlaneObject
 *    動作完了時のCSSプロパティ
 *  options
 *    Type : PlaneObject
 *    CSS3 のAnimaionメソッドに定義されたの各種オプション。
 *    duration (default: 400)
 *      Type : Number
 *      animation-durationに相当。msで指定。
 *    fillMode (default: both)
 *      Type : String
 *      animation-fill-modeに相当。
 *    delay (default: 0)
 *      Type : Number
 *      animation-delayに相当。msで指定。
 *    timingFunction (default: ease)
 *      Type : String
 *      animation-timing-functionに相当。
 *    iterationCount (default: 1)
 *      Type : String
 *      animation-iteration-countに相当。
 *    direction (default: normal)
 *      Type : String
 *      animation-directionに相当。
 *  complete
 *    Type : function()
 *    動作完了時に実行されるファンクション
 *    
 */
(function(module) {
  if (typeof define === 'function' && define.amd) {
    // AMD に対応している場合
    define(['jquery'], module);
  } else {
    // AMD 非対応の場合
    module(jQuery);
  }
})(function($) {
  // 初期設定
  var
    // ベンダープレフィックス
    vender = (function(){
      var userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('opera') != -1) {
        return '-o-';
      } else if (userAgent.indexOf('msie') != -1) {
        return '-ms-';
      } else if (userAgent.indexOf('chrome') != -1) {
        return '-webkit-';
      } else if (userAgent.indexOf('safari') != -1) {
        return '-webkit-';
      } else if (userAgent.indexOf('gecko') != -1) {
        return '-moz-';
      } else {
        return '';
      }
    })(),

    styleArr = new Array,
    rulesArr = new Array;

  // jQueryメソッド拡張
  $.fn.extend({
    /**
     * 拡張メソッド
     * @param  arg0  引数fromが入る
     * @param  arg1  引数の省略状況によって、to, options, complete のいずれかが入る
     * @param  arg2  引数の省略状況によって、options, complete のいずれかが入る
     * @param  arg3  引数の省略状況によって、completeが入る
     * @return  メソッドの実行対象となったオブジェクトを返す。チェーン処理可能。
     */
    css3animate : function(arg0, arg1, arg2, arg3) {
      var
        target = this,
        from,
        to,
        duration = '400ms',
        fillMode = 'both',
        delay = '0ms',
        timingFunction = 'ease',
        iterationCount = '1',
        direction = 'normal',
        complete,
        hash = (+new Date());

      /**
       * 引数の設定
       * 引数の省略状況を判断して、適切なパラメーターに代入する
       * @param  arg  css3animateに渡された引数プロパティ
       */
      var setArgment = function(arg){
        var maxLength = arg.length - 1;

        // 指定 to 
        if(maxLength === 0){
          to = arg[0];
          from = setFrom();
          return;
        }

        // 指定 from, to, options, complete
        if(maxLength === 3){
          from = arg[0];
          to = arg[1];
          parseOptions(arg[2]);
          complete = arg[3];
          return;
        }

        // complete の指定がある
        if(typeof arg[maxLength] === 'function'){
          complete = arg[maxLength];
        }

        // 引数が２つ指定されている
        if(maxLength === 1){
          // 指定 to, complete
          if(typeof complete === 'function'){
            to = arg[0];
            from = setFrom();
            return;
          // 指定 to, options
          }else if(parseOptions(arg[1])){
            to = arg[0];
            from = setFrom();
            return; 
          // 指定 from, to
          }else{
            from = arg[0];
            to = arg[1];
            return;
          }
        }

        // 指定 from, to, options
        if(typeof complete !== 'function'){
          from = arg[0];
          to = arg[1];
          parseOptions(arg[2]);
          return;
        }

        // 指定 to, options, complete
        if(parseOptions(arg[1])){
          to = arg[0];
          from = setFrom();
          return; 
        // 指定 from, to, complete
        }else{
          from = arg[0];
          to = arg[1];
          return;
        }
      }


      /**
       * オプションを分解する
       * @param  options  CSS3 のAnimaionメソッドに定義されたの各種オプション
       * @return  boolen  true : 渡されたオブジェクトがoptionsだった場合。  false : optionsではなかった場合。
       */
      var parseOptions = function(options){
        var rtn = false;
        if(options['duration']){
          duration = options['duration'] + 'ms';
          rtn = true;
        }
        if(options['fillMode']){
          fillMode = options['fillMode'];
          rtn = true;
        }
        if(options['delay']){
          delay = options['delay'] + 'ms';
          rtn = true;
        }
        if(options['timingFunction']){
          timingFunction = options['timingFunction'];
          rtn = true;
        }
        if(options['iterationCount']){
          iterationCount = options['iterationCount'];
          if(typeof iterationCount == 'number'){
            iterationCount = String(iterationCount);
          }
          rtn = true;
        }
        if(options['direction']){
          direction = options['direction'];
          rtn = true;
        }
        return rtn;
      }


      /**
       * 省略されたfromパラメータの設定
       * @return  対象オブジェクトのtoに対応する現在のCSSプロパティ
       */
      var setFrom = function(){
        var tmp = new Object;
        for (key in to) {
          tmp[key] = target.css(key);
        }
        return tmp;
      }


      // ルールをスタイルシートとして出力
      var tmpFrom = new Array,
          tmpTo = new Array;
      setArgment(arguments);
      styleElm = document.createElement('style');
      styleElm.type = 'text/css';
      styleElm.media = 'screen';
      $('head')[0].appendChild(styleElm);
      for (key in from) {
        tmpFrom.push(key.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + from[key]);
      }
      for (key in to) {
        tmpTo.push(key.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + to[key]);
      }
      styleElm.appendChild(document.createTextNode('@' + vender + 'keyframes anim_' + hash + '{from{' + tmpFrom.join(';') + '} to{' + tmpTo.join(';') + '}}'));
      styleArr[hash] = styleElm;
      delete tmpFrom, tmpTo;
      
      // 実行アニメーションのハッシュキーを保持する
      var tmpIsAnima = target.data('isAnima');
      if (tmpIsAnima !== undefined) {
        // すでに実行中のアニメーションの確認
        for (key in tmpIsAnima) {
          // 実行中のスタイルシートを削除する
          $(styleArr[tmpIsAnima[key]]).remove();
          target.off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
          target.data('isAnima').splice(key, 1);
        }
        target.data('isAnima').push(hash);
      }else{
        var tmpIsAnima = new Array;
        tmpIsAnima[0] = hash;
        target.data('isAnima', tmpIsAnima);
      }
      delete tmpIsAnima;        

      // アニメーション終了時の処理
      target.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', 
          function(e) {
            e.stopPropagation();
            target.off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');

            // コールバック処理
            if(typeof complete === 'function'){
              complete(e);
            }
            // スタイルシートを削除する
            $(styleArr[hash]).remove();

            // 実行中ハッシュキーを削除
            var tmpIsAnima = target.data('isAnima');
            for(key in tmpIsAnima){
              if(tmpIsAnima[key] == hash){
                target.data('isAnima').splice(key, 1);
              }
            }
          }
      );

      // アニメーションの適用
      var tmpRules = new Object;
      tmpRules[vender + 'animation-duration'] = duration;
      tmpRules[vender + 'animation-fill-mode'] = fillMode;
      tmpRules[vender + 'animation-delay'] = delay;
      tmpRules[vender + 'animation-timing-function'] = timingFunction;
      tmpRules[vender + 'animation-iteration-count'] = iterationCount;
      tmpRules[vender + 'animation-direction'] = direction;
      tmpRules[vender + 'animation-name'] = 'anim_' + hash;
      rulesArr[hash] = tmpRules;
      delete tmpRules;
      target.css(rulesArr[hash]);
      return target;
    }
  });

});
