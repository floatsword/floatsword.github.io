var Puzzle = function(img) {
    this.img = img;
    this.imgArray = [];
    this.count = 3;
};

$.extend(Puzzle.prototype, {
    init: function() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
        };

        this.split();
        this.sort();
        this.renderPuzzle();
        this.bindDragEvent();
    },
    split: function() {
        
    }
})
