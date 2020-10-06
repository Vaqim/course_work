window.onload = () => {
    function f(x){
        return 1 + Math.pow(Math.E, -x);
        // return Math.sin(x)/(1 + Math.pow(x, 2));
    }

    function rectangle(min, max, iters){
        let area = 0;
        let d = (max - min) / iters;
        let start = min;

        for (let i = 0; i < iters; i++){
            let end = start + d;
            let mid = (start + end) / 2;
            area += d * f(mid);
            start = end;
        }
        return area;
    }

    function trapezoid(min, max, iters){
        let area = (f(min) + f(max)) / 2;
        let height = (max - min) / iters;

        for(let x = min + height; x < max; x += height){
            area += f(x)
        }
        return area * height;
    }

    function simpson(min, max, iters){
        let height = (max - min) / iters;
        let area = (f(min) + f(max)) / 2 + 2 * f(min + height / 2);
        for(let x = min + height; x < max; x += height) {
            area += 2 * f(x + height / 2) + f(x);
        }
        return area * height / 3;
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function monteCarlo(min, max, dots){
        let goodDots = 0;
        let yMin = 0;
        let yMax = 3;

        let area = (yMax - yMin) * (max - min);

        for (let i = 0; i < dots; i++){
            let x = getRandomArbitrary(min, max);
            let y = getRandomArbitrary(yMin, yMax);
            if(f(x) >= y) {
                goodDots++;
            }
        }
        return (goodDots / dots) * area;
    }
    
    console.log('rectangle ', rectangle(0, 5, 10000000));

    console.log('trap ', trapezoid(0, 5, 10000000));

    console.log('simpson', simpson(0, 5, 10000000));

    console.log('monte Carlo', monteCarlo(0, 5, 100000000));

};