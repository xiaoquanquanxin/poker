//  通用方法
var forEach = Array.prototype.forEach;
var push = Array.prototype.push;
var indexOf = Array.prototype.indexOf;
var wrapper = document.getElementById("wrapper");
//  主要
var rightList = document.getElementById('rightList');
//  列主要
//    var rightContentList = rightList.getElementsByClassName("rightContentList");
//  左侧牌堆主要
var leftHeapList = document.getElementsByClassName("stack");

//  创造卡牌
function Card(wrapper) {
    this.el = wrapper;
    this.leftContent = null;            //  左侧牌堆主要
    this.rightContent = null;           //  右侧牌堆目标
    this.countContent = null;           //  主牌位
    this.stack = null;                  //  左侧牌堆
    this.show = null;                   //  左侧牌堆当前
    this.allPokerList = [];                 //  全部扑克牌
    this.rightContentList = [];             //  扑克牌的位置
    this.rightPokersList = [];              //  右侧主要牌堆

    this.leftHeapList = [];             //  左侧主要牌堆
    this.leftShowList = [];             //  左侧可用牌堆
    this.init()
}

Card.prototype = {
    constructor: Card,
    rightIndex: 0,                  //  扑克牌的计数
    _type: ['spade', 'heart', 'club', 'diamond'],
    _num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    _svgBackground: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="152" rx="5" ry="5" fill-opacity="0" stroke="#5fbcff" stroke-width="1" stroke-opacity="0.8"/><rect x="7" y="7" width="86" height="148" rx="3" ry="3" fill="blue" stroke="#5fbcff" stroke-width="1" fill-opacity="0.05" stroke-opacity="0.8"/></svg>',
    _svgPosition: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><rect x="12.5" y="42.5" rx="100%" ry="100%" width="75" height="75" fill="whitesmoke"/><rect x="10" y="40" rx="100%" ry="100%" width="80" height="80" fill-opacity="0" stroke="lightpink" stroke-width="5"/><line x1="80" y1="50" x2="20" y2="110" stroke="lightpink" stroke-width="5"/></svg>',
    init: function () {
        //  造左侧
        this.createLeftHeap();
        //  创造右侧
        this.createRightContent();
        // return
        //  创造计数,分数,牌堆情况
        this.createCountContent();

        //  卡牌相关
        this.createCard();
    },
    //  创造左侧
    createLeftHeap: function () {
        var div = document.createElement("div");
        div.className = 'left';
        this.stack = document.createElement('div');
        this.stack.innerHTML = this._svgPosition;
        this.stack.className = 'stack';
        div.appendChild(this.stack);
        this.show = document.createElement('div');
        this.show.className = 'show';
        this.show.innerHTML = this._svgPosition;
        div.appendChild(this.show);
        this.leftContent = div;
        this.el.appendChild(this.leftContent);
    },
    //  创造右侧
    createRightContent: function () {
        var div = document.createElement('div');
        div.className = 'right';
        var ul = document.createElement("ul");
        for (var i = 0; i < this._type.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('_type', this._type[i]);
            var _div = document.createElement('div');
            _div.className = 'rightContent ' + this._type[i] + ' ' + ((i % 2) ? 'red' : 'black');
            _div.setAttribute('num', this._type[i]);
            this.turnFront(_div);
            li.appendChild(_div);
            ul.appendChild(li);
        }
        div.appendChild(ul);
        this.rightContent = div;
        this.el.appendChild(this.rightContent)
    },
    //  创造计数,分数,牌堆情况
    createCountContent: function () {
        var ul = document.createElement('ul');
        ul.className = 'content';
        ul.id = 'rightList';
        this.countContent = ul;
        this.el.appendChild(this.countContent);
        //  造位置
        for (var i = 0; i < 7; i++) {
            var li = document.createElement("li");
            li.innerHTML = this._svgPosition;
            var div = document.createElement("div");
            div.className = 'rightContentList';
            this.rightContentList.push(div);
            li.appendChild(div);
            div.setAttribute('count', (i + 1).toString());
            this.countContent.appendChild(li);
        }
    },
    //  卡牌相关
    createCard: function () {
        this.generateCard();
        //  排序
        this.sortCard();
        //  发牌
        this.putCard();
        //  创造牌堆
        this.setCardHeap();
        //  绑定卡牌事件
        this.bindEvent();
    },
    //  造卡牌,默认全反面
    generateCard: function () {
        for (var i = 0; i < this._type.length; i++) {
            for (var j = 0; j < this._num.length; j++) {
                var div = document.createElement("div");
                div.className = 'card ' + this._type[i] + ' ' + ((i % 2) ? 'red' : 'black');
                div.setAttribute('num', this._num[j]);
                div.setAttribute('status', 'back');
                div.setAttribute('type', this._type[i]);
                div.innerHTML = this._svgBackground;
//                    this.turnFront(div)
                div.setAttribute('random', parseInt(Math.random() * 2000).toString());
                this.allPokerList.push(div);
            }
        }
    },
    //  卡牌变成正面的样式变化
    turnFront: function (div) {
        div.innerHTML = '';
        var num = document.createElement('span');
        num.innerHTML = div.getAttribute('num');
        div.appendChild(num);
        var type = document.createElement('div');
        div.appendChild(type);
    },
    //  排序
    sortCard: function () {
        var arr = this.allPokerList.sort(function (a, b) {
            return a.getAttribute('random') - b.getAttribute('random');
        });
    },
    //  发牌
    putCard: function () {
        var _this = this;
        forEach.call(this.rightContentList, function (t, i) {
            var j = 0;
            while (t.getAttribute("count") > j) {
                var div = _this.allPokerList[_this.rightIndex];
                div.style.top = j * 15 + 'px';
                t.appendChild(div);
                _this.rightPokersList.push(div);
                _this.rightIndex++;
                j++;
            }
        });
    },
    //  创草牌堆
    setCardHeap: function () {
        var _this = this;
        forEach.call(this.allPokerList.slice(this.rightPokersList.length), function (t, i) {
            t.style.top = i + 'px';
            t.style.left = i / 3 + 'px';
            _this.stack.appendChild(t);
            _this.leftHeapList.push(t);
        });
    },
    //  绑定事件
    bindEvent: function () {
        var _this = this;
        //  主牌堆
        this.countContent.onclick = function (e) {
            var target = getCardDiv(e);
            if (target && target.getAttribute('status') === 'back') {
                if (target === target.parentNode.children[target.parentNode.children.length - 1]) {
                    target.setAttribute('status', 'font');
                    setTimeout(function () {
                        target.setAttribute('dbl', 'true');
                    }, 300);
                    _this.turnFront(target);
                }
            }
        };
        this.countContent.ondblclick = function (e) {
            var target = getCardDiv(e);
            if (target && target.getAttribute('dbl')) {
                var type = target.getAttribute('type');
                var li = _this.rightContent.getElementsByTagName('li');
                forEach.call(li, function (t, i) {
                    if (t.getAttribute('_type') === type) {
                        t.appendChild(target);
                        cardResetPosition(target);
                        return false;
                    }
                })
            }
        };
        //  左侧牌堆
        this.stack.onclick = function (e) {
            var target = getCardDiv(e);
            if (target) {
                var index = _this.leftHeapList.indexOf(this);
                //  装到左侧展示
                _this.leftShowList.push(target);
                _this.show.appendChild(target);
                cardResetPosition(target);
                //  从左侧主要删除
                _this.leftHeapList.splice(index, 1);
                setTimeout(function () {
                    target.setAttribute('dbl', 'true');
                }, 300);
                _this.turnFront(target);
            }
        };
        //  左侧可选
        this.show.onclick = function (e) {
            // console.log(1);
        };
        this.show.ondblclick = function (e) {
            var target = getCardDiv(e);
            if (target && target.getAttribute('dbl')) {
                var type = target.getAttribute('type');
                var li = _this.rightContent.getElementsByTagName('li');
                forEach.call(li, function (t, i) {
                    if (t.getAttribute('_type') === type) {
                        t.appendChild(target);
                        cardResetPosition(target);
                        return false;
                    }
                })
            }

        };
        this.countContent.onmouseover = this.stack.onmouseover = this.show.onmouseover = function (e) {
            var target = getCardDiv(e);
            if (target) {
                target.classList.add('outline');
            }
        };
        this.countContent.onmouseout = this.stack.onmouseout = this.show.onmouseout = function (e) {
            var target = getCardDiv(e);
            if (target) {
                target.classList.remove('outline');
            }
        };

        //  找到卡牌
        function getCardDiv(e) {
            var target = e.target;
            while (target.tagName.toLowerCase() !== 'div' || (Array.prototype.indexOf.call(target.classList, 'card') === -1)) {
                if (target === _this.el) {
                    break
                }
                target = target.parentNode;
            }
            //  target是div
            var siblings = target.parentNode.children;
            if (target === siblings[siblings.length - 1]) {
                return target;
            }
        }
        //  重置位置
        function cardResetPosition(t) {
            var prev = t.previousSibling;
            var tStyle = t.style;
            var pStyle = getComputedStyle(prev);
            if (prev.tagName.toLowerCase() === 'svg') {
                tStyle.top = pStyle.top;
                tStyle.left = pStyle.left;
            } else {
                tStyle.top = parseInt(pStyle.top) + 1 + 'px';
                tStyle.left = parseFloat(pStyle.left) + (1 / 3) + 'px';
            }
            t.classList.remove('outline');
        }
    }
};
(function (w, u) {
    var unit = {};
    unit.init = function () {
        w.a = new Card(wrapper);
    };
    w.unit = unit;
    document.onmousedown = function (e) {
        e.preventDefault();
    }
}(window, undefined));
unit.init();
