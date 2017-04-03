var puzzle = null;
var Puzzle = function(img, parent) {
    this.img = img;
    this.imgArray = [];
    this.count = 3;  //三行三列
    this.init();
    this.correctSort = [];
    this.parent = parent || 'html, body';
};

$.extend(Puzzle.prototype, {
    init: function() {
        if (!this.canvas) {
            this.canvas = document.getElementById('canvas');
            this.context = this.canvas.getContext('2d');
        };
        var self = this;
        if (this.img.complete) {
            self.split();
            self.renderPuzzle();
        }

        this.img.onload = function() {
            console.log('onload');
            self.split();
            self.sort();
            self.renderPuzzle();
        }

    },

    split: function() { //利用canvas切割图片
        var index = 0;
        var count = this.count;
        var w = this.img.width/count;
        var h = this.img.height/count;

        this.canvas.width = w;
        this.canvas.height = h;

        this.imgArray = []; //清空已有的img数组

        for(var i=0; i<count; i++) {
            for (var j=0; j<count; j++) {
                var img = new Image();
                this.imgArray.push(img);
                this.context.drawImage(this.img, w*j, h*i, w, h, 0, 0, w, h)
                this.imgArray[index].src = canvas.toDataURL();
                this.imgArray[index].dataset.number = index;
                this.imgArray[index].className = 'my-handle'
                index ++;
            }
        }
    },

    renderPuzzle: function() {

        var count = this.count;
        var $box = $('.puzzle_box').find('.p_list');
        $box.empty();
        for (var i=0; i<this.imgArray.length; i++) {
            $box.append($('<li id='+this.imgArray[i].dataset.number+'>').addClass('col-sm-4').append(this.imgArray[i]))
        }

    },

    sort: function() {
        var len = this.imgArray.length;
        this.imgArray.sort(function() {
            return Math.random() - 0.5
        })
    },

    tip: function() {
        console.log(this);
        var $parent = $(this.parent),
            $children = $parent.children(),
            curIndex,
            curEle;
            console.log($children);
            for (var i=0 ;i<$children.length; i++) {
                if ($children[i].id != i) {
                    curIndex = i;
                    curEle = $('#'+i);
                    break;
                }
            }

            ;(function() {
                curEle.addClass('swing');
                $children.eq(i).addClass('swing');
                curEle.one('animationend', function() {
                    curEle.removeClass('swing')
                });
                $children.eq(i).one('animationend', function() {
                    $(this).removeClass('swing')
                })
            })()
    }
})
