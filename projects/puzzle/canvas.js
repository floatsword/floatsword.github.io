var puzzle = null;
var Puzzle = function(img) {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");

    this.img = img;
    this.imgArray = [];
    this.count = 3;
}

Puzzle.prototype = {
    constructor: Puzzle,

    init: function(context) {
        this.split();
        this.sort()
        this.dragEvent();
    },
    //利用canvas切割图片
    split: function() {
        var index = 0;
        var count = this.count;
        var w = this.img.width/count;
        var h = this.img.height/count;

        this.canvas.width=w;
        this.canvas.height=h;
        this.imgArray = [];
        //获取切割后的图片数组
        for (let i=0; i<count; i++) {
            for (let j=0; j<count; j++) {
                var img = new Image();
                this.imgArray[index] = img;

                this.context.drawImage(this.img, w*j, h*i, w, h, 0, 0, w, h)
                this.imgArray[index].src = this.canvas.toDataURL();
                this.imgArray[index].id = "img"+index;
                index++;
            }
        }

        this.randerList();

    },
    //绘制拼图
    randerList: function() {
        var count = this.count;
        var list = document.getElementById("game-box");

        list.innerHTML = "";
        var fragment = document.createDocumentFragment();
        for (let i=0; i<this.imgArray.length; i++) {
            var li = document.createElement("li");
            li.style.width = 850/count + "px";
            li.style.height = 550/count + "px";
            li.appendChild(this.imgArray[i]);
            fragment.appendChild(li)
        }
        list.appendChild(fragment)
    },

    //排序
    sort: function() {
        var len = this.imgArray.length;
        this.imgArray.sort(function() {
            return Math.random() - 0.5
        })

        this.randerList();
    },

    //为拼图添加事件监听
    dragEvent: function() {
        var list = document.getElementById("game-box");
        var self = this;
        //取消拖拽默认行为
        on("dragover",list,function(event) {
            var ev = event || window.event;
            ev.preventDefault();
        })
        on("dragenter",list,function(event) {
            var ev = event || window.event;
            ev.preventDefault();
        })

        //拖拽开始时将源对象信息存入datatransfer
        on("dragstart", list, function(event) {
            var ev = event || window.event;
            var tar = ev.target || ev.srcElement;
            ev.dataTransfer.setData("id",tar.id)
        })

        //拖拽事件触发，交换img
        on("drop",list, function(event) {
            var ev = event || window.event;
            var tar = ev.target || ev.srcElement;
            var dragSrc = ev.dataTransfer.getData("src");

            if (dragSrc){
                var img = new Image();
                img.src = dragSrc;
                img.crossOrigin = "Anonymous"
                self.img = img;
                self.init();
                return;
            }

            if (tar.nodeName.toLowerCase() === "img") {
                var id = ev.dataTransfer.getData("id")
                var srcObj = document.getElementById(id);
                var tarObj = {
                    src: tar.src,
                    id: tar.id
                }
                tar.src = srcObj.src;
                tar.id = srcObj.id;

                srcObj.src = tarObj.src;
                srcObj.id = tarObj.id;
            }
            self.isSuccess()
        })
    },

    isSuccess: function() {
        var list = document.getElementById("game-box"),
            imgLikeArr = list.querySelectorAll("img"),
            imgArr = Array.prototype.slice.call(imgLikeArr),
            flag = true, len=imgArr.length;

        for (let i=0; i<len; i++) {

            if (imgArr[i].id!= "img" + i){
                flag = false
            }
        }

        if (flag) {
            setTimeout(function(){
                alert("恭喜通关~")
            },200)
        }
    }
}


//事件代理
function on (type, ele, handler) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handler, false)
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+type, function() {
            handler.call(ele)
        })
    } else {
        ele["on"+type] = handler;
    }
}



//初始化

window.onload = function() {
    var img = new Image();
    img.src = "images/pic02.jpg";
    img.crossOrigin = "Anonymous";
    puzzle = new Puzzle(img);
    puzzle.init();
}
