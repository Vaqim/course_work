window.onload = function() {
    
    function f(x) {
        return Math.pow(x, 2) - Math.cos(x);
    }

    function iteratorFunc(a, b, n) {
        let result = [];
        let afterDot = getAmountAfterDot(n);

        for (let i = a; a < b; i += n){
            let j = i.toFixed(afterDot);
            result.push({
                'Y': f(j),
                'X': j
            });
        }
        return result;
    }

    function getAmountAfterDot(n) {
        return n > 1 && n < 0 ? n.toString().length - 2 : 0;
    }

    document.getElementById('drawMain').addEventListener('click', () => {

        let x1 = parseInt(document.getElementById('x1Main').value) || 0;
        let x2 = parseInt(document.getElementById('x2Main').value) || 3;

        let y1 = parseInt(document.getElementById('y1Main').value) || 0;
        let y2 = parseInt(document.getElementById('y2Main').value) || 12;

        let step = parseInt(document.getElementById('stepMain').value) || 0.2;

        // let results = iteratorFunc(x1, x2, step);

        const ctx = document.getElementById('main').getContext('2d');

        const chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: 'f(x)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [1, 3, 2, 5, 1],
                    fill: false,
                    borderColor: 'red',
                    borderWidth: 2,
             }]
            },

            // Configuration options go here
            options: {
                respoinsive: false,
                scales: {
                    xAxes: [{
                        display: true,
                    }],
                    yAxes: [{
                        display: true,
                    }]
                }
            }
        });
    });


}