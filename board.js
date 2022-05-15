class Board {
    constructor(width, height, strokeWidth) {
      this.width = width;
      this.height = height;
      this.strokeWidth = strokeWidth;
      this.quarterWidth = (this.width - 60) / 2;
      this.decorationH = height / 4;
    }
  
    // TOP
    #drawTopFirstDecoration(ctx, quarterWidth) {  
      const decorationW = quarterWidth / 6;
  
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.fillStyle = i % 2 == 0 ? "#B95C33" : "#894C25";
        ctx.moveTo(i * decorationW + this.strokeWidth, this.strokeWidth - 10);
        ctx.lineTo(
          i * decorationW + decorationW + this.strokeWidth - 10,
          this.strokeWidth - 10
        );
        ctx.lineTo(
          i * decorationW + decorationW / 2 + this.strokeWidth - 5,
          this.decorationH
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  
    #drawTopSecondDecoration(ctx, quarterWidth) {
      const decorationW = quarterWidth / 6;
      const startPos = quarterWidth + this.strokeWidth + 10;
  
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.fillStyle = i % 2 == 0 ? "#B95C33" : "#894C25";
        ctx.moveTo(
          i * decorationW + this.strokeWidth + startPos,
          this.strokeWidth - 10
        );
        ctx.lineTo(
          i * decorationW + decorationW + this.strokeWidth - 10 + startPos,
          this.strokeWidth - 10
        );
        ctx.lineTo(
          i * decorationW + decorationW / 2 + this.strokeWidth - 5 + startPos,
          this.decorationH
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  
    // BOTTOM
    #drawBottomFirstDecoration(ctx, quarterWidth) {
      const decorationW = quarterWidth / 6;
  
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.fillStyle = i % 2 == 0 ? "#B95C33" : "#894C25";
        ctx.moveTo(
          i * decorationW + this.strokeWidth,
          this.height - this.strokeWidth + 10
        );
        ctx.lineTo(
          i * decorationW + decorationW + this.strokeWidth - 10,
          this.height - this.strokeWidth + 10
        );
        ctx.lineTo(
          i * decorationW + decorationW / 2 + this.strokeWidth - 5,
          this.height - this.decorationH - this.strokeWidth
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  
    #drawBottomSecondDecoration(ctx, quarterWidth) {
      const decorationW = quarterWidth / 6;
      const startPos = quarterWidth + this.strokeWidth + 10;
  
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.fillStyle = i % 2 == 0 ? "#B95C33" : "#894C25";
        ctx.moveTo(
          i * decorationW + this.strokeWidth + startPos,
          this.height - this.strokeWidth + 10
        );
        ctx.lineTo(
          i * decorationW + decorationW + this.strokeWidth - 10 + startPos,
          this.height - this.strokeWidth + 10
        );
        ctx.lineTo(
          i * decorationW + decorationW / 2 + this.strokeWidth - 5 + startPos,
          this.height - this.decorationH - this.strokeWidth
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = "#E7CDB2";
      ctx.fillRect(0, 0, this.width, this.height);
  
      ctx.strokeStyle = "#9c491c";
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeRect(0, 0, this.width, this.height);
  
      ctx.fillStyle = "#9c491c";
      ctx.fillRect(
        this.width / 2 - this.strokeWidth / 2,
        0,
        this.strokeWidth,
        this.height
      );
  
      this.#drawTopFirstDecoration(ctx, this.quarterWidth);
      this.#drawTopSecondDecoration(ctx, this.quarterWidth);
      this.#drawBottomFirstDecoration(ctx, this.quarterWidth);
      this.#drawBottomSecondDecoration(ctx, this.quarterWidth);
    }
}

export class DrawBoard {
    constructor(canvas, width, height, strokeWidth) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.width = width;
      this.height = height;
      this.strokeWidth = strokeWidth;
  
      this.canvas.width = width;
      this.canvas.height = height;
      this.Board = new Board(this.width, this.height, this.strokeWidth);
    }
  
    draw() {
      this.Board.draw(this.ctx);
    }
  }