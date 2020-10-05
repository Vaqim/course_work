window.onload = function(){
    let X1, X2;

    function f(h, w, e1) {
        try {    
            const part1 = (e1 + 1) / 2;
            const part2 = 1 + ((e1 - 1) / (e1 + 1));
            const part3 = Math.log(Math.PI / 2) + (Math.log(Math.PI / 4) / e1);
            const part4 = Math.log((8 * h) / w);
            
            return part1 * (part2 * (part3 / part4));
        } catch(e) {
            console.log(e.message);
            return false;
        }
    }

    document.getElementById('drawIter').addEventListener('click', () => {
        X1 = +document.getElementById('x1').value;
        X2 = +document.getElementById('x2').value;
        
        let data = [{ // root is ~33.1
                h: 2,
                w: 1,
                e: 5.3,
            },{
                h: 0.5,
                w: 0.2,
                e: 4.8,
            },{
                h: 1,
                w: 0.3,
                e: 5.5,
            },{
                h: 0.5,
                w: 0.4,
                e: 3.5,
            },{
                h: 0.5,
                w: 0.1,
                e: 4.3,
            },{
                h: 1,
                w: 0.3,
                e: 4.8,
            },] 

        console.log(f(data[0].h, data[0].w, 33.1) - data[0].e);

    });
};
