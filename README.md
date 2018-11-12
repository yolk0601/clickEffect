#### clickEffect 点击特效

###### 有感于 ColdDay 的作品： https://github.com/ColdDay/click-colorful 

##### 个人实现 canvas 点击效果

**1. 实现一个 canvas 点击 出现 小球 效果**

![click-colorful](./ball.gif 'clickEffect')

**2. 实现一个 canvas 点击出现 星星 效果**

![click-colorful](./star.gif 'clickEffect')


> 使用方式：
> 
> > 引用 script clickEffect.js
> > 
> 
> 实例化：
>
```
config = {
     ele:document.getElementById('demo'),
 
     type: 'ball',
 
     colors: ["#eb125f", "#6eff8a", "#6386ff", "#f9f383"],
 
     maxNum: 10, // 一次点击出现的球球个数
 
     radius: 100, // 球球的最大半径
 
     reduceRa: 3, // (0,5]
 
     animationTime: 100, // 动画时间间隔ms
 
     speedX: 10,
 
     speedY: 10,
 
     addSX: 0.2, // (0,3]
 
     addSY: 0.2, // (0,3]  
      
 }
 
 var demo = new ClickEffect(config)
```


