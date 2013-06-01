/**
 * jquery.css3animate.js v1.3.1
 *
 * Copyright 2013 Zannen Form
 * Released under the MIT license
 * 
 * Date: 2013-06-02
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
    // オプションのデフォルト値
    defaults = {
      'duration': '400ms',
      'fillMode': 'both',
      'delay': '0ms',
      'timingFunction': 'ease',
      'iterationCount': '1',
      'direction': 'normal'
    },
    // タイミングファンクションのプリセット
    timingFuncArr = {
      'expo-in': 'cubic-bezier(0.71,0.01,0.83,0)',
      'expo-out': 'cubic-bezier(0.14,1,0.32,0.99)',
      'expo-in-out': 'cubic-bezier(0.85,0,0.15,1)',
      'circ-in': 'cubic-bezier(0.34,0,0.96,0.23)',
      'circ-out': 'cubic-bezier(0,0.5,0.37,0.98)',
      'circ-in-out': 'cubic-bezier(0.88,0.1,0.12,0.9)',
      'sine-in': 'cubic-bezier(0.22,0.04,0.36,0)',
      'sine-out': 'cubic-bezier(0.04,0,0.5,1)',
      'sine-in-out': 'cubic-bezier(0.37,0.01,0.63,1)',
      'quad-in': 'cubic-bezier(0.14,0.01,0.49,0)',
      'quad-out': 'cubic-bezier(0.01,0,0.43,1)',
      'quad-in-out': 'cubic-bezier(0.47,0.04,0.53,0.96)',
      'cubic-in': 'cubic-bezier(0.35,0,0.65,0)',
      'cubic-out': 'cubic-bezier(0.09,0.25,0.24,1)',
      'cubic-in-out': 'cubic-bezier(0.66,0,0.34,1)',
      'quart-in': 'cubic-bezier(0.69,0,0.76,0.17)',
      'quart-out': 'cubic-bezier(0.26,0.96,0.44,1)',
      'quart-in-out': 'cubic-bezier(0.76,0,0.24,1)',
      'quint-in': 'cubic-bezier(0.64,0,0.78,0)',
      'quint-out': 'cubic-bezier(0.22,1,0.35,1)',
      'quint-in-out': 'cubic-bezier(0.9,0,0.1,1)'
    },
    styleArr = new Array;

  /**
   * 省略されたfromパラメータの設定
   */
  var setFrom = function(that){
    var tmp = new Object;
    var to = that.paramObj['to'];
    var target = that.target;
    for (key in to) {
      tmp[key] = target.css(key);
    }
    that.paramObj['from'] = tmp;
    delete tmp;
  }

  /**
   * オプションを分解する
   */
  var parseOptions = function(that, options){
    var isOption = false;
    
    for(key in options){
      switch(key){
        case 'duration':
          that.optionObj['duration'] = options['duration'] + 'ms';
          isOption = true;
          break;
        case 'fillMode':
          that.optionObj['fillMode'] = options['fillMode'];
          isOption = true;
          break;
        case 'delay':
          that.optionObj['delay'] = options['delay'] + 'ms';
          isOption = true;
          break;
        case 'timingFunction':
          that.optionObj['timingFunction'] = timingFuncArr[options['timingFunction']];
          if(that.optionObj['timingFunction'] == undefined){
            that.optionObj['timingFunction'] = options['timingFunction'];
          }
          isOption = true;
          break;
        case 'iterationCount':
          that.optionObj['iterationCount'] = options['iterationCount'];
          if(typeof that.optionObj['iterationCount'] == 'number'){
            that.optionObj['iterationCount'] = String(that.optionObj['iterationCount']);
          }
          isOption = true;
          break;
        case 'direction':
          that.optionObj['direction'] = options['direction'];
          isOption = true;
          break;
      }
    }
    if(isOption == true){
      that.optionObj = $.extend({}, defaults, that.optionObj);
    }
    return isOption;
  }

  /**
   * 引数の省略状況を判断して、適切なパラメーターに代入する
   */
  var setArgments = function(that){
    var maxLength = that.args.length - 1;

    switch(maxLength){
      case 0:
        // 指定 to 
        that.paramObj['to'] = that.args[0];
        setFrom(that);
        that.optionObj = defaults;
        return;
        break;
      case 1:
        // 指定 to, complete
        if(typeof that.args[maxLength] === 'function'){
          that.paramObj['to'] = that.args[0];
          setFrom(that);
          that.optionObj = defaults;
          that.completeObj = that.args[maxLength];
          return;
        }
        rtn = parseOptions(that, that.args[1]);
        // 指定 to, options
        if(rtn == true){
          that.paramObj['to'] = that.args[0];
          setFrom(that);
          return;
        // 指定 from, to
        }else{
          that.paramObj['from'] = that.args[0];
          that.paramObj['to'] = that.args[1];
          return;
        }
        break;
      case 2:
        // 指定 from, to, options
        if(typeof that.args[maxLength] !== 'function'){
          that.paramObj['from'] = that.args[0];
          that.paramObj['to'] = that.args[1];
          parseOptions(that, that.args[2]);
          return;
        }
        rtn = parseOptions(that, that.args[1]);
        // 指定 to, options, complete
        if(rtn != false){
          that.paramObj['to'] = that.args[0];
          setFrom(that);
          that.completeObj = that.args[maxLength];
          return;
        // 指定 from, to, complete
        }else{
          that.paramObj['from'] = that.args[0];
          that.paramObj['to'] = that.args[1];
          that.completeObj = that.args[maxLength];
          return;
        }
        break;
      case 3:
        // 指定 from, to, options, complete
        that.paramObj['from'] = that.args[0];
        that.paramObj['to'] = that.args[1];
        parseOptions(that, that.args[2]);
        that.completeObj = that.args[3];
        return;
        break;        
    }
  }

  /**
   * アニメーションクラス
   */
  var AnimateClass = function(target, args){
    this.target = target;
    this.hash = (+new Date());
    this.args = args;
    this.paramObj = new Object;
    this.optionObj = new Object;
    this.completeObj = new Object;
  }

  AnimateClass.prototype = {
    // パラメーターをセットする
    setArgments : function(){
      setArgments(this);
    },
    
    // ルールをスタイルシートとして出力する
    setStyle : function(){
      var tmpFrom = new Array,
          tmpTo = new Array;
      styleElm = document.createElement('style');
      styleElm.type = 'text/css';
      styleElm.media = 'screen';
      $('head')[0].appendChild(styleElm);
      for (key in this.paramObj['from']) {
        tmpFrom.push(key.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + this.paramObj['from'][key]);
      }
      for (key in this.paramObj['to']) {
        tmpTo.push(key.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + this.paramObj['to'][key]);
      }
      styleElm.appendChild(document.createTextNode('@' + vender + 'keyframes anim_' + this.hash + '{from{' + tmpFrom.join(';') + '} to{' + tmpTo.join(';') + '}}'));
      styleArr[this.hash] = styleElm;
      delete tmpFrom, tmpTo;
    }
  }


  // メソッド
  var methods = {
    // アニメーションの開始
    start : function(target){
      // paused の場合、再開する
      if($(target).css(vender + 'animation-play-state') == 'paused'){
        $(target).css(vender + 'animation-play-state', 'running');
      }else{
        // アニメーションの適用
        $(target).css($(target).data('animaRules'));
      }
      return target;
    }, 
    // アニメーションの停止
    stop : function(target){
      $(target).css(vender + 'animation-play-state', 'paused');
      return target;
    },
    // アニメーションの停止、開始をトグル
    toggle : function(target){
      if($(target).css(vender + 'animation-play-state') == 'paused'){
        $(target).css(vender + 'animation-play-state', 'running');        
      }else{
        methods['start'](target);
      }
      return target;
    },
    // アニメーションの状態を返す
    status : function(target){
      if($(target).css(vender + 'animation-play-state') == 'paused'){
        return 'paused';
      }
      var tmpIsAnima = $(target).data('isAnima');
      if (tmpIsAnima !== undefined) {
        var tmpAnimaCss = $(target).css(vender + 'animation-name');
        if(tmpAnimaCss == 'anim_' + tmpIsAnima){
          return 'running';
        }
        return 'init';
      }
      return undefined;
    },
    // アニメーションの初期設定
    init : function(target, args){
      var animateClass = new AnimateClass(target, args);

      animateClass.setArgments();
      animateClass.setStyle();

      // 過去のスタイルシートを削除する
      var tmpIsAnima = animateClass.target.data('isAnima');
      if (tmpIsAnima !== undefined) {
        $(styleArr[tmpIsAnima]).remove();
        animateClass.target.off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
      }
      delete tmpIsAnima;
      // 実行アニメーションのハッシュキーを保持する
      animateClass.target.data('isAnima', animateClass.hash);
      
      // アニメーション終了時の処理
      animateClass.target.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', 
        function(e) {
          e.stopPropagation();
          animateClass.target.off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');

          // コールバック処理
          if(typeof animateClass.completeObj === 'function'){
            animateClass.completeObj(e);
          }
        }
      );
      var tmpRules = new Object;
      tmpRules[vender + 'animation-duration'] = animateClass.optionObj['duration'];
      tmpRules[vender + 'animation-fill-mode'] = animateClass.optionObj['fillMode'];
      tmpRules[vender + 'animation-delay'] = animateClass.optionObj['delay'];
      tmpRules[vender + 'animation-timing-function'] = animateClass.optionObj['timingFunction'];
      tmpRules[vender + 'animation-iteration-count'] = animateClass.optionObj['iterationCount'];
      tmpRules[vender + 'animation-direction'] = animateClass.optionObj['direction'];
      tmpRules[vender + 'animation-name'] = 'anim_' + animateClass.hash;
      animateClass.target.data('animaRules', tmpRules);
      delete tmpRules;
      delete animateClass;
      return target;
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
      if(typeof arguments[0] === 'string'){
        var tmpArgs = new Array();
        for(var i=1, ii=0, length=arguments.length; i<length; i++,ii++){
          tmpArgs[ii] = arguments[i];
        }
        return methods[arguments[0]](this, tmpArgs);
      }else{
        methods['init'](this, arguments);
        methods['start'](this);
        return this;
      }
    }
  });
});
