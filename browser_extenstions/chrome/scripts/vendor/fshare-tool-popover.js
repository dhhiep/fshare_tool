(function ($) {
  'use strict';
  var defaults = {
    //public options
    trigger: 'hover', //触发方式，'hover','click','focus'
    autoPlace: true, //自动放置，防止内容遮挡
    delay: 10, //显示隐藏延时
    placement: 'top', //放置偏好，'top',    'topLeft',    'topRight',
    // 'right',  'rightTop',   'rightBottom',
    // 'bottom', 'bottomLeft', 'bottomRight',
    // 'left',   'leftTop',    'leftBottom'
    //private options
    title: '',
    content: '',
  };

  var FshareToolPopover = function (element, options) {
    this.ele = $(element);
    this.wrapper = null;
    this.product = null;
    this.pid = 'fshare-tool-popover_' + new Date().getTime();
    this.timer_in = null;
    this.timer_out = null;
    this.mouse = false;
    //允许放置的方位名称
    this.posMap = [
      'topLeft',
      'top',
      'topRight',
      'rightTop',
      'right',
      'rightBottom',
      'bottomLeft',
      'bottom',
      'bottomRight',
      'leftTop',
      'left',
      'leftBottom',
    ];
    this.posId = 1; //默认偏好放置索引
    this.opts = $.extend({}, defaults, options);
    for (var i = this.posMap.length - 1; i >= 0; i--) {
      if (this.opts.placement === this.posMap[i]) {
        this.posId = i;
        break;
      }
    }
    this.init();
  };
  //初始化
  FshareToolPopover.prototype.init = function () {
    this.bind();
  };
  //渲染
  FshareToolPopover.prototype.render = function () {
    var _this = this,
      _html,
      _pid = this.pid,
      _content,
      _container = $(document.body);
    if (typeof _this.opts.content == 'function') {
      _content = _this.opts.content.call(this);
    } else if (typeof _this.opts.content == 'object') {
      _content = $(_this.opts.content).html();
    } else {
      _content = _this.opts.content;
    }
    _html =
      '<div>' +
      '<div class="fshare-tool-popover" id="' +
      _pid +
      '">' +
      '<div class="fshare-tool-popover-container">' +
      '<div class="fshare-tool-popover-inner">' +
      '<div class="fshare-tool-popover-title">' +
      _this.opts.title +
      '</div>' +
      '<div class="fshare-tool-popover-content">' +
      _content +
      '</div>' +
      '</div>' +
      '<div class="fshare-tool-popover-arrow"></div>' +
      '</div>' +
      '</div>' +
      '</div>';
    _container.append(_html);
    _this.product = $('#' + _pid); //渲染产品
    _this.wrapper = _this.product.parent('div'); //获取包裹容器
    this.place();
  };
  //放置
  FshareToolPopover.prototype.place = function () {
    var _this = this,
      _result, //最终输出的放置方案
      _plan = [], //自动优化放置后的可选方案
      _trigger = this.ele,
      _targets = this.wrapper,
      _product = this.product,
      _container = $(window),
      _gutter = 8;
    var _t = {
      x: _trigger.offset().left,
      y: _trigger.offset().top,
      w: _trigger.outerWidth(),
      h: _trigger.outerHeight(),
    }; //触发器的规格
    var _v = {
      x: _container.scrollLeft(),
      y: _container.scrollTop(),
      w: _container.outerWidth(true),
      h: _container.outerHeight(true),
    }; //视图容器的规格
    var _p = {
      w: _product.outerWidth(true),
      h: _product.outerHeight(true),
    }; //待放置物的规格
    //计算所有放置方案
    //所有宽度
    var _W_ = {
      w1: _v.w - (_t.x - _v.x), //t-l,b-l
      w2: _v.w - (_t.x - _v.x) - _t.w, //r-tcb
      w3: _t.x - _v.x + _t.w, //t-r,b-r
      w4: _t.x - _v.x, //l-tcb
      w5: (Math.min(_t.x - _v.x, _v.w - _t.w - _t.x + _v.x) + _t.w / 2) * 2, //t-c,b-c
    };
    //所有高度
    var _H_ = {
      h1: _t.y - _v.y, //t-lcr
      h2: _v.h - (_t.x - _v.x), //l-t,r-t
      h3: _v.h - (_t.y - _v.y) - _t.h, //b-lcr
      h4: _t.y - _v.y + _t.h, //l-b,r-b
      h5: (Math.min(_t.y - _v.y, _v.h - _t.h - _t.y + _v.y) + _t.h / 2) * 2, //l-c,r-c
    };
    //所有top
    var _T_ = {
      t1: _t.y - _p.h, //t-lcr
      t2: _t.y - _gutter, //l-t,r-t
      t3: _t.y + _t.h, //b-lcr
      t4: _t.y + _t.h - _p.h + _gutter, //l-b,r-b
      t5: _t.y + (_t.h - _p.h) / 2, //l-c,r-c
    };
    //所有left
    var _L_ = {
      l1: _t.x - _gutter, //t-l,b-l
      l2: _t.x + _t.w, //r-tcb
      l3: _t.x + _t.w - _p.w + _gutter, //t-r,b-r
      l4: _t.x - _p.w, //l-tcb
      l5: _t.x + (_t.w - _p.w) / 2, //t-c,b-c
    };
    //所有区域参数
    var _area = [
      {
        name: 'topLeft',
        width: _W_.w1,
        height: _H_.h1,
        top: _T_.t1,
        left: _L_.l1,
      },
      {
        name: 'top',
        width: _W_.w5,
        height: _H_.h1,
        top: _T_.t1,
        left: _L_.l5,
      },
      {
        name: 'topRight',
        width: _W_.w3,
        height: _H_.h1,
        top: _T_.t1,
        left: _L_.l3,
      },
      {
        name: 'rightTop',
        width: _W_.w2,
        height: _H_.h2,
        top: _T_.t2,
        left: _L_.l2,
      },
      {
        name: 'right',
        width: _W_.w2,
        height: _H_.h5,
        top: _T_.t5,
        left: _L_.l2,
      },
      {
        name: 'rightBottom',
        width: _W_.w2,
        height: _H_.h4,
        top: _T_.t4,
        left: _L_.l2,
      },
      {
        name: 'bottomLeft',
        width: _W_.w1,
        height: _H_.h3,
        top: _T_.t3,
        left: _L_.l1,
      },
      {
        name: 'bottom',
        width: _W_.w5,
        height: _H_.h3,
        top: _T_.t3,
        left: _L_.l5,
      },
      {
        name: 'bottomRight',
        width: _W_.w3,
        height: _H_.h3,
        top: _T_.t3,
        left: _L_.l3,
      },
      {
        name: 'leftTop',
        width: _W_.w4,
        height: _H_.h2,
        top: _T_.t2,
        left: _L_.l4,
      },
      {
        name: 'left',
        width: _W_.w4,
        height: _H_.h5,
        top: _T_.t5,
        left: _L_.l4,
      },
      {
        name: 'leftBottom',
        width: _W_.w4,
        height: _H_.h4,
        top: _T_.t4,
        left: _L_.l4,
      },
    ];
    $.each(_area, function (i, res) {
      //筛选所有符合放置的方案
      if (res.width >= _p.w && res.height >= _p.h) {
        _plan.push(res);
      }
    });
    if (_this.opts.autoPlace) {
      if (_plan.length) {
        //启用自动优化放置方案
        _result = _plan[0];
        for (var i = _plan.length - 1; i >= 0; i--) {
          if (_plan[i].name === _this.opts.placement) {
            _result = _plan[i]; //找到一条既符合优化放置，又符合用户规定的方案
            break;
          }
        }
      } else {
        //没有找到符合优化放置方案，选择默认偏好放置
        _result = _area[_this.posId];
      }
    } else {
      //不启用自动优化放置方案，选择默认偏好放置
      _result = _area[_this.posId];
    }
    _targets.css({
      position: 'absolute',
      top: _result.top + 'px',
      left: _result.left + 'px',
    });
    _product.addClass('fshare-tool-popover-' + _result.name);
    //为渲染的产品绑定事件
    _targets.mouseenter(function () {
      _this.show();
    });
    if (_this.opts.trigger !== 'click' && _this.opts.trigger !== 'focus') {
      _targets.mouseleave(function () {
        _this.destroy();
      });
    }
  };
  //绑定事件
  FshareToolPopover.prototype.bind = function () {
    var _this = this,
      _trigger = this.opts.trigger,
      _element = $(this.ele);
    switch (_trigger) {
      case 'click':
        _element.on('click', function (e) {
          e.stopPropagation();
          _this.product = $('#' + _this.pid);
          if (!_this.product.length) {
            _this.mouse = false;
            _this.show();
          } else {
            _this.destroy();
          }
        });
        $(document).on('click', function (e) {
          var _trigger = $(e.target);
          if (!_trigger.closest('.fshare-tool-popover').length) {
            $('.fshare-tool-popover').parent('div').remove();
          }
        });
        break;
      case 'focus':
        _element.on({
          focus: function () {
            _this.product = $('#' + _this.pid);
            if (!_this.product.length) {
              _this.mouse = false;
              _this.show();
            }
          },
          blur: function () {
            _this.product = $('#' + _this.pid);
            if (_this.product.length) {
              _this.destroy();
            }
          },
        });
        break;
      default:
        _element.hover(
          function () {
            _this.show();
          },
          function () {
            _this.destroy();
          }
        );
    }
  };
  //显示
  FshareToolPopover.prototype.show = function () {
    var _this = this;
    window.clearTimeout(_this.timer_out);
    if (!_this.mouse) {
      _this.timer_in = window.setTimeout(function () {
        _this.mouse = true;
        _this.render();
      }, _this.opts.delay);
    }
  };
  //销毁
  FshareToolPopover.prototype.destroy = function () {
    var _this = this;
    window.clearTimeout(_this.timer_in);
    _this.timer_out = window.setTimeout(function () {
      _this.mouse = false;
      $('.fshare-tool-popover').parent('div').remove();
      _this.product = null;
    }, _this.opts.delay);
  };
  $.fn.fshareToolPopover = function (options) {
    var _this = this;
    return _this.each(function () {
      return new FshareToolPopover(this, options);
    });
  };
})(jQuery);
