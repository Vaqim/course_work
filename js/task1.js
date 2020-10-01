window.onload = function() {
    
    function f(x) {
        return Math.pow(x, 3) - Math.cos(x);
    }

    function iteratorFunc(a, b, n) {
        let result = [{}, {}];

        for (let i = a; i < b; i += n){

            let j = +i.toFixed(2);
            if (f(j) === 0 || f(j) * f(j + n) < 0) {
                result[0].x = j;
                result[0].y = f(j);
                result[1].x = j + n;
                result[1].y = f(j + n);
                return result;
            }
        }
        return false;
    }

    function getArrayRange(start, end, step){
        let result = [];
        for (let i = start; i <= end; i += step){
            result.push(+i.toFixed(2));
        }
        return result;
    }

    document.getElementById('drawMain').addEventListener('click', () => {

        let x1 = +document.getElementById('x1Main').value || 0;
        let x2 = +document.getElementById('x2Main').value || 0;

        let step = 0.1;

        if (x1 >= x2) throw new Error('x1 >= x2');

        const ctx = document.getElementById('main').getContext('2d');

        let data = {
            labels: getArrayRange(x1, x2, step),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0
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
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        
    });

    document.getElementById('drawIter').addEventListener('click', () => {

        let x1 = +document.getElementById('x1Main').value || 0;
        let x2 = +document.getElementById('x2Main').value || 0;

        let step = +document.getElementById('stepIter').value || 0.1;

        if (x1 >= x2) throw new Error('x1 >= x2');
        if (step <= 0) throw new Error('negative step');

        const ctx = document.getElementById('iter').getContext('2d');

        let results = iteratorFunc(x1, x2, step);
        
        if(!results) return;

        let data = {
            labels: getArrayRange(x1, x2, step),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0
            },
            {
                label: "Корінь", // Name it as you want
                function: () => {},
                data: [{
                    x: +(results[0].x).toFixed(2),
                    y: +(results[0].y).toFixed(2)
                },
                {
                    x: +(results[1].x).toFixed(2),
                    y: +(results[1].y).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "red",
                borderWidth: 12,
                order: 0,
                fill: false,
                radius: 0
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

        let myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        
    });

    document.getElementById('drawDuhot').addEventListener('click', () => {

    })
}