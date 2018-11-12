(function (win, doc){
    /*
    params: 
        type: ball
        ele: canvas 对象 dom
        colors: Array
        maxNum: number  30, // 一次点击出现的球球个数
        radius: number  10, // 球球的最大半径
        reduceRa: number (0,5] // 半径减小速率
        animationTime: number  50, // 动画时间间隔ms
        speedX: number 10, //球球 初始横向速度
        speedY: number 10, //球球 初始纵向速度
        addSX: number (0,3]
        addSY: number (0,3]
    */
    function ClickEffect (params) {
        if (params.ele && toString.call(params.ele) === "[object HTMLCanvasElement]") {
            this.domEle = params.ele
        } else {
            this.domEle = document.getElementsByTagName('canvas')[0];
        }
        this.width = params.width ||window.innerWidth;
        this.height = params.height || window.innerHeight;
        this.domEle.width = this.width;
        this.domEle.height=  this.height;
        this._ctx = this.domEle ? this.domEle.getContext('2d') : null


        this.type = params.type || 'ball'
        this.colors = params.colors || ["#33b5e5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","#ff8800","#ff4444","#cc000"];
        this.maxNum = params.maxNum || 30; //最大数量
        this.radius = params.radius || 10;
        this.reduceRa = params.reduceRa || 0.4
        this.animationTime = params.animationTime || 50;
        this.speedX = params.speedX || 10;
        this.speedY = params.speedY || 10;
        this.addSX = params.addSX || 0.5;
        this.addSY = params.addSY || 0.5;
        this._patterns=[]; //图案
        this._timer = null; // 定时器
        this._x = 0; // 鼠标点击位置 x
        this._y = 0; // 标书点击位置 y
    }
    // reset
    ClickEffect.prototype.reset = function (){
        this.clearTimer()
        this.clearCanvas()
        this._patterns.length = 0;
    }
    // 清除画布
    ClickEffect.prototype.clearCanvas = function (){
        console.log('清除画布')
        this._ctx.clearRect(0,0,this.width,this.height);
    }
    // 暴露出去的接口，停止 定时器，可以截图效果
    ClickEffect.prototype.clearTimer = function (){
        console.log('清除定时器')
        clearInterval(this._timer)
    }
    // 入口函数
    ClickEffect.prototype.main = function (){
        var _this = this
        try {
           this.domEle.addEventListener('click', function (event){
                _this._fly(event)
            }, true)
        }catch(error){
            console.error('没有canvas元素，请在页面中写入canvas元素')
        }
    }
    // 点击事件调用函数，功能入口
    ClickEffect.prototype._fly = function (event) {
        // 添加球球
        var _this = this
        this._x = event.clientX;
        this._y = event.clientY;
        // 添加物体
        this._addPatterns();
        // 添加更新
        if (this._timer) {
            clearInterval(this._timer)
        }
        this._timer= setInterval(function () {
            if (_this._patterns.length ===0) {
                clearInterval(_this._timer)
            }
            _this._updateBalls()
            _this._render()
        }, this.animationTime)
    }
    // 画好球球一帧
    ClickEffect.prototype._render = function () {
        // 可优化点 
        this._ctx.clearRect(0,0,this.width,this.height);
        for (var i = 0, le = this._patterns.length; i < le; i++) {
            var pattern = this._patterns[i]
            switch(pattern.type) {
                case 'ball': 
                    this._drawBall(pattern);
                    break;
                case 'star':
                    this._drawStar(pattern);
                    break;
            }
        }
    }
    // 画球
    ClickEffect.prototype._drawBall = function (pattern) {
        var ball = pattern
        this._ctx.fillStyle = ball.color;
        this._ctx.beginPath()
        this._ctx.arc(ball.x ,ball.y , ball.r,0,2 * Math.PI);
        this._ctx.closePath();
        this._ctx.fill();
    }
    // 画星星
    ClickEffect.prototype._drawStar = function (pattern) {
        var star = pattern
        this._ctx.fillStyle = star.color;
        this._ctx.lineWidth = 3;
        this._ctx.strokeStyle = star.color;
        this._ctx.save();
        // 图形变换必须写在  图像状态设置前面
        this._ctx.translate(star.x, star.y);
        this._ctx.rotate(Math.random() * 360 * Math.PI /180);
        // scale() 除了缩放图之外，还对位置 和 边框属性有缩放作用。
        // 第一种解决方法是 将 不绘制边框。
        // 第二种解决方法是，将 绘制图的 fill() stroke() 函数 写在 restore() 之后
        this._ctx.scale(star.r,star.r);
        // 单位星星
        this._ctx.beginPath();
        for ( let i = 0; i < 5; i++) {
            this._ctx.lineTo(Math.cos( (18 + i * 72) * Math.PI /180), -Math.sin( (18 + i * 72) * Math.PI /180));
            this._ctx.lineTo(Math.cos( (54 + i * 72) * Math.PI /180) * 0.5, -Math.sin( (54 + i * 72) * Math.PI /180) * 0.5);
        }
        this._ctx.closePath();
        this._ctx.restore();
        this._ctx.fill();
        this._ctx.stroke();
    }
    // 添加好球球 组件
    ClickEffect.prototype._addPatterns = function () {
        for (var i = 0, le = this.maxNum; i < le; i++){
            var vxP=  Math.random() > 0.5; // 采用正数 还是负数
            var vyP=  Math.random() > 0.5; // 采用正数 还是负数
            var aBall = {
                type: this.type,
                x: this._x,
                y: this._y,
                r: Math.min(this.radius, Math.ceil(Math.random()*this.radius)+this.reduceRa), // 半径
                rA: this.reduceRa,
                g: 1.5+Math.random(),
                vx: vxP ? Math.ceil(Math.random()*this.speedX) : -(Math.ceil(Math.random()*this.speedX)) ,
                vy: vyP? Math.ceil(Math.random()*this.speedY) : -(Math.ceil(Math.random()*this.speedY))  ,
                vxA: vxP ? -this.addSX: this.addSX,
                vyA: vyP? - this.addSY: this.addSY,
                color: this.colors[Math.floor(Math.random()* this.colors.length)]
            }
            this._patterns.push(aBall);
        }
        this._render();
    }
    // 更新每个球球位置
    ClickEffect.prototype._updateBalls = function () {
        for (var i = 0, len = this._patterns.length; i < len; i++) {
            this._patterns[i].x +=  this._patterns[i].vx;
            this._patterns[i].y += this._patterns[i].vy;
            this._patterns[i].vx += this._patterns[i].vxA;
            this._patterns[i].vy += this._patterns[i].vyA;
            this._patterns[i].r -= this._patterns[i].rA;
        }
        // 减少球球 可优化
        var cnt = 0;
        var arr = []
        for (var i = 0; i < this._patterns.length; i++) {
            var ball = this._patterns[i]
            if(ball.r >0 ) {
                // || (ball.vx > -0.5 && ball.vx < 0.5) || (ball.vy > -0.5 && ball.vy < 0.5)
                arr.push(ball)
            }
        }
        this._patterns.length = 0;
        this._patterns = arr;
    }
    // 可优化
    return win.ClickEffect = ClickEffect;
})(window, document)