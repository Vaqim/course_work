window.onload = function(){
    let X1, X2;
    let dataSet = [{ // root is ~33.1
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
    },];

    function roundInt(integer){
        return (Math.round(integer * 10000) / 10000);
    }

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

    function iteratorFunc(a, b, h, w, e) {
        let result = {
            start: {},
            end: {}
        };
        let n = 0.0001;

        for (let i = a; i < b; i += n){
            let j = i;
            if (f(h, w, j) === e || (f(h, w, j) - e) * (f(h, w, j + n) - e) < 0) {
                result.start.y = j;
                result.start.x = f(h, w, j);
                result.end.y = j + n;
                result.end.x = f(h, w, j + n);
                return result;
            }
        }
        return false;
    }

    document.getElementById('drawIter').addEventListener('click', () => {
        X1 = +document.getElementById('x1').value;
        X2 = +document.getElementById('x2').value;
        let dataSetNumber;

        for (let i = 1; i <= 6; i++){
            if (document.getElementById(`set${i}`).checked){
                dataSetNumber = +i - 1;
                break;
            }
        }
        console.table(dataSet[dataSetNumber]);
        
        let results = iteratorFunc(X1, X2, dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, dataSet[dataSetNumber].e);
        if (!results) return;
        let root = (results.end.y + results.start.y) / 2;
        // console.log(f(dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, root));
        console.table(results);
        console.log(`root: ${roundInt(root)}`);
    });
};
