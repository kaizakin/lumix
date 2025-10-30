import { Drawable } from 'roughjs/bin/core'; //internal DS from roughjs lib

export function drawRoughPath(
    ctx: CanvasRenderingContext2D, // the default html canvas context.
    drawable: Drawable
) {
    drawable.sets.forEach((set) => {

        // Each `set` is one “sub-path” of the drawable.  
        // a rectangle might have multiple `sets` — one for the border, another for the fill texture (like a sketchy hatch

        ctx.beginPath(); //begins drawing line for each set

        // set.ops is literally a sequence of instructions like:
        // [
        //  { "op": "move", "data": [10, 10] },
        //  { "op": "lineTo", "data": [100, 10] },
        //  { "op": "bcurveTo", "data": [110, 20, 130, 40, 150, 10] }
        // ]
        //

        for (const op of set.ops) { // create a drawing path for each set
            const data = op.data;

            switch (op.op) {
                case 'move':
                    ctx.moveTo(data[0]!, data[1]!);
                    break;
                case 'bcurveTo':
                    ctx.bezierCurveTo( //Draw a smooth curved segment using 3 control points (6 numbers).
                        data[0]!, data[1]!,
                        data[2]!, data[3]!,
                        data[4]!, data[5]!
                    );
                    break;
                case 'lineTo':
                    ctx.lineTo(data[0]!, data[1]!);
                    break;
            }
        }

        // "path" | "fill" | "fillsketch" as of now only focusing on drawing shapes only
        // I will add fills later 
        if (set.type === 'path') {
            ctx.strokeStyle = drawable.options.stroke || '#000';
            ctx.lineWidth = drawable.options.strokeWidth || 1;
            ctx.stroke(); // actually draw it on the canvas
        }
    });
}