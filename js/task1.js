window.onload = function() {
    
    function f(x) {
        return Math.pow(x, 2) - Math.cos(x);
    }

    function iteratorFunc(a, b, n) {
        let result = [[], []];
        let afterDot = getAmountAfterDot(n);

        for (let i = a; i < b; i += n){
            
            let j = i.toFixed(2);
            result[0].push(+f(j).toFixed(2)); // Y
            result[1].push(+j); // X
        }
        debugger;
        return result;
    }

    function getAmountAfterDot(n) {
        return n > 1 && n < 0 ? n.toString().length - 2 : 0;
    }

    function getArrayRange(start, end){
        let result = [];
        for (let i = start; i <= end; i++){
            result.push(i);
        }
        return result;
    }

    document.getElementById('drawMain').addEventListener('click', () => {

        let x1 = parseInt(document.getElementById('x1Main').value) || -1;
        let x2 = parseInt(document.getElementById('x2Main').value) || 2;

        let step = parseInt(document.getElementById('stepMain').value) || 0.1;

        if (x1 >= x2) throw new Error('x1 >= x2');
        if (step <= 0) throw new Error('minus step');

        let results = iteratorFunc(x1, x2, step);
        console.log(results);

        const ctx = document.getElementById('main').getContext('2d');

        let data = {
            labels: results[0],
            datasets: [{
                label: "f(x) = x", // Name it as you want
                function: function(x){ return Math.pow(x, 2) - Math.cos(x) },
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false
            }]
        }

        Chart.pluginService.register({
            beforeInit: function(chart) {
                // We get the chart data
                let data = chart.config.data;
        
                // For every dataset ...
                for (let i = 0; i < data.datasets.length; i++) {
        
                    // For every label ...
                    for (let j = 0; j < data.labels.length; j++) {
        
                        // We get the dataset's function and calculate the value
                        let fct = data.datasets[i].function,
                            x = data.labels[j],
                            y = fct(x);
                        // Then we add the value to the dataset data
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });

        let myBarChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        
    });


}