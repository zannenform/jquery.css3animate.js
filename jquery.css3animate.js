/**
 * jquery.css3animate.js v1.2.0
 *
 * Copyright 2013 Zannen Form
 * Released under the MIT license
 * 
 * Date: 2013-05-27
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

  // メソッド
  var methods = {
    start : function(elm){
      $(elm).css(vender + 'animation-play-state', 'running');
      return elm;
    }, 
    stop : function(elm){
      $(elm).css(vender + 'animation-play-state', 'paused');
      return elm;
    },
    toggle : function(elm){
      if($(elm).css(vender + 'animation-play-state') == 'running'){
        $(elm).css(vender + 'animation-play-state', 'paused');
      }else{
        $(elm).css(vender + 'animation-play-state', 'running');        
      }
      return elm;
    },
    status : function(elm){
      return $(elm).css(vender + 'animation-play-state');
    }
  }
  
  // jQueryメソッド拡張
  $.fn.extend({
    /**
     * 拡張メソッド
     * @param  arg0  引数from、またはメソッド名が入る。
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

      // メソッド指定の場合はメソッドとして処理する
      if(typeof arguments[0] === 'string'){
        rtn = methods[arguments[0]](target);
        return rtn;
      }

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
        if(options['duration'] != undefined){
          duration = options['duration'] + 'ms';
          rtn = true;
        }
        if(options['fillMode'] != undefined){
          fillMode = options['fillMode'];
          rtn = true;
        }
        if(options['delay'] != undefined){
          delay = options['delay'] + 'ms';
          rtn = true;
        }
        if(options['timingFunction'] != undefined){
          timingFunction = options['timingFunction'];
          switch(timingFunction){
            case 'expo-in':
              timingFunction = 'cubic-bezier(0.71,0.01,0.83,0)';
              break;
            case 'expo-out':
              timingFunction = 'cubic-bezier(0.14,1,0.32,0.99)';
              break;
            case 'expo-in-out':
              timingFunction = 'cubic-bezier(0.85,0,0.15,1)';
              break;
            case 'circ-in':
              timingFunction = 'cubic-bezier(0.34,0,0.96,0.23)';
              break;
            case 'circ-out':
              timingFunction = 'cubic-bezier(0,0.5,0.37,0.98)';
              break;
            case 'circ-in-out':
              timingFunction = 'cubic-bezier(0.88,0.1,0.12,0.9)';
              break;
            case 'sine-in':
              timingFunction = 'cubic-bezier(0.22,0.04,0.36,0)';
              break;
            case 'sine-out':
              timingFunction = 'cubic-bezier(0.04,0,0.5,1)';
              break;
            case 'sine-in-out':
              timingFunction = 'cubic-bezier(0.37,0.01,0.63,1)';
              break;
            case 'quad-in':
              timingFunction = 'cubic-bezier(0.14,0.01,0.49,0)';
              break;
            case 'quad-out':
              timingFunction = 'cubic-bezier(0.01,0,0.43,1)';
              break;
            case 'quad-in-out':
              timingFunction = 'cubic-bezier(0.47,0.04,0.53,0.96)';
              break;
            case 'cubic-in':
              timingFunction = 'cubic-bezier(0.35,0,0.65,0)';
              break;
            case 'cubic-out':
              timingFunction = 'cubic-bezier(0.09,0.25,0.24,1)';
              break;
            case 'cubic-in-out':
              timingFunction = 'cubic-bezier(0.66,0,0.34,1)';
              break;
            case 'quart-in':
              timingFunction = 'cubic-bezier(0.69,0,0.76,0.17)';
              break;
            case 'quart-out':
              timingFunction = 'cubic-bezier(0.26,0.96,0.44,1)';
              break;
            case 'quart-in-out':
              timingFunction = 'cubic-bezier(0.76,0,0.24,1)';
              break;
            case 'quint-in':
              timingFunction = 'cubic-bezier(0.64,0,0.78,0)';
              break;
            case 'quint-out':
              timingFunction = 'cubic-bezier(0.22,1,0.35,1)';
              break;
            case 'quint-in-out':
              timingFunction = 'cubic-bezier(0.9,0,0.1,1)';
              break;            
          }
          rtn = true;
        }
        if(options['iterationCount'] != undefined){
          iterationCount = options['iterationCount'];
          if(typeof iterationCount == 'number'){
            iterationCount = String(iterationCount);
          }
          rtn = true;
        }
        if(options['direction'] != undefined){
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
        // 過去のアニメーションの確認
        for (key in tmpIsAnima) {
          // 過去のスタイルシートを削除する
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
